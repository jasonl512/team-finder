import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

// Create all tables when the server starts
// No separate migration file needed — just runs on startup
export async function setupDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id       SERIAL PRIMARY KEY,
      username VARCHAR(30) UNIQUE NOT NULL,
      email    VARCHAR(100) UNIQUE NOT NULL,
      password TEXT NOT NULL,
      bio      TEXT DEFAULT '',
      game     VARCHAR(50) DEFAULT '',
      platform VARCHAR(20) DEFAULT 'PC',
      rank     VARCHAR(20) DEFAULT 'Unranked'
    );

    CREATE TABLE IF NOT EXISTS posts (
      id          SERIAL PRIMARY KEY,
      user_id     INTEGER REFERENCES users(id),
      username    VARCHAR(30),
      title       VARCHAR(120) NOT NULL,
      description TEXT,
      game        VARCHAR(50),
      created_at  TIMESTAMPTZ DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS messages (
      id          SERIAL PRIMARY KEY,
      sender_id   INTEGER REFERENCES users(id),
      receiver_id INTEGER REFERENCES users(id),
      body        TEXT NOT NULL,
      created_at  TIMESTAMPTZ DEFAULT now()
    );
  `);
  console.log('Database tables ready.');
}

export default pool;
