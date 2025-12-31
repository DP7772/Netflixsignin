import fetch from 'node-fetch'; // Standard in Netlify Node environment

export async function handler(event) {
  try {
    // 1. Get the 'endpoint' from the frontend (e.g., "/trending/all/week")
    const { endpoint } = JSON.parse(event.body);
    
    const API_KEY = process.env.TMDB_API_KEY; // Securely loaded from Netlify
    const BASE_URL = "https://api.themoviedb.org/3";

    // 2. Fetch from TMDB using the secret key
    // We append the key here, on the server side
    const response = await fetch(`${BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${API_KEY}&language=en-US`);
    
    if (!response.ok) {
        return { statusCode: response.status, body: JSON.stringify({ error: "Failed to fetch from TMDB" }) };
    }

    const data = await response.json();

    // 3. Return the data to the frontend
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };

  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
