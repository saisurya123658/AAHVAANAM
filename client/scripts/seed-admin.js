require("dotenv").config();
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const Database = require("better-sqlite3");

const dataDir = path.join(__dirname, "..", "data");
fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(path.join(dataDir, "aahvaanam.db"));
db.exec(`
CREATE TABLE IF NOT EXISTS admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
`);

const email = (process.env.ADMIN_EMAIL || "admin@aahvaanam.com").trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD || "ChangeMe123!";

(async () => {
  const hash = await bcrypt.hash(password, 12);
  const existing = db.prepare("SELECT id FROM admins WHERE email=?").get(email);

  if (existing) {
    db.prepare("UPDATE admins SET password_hash=? WHERE email=?").run(hash, email);
    console.log(`Admin password updated for ${email}`);
  } else {
    db.prepare("INSERT INTO admins (email, password_hash) VALUES (?, ?)").run(email, hash);
    console.log(`Admin created: ${email}`);
  }

  db.close();
})();
