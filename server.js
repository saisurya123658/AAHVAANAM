require("dotenv").config();

const path = require("path");
const fs = require("fs");
const express = require("express");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const Database = require("better-sqlite3");

const app = express();
const PORT = Number(process.env.PORT || 3000);
const JWT_SECRET = process.env.JWT_SECRET || "dev-only-change-me";

const dataDir = path.join(__dirname, "data");
fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(path.join(dataDir, "aahvaanam.db"));
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
CREATE TABLE IF NOT EXISTS admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  booking_ref TEXT NOT NULL UNIQUE,
  guest_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  check_in TEXT NOT NULL,
  check_out TEXT NOT NULL,
  room_type TEXT NOT NULL,
  rooms INTEGER NOT NULL DEFAULT 1,
  guests INTEGER NOT NULL DEFAULT 1,
  special_request TEXT,
  status TEXT NOT NULL DEFAULT 'Pending',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_bookings_checkin ON bookings(check_in);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
`);

app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many login attempts. Please try again later." }
});

const bookingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many booking requests. Please try again later." }
});

function createBookingRef() {
  const stamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `AAH-${stamp}-${random}`;
}

function signAdmin(admin) {
  return jwt.sign(
    { sub: admin.id, email: admin.email, role: "admin" },
    JWT_SECRET,
    { expiresIn: "8h" }
  );
}

function requireAdmin(req, res, next) {
  const token = req.cookies.admin_token;
  if (!token) return res.status(401).json({ error: "Authentication required." });

  try {
    req.admin = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.clearCookie("admin_token");
    return res.status(401).json({ error: "Session expired. Please login again." });
  }
}

function validDateRange(checkIn, checkOut) {
  const a = new Date(`${checkIn}T00:00:00`);
  const b = new Date(`${checkOut}T00:00:00`);
  return !Number.isNaN(a.valueOf()) && !Number.isNaN(b.valueOf()) && b > a;
}

function cleanText(value, max = 500) {
  return String(value ?? "").trim().slice(0, max);
}

app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "aahvaanam-lodge" });
});

app.post("/api/bookings", bookingLimiter, (req, res) => {
  const guestName = cleanText(req.body.guestName, 100);
  const phone = cleanText(req.body.phone, 30);
  const email = cleanText(req.body.email, 120);
  const checkIn = cleanText(req.body.checkIn, 10);
  const checkOut = cleanText(req.body.checkOut, 10);
  const roomType = cleanText(req.body.roomType, 80);
  const rooms = Math.max(1, Math.min(20, Number(req.body.rooms || 1)));
  const guests = Math.max(1, Math.min(50, Number(req.body.guests || 1)));
  const specialRequest = cleanText(req.body.specialRequest, 500);

  if (!guestName || !phone || !checkIn || !checkOut || !roomType) {
    return res.status(400).json({ error: "Please fill all required fields." });
  }
  if (!validDateRange(checkIn, checkOut)) {
    return res.status(400).json({ error: "Check-out must be after check-in." });
  }

  const bookingRef = createBookingRef();
  const stmt = db.prepare(`
    INSERT INTO bookings
      (booking_ref, guest_name, phone, email, check_in, check_out, room_type, rooms, guests, special_request)
    VALUES
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    bookingRef, guestName, phone, email, checkIn, checkOut,
    roomType, rooms, guests, specialRequest
  );

  res.status(201).json({
    message: "Booking request received.",
    bookingRef
  });
});

app.post("/api/admin/login", loginLimiter, async (req, res) => {
  const email = cleanText(req.body.email, 120).toLowerCase();
  const password = String(req.body.password || "");

  const admin = db.prepare("SELECT * FROM admins WHERE email = ?").get(email);
  if (!admin || !(await bcrypt.compare(password, admin.password_hash))) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  const token = signAdmin(admin);
  res.cookie("admin_token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 8 * 60 * 60 * 1000
  });

  res.json({ message: "Login successful.", admin: { email: admin.email } });
});

app.post("/api/admin/logout", (req, res) => {
  res.clearCookie("admin_token");
  res.json({ message: "Logged out." });
});

app.get("/api/admin/me", requireAdmin, (req, res) => {
  res.json({ authenticated: true, email: req.admin.email });
});

app.get("/api/admin/stats", requireAdmin, (req, res) => {
  const total = db.prepare("SELECT COUNT(*) AS count FROM bookings").get().count;
  const pending = db.prepare("SELECT COUNT(*) AS count FROM bookings WHERE status='Pending'").get().count;
  const confirmed = db.prepare("SELECT COUNT(*) AS count FROM bookings WHERE status='Confirmed'").get().count;
  const checkedIn = db.prepare("SELECT COUNT(*) AS count FROM bookings WHERE status='Checked In'").get().count;
  const today = new Date().toISOString().slice(0, 10);
  const todayCheckins = db.prepare("SELECT COUNT(*) AS count FROM bookings WHERE check_in=? AND status NOT IN ('Cancelled')").get(today).count;

  res.json({ total, pending, confirmed, checkedIn, todayCheckins });
});

app.get("/api/admin/bookings", requireAdmin, (req, res) => {
  const q = cleanText(req.query.q, 100);
  const status = cleanText(req.query.status, 30);
  const allowedStatuses = ["Pending", "Confirmed", "Checked In", "Checked Out", "Cancelled"];

  let sql = "SELECT * FROM bookings WHERE 1=1";
  const params = [];

  if (q) {
    sql += " AND (booking_ref LIKE ? OR guest_name LIKE ? OR phone LIKE ? OR email LIKE ?)";
    const pattern = `%${q}%`;
    params.push(pattern, pattern, pattern, pattern);
  }

  if (status && allowedStatuses.includes(status)) {
    sql += " AND status = ?";
    params.push(status);
  }

  sql += " ORDER BY created_at DESC, id DESC";

  const bookings = db.prepare(sql).all(...params);
  res.json({ bookings });
});

app.patch("/api/admin/bookings/:id/status", requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const status = cleanText(req.body.status, 30);
  const allowedStatuses = ["Pending", "Confirmed", "Checked In", "Checked Out", "Cancelled"];

  if (!Number.isInteger(id) || !allowedStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid booking or status." });
  }

  const result = db.prepare(`
    UPDATE bookings SET status=?, updated_at=datetime('now') WHERE id=?
  `).run(status, id);

  if (!result.changes) return res.status(404).json({ error: "Booking not found." });

  res.json({ message: "Booking status updated." });
});

app.delete("/api/admin/bookings/:id", requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid booking." });

  const result = db.prepare("DELETE FROM bookings WHERE id=?").run(id);
  if (!result.changes) return res.status(404).json({ error: "Booking not found." });

  res.json({ message: "Booking deleted." });
});

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Aahvaanam Lodge running at http://localhost:${PORT}`);
});
