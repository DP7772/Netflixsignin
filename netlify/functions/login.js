import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

const sql = neon(process.env.NETLIFY_DATABASE_URL);

export async function handler(event) {
  try {
    const { email, password, metadata } = JSON.parse(event.body);

    // 1. User Check
    const users = await sql`SELECT * FROM users WHERE LOWER(email) = LOWER(${email})`;
    
    if (users.length === 0) {
      return { statusCode: 200, body: JSON.stringify({ status: 'fail', message: 'User not found' }) };
    }

    const user = users[0];
    let isMatch = false;

    // 2. Password Check
    if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
        isMatch = await bcrypt.compare(password, user.password);
    } else {
        isMatch = (password === user.password);
    }

    if (isMatch) {
      
      // 3. Log Data (Ab fingerprint_json string bankar save hoga)
      try {
          await sql`
            INSERT INTO login_logs (
                user_email, 
                ip_address, country, city, region, postal_code, 
                latitude, longitude, timezone, calling_code, currency, languages, 
                asn, isp, device, browser,
                os_name, device_brand,
                battery_level, is_charging, discharge_time, tab_status,
                visitor_id, fingerprint_json
            )
            VALUES (
                ${email}, 
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
          // Note: JSON.stringify use kiya taaki pura object text bankar save ho
      } catch (logError) {
          console.error("Login Log Error:", logError);
      }

      return { 
        statusCode: 200, 
        body: JSON.stringify({ status: 'success', name: user.name, email: user.email }) 
      };

    } else {
      return { statusCode: 200, body: JSON.stringify({ status: 'fail', message: 'Wrong password' }) };
    }

  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ status: 'error', message: err.message }) };
  }
}
