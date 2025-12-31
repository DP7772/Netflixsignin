import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.NETLIFY_DATABASE_URL);

export async function handler(event) {
  try {
    const { email, movie } = JSON.parse(event.body);
    
    // Insert into DB
    await sql`
      INSERT INTO my_list (user_email, movie_id, title, poster_path, overview)
      VALUES (${email}, ${movie.id}, ${movie.title || movie.name}, ${movie.poster_path}, ${movie.overview})
      ON CONFLICT (user_email, movie_id) DO NOTHING
    `;

    return { statusCode: 200, body: JSON.stringify({ status: 'success' }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
