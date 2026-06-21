const express = require('express');
const cors = require('cors');
const isPostgres = !!(process.env.DATABASE_URL || process.env.POSTGRES_URL);
const mysql = !isPostgres ? require('mysql2/promise') : null;
const pg = isPostgres ? require('pg') : null;
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: 'rzp_test_T01br2Bnh2Rgp1',
  key_secret: '35HVf4YzPFr5bmIXIRnDAMoc'
});

const app = express();
const PORT = process.env.PORT || 3001;

const JWT_SECRET = process.env.JWT_SECRET || 'box_cricket_secret_key_12345!@#';
const BREVO_API_KEY = process.env.BREVO_API_KEY || '';

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// MySQL connection parameters
const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Yaksh@1419',
  database: process.env.DB_NAME || 'box_cricket'
};

let dbPool = null;

const KEY_CASE_MAP = {
  playerid: 'playerId',
  ownerid: 'ownerId',
  caretakerphone: 'caretakerPhone',
  priceperhour: 'pricePerHour',
  advancepercent: 'advancePercent',
  reviewscount: 'reviewsCount',
  upiqrimage: 'upiQrImage',
  gamingdetails: 'gamingDetails',
  creatorid: 'creatorId',
  teamid: 'teamId',
  userid: 'userId',
  accesstype: 'accessType',
  team1id: 'team1Id',
  team2id: 'team2Id',
  scorerid: 'scorerId',
  scorername: 'scorerName',
  isabandoned: 'isAbandoned',
  matchstate: 'matchState',
  tosstext: 'tossText',
  sports_interests: 'sports_interests',
  visitcount: 'visitCount',
  paymentstatus: 'paymentStatus',
  subscriptionexpiry: 'subscriptionExpiry',
  lastexpiryreminder: 'lastExpiryReminder',
  subscriptionplan: 'subscriptionPlan'
};

function normalizeRowKeys(row) {
  if (!row || typeof row !== 'object') return row;
  const newRow = {};
  for (const [key, value] of Object.entries(row)) {
    const mappedKey = KEY_CASE_MAP[key.toLowerCase()] || key;
    newRow[mappedKey] = value;
  }
  return newRow;
}

