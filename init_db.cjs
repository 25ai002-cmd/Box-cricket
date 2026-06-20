const mysql = require('mysql2/promise');

async function init() {
  const dbConfigWithoutDb = {
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: 'Yaksh@1419'
  };

  try {
    console.log("Connecting to MySQL on 127.0.0.1:3306 to initialize database...");
    const conn = await mysql.createConnection(dbConfigWithoutDb);
    
    // Create database
    await conn.query("CREATE DATABASE IF NOT EXISTS box_cricket");
    console.log("Database 'box_cricket' checked/created.");
    await conn.end();

    // Reconnect with database selected
    const connDb = await mysql.createConnection({
      ...dbConfigWithoutDb,
      database: 'box_cricket'
    });

    console.log("Creating tables if not exist...");

    // Venues table
    await connDb.query(`
      CREATE TABLE IF NOT EXISTS venues (
        id VARCHAR(50) PRIMARY KEY,
        ownerId VARCHAR(50) DEFAULT 'BCP-PL-0000',
        name VARCHAR(100) NOT NULL,
        address TEXT NOT NULL,
        phone VARCHAR(30) NOT NULL,
        pricePerHour INT NOT NULL,
        advancePercent INT NOT NULL,
        terms TEXT,
        images LONGTEXT, -- JSON string array
        upiId VARCHAR(100) DEFAULT 'arena@upi',
        rating DECIMAL(3,2) DEFAULT 5.00,
        reviewsCount INT DEFAULT 0,
        sport VARCHAR(50) DEFAULT 'Box Cricket',
        sports TEXT DEFAULT NULL,
        upiQrImage LONGTEXT DEFAULT NULL,
        gamingDetails TEXT DEFAULT NULL
      )
    `);
    console.log("- 'venues' table ready.");

    // Venue Reviews table
    await connDb.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id VARCHAR(50) PRIMARY KEY,
        venueId VARCHAR(50) NOT NULL,
        user VARCHAR(100) NOT NULL,
        rating INT NOT NULL,
        comment TEXT,
        date VARCHAR(50) DEFAULT 'Today',
        FOREIGN KEY (venueId) REFERENCES venues(id) ON DELETE CASCADE
      )
    `);
    console.log("- 'reviews' table ready.");

    // Bookings table
    await connDb.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id VARCHAR(50) PRIMARY KEY,
        venueId VARCHAR(50) NOT NULL,
        venueName VARCHAR(100) NOT NULL,
        date VARCHAR(100) NOT NULL,
        timeSlot VARCHAR(100) NOT NULL,
        duration VARCHAR(30) DEFAULT '1 Hour',
        amountPaid INT NOT NULL,
        status VARCHAR(30) DEFAULT 'CONFIRMED',
        customerName VARCHAR(100) NOT NULL,
        FOREIGN KEY (venueId) REFERENCES venues(id) ON DELETE CASCADE
      )
    `);
    console.log("- 'bookings' table ready.");

    // Teams table
    await connDb.query(`
      CREATE TABLE IF NOT EXISTS teams (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        captain VARCHAR(100) NOT NULL,
        sport VARCHAR(50) NOT NULL DEFAULT 'Box Cricket',
        creatorId VARCHAR(50) DEFAULT NULL
      )
    `);
    console.log("- 'teams' table ready.");

    // Team Access table
    await connDb.query(`
      CREATE TABLE IF NOT EXISTS team_access (
        teamId VARCHAR(50) NOT NULL,
        userId VARCHAR(50) NOT NULL,
        accessType VARCHAR(20) DEFAULT 'viewer',
        PRIMARY KEY (teamId, userId),
        FOREIGN KEY (teamId) REFERENCES teams(id) ON DELETE CASCADE
      )
    `);
    console.log("- 'team_access' table ready.");

    // Players table
    await connDb.query(`
      CREATE TABLE IF NOT EXISTS players (
        id VARCHAR(50) PRIMARY KEY,
        teamId VARCHAR(50) NOT NULL,
        name VARCHAR(100) NOT NULL,
        jersey VARCHAR(10) NOT NULL,
        role VARCHAR(50) NOT NULL,
        matches INT DEFAULT 0,
        runs INT DEFAULT 0,
        avg DECIMAL(5,2) DEFAULT 0.00,
        sr DECIMAL(5,2) DEFAULT 0.00,
        wickets INT DEFAULT 0,
        eco DECIMAL(4,2) DEFAULT 0.00,
        best VARCHAR(10) DEFAULT '-',
        phone VARCHAR(30) DEFAULT NULL,
        FOREIGN KEY (teamId) REFERENCES teams(id) ON DELETE CASCADE
      )
    `);
    console.log("- 'players' table ready.");

    // Completed Matches table
    await connDb.query(`
      CREATE TABLE IF NOT EXISTS completed_matches (
        id VARCHAR(50) PRIMARY KEY,
        team1 VARCHAR(100) NOT NULL,
        team2 VARCHAR(100) NOT NULL,
        team1Id VARCHAR(50) DEFAULT NULL,
        team2Id VARCHAR(50) DEFAULT NULL,
        runs INT NOT NULL,
        wickets INT NOT NULL,
        balls INT NOT NULL,
        crr VARCHAR(10) NOT NULL,
        date VARCHAR(50) DEFAULT 'Today',
        sport VARCHAR(50) DEFAULT 'Cricket',
        venue VARCHAR(100) DEFAULT 'Local Arena',
        scorerId VARCHAR(50) DEFAULT NULL,
        scorerName VARCHAR(100) DEFAULT NULL,
        result VARCHAR(255) DEFAULT NULL,
        isAbandoned INT DEFAULT 0,
        matchState LONGTEXT DEFAULT NULL,
        tossText VARCHAR(255) DEFAULT NULL
      )
    `);
    console.log("- 'completed_matches' table ready.");

    // Live Matches table
    await connDb.query(`
      CREATE TABLE IF NOT EXISTS live_matches (
        id VARCHAR(50) PRIMARY KEY,
        sport VARCHAR(50) NOT NULL,
        data LONGTEXT NOT NULL
      )
    `);
    console.log("- 'live_matches' table ready.");

    // Users table
    await connDb.query(`
      CREATE TABLE IF NOT EXISTS users (
        playerId VARCHAR(50) PRIMARY KEY,
        username VARCHAR(50) UNIQUE,
        email VARCHAR(100) UNIQUE,
        phone VARCHAR(30) UNIQUE,
        password VARCHAR(255) NOT NULL,
        apiKey VARCHAR(100) UNIQUE NOT NULL,
        role VARCHAR(30) NOT NULL,
        specialty VARCHAR(50) DEFAULT NULL,
        specialties TEXT DEFAULT NULL,
        sports_interests TEXT DEFAULT NULL,
        paymentStatus VARCHAR(20) DEFAULT 'unpaid',
        subscriptionExpiry VARCHAR(50) DEFAULT NULL,
        lastExpiryReminder INT DEFAULT 0,
        subscriptionPlan VARCHAR(50) DEFAULT NULL
      )
    `);
    console.log("- 'users' table ready.");

    // Convert empty string usernames to NULL to avoid duplicate key issues on UNIQUE constraint
    await connDb.query("UPDATE users SET username = NULL WHERE username = ''");
    console.log("- Cleared duplicate empty string usernames.");

    // Seed PlayStation Gaming Hub
    const [exists] = await connDb.query("SELECT id FROM venues WHERE id = 'gaming-hub'");
    if (exists.length === 0) {
      await connDb.query(
        `INSERT INTO venues (id, ownerId, name, address, phone, pricePerHour, advancePercent, terms, images, upiId, rating, reviewsCount, sport, sports, gamingDetails) 
         VALUES ('gaming-hub', 'BCP-PL-0000', 'PlayStation Gaming Hub', 'In-House Arena, Level 2', '9999999999', 150, 100, 'Standard gaming hub terms apply. 1 hour booking slots.', '["https://images.unsplash.com/photo-1606144042614-b2417e99c4e3"]', 'gaming@upi', 5.0, 0, 'Gaming', '["Gaming"]', ?)`
      , [JSON.stringify({
        ps5Count: 3,
        ps4Count: 1,
        pcCount: 2,
        availableGames: "FIFA 24, Tekken 8, Spider-Man 2, GTA V, Valorant",
        ps5SinglePrice: 150,
        ps5MultiPrice: 250,
        ps4SinglePrice: 100,
        ps4MultiPrice: 180,
        pcSinglePrice: 120,
        pcMultiPrice: 120
      })]);
      console.log("- Seeded 'gaming-hub' venue.");
    }

    await connDb.end();
    console.log("Database initialized successfully!");
    process.exit(0);

  } catch (error) {
    console.error("Database initialization failed:", error.message);
    process.exit(1);
  }
}

init();
