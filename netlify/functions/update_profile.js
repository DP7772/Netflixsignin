import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

const sql = neon(process.env.NETLIFY_DATABASE_URL);

export async function handler(event) {
  try {
    const { email, newName, newPassword } = JSON.parse(event.body);

    if (!email || !newName || !newPassword) {
      return { statusCode: 400, body: JSON.stringify({ status: 'fail', message: 'Missing fields' }) };
    }

    // Hash the NEW password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update DB
    await sql`
      UPDATE users 
      SET name = ${newName}, password = ${hashedPassword}
      WHERE email = ${email}
    `;

    return { statusCode: 200, body: JSON.stringify({ status: 'success', message: 'Profile Updated' }) };

  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ status: 'error', message: err.message }) };
  }
}
