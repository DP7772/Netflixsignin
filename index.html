import { neon } from '@neondatabase/serverless';

// Connect using your NETLIFY_DATABASE_URL variable
const sql = neon(process.env.NETLIFY_DATABASE_URL);

export async function handler(event) {
  try {
    const { email, name, newPassword } = JSON.parse(event.body);

    // 1. Verify User (Security Check)
    const user = await sql`SELECT * FROM users WHERE email=${email} AND name=${name}`;

    if (user.length === 0) {
      return { 
        statusCode: 200, 
        body: JSON.stringify({ status: 'fail', message: 'Verification failed: Name or Email incorrect.' }) 
      };
    }

    // 2. Update Password
    await sql`UPDATE users SET password=${newPassword} WHERE email=${email}`;

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
