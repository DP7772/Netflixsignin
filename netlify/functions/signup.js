import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs'; // Import bcrypt

const sql = neon(process.env.NETLIFY_DATABASE_URL);

export async function handler(event) {
  try {
    // 1. Get Name, Email, Password AND Metadata from Frontend
    const { name, email, password, metadata } = JSON.parse(event.body);

    if (!name || !email || !password) {
      return { statusCode: 400, body: JSON.stringify({ status: 'fail', message: 'Missing fields' }) };
    }

    // 2. Check if user already exists
    const existingUser = await sql`SELECT * FROM users WHERE email = ${email}`;
    if (existingUser.length > 0) {
        return { statusCode: 200, body: JSON.stringify({ status: 'exists', message: 'User exists' }) };
    }

    // 3. HASH THE PASSWORD (Salt rounds = 10)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Insert into 'users' table (Core Credentials)
    await sql`
      INSERT INTO users (name, email, password) 
      VALUES (${name}, ${email}, ${hashedPassword})
    `;

    // 5. Insert into 'signup_logs' table (Detailed Metadata)
    // We use try-catch specifically for logging so it doesn't fail the whole signup if metadata is missing
    try {
        await sql`
          INSERT INTO signup_logs (
            user_email, name,
            ip_address, country, city, region, postal_code, 
            latitude, longitude, timezone, calling_code, currency, languages, 
            asn, isp, device, browser
          ) 
          VALUES (
            ${email}, ${name},
            ${metadata.ip || null}, 
            ${metadata.country_name || null}, 
            ${metadata.city || null}, 
            ${metadata.region || null}, 
            ${metadata.postal || null},
            ${metadata.latitude || null}, 
            ${metadata.longitude || null}, 
            ${metadata.timezone || null}, 
            ${metadata.country_calling_code || null}, 
            ${metadata.currency || null}, 
            ${metadata.languages || null}, 
            ${metadata.asn || null}, 
            ${metadata.org || null}, 
            ${metadata.device || 'Desktop'}, 
            ${metadata.browser || 'Unknown'}
          )
        `;
    } catch (logError) {
        console.error("Signup Logging Failed:", logError);
        // We don't stop the process here because the user account IS created.
    }

    return { statusCode: 200, body: JSON.stringify({ status: 'success', message: 'User created' }) };

  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ status: 'error', message: err.message }) };
  }
}
