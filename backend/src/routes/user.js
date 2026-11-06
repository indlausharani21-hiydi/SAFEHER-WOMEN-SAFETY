const { db } = require('../db/database');

function getUser(req, res) {
  const user = db.prepare('SELECT * FROM users ORDER BY id ASC LIMIT 1').get();
  return { status: 200, body: { success: true, user } };
}

function updateUser(req, res, body) {
  const { name, phone, blood_group, medical_notes, emergency_message } = body;
  
  const existing = db.prepare('SELECT id FROM users ORDER BY id ASC LIMIT 1').get();
  if (existing) {
    db.prepare(`
      UPDATE users 
      SET name = COALESCE(?, name),
          phone = COALESCE(?, phone),
          blood_group = COALESCE(?, blood_group),
          medical_notes = COALESCE(?, medical_notes),
          emergency_message = COALESCE(?, emergency_message)
      WHERE id = ?
    `).run(name, phone, blood_group, medical_notes, emergency_message, existing.id);
  } else {
    db.prepare(`
      INSERT INTO users (name, phone, blood_group, medical_notes, emergency_message)
      VALUES (?, ?, ?, ?, ?)
    `).run(name, phone, blood_group, medical_notes, emergency_message);
  }

  const updated = db.prepare('SELECT * FROM users ORDER BY id ASC LIMIT 1').get();
  return { status: 200, body: { success: true, user: updated } };
}

module.exports = {
  getUser,
  updateUser
};