function translateSql(sql) {
  if (typeof sql !== 'string') return sql;
  let pgSql = sql;
  // Map MySQL LONGTEXT type to PostgreSQL TEXT type
  pgSql = pgSql.replace(/\bLONGTEXT\b/gi, 'TEXT');
  // Map backticks to empty strings for PostgreSQL case-insensitive names
  pgSql = pgSql.replace(/`/g, '');
  // Map MySQL-specific INSERT IGNORE to PostgreSQL equivalent
  pgSql = pgSql.replace(
    /INSERT IGNORE INTO team_access \((.*?)\) SELECT id, IFNULL\(creatorId, 'BCP-PL-0000'\), 'owner' FROM teams/i,
    "INSERT INTO team_access ($1) SELECT id, COALESCE(creatorId, 'BCP-PL-0000'), 'owner' FROM teams ON CONFLICT (teamId, userId) DO NOTHING"
  );
  
  // Map PostgreSQL reserved column keyword 'user' in 'reviews' table specifically
  pgSql = pgSql.replace(/\buser VARCHAR\b/gi, '"user" VARCHAR');
  pgSql = pgSql.replace(/\bINSERT INTO reviews \((.*?)user(.*?)\)/gi, 'INSERT INTO reviews ($1"user"$2)');
  
  // Map ? placeholders to $1, $2, $3...
  let paramCount = 1;
  pgSql = pgSql.replace(/\?/g, () => `$${paramCount++}`);
  return pgSql;
}

class PgMySQLAdapter {
  constructor(pgPool) {
    this.pool = pgPool;
  }
  async query(sql, params) {
    const pgSql = translateSql(sql);
    const res = await this.pool.query(pgSql, params);
    const rows = Array.isArray(res.rows) ? res.rows.map(normalizeRowKeys) : [];
    return [rows, res.fields];
  }
  async getConnection() {
    const client = await this.pool.connect();
    return {
      query: async (sql, params) => {
        const pgSql = translateSql(sql);
        const res = await client.query(pgSql, params);
        const rows = Array.isArray(res.rows) ? res.rows.map(normalizeRowKeys) : [];
        return [rows, res.fields];
      },
      release: () => client.release()
    };
  }
  async end() {
    await this.pool.end();
  }
}
let useLocalFallback = false;
const LOCAL_DB_FILE = path.join(__dirname, 'local_db.json');
const resetCodes = new Map();
const signupVerificationCodes = new Map();
const verifiedSignupEmails = new Set();

// Initialize Local JSON Fallback DB if file doesn't exist
function initLocalDB() {
  if (!fs.existsSync(LOCAL_DB_FILE)) {
    const defaultData = {
      venues: [],
      reviews: [],
      bookings: [],
      teams: [],
      players: [],
      completed_matches: [],
      users: []
    };
    fs.writeFileSync(LOCAL_DB_FILE, JSON.stringify(defaultData, null, 2), 'utf8');
  }
}

function readLocalDB() {
  initLocalDB();
  const data = fs.readFileSync(LOCAL_DB_FILE, 'utf8');
  const parsed = JSON.parse(data);
  let changed = false;
  if (!parsed.users) {
    parsed.users = [];
    changed = true;
  }
  if (!parsed.tournaments) {
    parsed.tournaments = [];
    changed = true;
  }
  if (!parsed.loyalty_visits) {
    parsed.loyalty_visits = [];
    changed = true;
  }
  if (!parsed.live_matches) {
    parsed.live_matches = [];
    changed = true;
  }
  if (!parsed.venues) {
    parsed.venues = [];
    changed = true;
  }
  if (parsed.users) {
    parsed.users.forEach(u => {
      if (u.paymentStatus === undefined) {
        u.paymentStatus = u.role === 'admin' ? 'unpaid' : 'active';
        changed = true;
      }
      if (u.subscriptionExpiry === undefined) {
        u.subscriptionExpiry = null;
        changed = true;
      }
      if (u.lastExpiryReminder === undefined) {
        u.lastExpiryReminder = 0;
        changed = true;
      }
      if (u.subscriptionPlan === undefined) {
        u.subscriptionPlan = null;
        changed = true;
      }
    });
  }
  if (parsed.venues) {
    const oldTurfA = "https://images.unsplash.com/photo-1544698310-74ea9d1c8258?auto=format&fit=crop&q=80&w=800";
    const newTurfA = "https://images.unsplash.com/photo-1589487391730-58f20eb2c308?auto=format&fit=crop&q=80&w=800";
    const oldTurfC = "https://images.unsplash.com/photo-1595111028557-473d9d02dcf9?auto=format&fit=crop&q=80&w=800";
    const oldTurfC2 = "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800";
    const newTurfC = "https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&q=80&w=800";

    parsed.venues.forEach(venue => {
      if (venue.images && Array.isArray(venue.images)) {
        let updated = false;
        venue.images = venue.images.map(img => {
          if (img === oldTurfA) { updated = true; return newTurfA; }
          if (img === oldTurfC || img === oldTurfC2) { updated = true; return newTurfC; }
          if (img && img.includes("photo-1544698310-74ea9d1c8258")) { updated = true; return newTurfA; }
          if (img && img.includes("photo-1595111028557-473d9d02dcf9")) { updated = true; return newTurfC; }
          if (img && img.includes("photo-1508098682722-e99c43a406b2")) { updated = true; return newTurfC; }
          return img;
        });
        if (updated) changed = true;
      }
    });
  }
  if (!parsed.venues.some(v => v.id === 'gaming-hub')) {
    parsed.venues.push({
      id: 'gaming-hub',
      ownerId: 'BCP-PL-0000',
      name: 'PlayStation Gaming Hub',
      address: 'In-House Arena, Level 2',
      phone: '9999999999',
      caretakerPhone: '9999999999',
      pricePerHour: 150,
      advancePercent: 100,
      terms: 'Standard gaming hub terms apply. 1 hour booking slots.',
      images: ['https://images.unsplash.com/photo-1606144042614-b2417e99c4e3'],
      upiId: 'gaming@upi',
      rating: 5.0,
      reviewsCount: 0,
      sport: 'Gaming',
      sports: ['Gaming'],
      gamingDetails: {
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
      }
    });
    changed = true;
  } else {
    // If it exists, ensure gamingDetails is present
    const hub = parsed.venues.find(v => v.id === 'gaming-hub');
    if (hub && !hub.gamingDetails) {
      hub.gamingDetails = {
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
      };
      changed = true;
    }
  }
  if (changed) {
    fs.writeFileSync(LOCAL_DB_FILE, JSON.stringify(parsed, null, 2), 'utf8');
  }
  return parsed;
}

function writeLocalDB(data) {
  fs.writeFileSync(LOCAL_DB_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// Recalculate player stats from completed matches
async function recalculatePlayerStats() {
  if (useLocalFallback) {
    try {
      const db = readLocalDB();
      const playerStatsMap = {};
      
      db.players.forEach(p => {
        playerStatsMap[p.id] = {
          matches: 0,
          runs: 0,
          balls: 0,
          dismissals: 0,
          wickets: 0,
          runsConceded: 0,
          ballsBowled: 0,
          bestWickets: 0,
          bestRuns: 999
        };
      });

      const allMatches = (db.completed_matches || []).filter(m => !m.isAbandoned);

      allMatches.forEach(m => {
        const matchPlayers = new Set();
        const sport = m.sport || 'Cricket';

        if (sport === 'Cricket' || sport === 'Box Cricket') {
          const state = typeof m.matchState === 'string' ? JSON.parse(m.matchState) : m.matchState;
          if (state) {
            const firstInningsBatting = state.firstInningsBatting || [];
            const firstInningsBowling = state.firstInningsBowling || [];
            const batting = state.batting || [];
            const bowling = state.bowling || [];

            firstInningsBatting.forEach(p => { if (p.id) matchPlayers.add(p.id); });
            firstInningsBowling.forEach(p => { if (p.id) matchPlayers.add(p.id); });
            batting.forEach(p => { if (p.id) matchPlayers.add(p.id); });
            bowling.forEach(p => { if (p.id) matchPlayers.add(p.id); });
          }
        } else {
          // Find all players belonging to team1Id or team2Id
          const team1Id = m.team1Id;
          const team2Id = m.team2Id;
          db.players.forEach(p => {
            if (p.teamId === team1Id || p.teamId === team2Id) {
              matchPlayers.add(p.id);
            }
          });
        }

        matchPlayers.forEach(pid => {
          if (playerStatsMap[pid]) {
            playerStatsMap[pid].matches += 1;
          }
        });

        // Now process cricket stats if it's Cricket
        if (sport === 'Cricket' || sport === 'Box Cricket') {
          const state = typeof m.matchState === 'string' ? JSON.parse(m.matchState) : m.matchState;
          if (state) {
            const firstInningsBatting = state.firstInningsBatting || [];
            const firstInningsBowling = state.firstInningsBowling || [];
            const batting = state.batting || [];
            const bowling = state.bowling || [];

            const allBatting = [...firstInningsBatting, ...batting];
            allBatting.forEach(p => {
              if (p.id && playerStatsMap[p.id]) {
                const stats = playerStatsMap[p.id];
                stats.runs += p.runs || 0;
                stats.balls += p.balls || 0;
                const isOut = p.dismissal && p.dismissal.toLowerCase() !== 'not out' && p.dismissal.toLowerCase() !== 'batting';
                if (isOut) {
                  stats.dismissals += 1;
                }
              }
            });

            const allBowling = [...firstInningsBowling, ...bowling];
            allBowling.forEach(p => {
              if (p.id && playerStatsMap[p.id]) {
                const stats = playerStatsMap[p.id];
                stats.wickets += p.wickets || 0;
                stats.runsConceded += p.runs || 0;

                const oversStr = p.overs || '0.0';
                const parts = oversStr.toString().split('.');
                const ov = parseInt(parts[0]) || 0;
                const bl = parseInt(parts[1]) || 0;
                stats.ballsBowled += (ov * 6) + bl;

                const wkts = p.wickets || 0;
                const runsConceded = p.runs || 0;
                if (wkts > stats.bestWickets || (wkts === stats.bestWickets && runsConceded < stats.bestRuns)) {
                  stats.bestWickets = wkts;
                  stats.bestRuns = runsConceded;
                }
              }
            });
          }
        }
      });

      db.players = db.players.map(p => {
        const stats = playerStatsMap[p.id];
        if (!stats) return p;

        const avg = stats.dismissals > 0 ? (stats.runs / stats.dismissals) : stats.runs;
        const sr = stats.balls > 0 ? ((stats.runs / stats.balls) * 100) : 0.0;
        const eco = stats.ballsBowled > 0 ? ((stats.runsConceded / stats.ballsBowled) * 6) : 0.0;
        const best = stats.bestWickets > 0 ? `${stats.bestWickets}/${stats.bestRuns}` : '-';

        return {
          ...p,
          matches: stats.matches,
          runs: stats.runs,
          avg: parseFloat(avg.toFixed(2)),
          sr: parseFloat(sr.toFixed(2)),
          wickets: stats.wickets,
          eco: parseFloat(eco.toFixed(2)),
          best
        };
      });

      writeLocalDB(db);
      console.log("Recalculated local DB player career stats.");
    } catch (err) {
      console.error("Local fallback player stats recalculation failed:", err.message);
    }
  } else {
    try {
      const [players] = await dbPool.query('SELECT id, teamId FROM players');
      const playerStatsMap = {};
      players.forEach(p => {
        playerStatsMap[p.id] = {
          teamId: p.teamId,
          matches: 0,
          runs: 0,
          balls: 0,
          dismissals: 0,
          wickets: 0,
          runsConceded: 0,
          ballsBowled: 0,
          bestWickets: 0,
          bestRuns: 999
        };
      });

      const [matches] = await dbPool.query('SELECT sport, team1Id, team2Id, matchState FROM completed_matches WHERE isAbandoned = 0');
      matches.forEach(m => {
        const matchPlayers = new Set();
        const sport = m.sport || 'Cricket';

        if (sport === 'Cricket' || sport === 'Box Cricket') {
          if (m.matchState) {
            let state;
            try {
              state = typeof m.matchState === 'string' ? JSON.parse(m.matchState) : m.matchState;
            } catch (e) {
              return;
            }
            if (state) {
              const firstInningsBatting = state.firstInningsBatting || [];
              const firstInningsBowling = state.firstInningsBowling || [];
              const batting = state.batting || [];
              const bowling = state.bowling || [];

              firstInningsBatting.forEach(p => { if (p.id) matchPlayers.add(p.id); });
              firstInningsBowling.forEach(p => { if (p.id) matchPlayers.add(p.id); });
              batting.forEach(p => { if (p.id) matchPlayers.add(p.id); });
              bowling.forEach(p => { if (p.id) matchPlayers.add(p.id); });
            }
          }
        } else {
          // Find all players belonging to team1Id or team2Id
          const team1Id = m.team1Id;
          const team2Id = m.team2Id;
          players.forEach(p => {
            if (p.teamId === team1Id || p.teamId === team2Id) {
              matchPlayers.add(p.id);
            }
          });
        }

        matchPlayers.forEach(pid => {
          if (playerStatsMap[pid]) {
            playerStatsMap[pid].matches += 1;
          }
        });

        if (sport === 'Cricket' || sport === 'Box Cricket') {
          if (m.matchState) {
            let state;
            try {
              state = typeof m.matchState === 'string' ? JSON.parse(m.matchState) : m.matchState;
            } catch (e) {
              return;
            }
            if (state) {
              const firstInningsBatting = state.firstInningsBatting || [];
              const firstInningsBowling = state.firstInningsBowling || [];
              const batting = state.batting || [];
              const bowling = state.bowling || [];

              const allBatting = [...firstInningsBatting, ...batting];
              allBatting.forEach(p => {
                if (p.id && playerStatsMap[p.id]) {
                  const stats = playerStatsMap[p.id];
                  stats.runs += p.runs || 0;
                  stats.balls += p.balls || 0;
                  const isOut = p.dismissal && p.dismissal.toLowerCase() !== 'not out' && p.dismissal.toLowerCase() !== 'batting';
                  if (isOut) {
                    stats.dismissals += 1;
                  }
                }
              });

              const allBowling = [...firstInningsBowling, ...bowling];
              allBowling.forEach(p => {
                if (p.id && playerStatsMap[p.id]) {
                  const stats = playerStatsMap[p.id];
                  stats.wickets += p.wickets || 0;
                  stats.runsConceded += p.runs || 0;

                  const oversStr = p.overs || '0.0';
                  const parts = oversStr.toString().split('.');
                  const ov = parseInt(parts[0]) || 0;
                  const bl = parseInt(parts[1]) || 0;
                  stats.ballsBowled += (ov * 6) + bl;

                  const wkts = p.wickets || 0;
                  const runsConceded = p.runs || 0;
                  if (wkts > stats.bestWickets || (wkts === stats.bestWickets && runsConceded < stats.bestRuns)) {
                    stats.bestWickets = wkts;
                    stats.bestRuns = runsConceded;
                  }
                }
              });
            }
          }
        }
      });

      for (const [id, stats] of Object.entries(playerStatsMap)) {
        const avg = stats.dismissals > 0 ? (stats.runs / stats.dismissals) : stats.runs;
        const sr = stats.balls > 0 ? ((stats.runs / stats.balls) * 100) : 0.0;
        const eco = stats.ballsBowled > 0 ? ((stats.runsConceded / stats.ballsBowled) * 6) : 0.0;
        const best = stats.bestWickets > 0 ? `${stats.bestWickets}/${stats.bestRuns}` : '-';

        await dbPool.query(
          'UPDATE players SET matches = ?, runs = ?, avg = ?, sr = ?, wickets = ?, eco = ?, best = ? WHERE id = ?',
          [stats.matches, stats.runs, parseFloat(avg.toFixed(2)), parseFloat(sr.toFixed(2)), stats.wickets, parseFloat(eco.toFixed(2)), best, id]
        );
      }
      console.log("Recalculated MySQL player career stats successfully.");
    } catch (err) {
      console.error("MySQL player stats recalculation failed:", err.message);
    }
  }
}

// Password hashing utility
function hashPassword(password) {
  return crypto.createHmac('sha256', JWT_SECRET).update(password).digest('hex');
}

// Database and Table initialization
async function initDatabase() {
  try {
    if (isPostgres) {
      console.log("Connecting to PostgreSQL database using environment URL...");
      const pgPool = new pg.Pool({
        connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
        ssl: {
          rejectUnauthorized: false
        }
      });
      dbPool = new PgMySQLAdapter(pgPool);
    } else {
      const isLocal = !process.env.DB_HOST || process.env.DB_HOST === '127.0.0.1' || process.env.DB_HOST === 'localhost';
      if (isLocal) {
        console.log(`Connecting to local MySQL server at ${dbConfig.host}:${dbConfig.port}...`);
        const conn = await mysql.createConnection({
          host: dbConfig.host,
          port: dbConfig.port,
          user: dbConfig.user,
          password: dbConfig.password
        });
        await conn.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\``);
        console.log(`Database '${dbConfig.database}' verified.`);
        await conn.end();
      } else {
        console.log(`Connecting to remote MySQL database '${dbConfig.database}' at ${dbConfig.host}:${dbConfig.port}...`);
      }

      // Create pool with database selected
      dbPool = mysql.createPool({
        ...dbConfig,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      });
    }

    console.log("Initializing database tables...");

    // Venues table
    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS venues (
        id VARCHAR(50) PRIMARY KEY,
        ownerId VARCHAR(50) DEFAULT 'BCP-PL-0000',
        name VARCHAR(100) NOT NULL,
        address TEXT NOT NULL,
        phone VARCHAR(30) NOT NULL,
        caretakerPhone VARCHAR(30) DEFAULT NULL,
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

    // Safe column migration for existing databases
    try {
      await dbPool.query("ALTER TABLE venues ADD COLUMN ownerId VARCHAR(50) DEFAULT 'BCP-PL-0000'");
      console.log("Migration: 'ownerId' column verified in 'venues' table.");
    } catch (err) {
      // Column already exists or table not yet created
    }

    try {
      await dbPool.query("ALTER TABLE venues ADD COLUMN caretakerPhone VARCHAR(30) DEFAULT NULL");
      console.log("Migration: 'caretakerPhone' column verified in 'venues' table.");
    } catch (err) {
      // Already exists
    }

    try {
      await dbPool.query("ALTER TABLE venues MODIFY COLUMN images LONGTEXT");
      console.log("Migration: 'images' column altered to LONGTEXT in 'venues' table.");
    } catch (err) {
      // Already exists
    }

    // Reviews table
    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id VARCHAR(50) PRIMARY KEY,
        venueId VARCHAR(50) NOT NULL,
        user VARCHAR(100) NOT NULL,
        rating INT NOT NULL,
        comment TEXT,
        date VARCHAR(50) DEFAULT 'Today'
      )
    `);

    // Bookings table
    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id VARCHAR(50) PRIMARY KEY,
        venueId VARCHAR(50) NOT NULL,
        venueName VARCHAR(100) NOT NULL,
        date VARCHAR(100) NOT NULL,
        timeSlot VARCHAR(100) NOT NULL,
        duration VARCHAR(30) DEFAULT '1 Hour',
        amountPaid INT NOT NULL,
        status VARCHAR(30) DEFAULT 'CONFIRMED',
        customerName VARCHAR(100) NOT NULL
      )
    `);

    // Teams table
    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS teams (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        captain VARCHAR(100) NOT NULL,
        sport VARCHAR(50) NOT NULL DEFAULT 'Box Cricket',
        creatorId VARCHAR(50) DEFAULT NULL
      )
    `);

    // Safe column migration for creatorId on teams
    try {
      await dbPool.query("ALTER TABLE teams ADD COLUMN creatorId VARCHAR(50) DEFAULT NULL");
      console.log("Migration: 'creatorId' column verified in 'teams' table.");
      // Seed BCP-PL-0000 for existing teams
      await dbPool.query("UPDATE teams SET creatorId = 'BCP-PL-0000' WHERE creatorId IS NULL");
    } catch (err) {
      // Already exists or handled
    }

    // Create team_access table
    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS team_access (
        teamId VARCHAR(50) NOT NULL,
        userId VARCHAR(50) NOT NULL,
        accessType VARCHAR(20) DEFAULT 'viewer',
        PRIMARY KEY (teamId, userId)
      )
    `);

    // Seed team_access for existing teams
    try {
      await dbPool.query(`
        INSERT IGNORE INTO team_access (teamId, userId, accessType)
        SELECT id, IFNULL(creatorId, 'BCP-PL-0000'), 'owner' FROM teams
      `);
    } catch (err) {
      console.error("Error seeding team_access:", err.message);
    }

    // Players table
    await dbPool.query(`
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
        phone VARCHAR(30) DEFAULT NULL
      )
    `);

    // Safe column migration for phone on players
    try {
      await dbPool.query("ALTER TABLE players ADD COLUMN phone VARCHAR(30) DEFAULT NULL");
      console.log("Migration: 'phone' column verified in 'players' table.");
    } catch (err) {
      // Already exists
    }

    // Completed Matches table
    await dbPool.query(`
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

    const matchesMigrations = [
      "ALTER TABLE completed_matches ADD COLUMN sport VARCHAR(50) DEFAULT 'Cricket'",
      "ALTER TABLE completed_matches ADD COLUMN venue VARCHAR(100) DEFAULT 'Local Arena'",
      "ALTER TABLE completed_matches ADD COLUMN team1Id VARCHAR(50) DEFAULT NULL",
      "ALTER TABLE completed_matches ADD COLUMN team2Id VARCHAR(50) DEFAULT NULL",
      "ALTER TABLE completed_matches ADD COLUMN scorerId VARCHAR(50) DEFAULT NULL",
      "ALTER TABLE completed_matches ADD COLUMN scorerName VARCHAR(100) DEFAULT NULL",
      "ALTER TABLE completed_matches ADD COLUMN result VARCHAR(255) DEFAULT NULL",
      "ALTER TABLE completed_matches ADD COLUMN isAbandoned INT DEFAULT 0",
      "ALTER TABLE completed_matches ADD COLUMN matchState LONGTEXT DEFAULT NULL",
      "ALTER TABLE completed_matches ADD COLUMN tossText VARCHAR(255) DEFAULT NULL"
    ];
    for (const q of matchesMigrations) {
      try {
        await dbPool.query(q);
      } catch (err) {
        // column already exists
      }
    }

    // Teams migrations
    const teamsMigrations = [
      "ALTER TABLE teams ADD COLUMN sport VARCHAR(50) DEFAULT 'Box Cricket'"
    ];
    for (const q of teamsMigrations) {
      try {
        await dbPool.query(q);
      } catch (err) {
        // column already exists
      }
    }

    // Users table
    await dbPool.query(`
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
        sports_interests TEXT DEFAULT NULL
      )
    `);

    // Tournaments table
    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS tournaments (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        sport VARCHAR(50) NOT NULL,
        date VARCHAR(50) NOT NULL,
        standings TEXT DEFAULT NULL,
        bracket TEXT DEFAULT NULL
      )
    `);

    // Live matches table
    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS live_matches (
        id VARCHAR(50) PRIMARY KEY,
        sport VARCHAR(50) NOT NULL,
        data LONGTEXT NOT NULL
      )
    `);

    // Loyalty visits table
    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS loyalty_visits (
        playerId VARCHAR(50) NOT NULL,
        venueId VARCHAR(50) NOT NULL,
        visitCount INT NOT NULL DEFAULT 0,
        PRIMARY KEY (playerId, venueId)
      )
    `);

    // Safe column migration for specialty
    try {
      await dbPool.query("ALTER TABLE users ADD COLUMN specialty VARCHAR(50) DEFAULT NULL");
      console.log("Migration: 'specialty' column verified in 'users' table.");
    } catch (err) {
      // Already exists
    }

    // Safe column migration for specialties
    try {
      await dbPool.query("ALTER TABLE users ADD COLUMN specialties TEXT DEFAULT NULL");
      console.log("Migration: 'specialties' column verified in 'users' table.");
    } catch (err) {
      // Already exists
    }

    // Safe column migration for sports_interests
    try {
      await dbPool.query("ALTER TABLE users ADD COLUMN sports_interests TEXT DEFAULT NULL");
      console.log("Migration: 'sports_interests' column verified in 'users' table.");
    } catch (err) {
      // Already exists
    }

    // Safe column migration for paymentStatus
    try {
      await dbPool.query("ALTER TABLE users ADD COLUMN paymentStatus VARCHAR(20) DEFAULT 'unpaid'");
      console.log("Migration: 'paymentStatus' column verified in 'users' table.");
    } catch (err) {
      // Already exists
    }

    // Safe column migration for subscriptionExpiry
    try {
      await dbPool.query("ALTER TABLE users ADD COLUMN subscriptionExpiry VARCHAR(50) DEFAULT NULL");
      console.log("Migration: 'subscriptionExpiry' column verified in 'users' table.");
    } catch (err) {
      // Already exists
    }

    // Safe column migration for lastExpiryReminder
    try {
      await dbPool.query("ALTER TABLE users ADD COLUMN lastExpiryReminder INT DEFAULT 0");
      console.log("Migration: 'lastExpiryReminder' column verified in 'users' table.");
    } catch (err) {
      // Already exists
    }

    // Safe column migration for subscriptionPlan
    try {
      await dbPool.query("ALTER TABLE users ADD COLUMN subscriptionPlan VARCHAR(50) DEFAULT NULL");
      console.log("Migration: 'subscriptionPlan' column verified in 'users' table.");
    } catch (err) {
      // Already exists
    }

    // Safe column migration for sport on venues
    try {
      await dbPool.query("ALTER TABLE venues ADD COLUMN sport VARCHAR(50) DEFAULT 'Box Cricket'");
      console.log("Migration: 'sport' column verified in 'venues' table.");
    } catch (err) {
      // Already exists
    }

    // Safe column migration for sports on venues
    try {
      await dbPool.query("ALTER TABLE venues ADD COLUMN sports TEXT DEFAULT NULL");
      console.log("Migration: 'sports' column verified in 'venues' table.");
    } catch (err) {
      // Already exists
    }

    // Safe column migration for upiQrImage on venues
    try {
      await dbPool.query("ALTER TABLE venues ADD COLUMN upiQrImage LONGTEXT DEFAULT NULL");
      console.log("Migration: 'upiQrImage' column verified in 'venues' table.");
    } catch (err) {
      // Already exists
    }

    // Safe column migration for gamingDetails on venues
    try {
      await dbPool.query("ALTER TABLE venues ADD COLUMN gamingDetails TEXT DEFAULT NULL");
      console.log("Migration: 'gamingDetails' column verified in 'venues' table.");
    } catch (err) {
      // Already exists
    }

    // Convert empty string usernames to NULL to avoid duplicate key issues on UNIQUE constraint
    await dbPool.query("UPDATE users SET username = NULL WHERE username = ''");

    // Seed PlayStation Gaming Hub
    try {
      const [exists] = await dbPool.query("SELECT id FROM venues WHERE id = 'gaming-hub'");
      if (exists.length === 0) {
        await dbPool.query(
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
        console.log("Seeded 'gaming-hub' venue in MySQL database.");
      } else {
        // Ensure gamingDetails is populated for existing gaming-hub
        await dbPool.query(`
          UPDATE venues 
          SET gamingDetails = ? 
          WHERE id = 'gaming-hub' AND (gamingDetails IS NULL OR gamingDetails = '')
        `, [JSON.stringify({
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
      }
    } catch (e) {
      console.warn("Failed to seed 'gaming-hub' venue in MySQL:", e.message);
    }

    // Migrate old broken venue images in MySQL database
    try {
      const oldTurfA = "https://images.unsplash.com/photo-1544698310-74ea9d1c8258?auto=format&fit=crop&q=80&w=800";
      const newTurfA = "https://images.unsplash.com/photo-1589487391730-58f20eb2c308?auto=format&fit=crop&q=80&w=800";
      const oldTurfC = "https://images.unsplash.com/photo-1595111028557-473d9d02dcf9?auto=format&fit=crop&q=80&w=800";
      const oldTurfC2 = "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800";
      const newTurfC = "https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&q=80&w=800";

      const [allVenues] = await dbPool.query("SELECT id, images FROM venues");
      for (const venue of allVenues) {
        if (venue.images) {
          let updated = false;
          let imgs = [];
          try {
            imgs = typeof venue.images === 'string' ? JSON.parse(venue.images) : venue.images;
          } catch (e) {}
          if (Array.isArray(imgs)) {
            const mappedImgs = imgs.map(img => {
              if (img === oldTurfA) { updated = true; return newTurfA; }
              if (img === oldTurfC || img === oldTurfC2) { updated = true; return newTurfC; }
              if (img && img.includes("photo-1544698310-74ea9d1c8258")) { updated = true; return newTurfA; }
              if (img && img.includes("photo-1595111028557-473d9d02dcf9")) { updated = true; return newTurfC; }
              if (img && img.includes("photo-1508098682722-e99c43a406b2")) { updated = true; return newTurfC; }
              return img;
            });
            if (updated) {
              await dbPool.query("UPDATE venues SET images = ? WHERE id = ?", [JSON.stringify(mappedImgs), venue.id]);
              console.log(`✅ [Migration] Updated images for venue: ${venue.id}`);
            }
          }
        }
      }
    } catch (e) {
      console.warn("Failed to migrate old venue images in MySQL:", e.message);
    }

    console.log("✅ MySQL database and tables successfully initialized!");

  } catch (error) {
    console.error("❌ MySQL Database Connection Failed:", error.message);
    console.warn("⚠️ Operating in Local File Fallback Mode. Data will be saved in 'local_db.json'.");
    useLocalFallback = true;
    initLocalDB();
  }
}

// API Routes

// Authentication Middleware
async function authenticateRequest(req, res, next) {
  // Check for API Key in Header or Query
  const apiKey = req.headers['x-api-key'] || req.query.apiKey;
  if (apiKey) {
    let user = null;
    if (useLocalFallback) {
      const db = readLocalDB();
      user = db.users.find(u => u.apiKey === apiKey);
    } else {
      try {
        const [rows] = await dbPool.query('SELECT * FROM users WHERE apiKey = ?', [apiKey]);
        if (rows.length > 0) user = rows[0];
      } catch (e) {
        console.error("API Key db check error:", e.message);
      }
    }
    
    if (user) {
      req.user = {
        playerId: user.playerId,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role
      };
      return next();
    }
  }

  // Check for JWT token in Authorization Header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>
  
  if (!token) {
    return res.status(401).json({ error: 'Access Denied: No Token or API Key provided.' });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Access Denied: Invalid Token.' });
  }
}

// Request Signup Email Verification Code
app.post('/api/auth/request-signup-verification', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email Address is required.' });
  }
  if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)) {
    return res.status(400).json({ error: 'Access Denied: Only valid Google Accounts (@gmail.com) are supported.' });
  }

  // Check duplicates
  let emailDup = false;
  if (useLocalFallback) {
    const db = readLocalDB();
    emailDup = db.users.some(u => u.email === email);
  } else {
    try {
      const [rows] = await dbPool.query('SELECT playerId FROM users WHERE email = ?', [email]);
      emailDup = rows.length > 0;
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }
  if (emailDup) {
    return res.status(409).json({ error: 'This email is already registered.' });
  }

  // Generate 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  signupVerificationCodes.set(email, code);

  // Synchronously write to scratch/last_code.txt to avoid stdout buffering issues
  try {
    const scratchDir = path.join(__dirname, 'scratch');
    if (!fs.existsSync(scratchDir)) {
      fs.mkdirSync(scratchDir);
    }
    fs.writeFileSync(path.join(scratchDir, 'last_code.txt'), `EMAIL: ${email}\nCODE: ${code}\nTIMESTAMP: ${new Date().toISOString()}\n`, 'utf8');
  } catch (err) {
    console.error("Failed to write verification code to file:", err.message);
  }

  console.log(`\n===================================================`);
  console.log(`✉️ SIGNUP VERIFICATION CODE FOR ${email}: ${code}`);
  console.log(`===================================================\n`);

  try {
    await sendVerificationEmail(email, code, 'signup');
    res.json({ success: true, message: 'Verification code sent to your email address.' });
  } catch (err) {
    console.error("Failed to send signup verification email via Brevo:", err.message);
    res.status(500).json({ error: 'Failed to send verification email. Please check server logs.' });
  }
});

