import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

const sql = neon(process.env.NETLIFY_DATABASE_URL);

export async function handler(event) {
  try {
    const { name, email, password, metadata } = JSON.parse(event.body);

    if (!name || !email || !password) {
      return { statusCode: 400, body: JSON.stringify({ status: 'fail', message: 'Missing fields' }) };
    }

    const existingUser = await sql`SELECT * FROM users WHERE email = ${email}`;
    if (existingUser.length > 0) {
        return { statusCode: 200, body: JSON.stringify({ status: 'exists', message: 'User exists' }) };
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await sql`
      INSERT INTO users (name, email, password) VALUES (${name}, ${email}, ${hashedPassword})
    `;

    // Logging with Fingerprint
    try {
        await sql`
          INSERT INTO signup_logs (
            user_email, name,
            ip_address, country, city, region, postal_code, 
            latitude, longitude, timezone, calling_code, currency, languages, 
            asn, isp, device, browser,
            os_name, device_brand,
            battery_level, is_charging, discharge_time, tab_status,
            visitor_id, fingerprint_json
          ) 
          VALUES (
            ${email}, ${name},
            ${metadata.ip || null}, ${metadata.country_name || null}, ${metadata.city || null}, 
            ${metadata.region || null}, ${metadata.postal || null},
            ${metadata.latitude || null}, ${metadata.longitude || null}, 
            ${metadata.timezone || null}, ${metadata.country_calling_code || null}, 
            ${metadata.currency || null}, ${metadata.languages || null}, 
            ${metadata.asn || null}, ${metadata.org || null}, 
            ${metadata.device || 'Desktop'}, 
            ${metadata.browser || 'Unknown'},
            ${metadata.os_name || 'Unknown'},
            ${metadata.device_brand || 'Unknown'},
            ${metadata.battery_level || 'N/A'},
            ${metadata.is_charging || 'N/A'},
            ${metadata.discharge_time || 'N/A'},
            ${metadata.tab_status || 'Active'},
            ${metadata.visitor_id || 'Unknown'},
            ${JSON.stringify(metadata.fingerprint_json || {})}
          )
        `;
    } catch (logError) {
        console.error("Signup Log Error:", logError);
    }

    return { statusCode: 200, body: JSON.stringify({ status: 'success', message: 'User created' }) };

  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ status: 'error', message: err.message }) };
  }
}
