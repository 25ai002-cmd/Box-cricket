const mysql = require('mysql2/promise');

const dbConfig = {
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: 'Yaksh@1419',
  database: 'box_cricket'
};

async function main() {
  let conn;
  try {
    conn = await mysql.createConnection(dbConfig);
    const playerId = 'BCP-PL-3345';
    
    // Retrieve API key
    const [rows] = await conn.query('SELECT apiKey, email FROM users WHERE playerId = ?', [playerId]);
    if (rows.length === 0) {
      console.error('User not found');
      return;
    }
    const apiKey = rows[0].apiKey;
    console.log(`User ${playerId} API Key: ${apiKey}`);

    // Call /api/auth/subscribe using fetch
    console.log('Sending test POST request to http://localhost:3001/api/auth/subscribe...');
    const response = await fetch('http://localhost:3001/api/auth/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      },
      body: JSON.stringify({
        plan: 'monthly',
        // Manual simulated payment (no Razorpay credentials, which is allowed as a fallback)
      })
    });

    console.log('Status Code:', response.status);
    const data = await response.json();
    console.log('Response Body:', JSON.stringify(data, null, 2));

  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    if (conn) await conn.end();
  }
}

main();
