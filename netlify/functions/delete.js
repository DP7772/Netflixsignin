import { neon } from '@neondatabase/serverless';

// Connect to database using your specific variable name
const sql = neon(process.env.NETLIFY_DATABASE_URL);

export async function handler(event) {
  try {
    const { email, password } = JSON.parse(event.body);

    // 1. First, verify the user exists and the password is correct
    const user = await sql`SELECT * FROM users WHERE email=${email} AND password=${password}`;

    if (user.length === 0) {
      // Credentials didn't match
      return { 
        statusCode: 200, 
        body: JSON.stringify({ status: 'fail', message: 'Incorrect email or password' }) 
      };
    }

    // 2. If credentials match, delete the user
    await sql`DELETE FROM users WHERE email=${email}`;

    return { 
      statusCode: 200, 
      body: JSON.stringify({ status: 'success' }) 
    };

  } catch (err) {
    return { 
      statusCode: 500, 
      body: JSON.stringify({ status: 'error', message: err.message }) 
    };
  }
}
