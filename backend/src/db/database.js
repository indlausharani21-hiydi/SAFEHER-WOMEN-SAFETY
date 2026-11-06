/**
 * SafeHer Database Module
 * Uses Node.js native SQLite (node:sqlite) for zero external dependencies
 * and high-performance persistent storage.
 */
const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');
const fs = require('node:fs');

const DB_DIR = path.resolve(__dirname, '../../../data');
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const DB_PATH = path.join(DB_DIR, 'safeher.sqlite');
const db = new DatabaseSync(DB_PATH);

// Enable WAL mode and foreign keys for high reliability
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

/**
 * Initialize Schema
 */
function initializeDatabase() {
  db.exec(`
    -- User emergency profile
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT,
      blood_group TEXT,
      medical_notes TEXT,
      emergency_message TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Emergency Contacts / Guardians
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

    -- SOS Emergency Incidents Log
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

    -- Safe Havens (Police Stations, Hospitals, 24/7 Pharmacies, Shelter Homes)
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

    -- Community Incident & Hazard Reports (e.g. Broken Lights, Catcalling, Deserted Stretches)
    CREATE TABLE IF NOT EXISTS incident_reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT NOT NULL, -- poor_lighting, harassment, isolated, stalker, other
      description TEXT,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      address TEXT,
      severity TEXT DEFAULT 'MEDIUM', -- LOW, MEDIUM, HIGH
      upvotes INTEGER DEFAULT 1,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  seedInitialData();
}

/**
 * Seed initial sample data if tables are empty
 */
function seedInitialData() {
  // Check user profile
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  if (userCount === 0) {
    db.prepare(`
      INSERT INTO users (name, phone, blood_group, medical_notes, emergency_message)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      'Ananya Sharma',
      '+91 98765 43210',
      'O+',
      'Asthma inhaler in backpack',
      'EMERGENCY! I need immediate help. Here is my current real-time GPS location: '
    );
  }

  // Check contacts
  const contactCount = db.prepare('SELECT COUNT(*) as count FROM contacts').get().count;
  if (contactCount === 0) {
    const insertContact = db.prepare(`
      INSERT INTO contacts (name, phone, relationship, is_primary, notify_sms, notify_whatsapp)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    insertContact.run('Mom (Priya Sharma)', '+91 98765 00001', 'Mother', 1, 1, 1);
    insertContact.run('Aditi (Best Friend)', '+91 98765 00002', 'Friend', 0, 1, 1);
    insertContact.run('Inspector Vikram (Local Police Contact)', '+91 98765 00003', 'Emergency Authority', 0, 1, 0);
  }

  // Check safe places
  const placeCount = db.prepare('SELECT COUNT(*) as count FROM safe_places').get().count;
  if (placeCount === 0) {
    const insertPlace = db.prepare(`
      INSERT INTO safe_places (name, category, address, phone, latitude, longitude, is_verified, open_24_7, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertPlace.run('Central Women Special Police Station', 'police', 'Civil Lines, Station Road', '011-23010101', 28.6139, 77.2090, 1, 1, '24x7 Women Help Desk with dedicated patrol unit');
    insertPlace.run('City Metro Police Assistance Booth', 'police', 'Gate 2, Metro Station Interchange', '112', 28.6210, 77.2150, 1, 1, 'Manned 24/7 security booth with direct CCTV link');
    insertPlace.run('Apollo 24/7 Emergency Care & Hospital', 'hospital', 'Ring Road, Sector 4', '011-26925858', 28.6180, 77.2020, 1, 1, 'Round-the-clock emergency room, security guard on gate');
    insertPlace.run('Sanjeevani All-Night Chemist & Clinic', 'pharmacy', 'Shop 12, Main Market', '+91 98111 22334', 28.6110, 77.2130, 1, 1, 'Well-lit 24/7 pharmacy with CCTV and security');
    insertPlace.run('SafeHaven Women Shelter & Crisis Center', 'shelter', 'Community Center Lane 3', '1091', 28.6095, 77.2050, 1, 1, 'Safe transit room, counselor available 24/7');
  }

  // Check incident reports
  const reportCount = db.prepare('SELECT COUNT(*) as count FROM incident_reports').get().count;
  if (reportCount === 0) {
    const insertReport = db.prepare(`
      INSERT INTO incident_reports (title, category, description, latitude, longitude, address, severity, upvotes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertReport.run('Streetlights broken near park back entrance', 'poor_lighting', 'The entire 200m stretch is pitch black after 7 PM. Avoid walking alone.', 28.6155, 77.2115, 'Green Park West Gate', 'HIGH', 14);
    insertReport.run('Deserted underpass walkway', 'isolated', 'Poorly maintained pedestrian underpass with no security guard or cameras.', 28.6172, 77.2065, 'Outer Ring Underpass', 'MEDIUM', 8);
    insertReport.run('Frequent catcalling near bus stand', 'harassment', 'Group of men loitering near the empty tea stall between 8 PM - 10 PM.', 28.6125, 77.2078, 'Sector 3 Bus Stop', 'HIGH', 23);
  }
}

// Run initialization
initializeDatabase();

module.exports = {
  db,
  DB_PATH
};
