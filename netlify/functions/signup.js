// 1. Use the standard driver
import { neon } from '@neondatabase/serverless';

// 2. Explicitly pass YOUR variable name
const sql = neon(process.env.NETLIFY_DATABASE_URL); 

export async function handler(event) {
  try {
    const { name, email, password } = JSON.parse(event.body);

    const existing = await sql`SELECT * FROM users WHERE email=${email}`;
    if(existing.length > 0) {
      return { statusCode: 200, body: JSON.stringify({status:'exists'}) };
    }

    await sql`INSERT INTO users (name,email,password) VALUES (${name}, ${email}, ${password})`;

    return { statusCode: 200, body: JSON.stringify({status:'success'}) };

  } catch(err) {
    return { statusCode: 500, body: JSON.stringify({status:'error', message: err.message}) };
  }
}
