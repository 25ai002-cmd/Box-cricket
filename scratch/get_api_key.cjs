const mysql = require('mysql2/promise');

async function run() {
  try {
    const conn = await mysql.createConnection({
      host: '127.0.0.1',
      port: 3306,
      user: 'root',
      password: 'Yaksh@1419',
      database: 'box_cricket'
    });
    const [rows] = await conn.query("SELECT playerId, username, role, apiKey FROM users");
    console.log(JSON.stringify(rows, null, 2));
    await conn.end();
  } catch (error) {
    console.error(error.message);
  }
}

run();
