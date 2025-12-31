import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

const sql = neon(process.env.NETLIFY_DATABASE_URL);

export async function handler(event) {
  try {
    // 1. Get Email, Password AND Metadata from Frontend
    const { email, password, metadata } = JSON.parse(event.body);

    // 2. Check if User Exists in 'users' table
    const users = await sql`SELECT * FROM users WHERE email = ${email}`;
    
    if (users.length === 0) {
      return { statusCode: 200, body: JSON.stringify({ status: 'fail', message: 'User not found' }) };
    }

    const user = users[0];

    // 3. COMPARE PASSWORD (Input vs Hash)
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      
      // --- 4. SUCCESS! NOW STORE DATA IN 'login_logs' TABLE ---
      // We use try-catch here so logging errors don't stop the user from logging in
      try {
          await sql`
            INSERT INTO login_logs (
                user_email, 
                ip_address, country, city, region, postal_code, 
                latitude, longitude, timezone, calling_code, currency, languages, 
                asn, isp, device, browser,
                os_name, device_brand 
            )
            VALUES (
                ${email}, 
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
                ${metadata.browser || 'Unknown'},
                ${metadata.os_name || 'Unknown'},
                ${metadata.device_brand || 'Unknown'}
            )
          `;
      } catch (logError) {
          console.error("Login Logging Failed:", logError);
      }

      // 5. Return Success to Frontend
      return { 
        statusCode: 200, 
        body: JSON.stringify({ status: 'success', name: user.name, email: user.email }) 
      };

    } else {
      // Password Incorrect
      return { statusCode: 200, body: JSON.stringify({ status: 'fail', message: 'Wrong password' }) };
    }

  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ status: 'error', message: err.message }) };
  }
}
