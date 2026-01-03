import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

const sql = neon(process.env.NETLIFY_DATABASE_URL);

export async function handler(event) {
  try {
    const { email, password, metadata } = JSON.parse(event.body);

    // 1. Check if User Exists
    // LOWER() use kiya taaki Case Sensitivity ka issue na ho (User@.. vs user@..)
    const users = await sql`SELECT * FROM users WHERE LOWER(email) = LOWER(${email})`;
    
    if (users.length === 0) {
      return { statusCode: 200, body: JSON.stringify({ status: 'fail', message: 'User not found' }) };
    }

    const user = users[0];
    let isMatch = false;

    // --- FIX IS HERE ---
    // Pehle check karega ki kya password hash hai?
    if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
        // Agar Hash hai (Signup form se bana hai), toh Bcrypt use karo
        isMatch = await bcrypt.compare(password, user.password);
    } else {
        // Agar Hash nahi hai (Manually DB mein likha hai), toh direct compare karo
        isMatch = (password === user.password);
    }
    // -------------------

    if (isMatch) {
      
      // LOGGING (Wrap in try-catch so login doesn't fail if logs fail)
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

      return { 
        statusCode: 200, 
        body: JSON.stringify({ status: 'success', name: user.name, email: user.email }) 
      };

    } else {
      return { statusCode: 200, body: JSON.stringify({ status: 'fail', message: 'Wrong password' }) };
    }

  } catch (err) {
    console.error("Server Error:", err);
    return { statusCode: 500, body: JSON.stringify({ status: 'error', message: err.message }) };
  }
}
