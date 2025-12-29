import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.NETLIFY_DATABASE_URL);

export async function handler(event) {
  try {
    const { email, otp } = JSON.parse(event.body);

    if (!email || !otp) {
      return { statusCode: 400, body: JSON.stringify({ status: 'fail', message: 'Missing data' }) };
    }

    // 1. Fetch OTP from Database
    const records = await sql`SELECT otp_code FROM otps WHERE contact = ${email}`;

    if (records.length === 0) {
      return { statusCode: 400, body: JSON.stringify({ status: 'fail', message: 'No OTP found' }) };
    }

    const dbOtp = records[0].otp_code;

    // 2. Strict Comparison (Trim spaces to be safe)
    if (String(dbOtp).trim() === String(otp).trim()) {
      return { 
        statusCode: 200, 
        body: JSON.stringify({ status: 'success', message: 'Verified' }) 
      };
    } else {
      return { 
        statusCode: 200, 
        body: JSON.stringify({ status: 'fail', message: 'Incorrect OTP' }) 
      };
    }

  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ status: 'error', message: err.message }) };
  }
}
