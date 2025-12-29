import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.NETLIFY_DATABASE_URL);

export async function handler(event) {
  try {
    const { name, email, password } = JSON.parse(event.body);

    // 1. Basic Validation
    if (!email || !password || !name) {
      return { statusCode: 400, body: JSON.stringify({ status: 'fail', message: 'Missing fields' }) };
    }

    // 2. Check if user already exists
    const existing = await sql`SELECT * FROM users WHERE email = ${email}`;
    if (existing.length > 0) {
        return { statusCode: 200, body: JSON.stringify({ status: 'exists', message: 'User exists' }) };
    }

    // 3. INSERT USER (Correctly using email variable)
    // Ensure your Neon table 'users' has columns: name, email, password
    await sql`
      INSERT INTO users (name, email, password) 
      VALUES (${name}, ${email}, ${password})
    `;

    return { 
      statusCode: 200, 
      body: JSON.stringify({ status: 'success', message: 'User created' }) 
    };

  } catch (err) {
    console.error("Signup Error:", err);
    return { statusCode: 500, body: JSON.stringify({ status: 'error', message: err.message }) };
  }
}
