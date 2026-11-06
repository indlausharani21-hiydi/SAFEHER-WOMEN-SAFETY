const { db } = require('../db/database');

function getIncidentReports(req, res, query) {
  const category = query.get('category');
  let sql = 'SELECT * FROM incident_reports';
  const params = [];

  if (category && category !== 'all') {
    sql += ' WHERE category = ?';
    params.push(category);
  }

  sql += ' ORDER BY timestamp DESC LIMIT 100';
  const reports = db.prepare(sql).all(...params);

  return { status: 200, body: { success: true, count: reports.length, reports } };
}

function addIncidentReport(req, res, body) {
  const { title, category, description, latitude, longitude, address, severity } = body;

  if (!title || !category || !latitude || !longitude) {
    return { status: 400, body: { success: false, error: 'Title, category, latitude and longitude are required' } };
  }

  const result = db.prepare(`
    INSERT INTO incident_reports (title, category, description, latitude, longitude, address, severity, upvotes)
    VALUES (?, ?, ?, ?, ?, ?, ?, 1)
  `).run(
    title,
    category,
    description || '',
    parseFloat(latitude),
    parseFloat(longitude),
    address || 'Nearby Reported Area',
    severity || 'MEDIUM'
  );

  const report = db.prepare('SELECT * FROM incident_reports WHERE id = ?').get(result.lastInsertRowid);
  return { status: 201, body: { success: true, report } };
}

function upvoteIncidentReport(req, res, params) {
  const id = parseInt(params.id, 10);
  db.prepare('UPDATE incident_reports SET upvotes = upvotes + 1 WHERE id = ?').run(id);
  const updated = db.prepare('SELECT * FROM incident_reports WHERE id = ?').get(id);

  if (!updated) {
    return { status: 404, body: { success: false, error: 'Report not found' } };
  }

  return { status: 200, body: { success: true, report: updated } };
}

module.exports = {
  getIncidentReports,
  addIncidentReport,
  upvoteIncidentReport
};
