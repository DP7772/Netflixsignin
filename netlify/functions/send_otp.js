import { neon } from '@neondatabase/serverless';
import nodemailer from 'nodemailer';

const sql = neon(process.env.NETLIFY_DATABASE_URL);

// --- HARD CODED CREDENTIALS (JUST FOR TESTING) ---
// REPLACE THESE WITH YOUR REAL DETAILS INSIDE THE QUOTES
const MY_EMAIL = "am08077772@gmail.com";  // Check spelling carefully! (412 or 421?)
const MY_PASSWORD = "iyhjwreqahcsluoc"; // Paste your App Password here (No spaces)
// -------------------------------------------------

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: MY_EMAIL,
    pass: MY_PASSWORD
  }
});

export async function handler(event) {
  try {
    const { contact } = JSON.parse(event.body);

    // ... (rest of the code stays the same) ...
    if (!contact || !contact.includes('@')) {
       return { statusCode: 200, body: JSON.stringify({ status: 'fail', message: 'Not a valid email' }) };
    }
    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await sql`
      INSERT INTO otps (contact, otp_code) VALUES (${contact}, ${otp})
      ON CONFLICT (contact) DO UPDATE SET otp_code = ${otp}, created_at = NOW()
    `;

    // Send the email using the hard-coded variables
    await transporter.sendMail({
      from: MY_EMAIL,
      to: contact,
      subject: 'Netflix Clone Verification Code',
      text: `Your verification code is: ${otp}`
    });

    return { statusCode: 200, body: JSON.stringify({ status: 'success' }) };

  } catch (err) {
    console.error("Email Error:", err);
    return { statusCode: 500, body: JSON.stringify({ status: 'error', message: err.message }) };
  }
}
