const { db } = require('../db/database');

function triggerSOS(req, res, body) {
  const { latitude, longitude, address, alert_type, battery_level, notes } = body;

  const result = db.prepare(`
    INSERT INTO alerts (latitude, longitude, address, alert_type, battery_level, notes, status)
    VALUES (?, ?, ?, ?, ?, ?, 'ACTIVE')
  `).run(
    latitude || 28.6139,
    longitude || 77.2090,
    address || 'Live GPS Coordinates',
    alert_type || 'SOS',
    battery_level || null,
    notes || 'Emergency button pressed from SafeHer Web App'
  );

  const alert = db.prepare('SELECT * FROM alerts WHERE id = ?').get(result.lastInsertRowid);
  const user = db.prepare('SELECT * FROM users ORDER BY id ASC LIMIT 1').get();
  const contacts = db.prepare('SELECT * FROM contacts').all();

  const mapLink = `https://maps.google.com/?q=${alert.latitude},${alert.longitude}`;
  const baseMessage = user ? user.emergency_message : 'EMERGENCY! I need immediate help. My location: ';
  const fullMessage = `${baseMessage} ${mapLink} (SafeHer Alert ID #${alert.id})`;

  // Generate actionable direct links for WhatsApp and SMS
  const notificationPayloads = contacts.map(c => {
    const cleanPhone = c.phone.replace(/[^0-9]/g, '');
    return {
      contactId: c.id,
      name: c.name,
      phone: c.phone,
      whatsappUrl: `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(fullMessage)}`,
      smsUrl: `sms:${c.phone}?body=${encodeURIComponent(fullMessage)}`,
      notify_whatsapp: c.notify_whatsapp,
      notify_sms: c.notify_sms
    };
  });

  return {
    status: 201,
    body: {
      success: true,
      alert,
      message: 'Emergency SOS activated and recorded to database.',
      emergencyMessage: fullMessage,
      mapLink,
      notifications: notificationPayloads
    }
  };
}

function getActiveSOS(req, res) {
  const activeAlert = db.prepare(`
    SELECT * FROM alerts 
    WHERE status = 'ACTIVE' 
    ORDER BY timestamp DESC 
    LIMIT 1
  `).get();

  return {
    status: 200,
    body: {
      success: true,
      hasActiveAlert: !!activeAlert,
      alert: activeAlert || null
    }
  };
}

function resolveSOS(req, res, body) {
  const { alert_id, resolution_notes } = body;
  
  let targetId = alert_id;
  if (!targetId) {
    const active = db.prepare("SELECT id FROM alerts WHERE status = 'ACTIVE' ORDER BY timestamp DESC LIMIT 1").get();
    if (active) targetId = active.id;
  }

  if (!targetId) {
    return { status: 400, body: { success: false, error: 'No active alert to resolve' } };
  }

  db.prepare(`
    UPDATE alerts 
    SET status = 'RESOLVED', 
        resolved_at = CURRENT_TIMESTAMP, 
        notes = notes || ' | ' || ?
    WHERE id = ?
  `).run(resolution_notes || 'Resolved by user', targetId);

  const updated = db.prepare('SELECT * FROM alerts WHERE id = ?').get(targetId);

  return {
    status: 200,
    body: {
      success: true,
      message: 'Emergency SOS resolved. System returned to standby.',
      alert: updated
    }
  };
}

function getAlertHistory(req, res) {
  const alerts = db.prepare('SELECT * FROM alerts ORDER BY timestamp DESC LIMIT 50').all();
  return { status: 200, body: { success: true, alerts } };
}

module.exports = {
  triggerSOS,
  getActiveSOS,
  resolveSOS,
  getAlertHistory
};
