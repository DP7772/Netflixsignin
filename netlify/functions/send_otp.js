import { neon } from '@neondatabase/serverless';
import nodemailer from 'nodemailer';

// 1. Connect to Neon Database
const sql = neon(process.env.NETLIFY_DATABASE_URL);

// 2. Configure Email Sender (Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address from Netlify settings
    pass: process.env.EMAIL_PASS  // Your 16-digit App Password from Netlify settings
  }
});

export async function handler(event) {
  try {
    const { contact } = JSON.parse(event.body);

    // Safety Check: Ensure it is actually an email
    if (!contact || !contact.includes('@')) {
      return { 
        statusCode: 200, 
        body: JSON.stringify({ status: 'fail', message: 'Invalid email format' }) 
      };
    }

    // 3. Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 4. Save OTP to Database 
    // (ON CONFLICT means: if this email already has an OTP, verify it by updating the old code to the new one)
    await sql`
      INSERT INTO otps (contact, otp_code) VALUES (${contact}, ${otp})
      ON CONFLICT (contact) DO UPDATE SET otp_code = ${otp}, created_at = NOW()
    `;

    // 5. Send the Email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: contact,
      subject: 'Netflix Clone Verification Code',
      text: `Your verification code is: ${otp}`
    });

    return { 
      statusCode: 200, 
      body: JSON.stringify({ status: 'success', message: 'OTP Sent' }) 
    };

  } catch (err) {
    console.error("Send OTP Error:", err);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ status: 'error', message: err.message }) 
    };
  }
}
