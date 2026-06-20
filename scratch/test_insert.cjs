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
    console.log("Connected successfully to MySQL!");
    
    const [res] = await conn.query(
      "INSERT INTO venues (id, ownerId, name, address, phone, pricePerHour, advancePercent, sport, sports, gamingDetails) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      ['test-gaming', 'BCP-PL-0000', 'pitstop', '123 Street', '9999999999', 150, 100, 'Gaming', JSON.stringify(['Gaming']), JSON.stringify({ count: 1 })]
    );
    console.log("Insert response:", res);
    
    const [del] = await conn.query("DELETE FROM venues WHERE id = ?", ['test-gaming']);
    console.log("Delete response:", del);
    
    await conn.end();
  } catch (error) {
    console.error("Error running MySQL test:", error.message);
  }
}

run();
