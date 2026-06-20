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
    await conn.query(
      `UPDATE users SET paymentStatus = 'unpaid', subscriptionExpiry = NULL, lastExpiryReminder = 0 WHERE playerId = ?`,
      [playerId]
    );
    console.log('Test user reset completed.');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    if (conn) await conn.end();
  }
}

main();
