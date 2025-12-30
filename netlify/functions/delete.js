import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

const sql = neon(process.env.NETLIFY_DATABASE_URL);

export async function handler(event) {
  try {
    const { email, password } = JSON.parse(event.body);

    // Find User
    const users = await sql`SELECT * FROM users WHERE email = ${email}`;
    if (users.length === 0) {
        return { statusCode: 200, body: JSON.stringify({ status: 'fail', message: 'User not found' }) };
    }

    // Verify Password Hash
    const isMatch = await bcrypt.compare(password, users[0].password);
    if (!isMatch) {
        return { statusCode: 200, body: JSON.stringify({ status: 'fail', message: 'Wrong password' }) };
    }

    // Delete
    await sql`DELETE FROM users WHERE email = ${email}`;

    return { statusCode: 200, body: JSON.stringify({ status: 'success', message: 'Account Deleted' }) };

  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ status: 'error', message: err.message }) };
  }
}
