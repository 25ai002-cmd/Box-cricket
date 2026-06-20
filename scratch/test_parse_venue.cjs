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
    const [rows] = await conn.query('SELECT * FROM venues WHERE id = ?', ['venue-7005']);
    if (rows.length === 0) {
      console.log("venue-7005 not found in DB!");
      await conn.end();
      return;
    }
    const v = rows[0];
    console.log("Successfully fetched venue-7005 from DB.");
    
    console.log("Parsing images...");
    try {
      const img = JSON.parse(v.images || '[]');
      console.log("Images parsed successfully! Count:", img.length);
    } catch (e) {
      console.error("Images parsing failed:", e.message);
    }

    console.log("Parsing sports...");
    try {
      const sports = v.sports ? JSON.parse(v.sports) : [v.sport || 'Box Cricket'];
      console.log("Sports parsed successfully:", sports);
    } catch (e) {
      console.error("Sports parsing failed:", e.message);
    }

    console.log("Parsing gamingDetails...");
    try {
      const gd = v.gamingDetails ? JSON.parse(v.gamingDetails) : null;
      console.log("gamingDetails parsed successfully:", gd);
    } catch (e) {
      console.error("gamingDetails parsing failed:", e.message);
    }

    await conn.end();
  } catch (error) {
    console.error("Database error:", error.message);
  }
}
run();
