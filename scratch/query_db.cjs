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
    const [rows] = await conn.query('SELECT playerId, username, email, role, paymentStatus, subscriptionExpiry, lastExpiryReminder FROM users');
    console.log(JSON.stringify(rows, null, 2));
  } catch (err) {
    console.error('Error querying DB:', err.message);
  } finally {
    if (conn) await conn.end();
  }
}

main();
