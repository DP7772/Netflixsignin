import { neon } from '@neondatabase/serverless';

// Explicitly pass YOUR variable name
const sql = neon(process.env.NETLIFY_DATABASE_URL);

export async function handler(event) {
  try {
    const { email, password } = JSON.parse(event.body);

    const user = await sql`SELECT * FROM users WHERE email=${email} AND password=${password}`;
    
    if(user.length > 0) {
      return { statusCode: 200, body: JSON.stringify({status:'success'}) };
    } else {
      return { statusCode: 200, body: JSON.stringify({status:'fail'}) };
    }

  } catch(err) {
    return { statusCode: 500, body: JSON.stringify({status:'error', message: err.message}) };
  }
}
