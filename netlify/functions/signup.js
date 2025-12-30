import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs'; // Import bcrypt

const sql = neon(process.env.NETLIFY_DATABASE_URL);

export async function handler(event) {
  try {
    const { name, email, password } = JSON.parse(event.body);

    if (!name || !email || !password) {
      return { statusCode: 400, body: JSON.stringify({ status: 'fail', message: 'Missing fields' }) };
    }

    // 1. Check if user exists
    const existingUser = await sql`SELECT * FROM users WHERE email = ${email}`;
    if (existingUser.length > 0) {
        return { statusCode: 200, body: JSON.stringify({ status: 'exists', message: 'User exists' }) };
    }

    // 2. HASH THE PASSWORD (Salt rounds = 10)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Insert into DB (Store the HASH, not the plain password)
    await sql`
      INSERT INTO users (name, email, password) 
      VALUES (${name}, ${email}, ${hashedPassword})
    `;

    return { statusCode: 200, body: JSON.stringify({ status: 'success', message: 'User created' }) };

  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ status: 'error', message: err.message }) };
  }
}
