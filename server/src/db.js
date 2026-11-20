import Database from 'better-sqlite3';

export function createDb(dbPath = './coy.db') {
  const db = new Database(dbPath);

  // Enable WAL mode and foreign keys
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id        INTEGER PRIMARY KEY,
      name      TEXT    NOT NULL,
      age       INTEGER NOT NULL,
      photo_url TEXT    NOT NULL,
      bio       TEXT,
      city      TEXT,
      interests TEXT,
      sort_key  REAL
    );

    CREATE TABLE IF NOT EXISTS swipes (
      id         INTEGER PRIMARY KEY,
      swiper_id  INTEGER NOT NULL REFERENCES users(id),
      target_id  INTEGER NOT NULL REFERENCES users(id),
      direction  TEXT    NOT NULL CHECK (direction IN ('like','pass')),
      created_at TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(swiper_id, target_id)
    );

    CREATE TABLE IF NOT EXISTS matches (
      id         INTEGER PRIMARY KEY,
      user_a_id  INTEGER NOT NULL,
      user_b_id  INTEGER NOT NULL,
      created_at TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_a_id, user_b_id)
    );
  `);

  return db;
}
