import Database from 'better-sqlite3';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbFile = process.env.DB_FILE || './data/bethel.db';
const fullPath = path.isAbsolute(dbFile) ? dbFile : path.join(__dirname, dbFile);
const dir = path.dirname(fullPath);
if(!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

export const db = new Database(fullPath);
db.pragma('journal_mode = WAL');

export function runMigrations(){
  db.exec(`
    CREATE TABLE IF NOT EXISTS users(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role in ('admin','leader','member')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS members(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      gender TEXT,
      marital_status TEXT,
      baptism_date TEXT,
      phone TEXT,
      address TEXT,
      photo_url TEXT,
      spiritual_gifts TEXT,
      ministries TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
}
