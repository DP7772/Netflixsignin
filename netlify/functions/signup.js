// netlify/functions/signup.js
import { neon } from '@netlify/neon';
const sql = neon(); // Uses NETLIFY_DATABASE_URL

export async function handler(event) {
  try {
    const { name, email, password } = JSON.parse(event.body);

    // Check if user exists
    const existing = await sql`SELECT * FROM users WHERE email=${email}`;
    if(existing.length > 0) {
      return { statusCode: 200, body: JSON.stringify({status:'exists'}) };
    }

    // Insert new user
    await sql`INSERT INTO users (name,email,password) VALUES (${name}, ${email}, ${password})`;

    return { statusCode: 200, body: JSON.stringify({status:'success'}) };

  } catch(err) {
    return { statusCode: 500, body: JSON.stringify({status:'error', message: err.message}) };
  }
}
