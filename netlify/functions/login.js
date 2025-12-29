import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.NETLIFY_DATABASE_URL);

export async function handler(event) {
  try {
    const { email, password } = JSON.parse(event.body);

    if (!email || !password) {
      return { statusCode: 400, body: JSON.stringify({ status: 'fail', message: 'Missing fields' }) };
    }

    // 1. Check User in DB
    const users = await sql`SELECT * FROM users WHERE email = ${email}`;

    if (users.length === 0) {
      return { statusCode: 200, body: JSON.stringify({ status: 'fail', message: 'User not found' }) };
    }

    const user = users[0];

    // 2. Verify Password
    if (user.password === password) {
      // SUCCESS: Return Name along with success status
      return { 
        statusCode: 200, 
        body: JSON.stringify({ 
            status: 'success', 
            name: user.name, // <--- SENDING REAL NAME FROM DB
            email: user.email 
        }) 
      };
    } else {
      return { statusCode: 200, body: JSON.stringify({ status: 'fail', message: 'Wrong password' }) };
    }

  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ status: 'error', message: err.message }) };
  }
}
