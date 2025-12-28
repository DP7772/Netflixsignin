import { neon } from '@neondatabase/serverless';
import nodemailer from 'nodemailer';

const sql = neon(process.env.NETLIFY_DATABASE_URL);

// Configure the Email Sender
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Add this var in Netlify
    pass: process.env.EMAIL_PASS  // Add this var in Netlify (App Password)
  }
});

export async function handler(event) {
  try {
    const { contact } = JSON.parse(event.body);

    // Safety Check: Only send if it looks like an email
    if (!contact || !contact.includes('@')) {
      return { 
        statusCode: 200, 
        body: JSON.stringify({ status: 'fail', message: 'Not a valid email' }) 
      };
    }

    // 1. Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 2. Save OTP to Database (Overwrite if one exists for this email)
    // We use "ON CONFLICT" so if they ask twice, we just update the code
    await sql`
      INSERT INTO otps (contact, otp_code) VALUES (${contact}, ${otp})
      ON CONFLICT (contact) DO UPDATE SET otp_code = ${otp}, created_at = NOW()
    `;

    // 3. Send the Email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: contact,
      subject: 'Netflix Clone Verification Code',
      text: `Your verification code is: ${otp}`
    });

    return { statusCode: 200, body: JSON.stringify({ status: 'success' }) };

  } catch (err) {
    console.error("Email Error:", err);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ status: 'error', message: err.message }) 
    };
  }
}
