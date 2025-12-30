import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

const sql = neon(process.env.NETLIFY_DATABASE_URL);

export async function handler(event) {
  try {
    const { email, name, newPassword } = JSON.parse(event.body);

    // Verify Name Match (Security Check)
    const users = await sql`SELECT * FROM users WHERE email = ${email}`;
    if (users.length === 0 || users[0].name !== name) {
        return { statusCode: 200, body: JSON.stringify({ status: 'fail', message: 'Identity mismatch' }) };
    }

    // Hash New Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update
    await sql`UPDATE users SET password = ${hashedPassword} WHERE email = ${email}`;

    return { statusCode: 200, body: JSON.stringify({ status: 'success', message: 'Password Reset' }) };

  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ status: 'error', message: err.message }) };
  }
}
