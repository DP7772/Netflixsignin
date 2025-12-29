import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.NETLIFY_DATABASE_URL);

export async function handler(event) {
  try {
    const { email, newName, newPassword } = JSON.parse(event.body);

    if (!email || !newName || !newPassword) {
      return { statusCode: 400, body: JSON.stringify({ status: 'fail', message: 'Missing fields' }) };
    }

    // UPDATE QUERY
    await sql`
      UPDATE users 
      SET name = ${newName}, password = ${newPassword}
      WHERE email = ${email}
    `;

    return { 
      statusCode: 200, 
      body: JSON.stringify({ status: 'success', message: 'Profile Updated' }) 
    };

  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ status: 'error', message: err.message }) };
  }
}