// Verify Signup Email Verification Code
app.post('/api/auth/verify-signup-code', (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) {
    return res.status(400).json({ error: 'Email and Verification Code are required.' });
  }
  const expectedCode = signupVerificationCodes.get(email);
  if (!expectedCode || expectedCode !== code.trim()) {
    return res.status(400).json({ error: 'Invalid or expired verification code.' });
  }

  signupVerificationCodes.delete(email);
  verifiedSignupEmails.add(email);
  res.json({ success: true, message: 'Email verified successfully.' });
});

// Authentication API Endpoints

// GET /api/auth/check-phone?phone=xxx  — real-time duplicate phone check
app.get('/api/auth/check-phone', async (req, res) => {
  const { phone } = req.query;
  if (!phone || phone.trim().length < 6) {
    return res.json({ taken: false });
  }
  const normalizedPhone = phone.trim();
  try {
    if (useLocalFallback) {
      const db = readLocalDB();
      const taken = db.users.some(u => u.phone === normalizedPhone);
      return res.json({ taken });
    }
    const [rows] = await dbPool.query('SELECT playerId FROM users WHERE phone = ?', [normalizedPhone]);
    return res.json({ taken: rows.length > 0 });
  } catch (err) {
    return res.json({ taken: false });
  }
});

app.post('/api/auth/signup', async (req, res) => {
  const { email, phone, password, role, sports_interests } = req.body;
  const resolvedRole = role === 'general' ? 'viewer' : (role || 'viewer');
  if (!password || (!email && !phone)) {
    return res.status(400).json({ error: 'Password and Email or Phone are required.' });
  }
  if (email) {
    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)) {
      return res.status(400).json({ error: 'Access Denied: Only valid Google Accounts (@gmail.com) are supported.' });
    }
    if (!verifiedSignupEmails.has(email)) {
      return res.status(400).json({ error: 'Access Denied: Email address has not been verified.' });
    }
  }

  const playerId = 'BCP-PL-' + Math.floor(1000 + Math.random() * 9000);
  const apiKey = 'BCP-KEY-' + crypto.randomBytes(16).toString('hex');
  const hashedPassword = hashPassword(password);
  const defaultUsername = null; // NULL initially to allow multiple signups with UNIQUE constraint

  if (useLocalFallback) {
    const db = readLocalDB();
    
    // Check duplicates
    const emailDup = email && db.users.some(u => u.email === email);
    const phoneDup = phone && db.users.some(u => u.phone === phone);
    if (emailDup) return res.status(409).json({ error: 'Email is already registered.' });
    if (phoneDup) return res.status(409).json({ error: 'Phone number is already registered.' });

    const sportsInterestsStr = sports_interests ? JSON.stringify(sports_interests) : null;
    const newUser = {
      playerId,
      username: defaultUsername,
      email: email || null,
      phone: phone || null,
      password: hashedPassword,
      apiKey,
      role: resolvedRole,
      specialties: null,
      sports_interests: sportsInterestsStr,
      paymentStatus: resolvedRole === 'admin' ? 'unpaid' : 'active',
      subscriptionExpiry: null,
      subscriptionPlan: null
    };
    db.users.push(newUser);
    writeLocalDB(db);
    if (email) {
      verifiedSignupEmails.delete(email);
      sendWelcomeEmail(email, defaultUsername, resolvedRole).catch(e => console.error("Welcome email error:", e.message));
    }

    const token = jwt.sign({ playerId, email, phone, role: newUser.role }, JWT_SECRET, { expiresIn: '2d' });
    return res.status(201).json({
      token,
      user: {
        playerId,
        username: defaultUsername,
        email: email || null,
        phone: phone || null,
        apiKey,
        role: newUser.role,
        specialty: null,
        specialties: {},
        sports_interests: sports_interests || [],
        paymentStatus: newUser.paymentStatus || 'unpaid',
        subscriptionExpiry: newUser.subscriptionExpiry || null,
        subscriptionPlan: newUser.subscriptionPlan || null
      }
    });
  }

  try {
    // Check duplicates in SQL
    if (email) {
      const [rows] = await dbPool.query('SELECT playerId FROM users WHERE email = ?', [email]);
      if (rows.length > 0) return res.status(409).json({ error: 'Email is already registered.' });
    }
    if (phone) {
      const [rows] = await dbPool.query('SELECT playerId FROM users WHERE phone = ?', [phone]);
      if (rows.length > 0) return res.status(409).json({ error: 'Phone number is already registered.' });
    }

    const sportsInterestsStr = sports_interests ? JSON.stringify(sports_interests) : null;
    await dbPool.query(
      'INSERT INTO users (playerId, username, email, phone, password, apiKey, role, specialty, specialties, sports_interests, paymentStatus, subscriptionExpiry) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [playerId, defaultUsername, email || null, phone || null, hashedPassword, apiKey, resolvedRole, null, null, sportsInterestsStr, resolvedRole === 'admin' ? 'unpaid' : 'active', null]
    );
    if (email) {
      verifiedSignupEmails.delete(email);
      sendWelcomeEmail(email, defaultUsername, resolvedRole).catch(e => console.error("Welcome email error:", e.message));
    }

    const token = jwt.sign({ playerId, email, phone, role: resolvedRole }, JWT_SECRET, { expiresIn: '2d' });
    res.status(201).json({
      token,
      user: {
        playerId,
        username: defaultUsername,
        email: email || null,
        phone: phone || null,
        apiKey,
        role: resolvedRole,
        specialty: null,
        specialties: {},
        sports_interests: sports_interests || [],
        paymentStatus: resolvedRole === 'admin' ? 'unpaid' : 'active',
        subscriptionExpiry: null,
        subscriptionPlan: null
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { emailOrPhone, password } = req.body;
  // sports_interests is not needed for login body but returned from DB
  if (!emailOrPhone || !password) {
    return res.status(400).json({ error: 'Identifier and Password are required.' });
  }

  const hashedPassword = hashPassword(password);
  let user = null;

  if (useLocalFallback) {
    const db = readLocalDB();
    user = db.users.find(u => 
      (u.email === emailOrPhone || u.phone === emailOrPhone) && 
      u.password === hashedPassword
    );
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid Email/Phone or Password.' });
    }

    const token = jwt.sign({ playerId: user.playerId, email: user.email, phone: user.phone, role: user.role }, JWT_SECRET, { expiresIn: '2d' });
    let parsedSportsInterests = [];
    try { parsedSportsInterests = user.sports_interests ? JSON.parse(user.sports_interests) : []; } catch(e) {}
    let parsedSpecialties = {};
    try { parsedSpecialties = user.specialties ? JSON.parse(user.specialties) : {}; } catch(e) {}
    return res.json({
      token,
      user: {
        playerId: user.playerId,
        username: user.username,
        email: user.email,
        phone: user.phone,
        apiKey: user.apiKey,
        role: user.role,
        specialty: user.specialty || null,
        specialties: parsedSpecialties,
        sports_interests: parsedSportsInterests,
        paymentStatus: user.paymentStatus || 'unpaid',
        subscriptionExpiry: user.subscriptionExpiry || null
      }
    });
  }

  try {
    const [rows] = await dbPool.query(
      'SELECT * FROM users WHERE (email = ? OR phone = ?) AND password = ?',
      [emailOrPhone, emailOrPhone, hashedPassword]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid Email/Phone or Password.' });
    }

    user = rows[0];
    const token = jwt.sign({ playerId: user.playerId, email: user.email, phone: user.phone, role: user.role }, JWT_SECRET, { expiresIn: '2d' });
    let parsedSportsInterestsSQL = [];
    try { parsedSportsInterestsSQL = user.sports_interests ? JSON.parse(user.sports_interests) : []; } catch(e) {}
    let parsedSpecialtiesSQL = {};
    try { parsedSpecialtiesSQL = user.specialties ? JSON.parse(user.specialties) : {}; } catch(e) {}
    res.json({
      token,
      user: {
        playerId: user.playerId,
        username: user.username,
        email: user.email,
        phone: user.phone,
        apiKey: user.apiKey,
        role: user.role,
        specialty: user.specialty || null,
        specialties: parsedSpecialtiesSQL,
        sports_interests: parsedSportsInterestsSQL,
        paymentStatus: user.paymentStatus || 'unpaid',
        subscriptionExpiry: user.subscriptionExpiry || null,
        subscriptionPlan: user.subscriptionPlan || null
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/google', async (req, res) => {
  const { token, role } = req.body;
  const resolvedRole = role === 'general' ? 'viewer' : (role || 'viewer');
  if (!token) {
    return res.status(400).json({ error: 'Google ID Token is required.' });
  }

  try {
    const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(token)}`);
    if (!response.ok) {
      return res.status(401).json({ error: 'Invalid Google ID Token.' });
    }

    const payload = await response.json();
    const email = payload.email;
    if (!email) {
      return res.status(400).json({ error: 'Google Account email not found in token.' });
    }

    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)) {
      return res.status(400).json({ error: 'Access Denied: Only valid Google Accounts (@gmail.com) are supported.' });
    }

    const name = payload.name || email.split('@')[0];
    let user = null;

    if (useLocalFallback) {
      const db = readLocalDB();
      user = db.users.find(u => u.email === email);

      if (!user) {
        const playerId = 'BCP-PL-' + Math.floor(100000 + Math.random() * 900000);
        const apiKey = 'bcp_live_api_' + crypto.randomBytes(16).toString('hex');
        user = {
          playerId,
          username: name,
          email,
          phone: null,
          password: hashPassword('google-signed-in-' + Math.random()),
          apiKey,
          role: resolvedRole,
          specialty: '',
          specialties: '{}',
          sports_interests: '[]',
          paymentStatus: resolvedRole === 'admin' ? 'unpaid' : 'active',
          subscriptionExpiry: null
        };
        db.users.push(user);
        writeLocalDB(db);
        sendWelcomeEmail(email, name, resolvedRole).catch(e => console.error("Welcome email error:", e.message));
      }
    } else {
      const [rows] = await dbPool.query('SELECT * FROM users WHERE email = ?', [email]);
      if (rows.length > 0) {
        user = rows[0];
      } else {
        const playerId = 'BCP-PL-' + Math.floor(100000 + Math.random() * 900000);
        const apiKey = 'bcp_live_api_' + crypto.randomBytes(16).toString('hex');
        const randomPassword = hashPassword('google-signed-in-' + Math.random());
        await dbPool.query(
          'INSERT INTO users (playerId, username, email, phone, password, apiKey, role, specialty, specialties, sports_interests, paymentStatus, subscriptionExpiry) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [playerId, name, email, null, randomPassword, apiKey, resolvedRole, '', '{}', '[]', resolvedRole === 'admin' ? 'unpaid' : 'active', null]
        );
        const [newRows] = await dbPool.query('SELECT * FROM users WHERE email = ?', [email]);
        user = newRows[0];
        sendWelcomeEmail(email, name, resolvedRole).catch(e => console.error("Welcome email error:", e.message));
      }
    }

    const appToken = jwt.sign({ playerId: user.playerId, email: user.email, phone: user.phone, role: user.role }, JWT_SECRET, { expiresIn: '2d' });
    let parsedSportsInterests = [];
    try { parsedSportsInterests = user.sports_interests ? (typeof user.sports_interests === 'string' ? JSON.parse(user.sports_interests) : user.sports_interests) : []; } catch(e) {}
    let parsedSpecialties = {};
    try { parsedSpecialties = user.specialties ? (typeof user.specialties === 'string' ? JSON.parse(user.specialties) : user.specialties) : {}; } catch(e) {}

    res.json({
      token: appToken,
      user: {
        playerId: user.playerId,
        username: user.username,
        email: user.email,
        phone: user.phone,
        apiKey: user.apiKey,
        role: user.role,
        specialty: user.specialty || null,
        specialties: parsedSpecialties,
        sports_interests: parsedSportsInterests,
        paymentStatus: user.paymentStatus || (user.role === 'admin' ? 'unpaid' : 'active'),
        subscriptionExpiry: user.subscriptionExpiry || null,
        subscriptionPlan: user.subscriptionPlan || null
      }
    });
  } catch (error) {
    console.error("Google login verification error:", error);
    res.status(500).json({ error: 'Failed to authenticate with Google.' });
  }
});

app.post('/api/auth/direct-google', async (req, res) => {
  const { email, role } = req.body;
  const resolvedRole = role === 'general' ? 'viewer' : (role || 'viewer');
  if (!email) {
    return res.status(400).json({ error: 'Google Email is required.' });
  }

  if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)) {
    return res.status(400).json({ error: 'Access Denied: Only valid Google Accounts (@gmail.com) are supported.' });
  }

  try {
    const name = email.split('@')[0];
    let user = null;

    if (useLocalFallback) {
      const db = readLocalDB();
      user = db.users.find(u => u.email === email);

      if (!user) {
        const playerId = 'BCP-PL-' + Math.floor(100000 + Math.random() * 900000);
        const apiKey = 'bcp_live_api_' + crypto.randomBytes(16).toString('hex');
        user = {
          playerId,
          username: name,
          email,
          phone: null,
          password: hashPassword('google-direct-signed-in-' + Math.random()),
          apiKey,
          role: resolvedRole,
          specialty: '',
          specialties: '{}',
          sports_interests: '[]',
          paymentStatus: resolvedRole === 'admin' ? 'unpaid' : 'active',
          subscriptionExpiry: null
        };
        db.users.push(user);
        writeLocalDB(db);
        sendWelcomeEmail(email, name, resolvedRole).catch(e => console.error("Welcome email error:", e.message));
      }
    } else {
      const [rows] = await dbPool.query('SELECT * FROM users WHERE email = ?', [email]);
      if (rows.length > 0) {
        user = rows[0];
      } else {
        const playerId = 'BCP-PL-' + Math.floor(100000 + Math.random() * 900000);
        const apiKey = 'bcp_live_api_' + crypto.randomBytes(16).toString('hex');
        const randomPassword = hashPassword('google-direct-signed-in-' + Math.random());
        await dbPool.query(
          'INSERT INTO users (playerId, username, email, phone, password, apiKey, role, specialty, specialties, sports_interests, paymentStatus, subscriptionExpiry) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [playerId, name, email, null, randomPassword, apiKey, resolvedRole, '', '{}', '[]', resolvedRole === 'admin' ? 'unpaid' : 'active', null]
        );
        const [newRows] = await dbPool.query('SELECT * FROM users WHERE email = ?', [email]);
        user = newRows[0];
        sendWelcomeEmail(email, name, resolvedRole).catch(e => console.error("Welcome email error:", e.message));
      }
    }

    const appToken = jwt.sign({ playerId: user.playerId, email: user.email, phone: user.phone, role: user.role }, JWT_SECRET, { expiresIn: '2d' });
    let parsedSportsInterests = [];
    try { parsedSportsInterests = user.sports_interests ? (typeof user.sports_interests === 'string' ? JSON.parse(user.sports_interests) : user.sports_interests) : []; } catch(e) {}
    let parsedSpecialties = {};
    try { parsedSpecialties = user.specialties ? (typeof user.specialties === 'string' ? JSON.parse(user.specialties) : user.specialties) : {}; } catch(e) {}

    res.json({
      token: appToken,
      user: {
        playerId: user.playerId,
        username: user.username,
        email: user.email,
        phone: user.phone,
        apiKey: user.apiKey,
        role: user.role,
        specialty: user.specialty || null,
        specialties: parsedSpecialties,
        sports_interests: parsedSportsInterests,
        paymentStatus: user.paymentStatus || (user.role === 'admin' ? 'unpaid' : 'active'),
        subscriptionExpiry: user.subscriptionExpiry || null,
        subscriptionPlan: user.subscriptionPlan || null
      }
    });
  } catch (error) {
    console.error("Google direct login error:", error);
    res.status(500).json({ error: 'Failed to authenticate directly with Google email.' });
  }
});

app.post('/api/auth/subscribe', authenticateRequest, async (req, res) => {
  const playerId = req.user.playerId;
  const plan = req.body.plan || 'monthly';
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  console.log(`💳 [Subscription Endpoint] Received subscription request for player: ${playerId}, plan: ${plan}`);

  if (razorpay_payment_id) {
    console.log(`💳 [Subscription Endpoint] Verifying Razorpay payment: ${razorpay_payment_id}`);
    if (!razorpay_order_id || !razorpay_signature) {
      console.warn("💳 [Subscription Endpoint] Missing payment verification fields");
      return res.status(400).json({ error: 'Missing payment verification fields' });
    }
    try {
      const body = razorpay_order_id + '|' + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac('sha256', '35HVf4YzPFr5bmIXIRnDAMoc')
        .update(body)
        .digest('hex');
      if (expectedSignature !== razorpay_signature) {
        console.warn("💳 [Subscription Endpoint] Signature verification failed");
        return res.status(400).json({ error: 'Payment signature verification failed' });
      }
      console.log("💳 [Subscription Endpoint] Razorpay signature verified successfully!");
    } catch (err) {
      console.error("💳 [Subscription Endpoint] Signature verification exception:", err.message);
      return res.status(500).json({ error: 'Signature verification failed: ' + err.message });
    }
  } else {
    console.log("💳 [Subscription Endpoint] Manual payment flow (simulated/no Razorpay credentials provided)");
  }
  
  let days = 30;
  if (plan === 'quarterly') days = 90;
  else if (plan === 'yearly') days = 365;

  let currentExpiry = null;

  if (useLocalFallback) {
    const db = readLocalDB();
    const user = db.users.find(u => u.playerId === playerId);
    if (!user) {
      console.warn(`💳 [Subscription Endpoint] User ${playerId} not found in local DB`);
      return res.status(404).json({ error: 'User not found' });
    }
    currentExpiry = user.subscriptionExpiry;
  } else {
    try {
      const [rows] = await dbPool.query('SELECT subscriptionExpiry FROM users WHERE playerId = ?', [playerId]);
      if (rows.length === 0) {
        console.warn(`💳 [Subscription Endpoint] User ${playerId} not found in MySQL`);
        return res.status(404).json({ error: 'User not found' });
      }
      currentExpiry = rows[0].subscriptionExpiry;
    } catch (error) {
      console.error("💳 [Subscription Endpoint] MySQL select error:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  let startDate = new Date();
  if (currentExpiry) {
    const existingExpiryDate = new Date(currentExpiry);
    if (!isNaN(existingExpiryDate.getTime()) && existingExpiryDate > startDate) {
      startDate = existingExpiryDate;
    }
  }

  const expiryDate = new Date(startDate);
  expiryDate.setDate(expiryDate.getDate() + days);
  const expiryStr = expiryDate.toISOString();

  let planName = 'monthly';
  if (plan === 'quarterly') planName = '3 months';
  else if (plan === 'yearly') planName = '12 months';

  if (useLocalFallback) {
    const db = readLocalDB();
    const idx = db.users.findIndex(u => u.playerId === playerId);
    if (idx !== -1) {
      db.users[idx].paymentStatus = 'active';
      db.users[idx].subscriptionExpiry = expiryStr;
      db.users[idx].subscriptionPlan = planName;
      db.users[idx].role = 'admin';
      writeLocalDB(db);
      console.log(`💳 [Subscription Endpoint] Local DB: Subscription activated/extended for ${playerId} to ${expiryStr} (${planName})`);
      return res.json({ success: true, paymentStatus: 'active', subscriptionExpiry: expiryStr, subscriptionPlan: planName, role: 'admin' });
    }
    console.warn(`💳 [Subscription Endpoint] User ${playerId} not found in local DB on update`);
    return res.status(404).json({ error: 'User not found' });
  }

  try {
    await dbPool.query(
      "UPDATE users SET paymentStatus = 'active', subscriptionExpiry = ?, subscriptionPlan = ?, role = 'admin' WHERE playerId = ?",
      [expiryStr, planName, playerId]
    );
    console.log(`💳 [Subscription Endpoint] MySQL DB: Subscription activated/extended for ${playerId} to ${expiryStr} (${planName})`);
    res.json({ success: true, paymentStatus: 'active', subscriptionExpiry: expiryStr, subscriptionPlan: planName, role: 'admin' });
  } catch (error) {
    console.error("💳 [Subscription Endpoint] MySQL update error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Fetch verified senders dynamically from Brevo
async function getVerifiedBrevoSender() {
  try {
    const response = await fetch('https://api.brevo.com/v3/senders', {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY
      }
    });
    if (response.ok) {
      const data = await response.json();
      if (data.senders && data.senders.length > 0) {
        const activeSender = data.senders.find(s => s.active);
        if (activeSender) {
          console.log(`Using verified Brevo sender: ${activeSender.name} <${activeSender.email}>`);
          return {
            name: activeSender.name,
            email: activeSender.email
          };
        }
      }
    } else {
      const errText = await response.text();
      console.warn("Brevo Senders API error:", response.status, errText);
    }
  } catch (e) {
    console.error("Failed to fetch verified Brevo senders:", e.message);
  }
  return {
    name: 'SportSpot',
    email: 'no-reply@sportspot.com'
  };
}

// Brevo Transactional Email sender helper
async function sendVerificationEmail(email, code, type = 'reset') {
  const url = 'https://api.brevo.com/v3/smtp/email';
  const senderObj = await getVerifiedBrevoSender();
  const isSignup = type === 'signup';
  const subject = isSignup ? 'SportSpot Sign Up Verification' : 'SportSpot Password Reset';
  const messageText = isSignup
    ? 'We received a request to sign up for a SportSpot account with this email address. Please use the following 6-digit verification code to complete your registration:'
    : 'We received a request to reset the password for your SportSpot account. Please use the following 6-digit verification code to complete the request:';

  const data = {
    sender: senderObj,
    to: [
      {
        email: email,
        name: 'SportSpot User'
      }
    ],
    subject: subject,
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
        <h2 style="color: #4285F4; text-align: center;">SportSpot Account Security</h2>
        <p>Hello,</p>
        <p>${messageText}</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="font-size: 2.2rem; font-weight: bold; letter-spacing: 6px; color: #34A853; padding: 10px 20px; border: 2px dashed #34A853; border-radius: 4px; background-color: #f1f8e9;">${code}</span>
        </div>
        <p>This code is valid for 15 minutes. If you did not request this, please ignore this email.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 0.8rem; color: #777; text-align: center;">This is an automated security notification from SportSpot. Please do not reply directly to this email.</p>
      </div>
    `
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Brevo API returned error status ${response.status}:`, errorText);
      throw new Error(`Failed to send email via Brevo: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('Verification email successfully sent via Brevo:', result);
    return result;
  } catch (error) {
    console.error('Error sending verification email via Brevo:', error.message);
    throw error;
  }
}

// Brevo General Transactional Email helper
async function sendGeneralEmail({ toEmail, toName, subject, htmlContent }) {
  const url = 'https://api.brevo.com/v3/smtp/email';
  const senderObj = await getVerifiedBrevoSender();

  const data = {
    sender: senderObj,
    to: [
      {
        email: toEmail,
        name: toName || 'SportSpot User'
      }
    ],
    subject: subject,
    htmlContent: htmlContent
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Brevo API returned error status ${response.status}:`, errorText);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error sending email via Brevo:', error.message);
    return false;
  }
}

async function sendWelcomeEmail(email, username, role) {
  const subject = 'Welcome to SportSpot! 🏟️';
  let roleText = 'Player';
  if (role === 'admin') roleText = 'Venue Partner';
  else if (role === 'scorer') roleText = 'Scorer';

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
      <h2 style="color: #4285F4; text-align: center;">Welcome to SportSpot, ${username}!</h2>
      <p>Thank you for signing up on SportSpot as a <strong>${roleText}</strong>. We are thrilled to have you join our community!</p>
      <p>Here is what you can do next:</p>
      <ul>
        ${role === 'admin' 
          ? `<li>Register your sports arena profile (cricket, football, badminton, etc.)</li>
             <li>Choose a subscription plan to list your venue and enable booking slots</li>
             <li>Manage booking calendars and check real-time stats</li>`
          : role === 'scorer'
          ? `<li>Select matches to score in real-time</li>
             <li>Update scores, runs, wickets, and overs with high-fidelity panel</li>`
          : `<li>Explore local sports venues and check slot availability</li>
             <li>Book slots online and receive instant confirmations</li>
             <li>Join local tournaments and track match stats</li>`
        }
      </ul>
      <p>If you have any questions or need support, feel free to reach out to our team.</p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="font-size: 0.8rem; color: #777; text-align: center;">This is an automated welcome notification from SportSpot. Please do not reply directly to this email.</p>
    </div>
  `;

  await sendWelcomeEmailAsync(email, username, subject, htmlContent);
}

// Wrap async sending safely to prevent signup blocking
async function sendWelcomeEmailAsync(email, username, subject, htmlContent) {
  try {
    await sendGeneralEmail({ toEmail: email, toName: username, subject, htmlContent });
  } catch (err) {
    console.error("Welcome email background send error:", err.message);
  }
}

async function sendSubscriptionExpiryEmail(email, username, daysRemaining) {
  const subject = `SportSpot Premium - Action Required: Your Subscription Expires in ${daysRemaining} Day${daysRemaining > 1 ? 's' : ''}`;
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
      <h2 style="color: #D97706; text-align: center;">⚠️ Subscription Expiration Alert</h2>
      <p>Hello <strong>${username}</strong>,</p>
      <p>This is a reminder that your SportSpot Premium subscription will expire in <strong>${daysRemaining} day${daysRemaining > 1 ? 's' : ''}</strong>.</p>
      <p>Once your subscription expires, your registered sports arenas and venues will be hidden from players, and they will not be able to find your slots or book them.</p>
      <p>Please log in to the SportSpot app and renew your subscription as soon as possible to keep your listings visible and active.</p>
      <div style="text-align: center; margin: 25px 0;">
        <span style="font-size: 1.1rem; font-weight: bold; background-color: #FEF3C7; border: 1px solid #F59E0B; color: #D97706; padding: 8px 16px; border-radius: 4px;">
          Plan Expires in ${daysRemaining} Day${daysRemaining > 1 ? 's' : ''}
        </span>
      </div>
      <p>Thank you for choosing SportSpot to host your venue!</p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="font-size: 0.8rem; color: #777; text-align: center;">This is an automated subscription alert from SportSpot. Please do not reply directly to this email.</p>
    </div>
  `;

  await sendGeneralEmail({ toEmail: email, toName: username, subject, htmlContent });
}

async function sendSubscriptionExpiredEmail(email, username) {
  const subject = 'SportSpot Premium - Subscription Expired ⚠️';
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
      <h2 style="color: #EA4335; text-align: center;">Subscription Expired</h2>
      <p>Hello <strong>${username}</strong>,</p>
      <p>Your SportSpot Premium subscription has expired. As a result, your registered sports venues and arenas have been hidden from player discovery listings.</p>
      <p>To make your venues visible to players and start accepting slot bookings again, please open the SportSpot dashboard and activate a premium subscription plan (Monthly, Quarterly, or Yearly).</p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="font-size: 0.8rem; color: #777; text-align: center;">This is an automated notification from SportSpot. Please do not reply directly to this email.</p>
    </div>
  `;

  await sendGeneralEmail({ toEmail: email, toName: username, subject, htmlContent });
}

async function sendBookingConfirmationEmails(booking, customerEmail, ownerEmail, ownerName) {
  // Email to customer
  const customerHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
      <h2 style="color: #4285F4; text-align: center;">Booking Confirmed! 🎉</h2>
      <p>Hello <strong>${booking.customerName}</strong>,</p>
      <p>Your booking at <strong>${booking.venueName}</strong> has been successfully confirmed. Yes, your booking is confirmed!</p>
      <div style="background-color: #ffffff; padding: 15px; border-radius: 6px; border: 1px solid #eee; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #333;">Booking Details:</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 6px 0; color: #666; width: 120px;">Booking ID:</td>
            <td style="padding: 6px 0; font-weight: bold;">${booking.id}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #666;">Date:</td>
            <td style="padding: 6px 0; font-weight: bold;">${booking.date}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #666;">Time Slot:</td>
            <td style="padding: 6px 0; font-weight: bold; color: #34A853;">${booking.timeSlot}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #666;">Duration:</td>
            <td style="padding: 6px 0; font-weight: bold;">${booking.duration}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #666;">Advance Paid:</td>
            <td style="padding: 6px 0; font-weight: bold; color: #4285F4;">₹${booking.amountPaid}</td>
          </tr>
        </table>
      </div>
      <p>Show this email or booking ID at the venue counter upon arrival.</p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="font-size: 0.8rem; color: #777; text-align: center;">This is an automated confirmation from SportSpot. Please do not reply directly to this email.</p>
    </div>
  `;

  // Email to Owner
  const ownerHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
      <h2 style="color: #34A853; text-align: center;">New Booking Received! ⚡</h2>
      <p>Hello <strong>${ownerName}</strong>,</p>
      <p>You have received a new booking at your venue: <strong>${booking.venueName}</strong>.</p>
      <div style="background-color: #ffffff; padding: 15px; border-radius: 6px; border: 1px solid #eee; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #333;">Booking Details:</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 6px 0; color: #666; width: 120px;">Customer Name:</td>
            <td style="padding: 6px 0; font-weight: bold;">${booking.customerName}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #666; width: 120px;">Booking ID:</td>
            <td style="padding: 6px 0; font-weight: bold;">${booking.id}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #666;">Date:</td>
            <td style="padding: 6px 0; font-weight: bold;">${booking.date}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #666;">Time Slot:</td>
            <td style="padding: 6px 0; font-weight: bold; color: #34A853;">${booking.timeSlot}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #666;">Duration:</td>
            <td style="padding: 6px 0; font-weight: bold;">${booking.duration}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #666;">Advance Paid:</td>
            <td style="padding: 6px 0; font-weight: bold; color: #4285F4;">₹${booking.amountPaid}</td>
          </tr>
        </table>
      </div>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="font-size: 0.8rem; color: #777; text-align: center;">This is an automated notification from SportSpot. Please do not reply directly to this email.</p>
    </div>
  `;

  if (customerEmail) {
    await sendGeneralEmail({ toEmail: customerEmail, toName: booking.customerName, subject: `Booking Confirmed! 🏟️ - ${booking.venueName}`, htmlContent: customerHtml });
  }
  if (ownerEmail) {
    await sendGeneralEmail({ toEmail: ownerEmail, toName: ownerName, subject: `New Arena Booking Received! ⚡ - ${booking.venueName}`, htmlContent: ownerHtml });
  }
}

async function sendBookingCancellationEmails(booking, customerEmail, ownerEmail, ownerName) {
  // Email to customer
  const customerHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
      <h2 style="color: #EA4335; text-align: center;">Booking Cancelled & Refund Initiated</h2>
      <p>Hello <strong>${booking.customerName}</strong>,</p>
      <p>Your booking at <strong>${booking.venueName}</strong> for <strong>${booking.date} (${booking.timeSlot})</strong> has been cancelled.</p>
      <p><strong>Refund Details:</strong> A refund of <strong>₹${booking.amountPaid}</strong> has been initiated and will be credited to your account/source payment method within 3 to 5 business days.</p>
      <div style="background-color: #ffffff; padding: 15px; border-radius: 6px; border: 1px solid #eee; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #333;">Cancelled Booking Details:</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 6px 0; color: #666; width: 120px;">Booking ID:</td>
            <td style="padding: 6px 0; font-weight: bold;">${booking.id}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #666;">Date:</td>
            <td style="padding: 6px 0; font-weight: bold;">${booking.date}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #666;">Time Slot:</td>
            <td style="padding: 6px 0; font-weight: bold; color: #EA4335;">${booking.timeSlot}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #666;">Amount to Refund:</td>
            <td style="padding: 6px 0; font-weight: bold; color: #EA4335;">₹${booking.amountPaid}</td>
          </tr>
        </table>
      </div>
      <p>If you have any questions regarding your refund, please feel free to reach out to us.</p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="font-size: 0.8rem; color: #777; text-align: center;">This is an automated notification from SportSpot. Please do not reply directly to this email.</p>
    </div>
  `;

  // Email to Owner
  const ownerHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
      <h2 style="color: #EA4335; text-align: center;">Booking Cancelled ⚠️</h2>
      <p>Hello <strong>${ownerName}</strong>,</p>
      <p>A booking at your venue: <strong>${booking.venueName}</strong> has been cancelled by the customer or admin.</p>
      <div style="background-color: #ffffff; padding: 15px; border-radius: 6px; border: 1px solid #eee; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #333;">Cancelled Booking Details:</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 6px 0; color: #666; width: 120px;">Customer Name:</td>
            <td style="padding: 6px 0; font-weight: bold;">${booking.customerName}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #666; width: 120px;">Booking ID:</td>
            <td style="padding: 6px 0; font-weight: bold;">${booking.id}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #666;">Date:</td>
            <td style="padding: 6px 0; font-weight: bold;">${booking.date}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #666;">Time Slot:</td>
            <td style="padding: 6px 0; font-weight: bold;">${booking.timeSlot}</td>
          </tr>
        </table>
      </div>
      <p>The slots have been freed up and are now available for booking again.</p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="font-size: 0.8rem; color: #777; text-align: center;">This is an automated notification from SportSpot. Please do not reply directly to this email.</p>
    </div>
  `;

  if (customerEmail) {
    await sendGeneralEmail({ toEmail: customerEmail, toName: booking.customerName, subject: `Booking Cancelled - Refund Initiated: ${booking.venueName}`, htmlContent: customerHtml });
  }
  if (ownerEmail) {
    await sendGeneralEmail({ toEmail: ownerEmail, toName: ownerName, subject: `Booking Cancelled: ${booking.venueName}`, htmlContent: ownerHtml });
  }
}

async function checkSubscriptionExpirations() {
  console.log("⏰ [Subscription Checker] Running expiration checks...");
  let usersToUpdate = [];
  const now = new Date();

  if (useLocalFallback) {
    const db = readLocalDB();
    
    db.users.forEach(user => {
      if (user.role === 'admin' && user.paymentStatus === 'active' && user.subscriptionExpiry) {
        const expiry = new Date(user.subscriptionExpiry);
        const diffTime = expiry - now;
        const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (daysRemaining <= 0) {
          console.log(`❌ [Subscription Checker] Subscription expired for ${user.username} (${user.email})`);
          user.paymentStatus = 'unpaid';
          user.lastExpiryReminder = 0;
          user.subscriptionPlan = null;
          usersToUpdate.push(user);
          if (user.email) {
            sendSubscriptionExpiredEmail(user.email, user.username).catch(err => console.error("Error expired email:", err.message));
          }
        } else if ([5, 3, 1].includes(daysRemaining)) {
          if (user.lastExpiryReminder !== daysRemaining) {
            console.log(`✉️ [Subscription Checker] Expiry reminder warning (${daysRemaining} days) for ${user.username} (${user.email})`);
            if (user.email) {
              sendSubscriptionExpiryEmail(user.email, user.username, daysRemaining).catch(err => console.error("Error reminder email:", err.message));
            }
            user.lastExpiryReminder = daysRemaining;
            usersToUpdate.push(user);
          }
        }
      }
    });

    if (usersToUpdate.length > 0) {
      writeLocalDB(db);
    }
  } else {
    try {
      const [users] = await dbPool.query(
        "SELECT playerId, email, username, subscriptionExpiry, lastExpiryReminder FROM users WHERE role = 'admin' AND paymentStatus = 'active' AND subscriptionExpiry IS NOT NULL"
      );

      for (const user of users) {
        const expiry = new Date(user.subscriptionExpiry);
        const diffTime = expiry - now;
        const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (daysRemaining <= 0) {
          console.log(`❌ [Subscription Checker] SQL: Subscription expired for ${user.username} (${user.email})`);
          await dbPool.query(
            "UPDATE users SET paymentStatus = 'unpaid', lastExpiryReminder = 0, subscriptionPlan = NULL WHERE playerId = ?",
            [user.playerId]
          );
          if (user.email) {
            sendSubscriptionExpiredEmail(user.email, user.username).catch(err => console.error("Error expired email:", err.message));
          }
        } else if ([5, 3, 1].includes(daysRemaining)) {
          if (user.lastExpiryReminder !== daysRemaining) {
            console.log(`✉️ [Subscription Checker] SQL: Expiry reminder warning (${daysRemaining} days) for ${user.username} (${user.email})`);
            if (user.email) {
              sendSubscriptionExpiryEmail(user.email, user.username, daysRemaining).catch(err => console.error("Error reminder email:", err.message));
            }
            await dbPool.query(
              "UPDATE users SET lastExpiryReminder = ? WHERE playerId = ?",
              [daysRemaining, user.playerId]
            );
          }
        }
      }
    } catch (err) {
      console.error("Error in checkSubscriptionExpirations SQL:", err.message);
    }
  }
}

// Forgot Password - Initiate (Verify email exists and generate code)
app.post('/api/auth/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email Address is required.' });
  }
  if (email && !/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)) {
    return res.status(400).json({ error: 'Access Denied: Only valid Google Accounts (@gmail.com) are supported.' });
  }

  let userExists = false;
  if (useLocalFallback) {
    const db = readLocalDB();
    userExists = db.users.some(u => u.email === email);
  } else {
    try {
      const [rows] = await dbPool.query('SELECT playerId FROM users WHERE email = ?', [email]);
      userExists = rows.length > 0;
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  if (!userExists) {
    return res.status(404).json({ error: 'This email address is not registered.' });
  }

  // Generate 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  resetCodes.set(email, code);

  // Print to server console for testing/debugging
  console.log(`\n===================================================`);
  console.log(`✉️ RESET CODE FOR ${email}: ${code}`);
  console.log(`===================================================\n`);

  try {
    await sendVerificationEmail(email, code);
    res.json({ success: true, message: 'Verification code sent to your email address.' });
  } catch (err) {
    console.error("Failed to send email via Brevo:", err.message);
    // Fall back to returning the success but mentioning in logs
    res.status(500).json({ error: 'Failed to send verification email. Please check server logs.' });
  }
});

// Verify Reset Code
app.post('/api/auth/verify-reset-code', (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) {
    return res.status(400).json({ error: 'Email and Verification Code are required.' });
  }
  const expectedCode = resetCodes.get(email);
  if (!expectedCode || expectedCode !== code.trim()) {
    return res.status(400).json({ error: 'Invalid or expired verification code.' });
  }
  res.json({ success: true, message: 'Verification code is correct.' });
});

// Reset Password - Verify code and save new password
app.post('/api/auth/reset-password', async (req, res) => {
  const { email, code, newPassword } = req.body;
  if (!email || !code || !newPassword) {
    return res.status(400).json({ error: 'Email, Verification Code, and New Password are required.' });
  }

  const expectedCode = resetCodes.get(email);
  if (!expectedCode || expectedCode !== code.trim()) {
    return res.status(400).json({ error: 'Invalid or expired verification code.' });
  }

  const hashedPassword = hashPassword(newPassword);

  if (useLocalFallback) {
    const db = readLocalDB();
    const idx = db.users.findIndex(u => u.email === email);
    if (idx !== -1) {
      db.users[idx].password = hashedPassword;
      writeLocalDB(db);
    } else {
      return res.status(404).json({ error: 'User not found.' });
    }
  } else {
    try {
      const [result] = await dbPool.query('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'User not found.' });
      }
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  // Remove code from memory after successful reset
  resetCodes.delete(email);

  res.json({ success: true, message: 'Password has been reset successfully.' });
});

// Check Username Availability
app.get('/api/users/check-username', async (req, res) => {
  const { username, playerId } = req.query;
  if (!username) {
    return res.status(400).json({ error: 'Username is required.' });
  }

  const lowerUsername = username.trim().toLowerCase();

  if (useLocalFallback) {
    const db = readLocalDB();
    const isTaken = db.users.some(u => 
      u.username && 
      u.username.toLowerCase() === lowerUsername && 
      u.playerId !== playerId
    );
    return res.json({ unique: !isTaken });
  }

  try {
    let queryStr = 'SELECT COUNT(*) AS count FROM users WHERE LOWER(username) = ?';
    let queryParams = [lowerUsername];
    
    if (playerId) {
      queryStr += ' AND playerId != ?';
      queryParams.push(playerId);
    }

    const [rows] = await dbPool.query(queryStr, queryParams);
    const count = parseInt(rows[0].count, 10);
    res.json({ unique: count === 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch list of registered player users (Protected)
app.get('/api/users', authenticateRequest, async (req, res) => {
  if (useLocalFallback) {
    const db = readLocalDB();
    const playersList = db.users
      .filter(u => u.role === 'viewer')
      .map(u => ({ 
        playerId: u.playerId, 
        username: u.username, 
        email: u.email, 
        phone: u.phone,
        role: u.role,
        specialty: u.specialty,
        specialties: u.specialties,
        sports_interests: u.sports_interests
      }));
    return res.json(playersList);
  }

  try {
    const [rows] = await dbPool.query("SELECT playerId, username, email, phone, role, specialty, specialties, sports_interests FROM users WHERE role = 'viewer'");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update/Upsert User Profile (Protected)
app.post('/api/users', authenticateRequest, async (req, res) => {
  const { playerId, username, email, phone, role, specialty, specialties, sports_interests } = req.body;
  
  if (req.user.playerId !== playerId) {
    return res.status(403).json({ error: 'Forbidden: You cannot modify other players profiles.' });
  }

  const trimmedUsername = username ? username.trim() : '';

  if (useLocalFallback) {
    const db = readLocalDB();
    
    if (trimmedUsername) {
      const taken = db.users.some(u => 
        u.username && 
        u.username.toLowerCase() === trimmedUsername.toLowerCase() && 
        u.playerId !== playerId
      );
      if (taken) {
        return res.status(409).json({ error: 'Username already taken.' });
      }
    }

    if (phone) {
      const phoneTaken = db.users.some(u => 
        u.phone && 
        u.phone.trim() === phone.trim() && 
        u.playerId !== playerId
      );
      if (phoneTaken) {
        return res.status(409).json({ error: 'Phone number already registered by another user.' });
      }
    }

    const idx = db.users.findIndex(u => u.playerId === playerId);
    const sportsInterestsStr = sports_interests !== undefined ? JSON.stringify(sports_interests) : undefined;
    const specialtiesStr = specialties !== undefined ? JSON.stringify(specialties) : undefined;
    if (idx !== -1) {
      db.users[idx].username = trimmedUsername;
      if (email) db.users[idx].email = email;
      if (phone) db.users[idx].phone = phone;
      if (role) db.users[idx].role = role;
      db.users[idx].specialty = specialty || db.users[idx].specialty || null;
      if (specialtiesStr !== undefined) db.users[idx].specialties = specialtiesStr;
      if (sportsInterestsStr !== undefined) db.users[idx].sports_interests = sportsInterestsStr;
    } else {
      db.users.push({
        playerId,
        username: trimmedUsername,
        email: email || null,
        phone: phone || null,
        password: '',
        apiKey: 'BCP-KEY-' + crypto.randomBytes(16).toString('hex'),
        role: role || 'viewer',
        specialty: specialty || null,
        specialties: specialtiesStr || null,
        sports_interests: sportsInterestsStr || null
      });
    }
    writeLocalDB(db);
    return res.json({ success: true });
  }

  try {
    if (trimmedUsername) {
      const [rows] = await dbPool.query('SELECT playerId FROM users WHERE LOWER(username) = ? AND playerId != ?', [trimmedUsername.toLowerCase(), playerId]);
      if (rows.length > 0) {
        return res.status(409).json({ error: 'Username already taken.' });
      }
    }

    if (phone) {
      const [rows] = await dbPool.query('SELECT playerId FROM users WHERE phone = ? AND playerId != ?', [phone.trim(), playerId]);
      if (rows.length > 0) {
        return res.status(409).json({ error: 'Phone number already registered by another user.' });
      }
    }

    const sportsInterestsUpdateStr = sports_interests !== undefined ? JSON.stringify(sports_interests) : null;
    const specialtiesUpdateStr = specialties !== undefined ? JSON.stringify(specialties) : null;
    
    let query = 'UPDATE users SET username = ?, email = COALESCE(?, email), phone = COALESCE(?, phone), role = COALESCE(?, role)';
    const params = [trimmedUsername, email || null, phone || null, role || null];
    
    if (specialty !== undefined) {
      query += ', specialty = ?';
      params.push(specialty);
    }
    if (specialtiesUpdateStr !== null) {
      query += ', specialties = ?';
      params.push(specialtiesUpdateStr);
    }
    if (sportsInterestsUpdateStr !== null) {
      query += ', sports_interests = ?';
      params.push(sportsInterestsUpdateStr);
    }
    query += ' WHERE playerId = ?';
    params.push(playerId);
    
    await dbPool.query(query, params);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 1. VENUES
app.get('/api/venues', authenticateRequest, async (req, res) => {
  if (useLocalFallback) {
    const db = readLocalDB();
    const enrichedVenues = db.venues.map(v => {
      const owner = db.users.find(u => u.playerId === v.ownerId);
      const ownerPaymentStatus = owner ? owner.paymentStatus : 'unpaid';
      const revs = db.reviews.filter(r => r.venueId === v.id);
      let parsedSports = [];
      try {
        parsedSports = v.sports ? (typeof v.sports === 'string' ? JSON.parse(v.sports) : v.sports) : [v.sport || 'Box Cricket'];
      } catch (e) {
        parsedSports = [v.sport || 'Box Cricket'];
      }
      return {
        ...v,
        images: Array.isArray(v.images) ? v.images : JSON.parse(v.images || '[]'),
        sports: parsedSports,
        reviews: revs,
        gamingDetails: v.gamingDetails ? (typeof v.gamingDetails === 'string' ? JSON.parse(v.gamingDetails) : v.gamingDetails) : null,
        ownerPaymentStatus
      };
    });
    return res.json(enrichedVenues);
  }

  try {
    const [rows] = await dbPool.query('SELECT v.*, u.paymentStatus AS ownerPaymentStatus FROM venues v LEFT JOIN users u ON v.ownerId = u.playerId');
    const parsedRows = await Promise.all(rows.map(async (v) => {
      const [revs] = await dbPool.query('SELECT * FROM reviews WHERE venueId = ?', [v.id]);
      let parsedSports = [];
      try {
        parsedSports = v.sports ? JSON.parse(v.sports) : [v.sport || 'Box Cricket'];
      } catch (e) {
        parsedSports = [v.sport || 'Box Cricket'];
      }
      let parsedGamingDetails = null;
      try {
        parsedGamingDetails = v.gamingDetails ? JSON.parse(v.gamingDetails) : null;
      } catch (e) {
        console.error("Failed to parse gamingDetails:", e);
      }
      return {
        ...v,
        images: JSON.parse(v.images || '[]'),
        sports: parsedSports,
        reviews: revs,
        gamingDetails: parsedGamingDetails,
        ownerPaymentStatus: v.ownerPaymentStatus || 'unpaid'
      };
    }));
    res.json(parsedRows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/venues', authenticateRequest, async (req, res) => {
  const { id, ownerId, name, address, phone, caretakerPhone, pricePerHour, advancePercent, terms, images, upiId, sport, sports, upiQrImage, gamingDetails } = req.body;
  const finalOwnerId = ownerId || req.user.playerId || 'BCP-PL-0000';
  const finalSports = Array.isArray(sports) ? sports : (sport ? [sport] : ['Box Cricket']);
  const finalSport = finalSports[0] || 'Box Cricket';

  if (useLocalFallback) {
    const db = readLocalDB();
    
    // Check if venue already exists to update or insert
    const idx = db.venues.findIndex(v => v.id === id);
    const venueObj = { 
      id, 
      ownerId: finalOwnerId, 
      name, 
      address, 
      phone, 
      caretakerPhone: caretakerPhone || null,
      pricePerHour: parseInt(pricePerHour), 
      advancePercent: parseInt(advancePercent), 
      terms, 
      images: images || [], 
      upiId, 
      upiQrImage: upiQrImage || null,
      sport: finalSport, 
      sports: finalSports,
      gamingDetails: gamingDetails || null,
      rating: 5.0, 
      reviewsCount: 0 
    };
    
    if (idx !== -1) {
      db.venues[idx] = { ...db.venues[idx], ...venueObj };
    } else {
      db.venues.push(venueObj);
    }
    writeLocalDB(db);
    return res.status(201).json({ success: true, id });
  }

  try {
    const imagesStr = JSON.stringify(images || []);
    const sportsStr = JSON.stringify(finalSports);
    const gamingDetailsStr = gamingDetails ? (typeof gamingDetails === 'string' ? gamingDetails : JSON.stringify(gamingDetails)) : null;
    
    // Check if exists to update
    const [exists] = await dbPool.query('SELECT id FROM venues WHERE id = ?', [id]);
    if (exists.length > 0) {
      await dbPool.query(
        'UPDATE venues SET ownerId = ?, name = ?, address = ?, phone = ?, caretakerPhone = ?, pricePerHour = ?, advancePercent = ?, terms = ?, images = ?, upiId = ?, sport = ?, sports = ?, upiQrImage = ?, gamingDetails = ? WHERE id = ?',
        [finalOwnerId, name, address, phone, caretakerPhone || null, pricePerHour, advancePercent, terms, imagesStr, upiId, finalSport, sportsStr, upiQrImage || null, gamingDetailsStr, id]
      );
    } else {
      await dbPool.query(
        'INSERT INTO venues (id, ownerId, name, address, phone, caretakerPhone, pricePerHour, advancePercent, terms, images, upiId, sport, sports, upiQrImage, gamingDetails) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [id, finalOwnerId, name, address, phone, caretakerPhone || null, pricePerHour, advancePercent, terms, imagesStr, upiId, finalSport, sportsStr, upiQrImage || null, gamingDetailsStr]
      );
    }
    res.status(201).json({ success: true, id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/venues/:id', authenticateRequest, async (req, res) => {
  const { id } = req.params;
  const playerId = req.user.playerId;

  if (useLocalFallback) {
    const db = readLocalDB();
    const venue = db.venues.find(v => v.id === id);
    if (!venue) {
      return res.status(404).json({ error: 'Venue not found.' });
    }
    if (venue.ownerId !== playerId) {
      return res.status(403).json({ error: 'Access Denied: You do not own this venue.' });
    }

    db.venues = db.venues.filter(v => v.id !== id);
    db.reviews = db.reviews.filter(r => r.venueId !== id);
    db.bookings = db.bookings.filter(b => b.venueId !== id);
    writeLocalDB(db);
    return res.json({ success: true, message: 'Venue deleted successfully.' });
  }

  try {
    const [rows] = await dbPool.query('SELECT ownerId FROM venues WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Venue not found.' });
    }
    if (rows[0].ownerId !== playerId) {
      return res.status(403).json({ error: 'Access Denied: You do not own this venue.' });
    }

    await dbPool.query('DELETE FROM venues WHERE id = ?', [id]);
    await dbPool.query('DELETE FROM reviews WHERE venueId = ?', [id]);
    await dbPool.query('DELETE FROM bookings WHERE venueId = ?', [id]);
    res.json({ success: true, message: 'Venue deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. VENUE REVIEWS
app.post('/api/venues/:id/reviews', authenticateRequest, async (req, res) => {
  if (useLocalFallback) {
    const db = readLocalDB();
    const venueId = req.params.id;
    const { id, user, rating, comment, date } = req.body;

    db.reviews.push({ id, venueId, user, rating: parseInt(rating), comment, date });
    
    // Recalculate average
    const revs = db.reviews.filter(r => r.venueId === venueId);
    const count = revs.length;
    const avg = count > 0 ? (revs.reduce((sum, r) => sum + r.rating, 0) / count).toFixed(1) : 5.0;

    const vIdx = db.venues.findIndex(v => v.id === venueId);
    if (vIdx !== -1) {
      db.venues[vIdx].rating = parseFloat(avg);
      db.venues[vIdx].reviewsCount = count;
    }

    writeLocalDB(db);
    return res.status(201).json({ success: true });
  }

  try {
    const venueId = req.params.id;
    const { id, user, rating, comment, date } = req.body;

    await dbPool.query(
      'INSERT INTO reviews (id, venueId, user, rating, comment, date) VALUES (?, ?, ?, ?, ?, ?)',
      [id, venueId, user, rating, comment, date]
    );

    const [revs] = await dbPool.query('SELECT rating FROM reviews WHERE venueId = ?', [venueId]);
    const count = revs.length;
    const avg = count > 0 ? (revs.reduce((sum, r) => sum + r.rating, 0) / count).toFixed(1) : 5.0;

    await dbPool.query(
      'UPDATE venues SET rating = ?, reviewsCount = ? WHERE id = ?',
      [avg, count, venueId]
    );

    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. BOOKINGS
app.get('/api/bookings', authenticateRequest, async (req, res) => {
  const { venueId, customerName } = req.query;

  if (useLocalFallback) {
    const db = readLocalDB();
    let filtered = db.bookings;
    if (venueId) {
      filtered = filtered.filter(b => b.venueId === venueId);
    }
    if (customerName) {
      filtered = filtered.filter(b => b.customerName === customerName);
    }
    return res.json(filtered);
  }

  try {
    let queryStr = 'SELECT * FROM bookings';
    const queryParams = [];
    
    if (venueId || customerName) {
      queryStr += ' WHERE';
      if (venueId) {
        queryStr += ' venueId = ?';
        queryParams.push(venueId);
      }
      if (customerName) {
        if (venueId) queryStr += ' AND';
        queryStr += ' customerName = ?';
        queryParams.push(customerName);
      }
    }
    queryStr += ' ORDER BY id DESC';

    const [rows] = await dbPool.query(queryStr, queryParams);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/bookings', authenticateRequest, async (req, res) => {
  const bookingsList = Array.isArray(req.body) ? req.body : [req.body];

  if (useLocalFallback) {
    const db = readLocalDB();
    db.bookings.push(...bookingsList);
    writeLocalDB(db);
    res.status(201).json({ success: true });
  } else {
    try {
      for (const b of bookingsList) {
        await dbPool.query(
          'INSERT INTO bookings (id, venueId, venueName, date, timeSlot, duration, amountPaid, status, customerName) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [b.id, b.venueId, b.venueName, b.date, b.timeSlot, b.duration, b.amountPaid, b.status, b.customerName]
        );
      }
      res.status(201).json({ success: true });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Trigger emails in background
  setTimeout(async () => {
    try {
      for (const b of bookingsList) {
        let customerEmail = req.user.email;
        let ownerEmail = null;
        let ownerName = 'Arena Owner';
        
        if (useLocalFallback) {
          const db = readLocalDB();
          const venue = db.venues.find(v => v.id === b.venueId);
          if (venue) {
            const owner = db.users.find(u => u.playerId === venue.ownerId);
            if (owner) {
              ownerEmail = owner.email;
              ownerName = owner.username;
            }
          }
        } else {
          const [vRows] = await dbPool.query('SELECT ownerId FROM venues WHERE id = ?', [b.venueId]);
          if (vRows.length > 0) {
            const ownerId = vRows[0].ownerId;
            const [uRows] = await dbPool.query('SELECT email, username FROM users WHERE playerId = ?', [ownerId]);
            if (uRows.length > 0) {
              ownerEmail = uRows[0].email;
              ownerName = uRows[0].username;
            }
          }
        }
        
        await sendBookingConfirmationEmails(b, customerEmail, ownerEmail, ownerName);
      }
    } catch (e) {
      console.error("Error in sending booking confirmation emails:", e.message);
    }
  }, 100);
});

app.delete('/api/bookings/:id', authenticateRequest, async (req, res) => {
  const id = req.params.id;
  let booking = null;

  if (useLocalFallback) {
    const db = readLocalDB();
    booking = db.bookings.find(b => b.id === id);
    if (booking) {
      db.bookings = db.bookings.filter(b => b.id !== id);
      writeLocalDB(db);
    }
    res.json({ success: true });
  } else {
    try {
      const [rows] = await dbPool.query('SELECT * FROM bookings WHERE id = ?', [id]);
      if (rows.length > 0) {
        booking = rows[0];
      }
      await dbPool.query('DELETE FROM bookings WHERE id = ?', [id]);
      res.json({ success: true });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Trigger cancellation emails in background
  if (booking) {
    setTimeout(async () => {
      try {
        let customerEmail = null;
        const customerName = booking.customerName;

        if (req.user && req.user.username === customerName) {
          customerEmail = req.user.email;
        } else {
          if (useLocalFallback) {
            const db = readLocalDB();
            const u = db.users.find(us => us.username === customerName);
            if (u) customerEmail = u.email;
          } else {
            const [uRows] = await dbPool.query('SELECT email FROM users WHERE username = ?', [customerName]);
            if (uRows.length > 0) customerEmail = uRows[0].email;
          }
        }

        let ownerEmail = null;
        let ownerName = 'Arena Owner';
        
        if (useLocalFallback) {
          const db = readLocalDB();
          const venue = db.venues.find(v => v.id === booking.venueId);
          if (venue) {
            const owner = db.users.find(u => u.playerId === venue.ownerId);
            if (owner) {
              ownerEmail = owner.email;
              ownerName = owner.username;
            }
          }
        } else {
          const [vRows] = await dbPool.query('SELECT ownerId FROM venues WHERE id = ?', [booking.venueId]);
          if (vRows.length > 0) {
            const ownerId = vRows[0].ownerId;
            const [uRows] = await dbPool.query('SELECT email, username FROM users WHERE playerId = ?', [ownerId]);
            if (uRows.length > 0) {
              ownerEmail = uRows[0].email;
              ownerName = uRows[0].username;
            }
          }
        }

        await sendBookingCancellationEmails(booking, customerEmail, ownerEmail, ownerName);
      } catch (err) {
        console.error("Error sending booking cancellation emails:", err.message);
      }
    }, 100);
  }
});

// 4. TEAMS
app.get('/api/teams', authenticateRequest, async (req, res) => {
  const userId = req.user.playerId;
  const userPhone = req.user.phone;
  const username = req.user.username;

  if (useLocalFallback) {
    const db = readLocalDB();
    db.team_access = db.team_access || [];
    const normalizedUser = (username || '').trim().toLowerCase();

    const myTeamIds = new Set([
      ...db.teams.filter(t => t.creatorId === userId).map(t => t.id),
      ...db.team_access.filter(ta => ta.userId === userId).map(ta => ta.teamId),
      ...db.players.filter(p => {
        const phoneMatch = userPhone && p.phone === userPhone;
        const pName = (p.name || '').trim().toLowerCase();
        const nameMatch = normalizedUser && pName && (
          normalizedUser.includes(pName) || pName.includes(normalizedUser)
        );
        return phoneMatch || nameMatch;
      }).map(p => p.teamId)
    ]);
    const filteredTeams = db.teams.filter(t => myTeamIds.has(t.id));
    const enriched = filteredTeams.map(t => {
      const players = db.players.filter(p => p.teamId === t.id);
      const accessObj = db.team_access.find(ta => ta.teamId === t.id && ta.userId === userId);
      return { 
        ...t, 
        players,
        accessType: accessObj ? accessObj.accessType : (t.creatorId === userId ? 'owner' : 'viewer')
      };
    });
    return res.json(enriched);
  }

  try {
    const [teams] = await dbPool.query(`
      SELECT DISTINCT t.*, COALESCE(ta.accessType, 'viewer') AS accessType
      FROM teams t
      LEFT JOIN team_access ta ON t.id = ta.teamId
      LEFT JOIN players p ON t.id = p.teamId
      WHERE t.creatorId = ? 
         OR ta.userId = ? 
         OR (p.phone IS NOT NULL AND p.phone = ?)
         OR (p.name IS NOT NULL AND (
               LOWER(?) LIKE CONCAT('%', LOWER(TRIM(p.name)), '%') OR 
               LOWER(TRIM(p.name)) LIKE CONCAT('%', LOWER(?), '%')
            ))
    `, [userId, userId, userPhone, username, username]);
    const enrichedTeams = await Promise.all(teams.map(async (t) => {
      const [players] = await dbPool.query('SELECT * FROM players WHERE teamId = ?', [t.id]);
      return {
        ...t,
        players
      };
    }));
    res.json(enrichedTeams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/teams', authenticateRequest, async (req, res) => {
  const { id, name, captain, sport } = req.body;
  const finalSport = sport || 'Box Cricket';
  const userId = req.user.playerId;

  if (useLocalFallback) {
    const db = readLocalDB();
    db.teams.push({ id, name, captain, sport: finalSport, creatorId: userId });
    db.team_access = db.team_access || [];
    db.team_access.push({ teamId: id, userId, accessType: 'owner' });
    writeLocalDB(db);
    return res.status(201).json({ success: true, id });
  }

  try {
    await dbPool.query('INSERT INTO teams (id, name, captain, sport, creatorId) VALUES (?, ?, ?, ?, ?)', [id, name, captain, finalSport, userId]);
    await dbPool.query('INSERT INTO team_access (teamId, userId, accessType) VALUES (?, ?, ?)', [id, userId, 'owner']);
    res.status(201).json({ success: true, id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/teams/:id', authenticateRequest, async (req, res) => {
  const teamId = req.params.id;
  const { name, captain, sport } = req.body;

  if (useLocalFallback) {
    const db = readLocalDB();
    const idx = db.teams.findIndex(t => t.id === teamId);
    if (idx !== -1) {
      db.teams[idx] = { 
        ...db.teams[idx], 
        name: name ? name.toUpperCase() : db.teams[idx].name, 
        captain: captain !== undefined ? captain : db.teams[idx].captain,
        sport: sport !== undefined ? sport : db.teams[idx].sport
      };
      writeLocalDB(db);
      return res.json({ success: true });
    }
    return res.status(404).json({ error: 'Team not found.' });
  }

  try {
    const [rows] = await dbPool.query('SELECT * FROM teams WHERE id = ?', [teamId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Team not found.' });
    }
    const current = rows[0];
    const finalName = name ? name.toUpperCase() : current.name;
    const finalCaptain = captain !== undefined ? captain : current.captain;
    const finalSport = sport !== undefined ? sport : current.sport;

    await dbPool.query('UPDATE teams SET name = ?, captain = ?, sport = ? WHERE id = ?', [finalName, finalCaptain, finalSport, teamId]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/teams/share', authenticateRequest, async (req, res) => {
  const { shareCode } = req.body;
  const userId = req.user.playerId;

  if (!shareCode) {
    return res.status(400).json({ error: 'Share Code is required!' });
  }

  if (useLocalFallback) {
    const db = readLocalDB();
    const team = db.teams.find(t => t.id === shareCode);
    if (!team) {
      return res.status(404).json({ error: 'Team not found. Please verify the Share Code!' });
    }
    db.team_access = db.team_access || [];
    const alreadyHas = db.team_access.some(ta => ta.teamId === shareCode && ta.userId === userId);
    if (!alreadyHas) {
      db.team_access.push({ teamId: shareCode, userId, accessType: 'viewer' });
      writeLocalDB(db);
    }
    return res.json({ success: true, message: 'Team imported successfully!' });
  }

  try {
    const [teams] = await dbPool.query('SELECT * FROM teams WHERE id = ?', [shareCode]);
    if (teams.length === 0) {
      return res.status(404).json({ error: 'Team not found. Please verify the Share Code!' });
    }
    // Check if already has access
    const [accessRows] = await dbPool.query('SELECT * FROM team_access WHERE teamId = ? AND userId = ?', [shareCode, userId]);
    if (accessRows.length === 0) {
      await dbPool.query('INSERT INTO team_access (teamId, userId, accessType) VALUES (?, ?, ?)', [shareCode, userId, 'viewer']);
    }
    res.json({ success: true, message: 'Team imported successfully!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/teams/:id/players', authenticateRequest, async (req, res) => {
  const teamId = req.params.id;
  const { id, name, jersey, role, matches, runs, avg, sr, wickets, eco, best, phone } = req.body;

  if (useLocalFallback) {
    const db = readLocalDB();
    db.players.push({ id, teamId, name, jersey, role, matches, runs, avg: parseFloat(avg), sr: parseFloat(sr), wickets, eco: parseFloat(eco), best, phone: phone || null });
    writeLocalDB(db);
    return res.status(201).json({ success: true });
  }

  try {
    await dbPool.query(
      'INSERT INTO players (id, teamId, name, jersey, role, matches, runs, avg, sr, wickets, eco, best, phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, teamId, name, jersey, role, matches, runs, avg, sr, wickets, eco, best, phone || null]
    );
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/players/:id', authenticateRequest, async (req, res) => {
  const playerId = req.params.id;
  const { name, jersey, role, phone } = req.body;

  if (useLocalFallback) {
    const db = readLocalDB();
    const idx = db.players.findIndex(p => p.id === playerId);
    if (idx !== -1) {
      db.players[idx] = { ...db.players[idx], name, jersey, role, phone: phone || null };
      writeLocalDB(db);
      return res.json({ success: true });
    }
    return res.status(404).json({ error: 'Player not found.' });
  }

  try {
    await dbPool.query(
      'UPDATE players SET name = ?, jersey = ?, role = ?, phone = ? WHERE id = ?',
      [name, jersey, role, phone || null, playerId]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/players/:id', authenticateRequest, async (req, res) => {
  const playerId = req.params.id;

  if (useLocalFallback) {
    const db = readLocalDB();
    const originalLength = db.players.length;
    db.players = db.players.filter(p => p.id !== playerId);
    if (db.players.length !== originalLength) {
      writeLocalDB(db);
      return res.json({ success: true });
    }
    return res.status(404).json({ error: 'Player not found.' });
  }

  try {
    await dbPool.query('DELETE FROM players WHERE id = ?', [playerId]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. MATCHES
app.get('/api/matches', authenticateRequest, async (req, res) => {
  if (useLocalFallback) {
    const db = readLocalDB();
    return res.json(db.completed_matches);
  }

  try {
    const [rows] = await dbPool.query('SELECT * FROM completed_matches ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/matches', authenticateRequest, async (req, res) => {
  const { id, team1, team2, team1Id, team2Id, runs, wickets, balls, crr, date, sport, venue, scorerId, scorerName, result, isAbandoned, matchState, tossText } = req.body;
  const finalSport = sport || 'Cricket';
  const finalVenue = venue || 'Local Arena';

  if (useLocalFallback) {
    const db = readLocalDB();
    db.completed_matches.push({ 
      id, 
      team1, 
      team2, 
      team1Id: team1Id || null,
      team2Id: team2Id || null,
      runs: parseInt(runs), 
      wickets: parseInt(wickets), 
      balls: parseInt(balls), 
      crr, 
      date,
      sport: finalSport,
      venue: finalVenue,
      scorerId: scorerId || null,
      scorerName: scorerName || null,
      result: result || null,
      isAbandoned: isAbandoned ? 1 : 0,
      matchState: typeof matchState === 'object' ? matchState : (matchState ? JSON.parse(matchState) : null),
      tossText: tossText || null
    });
    writeLocalDB(db);
    await recalculatePlayerStats();
    return res.status(201).json({ success: true });
  }

  try {
    await dbPool.query(
      'INSERT INTO completed_matches (id, team1, team2, team1Id, team2Id, runs, wickets, balls, crr, date, sport, venue, scorerId, scorerName, result, isAbandoned, matchState, tossText) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        id, team1, team2, team1Id || null, team2Id || null, runs, wickets, balls, crr, date, finalSport, finalVenue,
        scorerId || null, scorerName || null, result || null, isAbandoned ? 1 : 0,
        matchState ? (typeof matchState === 'string' ? matchState : JSON.stringify(matchState)) : null,
        tossText || null
      ]
    );
    await recalculatePlayerStats();
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 6. TOURNAMENTS
app.get('/api/tournaments', authenticateRequest, async (req, res) => {
  if (useLocalFallback) {
    const db = readLocalDB();
    const enriched = db.tournaments.map(t => ({
      ...t,
      standings: typeof t.standings === 'string' ? JSON.parse(t.standings) : (t.standings || []),
      bracket: typeof t.bracket === 'string' ? JSON.parse(t.bracket) : (t.bracket || {})
    }));
    return res.json(enriched);
  }

  try {
    const [rows] = await dbPool.query('SELECT * FROM tournaments ORDER BY id DESC');
    const enriched = rows.map(t => ({
      ...t,
      standings: JSON.parse(t.standings || '[]'),
      bracket: JSON.parse(t.bracket || '{}')
    }));
    res.json(enriched);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/tournaments', authenticateRequest, async (req, res) => {
  const { id, name, sport, date, standings, bracket } = req.body;
  const standingsStr = JSON.stringify(standings || []);
  const bracketStr = JSON.stringify(bracket || {});

  if (useLocalFallback) {
    const db = readLocalDB();
    const idx = db.tournaments.findIndex(t => t.id === id);
    const tourObj = { id, name, sport, date, standings: standingsStr, bracket: bracketStr };
    if (idx !== -1) {
      db.tournaments[idx] = tourObj;
    } else {
      db.tournaments.push(tourObj);
    }
    writeLocalDB(db);
    return res.status(201).json({ success: true });
  }

  try {
    const [exists] = await dbPool.query('SELECT id FROM tournaments WHERE id = ?', [id]);
    if (exists.length > 0) {
      await dbPool.query(
        'UPDATE tournaments SET name = ?, sport = ?, date = ?, standings = ?, bracket = ? WHERE id = ?',
        [name, sport, date, standingsStr, bracketStr, id]
      );
    } else {
      await dbPool.query(
        'INSERT INTO tournaments (id, name, sport, date, standings, bracket) VALUES (?, ?, ?, ?, ?, ?)',
        [id, name, sport, date, standingsStr, bracketStr]
      );
    }
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/tournaments/:id', authenticateRequest, async (req, res) => {
  const { id } = req.params;

  if (useLocalFallback) {
    const db = readLocalDB();
    db.tournaments = db.tournaments.filter(t => t.id !== id);
    writeLocalDB(db);
    return res.json({ success: true });
  }

  try {
    await dbPool.query('DELETE FROM tournaments WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// 7. LOYALTY VISITS
app.get('/api/loyalty', authenticateRequest, async (req, res) => {
  const playerId = req.user.playerId;

  if (useLocalFallback) {
    const db = readLocalDB();
    const records = db.loyalty_visits.filter(r => r.playerId === playerId);
    const mapping = {};
    records.forEach(r => {
      mapping[r.venueId] = r.visitCount;
    });
    return res.json(mapping);
  }

  try {
    const [rows] = await dbPool.query('SELECT venueId, visitCount FROM loyalty_visits WHERE playerId = ?', [playerId]);
    const mapping = {};
    rows.forEach(r => {
      mapping[r.venueId] = r.visitCount;
    });
    res.json(mapping);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/loyalty', authenticateRequest, async (req, res) => {
  const playerId = req.user.playerId;
  const { venueId, visitCount } = req.body;

  if (useLocalFallback) {
    const db = readLocalDB();
    const idx = db.loyalty_visits.findIndex(r => r.playerId === playerId && r.venueId === venueId);
    if (idx !== -1) {
      db.loyalty_visits[idx].visitCount = visitCount;
    } else {
      db.loyalty_visits.push({ playerId, venueId, visitCount });
    }
    writeLocalDB(db);
    return res.status(201).json({ success: true });
  }

  try {
    const [exists] = await dbPool.query('SELECT visitCount FROM loyalty_visits WHERE playerId = ? AND venueId = ?', [playerId, venueId]);
    if (exists.length > 0) {
      await dbPool.query(
        'UPDATE loyalty_visits SET visitCount = ? WHERE playerId = ? AND venueId = ?',
        [visitCount, playerId, venueId]
      );
    } else {
      await dbPool.query(
        'INSERT INTO loyalty_visits (playerId, venueId, visitCount) VALUES (?, ?, ?)',
        [playerId, venueId, visitCount]
      );
    }
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 8. LIVE MATCHES
app.get('/api/matches/live', authenticateRequest, async (req, res) => {
  if (useLocalFallback) {
    const db = readLocalDB();
    const list = (db.live_matches || []).map(m => {
      try {
        return typeof m.data === 'string' ? JSON.parse(m.data) : m.data;
      } catch (err) {
        return m;
      }
    });
    return res.json(list);
  }
  try {
    const [rows] = await dbPool.query('SELECT data FROM live_matches');
    const list = rows.map(r => {
      try {
        return typeof r.data === 'string' ? JSON.parse(r.data) : r.data;
      } catch (err) {
        return r;
      }
    });
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/matches/live/:id', authenticateRequest, async (req, res) => {
  const { id } = req.params;
  if (useLocalFallback) {
    const db = readLocalDB();
    const match = db.live_matches.find(m => m.id === id);
    if (!match) return res.status(404).json({ error: 'Live match not found.' });
    return res.json(JSON.parse(match.data));
  }
  try {
    const [rows] = await dbPool.query('SELECT data FROM live_matches WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Live match not found.' });
    res.json(JSON.parse(rows[0].data));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/matches/live', authenticateRequest, async (req, res) => {
  const { id, sport, data } = req.body;
  if (useLocalFallback) {
    const db = readLocalDB();
    const idx = db.live_matches.findIndex(m => m.id === id);
    const matchObj = { id, sport, data };
    if (idx !== -1) {
      db.live_matches[idx] = matchObj;
    } else {
      db.live_matches.push(matchObj);
    }
    writeLocalDB(db);
    return res.status(201).json({ success: true });
  }
  try {
    const [exists] = await dbPool.query('SELECT id FROM live_matches WHERE id = ?', [id]);
    if (exists.length > 0) {
      await dbPool.query(
        'UPDATE live_matches SET sport = ?, data = ? WHERE id = ?',
        [sport, data, id]
      );
    } else {
      await dbPool.query(
        'INSERT INTO live_matches (id, sport, data) VALUES (?, ?, ?)',
        [id, sport, data]
      );
    }
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/matches/live/:id', authenticateRequest, async (req, res) => {
  const { id } = req.params;
  if (useLocalFallback) {
    const db = readLocalDB();
    db.live_matches = db.live_matches.filter(m => m.id !== id);
    writeLocalDB(db);
    return res.json({ success: true });
  }
  try {
    await dbPool.query('DELETE FROM live_matches WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =============================================================================
// RAZORPAY PAYMENT ROUTES
// =============================================================================

// POST /api/payment/create-order  — creates a Razorpay order and returns the order id
app.post('/api/payment/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt, notes } = req.body;
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      return res.status(400).json({ error: 'Valid amount (in paise) is required' });
    }
    const options = {
      amount: Math.round(Number(amount)), // amount in paise, e.g. ₹250 = 25000
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
      notes: notes || {}
    };
    const order = await razorpay.orders.create(options);
    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: 'rzp_test_T01br2Bnh2Rgp1'
    });
  } catch (err) {
    console.error('Razorpay create-order error:', err);
    res.status(500).json({ error: err.message || 'Failed to create payment order' });
  }
});

// POST /api/payment/verify  — verifies Razorpay signature after payment success
app.post('/api/payment/verify', (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing payment verification fields' });
    }
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', '35HVf4YzPFr5bmIXIRnDAMoc')
      .update(body)
      .digest('hex');
    if (expectedSignature === razorpay_signature) {
      res.json({ success: true, paymentId: razorpay_payment_id });
    } else {
      res.status(400).json({ success: false, error: 'Payment signature verification failed' });
    }
  } catch (err) {
    console.error('Razorpay verify error:', err);
    res.status(500).json({ error: err.message || 'Verification failed' });
  }
});

// Serve static assets in production if dist directory is present
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  // Catch-all route to serve index.html for client-side routing
  app.get('*any', (req, res) => {
    res.sendFile(path.resolve(distPath, 'index.html'));
  });
}

// Initialize DB and start server
initDatabase().then(async () => {
  try {
    await recalculatePlayerStats();
  } catch (err) {
    console.error("Startup player stats recalculation failed:", err.message);
  }
  app.listen(PORT, () => {
    console.log(`Express SQL Server active at http://localhost:${PORT}`);
    
    // Start subscription checking scheduler
    checkSubscriptionExpirations();
    setInterval(checkSubscriptionExpirations, 12 * 60 * 60 * 1000); // check every 12 hours
  });
});
