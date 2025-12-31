import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.NETLIFY_DATABASE_URL);

export async function handler(event) {
  try {
    const { email } = JSON.parse(event.body);
    const list = await sql`SELECT * FROM my_list WHERE user_email = ${email} ORDER BY created_at DESC`;
    return { statusCode: 200, body: JSON.stringify({ results: list }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
