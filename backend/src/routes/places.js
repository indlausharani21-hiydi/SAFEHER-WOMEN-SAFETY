const { db } = require('../db/database');

// Haversine formula to calculate distance in km
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
}

function getSafePlaces(req, res, query) {
  const category = query.get('category');
  const userLat = parseFloat(query.get('lat'));
  const userLng = parseFloat(query.get('lng'));

  let sql = 'SELECT * FROM safe_places';
  const params = [];

  if (category && category !== 'all') {
    sql += ' WHERE category = ?';
    params.push(category);
  }

  sql += ' ORDER BY is_verified DESC, name ASC';

  let places = db.prepare(sql).all(...params);

  if (!isNaN(userLat) && !isNaN(userLng)) {
    places = places.map(p => ({
      ...p,
      distanceKm: calculateDistance(userLat, userLng, p.latitude, p.longitude)
    })).sort((a, b) => a.distanceKm - b.distanceKm);
  }

  return { status: 200, body: { success: true, count: places.length, places } };
}

function addSafePlace(req, res, body) {
  const { name, category, address, phone, latitude, longitude, open_24_7, notes } = body;
  
  if (!name || !category || !latitude || !longitude) {
    return { status: 400, body: { success: false, error: 'Name, category, latitude and longitude are required' } };
  }

  const result = db.prepare(`
    INSERT INTO safe_places (name, category, address, phone, latitude, longitude, open_24_7, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    name,
    category,
    address || 'Verified community shelter',
    phone || '',
    parseFloat(latitude),
    parseFloat(longitude),
    open_24_7 ? 1 : 0,
    notes || ''
  );

  const place = db.prepare('SELECT * FROM safe_places WHERE id = ?').get(result.lastInsertRowid);
  return { status: 201, body: { success: true, place } };
}

module.exports = {
  getSafePlaces,
  addSafePlace
};
