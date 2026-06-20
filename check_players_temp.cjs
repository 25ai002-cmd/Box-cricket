const mysql = require('mysql2/promise');

async function main() {
  try {
    const connection = await mysql.createConnection({
      host: '127.0.0.1',
      port: 3306,
      user: 'root',
      password: 'Yaksh@1419',
      database: 'box_cricket'
    });
    const [rows] = await connection.query('SELECT * FROM completed_matches');
    console.log(JSON.stringify(rows, null, 2));
    await connection.end();
  } catch (err) {
    console.error(err);
  }
}

main();
