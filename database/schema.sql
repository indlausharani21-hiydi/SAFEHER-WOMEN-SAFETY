-- ====================================================
-- SafeHer Database Schema (SQLite)
-- Personal Women Safety & Emergency Response Platform
-- ====================================================

-- 1. User Profile & Emergency Medical Info
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT,
  blood_group TEXT,
  medical_notes TEXT,
  emergency_message TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Emergency Contacts & Trusted Guardians
CREATE TABLE IF NOT EXISTS contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  relationship TEXT DEFAULT 'Family',
  is_primary INTEGER DEFAULT 0,
  notify_sms INTEGER DEFAULT 1,
  notify_whatsapp INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. SOS Emergency Alerts Incident Log
CREATE TABLE IF NOT EXISTS alerts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  latitude REAL,
  longitude REAL,
  address TEXT,
  status TEXT DEFAULT 'ACTIVE', -- ACTIVE, RESOLVED, CANCELLED
  alert_type TEXT DEFAULT 'SOS', -- SOS, SILENT, MEDICAL
  battery_level INTEGER,
  notes TEXT,
  resolved_at DATETIME
);

-- 4. Verified Safe Havens & Shelters
CREATE TABLE IF NOT EXISTS safe_places (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- police, hospital, pharmacy, shelter, transit
  address TEXT NOT NULL,
  phone TEXT,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  is_verified INTEGER DEFAULT 1,
  open_24_7 INTEGER DEFAULT 1,
  notes TEXT
);

-- 5. Community Safety Hazard & Incident Reports
CREATE TABLE IF NOT EXISTS incident_reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  category TEXT NOT NULL, -- poor_lighting, harassment, isolated, suspicious, other
  description TEXT,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  address TEXT,
  severity TEXT DEFAULT 'MEDIUM', -- LOW, MEDIUM, HIGH
  upvotes INTEGER DEFAULT 1,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
