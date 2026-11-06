-- ====================================================
-- SafeHer Seed Data
-- Pre-populates Initial Contacts, Safe Havens & Reports
-- ====================================================

-- Default User Profile
INSERT OR IGNORE INTO users (id, name, phone, blood_group, medical_notes, emergency_message)
VALUES (
  1,
  'Ananya Sharma',
  '+91 98765 43210',
  'O+',
  'Asthma inhaler in backpack',
  'EMERGENCY! I need immediate help. Here is my current real-time GPS location: '
);

-- Default Emergency Guardians
INSERT OR IGNORE INTO contacts (id, name, phone, relationship, is_primary, notify_sms, notify_whatsapp)
VALUES
  (1, 'Mom (Priya Sharma)', '+91 98765 00001', 'Mother', 1, 1, 1),
  (2, 'Aditi (Best Friend)', '+91 98765 00002', 'Friend', 0, 1, 1),
  (3, 'Inspector Vikram (Police Assistance)', '+91 98765 00003', 'Emergency Authority', 0, 1, 0);

-- Verified Safe Havens
INSERT OR IGNORE INTO safe_places (id, name, category, address, phone, latitude, longitude, is_verified, open_24_7, notes)
VALUES
  (1, 'Central Women Special Police Station', 'police', 'Civil Lines, Station Road', '011-23010101', 28.6139, 77.2090, 1, 1, '24x7 Women Help Desk with dedicated patrol unit'),
  (2, 'City Metro Police Assistance Booth', 'police', 'Gate 2, Metro Station Interchange', '112', 28.6210, 77.2150, 1, 1, 'Manned 24/7 security booth with direct CCTV link'),
  (3, 'Apollo 24/7 Emergency Care & Hospital', 'hospital', 'Ring Road, Sector 4', '011-26925858', 28.6180, 77.2020, 1, 1, 'Round-the-clock emergency room, security guard on gate'),
  (4, 'Sanjeevani All-Night Chemist & Clinic', 'pharmacy', 'Shop 12, Main Market', '+91 98111 22334', 28.6110, 77.2130, 1, 1, 'Well-lit 24/7 pharmacy with CCTV and security'),
  (5, 'SafeHaven Women Shelter & Crisis Center', 'shelter', 'Community Center Lane 3', '1091', 28.6095, 77.2050, 1, 1, 'Safe transit room, counselor available 24/7');

-- Community Hazard Flags
INSERT OR IGNORE INTO incident_reports (id, title, category, description, latitude, longitude, address, severity, upvotes)
VALUES
  (1, 'Streetlights broken near park back entrance', 'poor_lighting', 'The entire 200m stretch is pitch black after 7 PM. Avoid walking alone.', 28.6155, 77.2115, 'Green Park West Gate', 'HIGH', 14),
  (2, 'Deserted underpass walkway', 'isolated', 'Poorly maintained pedestrian underpass with no security guard or cameras.', 28.6172, 77.2065, 'Outer Ring Underpass', 'MEDIUM', 8),
  (3, 'Frequent catcalling near bus stand', 'harassment', 'Group of men loitering near the empty tea stall between 8 PM - 10 PM.', 28.6125, 77.2078, 'Sector 3 Bus Stop', 'HIGH', 23);
