const { db } = require('../db/database');

function getContacts(req, res) {
  const contacts = db.prepare('SELECT * FROM contacts ORDER BY is_primary DESC, id ASC').all();
  return { status: 200, body: { success: true, contacts } };
}

function addContact(req, res, body) {
  const { name, phone, relationship, is_primary, notify_sms, notify_whatsapp } = body;
  if (!name || !phone) {
    return { status: 400, body: { success: false, error: 'Name and phone are required.' } };
  }

  if (is_primary) {
    db.prepare('UPDATE contacts SET is_primary = 0').run();
  }

  const result = db.prepare(`
    INSERT INTO contacts (name, phone, relationship, is_primary, notify_sms, notify_whatsapp)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    name,
    phone,
    relationship || 'Friend',
    is_primary ? 1 : 0,
    notify_sms !== undefined ? (notify_sms ? 1 : 0) : 1,
    notify_whatsapp !== undefined ? (notify_whatsapp ? 1 : 0) : 1
  );

  const contact = db.prepare('SELECT * FROM contacts WHERE id = ?').get(result.lastInsertRowid);
  return { status: 201, body: { success: true, contact } };
}

function deleteContact(req, res, params) {
  const id = parseInt(params.id, 10);
  const result = db.prepare('DELETE FROM contacts WHERE id = ?').run(id);
  if (result.changes === 0) {
    return { status: 404, body: { success: false, error: 'Contact not found' } };
  }
  return { status: 200, body: { success: true, message: 'Contact deleted successfully' } };
}

function setPrimaryContact(req, res, params) {
  const id = parseInt(params.id, 10);
  db.prepare('UPDATE contacts SET is_primary = 0').run();
  const result = db.prepare('UPDATE contacts SET is_primary = 1 WHERE id = ?').run(id);
  
  if (result.changes === 0) {
    return { status: 404, body: { success: false, error: 'Contact not found' } };
  }
  return { status: 200, body: { success: true, message: 'Primary contact updated' } };
}

module.exports = {
  getContacts,
  addContact,
  deleteContact,
  setPrimaryContact
};
