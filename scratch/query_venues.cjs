const mysql = require('mysql2/promise');

async function check() {
  try {
    const conn = await mysql.createConnection({
      host: '127.0.0.1',
      port: 3306,
      user: 'root',
      password: 'Yaksh@1419',
      database: 'box_cricket'
    });
    const [rows] = await conn.query('SELECT id, name, sports, sport FROM venues');
    console.log("Venues in database:", rows);
    await conn.end();
  } catch (err) {
    console.error("Error connecting to database:", err.message);
  }
}
check();
