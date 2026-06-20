const mysql = require('mysql2/promise');

const dbConfig = {
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: 'Yaksh@1419',
  database: 'box_cricket'
};

const days = parseFloat(process.argv[2]);
if (isNaN(days)) {
  console.error('Usage: node setup_user_expiry.cjs <days_remaining>');
  process.exit(1);
}

async function main() {
  let conn;
  try {
    conn = await mysql.createConnection(dbConfig);
    const playerId = 'BCP-PL-3345'; // yakshbarot597@gmail.com
    
    // Calculate expiry date
    // If days is 5, we want Math.ceil(diffTime / day) to be 5, so we can set it to 4.8 days from now
    const offsetMs = days * 24 * 60 * 60 * 1000 - 30 * 60 * 1000; // e.g., 4.98 days
    const expiryDate = new Date(Date.now() + offsetMs);
    const expiryStr = expiryDate.toISOString();
    
    console.log(`Setting subscriptionExpiry for ${playerId} to ${expiryStr} (${days} days remaining)`);
    
    await conn.query(
      `UPDATE users SET paymentStatus = 'active', subscriptionExpiry = ?, lastExpiryReminder = 0 WHERE playerId = ?`,
      [expiryStr, playerId]
    );
    
    const [rows] = await conn.query('SELECT playerId, email, role, paymentStatus, subscriptionExpiry, lastExpiryReminder FROM users WHERE playerId = ?', [playerId]);
    console.log('User status updated:', JSON.stringify(rows[0], null, 2));
    
  } catch (err) {
    console.error('Error updating DB:', err.message);
  } finally {
    if (conn) await conn.end();
  }
}

main();
