import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

const sql = neon(process.env.NETLIFY_DATABASE_URL);

export async function handler(event) {
  try {
    const { email, password } = JSON.parse(event.body);

    // 1. Find User
    const users = await sql`SELECT * FROM users WHERE email = ${email}`;
    if (users.length === 0) {
      return { statusCode: 200, body: JSON.stringify({ status: 'fail', message: 'User not found' }) };
    }

    const user = users[0];

    // 2. COMPARE PASSWORD (Input vs Hash)
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      return { 
        statusCode: 200, 
        body: JSON.stringify({ status: 'success', name: user.name, email: user.email }) 
      };
    } else {
      return { statusCode: 200, body: JSON.stringify({ status: 'fail', message: 'Wrong password' }) };
    }

  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ status: 'error', message: err.message }) };
  }
}
