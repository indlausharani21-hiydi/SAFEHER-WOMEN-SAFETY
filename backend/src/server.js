/**
 * SafeHer Full-Stack Server
 * Zero external dependencies: Uses Node.js native http, fs, path, and node:sqlite.
 */
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

// Database initialization
require('./db/database');

// Route controllers
const userController = require('./routes/user');
const contactsController = require('./routes/contacts');
const alertsController = require('./routes/alerts');
const placesController = require('./routes/places');
const reportsController = require('./routes/reports');

const PORT = process.env.PORT || 5000;
const FRONTEND_DIR = path.resolve(__dirname, '../../frontend');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg'
};

function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        resolve({});
      }
    });
  });
}

function sendResponse(res, status, data, contentType = 'application/json') {
  res.writeHead(status, {
    'Content-Type': contentType,
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  if (contentType === 'application/json') {
    res.end(JSON.stringify(data));
  } else {
    res.end(data);
  }
}

function serveStaticFile(res, filePath) {
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback to index.html for SPA
      const indexPath = path.join(FRONTEND_DIR, 'index.html');
      fs.readFile(indexPath, (readErr, content) => {
        if (readErr) {
          sendResponse(res, 404, { error: 'Not found' });
        } else {
          sendResponse(res, 200, content, 'text/html; charset=utf-8');
        }
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        sendResponse(res, 500, { error: 'Failed to read file' });
      } else {
        sendResponse(res, 200, content, contentType);
      }
    });
  });
}

const server = http.createServer(async (req, res) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;
  const searchParams = parsedUrl.searchParams;

  // API Routing
  if (pathname.startsWith('/api')) {
    try {
      // System health check
      if (pathname === '/api/health' && req.method === 'GET') {
        return sendResponse(res, 200, { status: 'healthy', timestamp: new Date().toISOString() });
      }

      // User Profile
      if (pathname === '/api/user') {
        if (req.method === 'GET') {
          const result = userController.getUser(req, res);
          return sendResponse(res, result.status, result.body);
        }
        if (req.method === 'PUT') {
          const body = await parseBody(req);
          const result = userController.updateUser(req, res, body);
          return sendResponse(res, result.status, result.body);
        }
      }

      // Contacts
      if (pathname === '/api/contacts') {
        if (req.method === 'GET') {
          const result = contactsController.getContacts(req, res);
          return sendResponse(res, result.status, result.body);
        }
        if (req.method === 'POST') {
          const body = await parseBody(req);
          const result = contactsController.addContact(req, res, body);
          return sendResponse(res, result.status, result.body);
        }
      }

      // Contact sub-routes (delete, primary)
      const contactMatch = pathname.match(/^\/api\/contacts\/(\d+)$/);
      if (contactMatch && req.method === 'DELETE') {
        const result = contactsController.deleteContact(req, res, { id: contactMatch[1] });
        return sendResponse(res, result.status, result.body);
      }

      const primaryMatch = pathname.match(/^\/api\/contacts\/(\d+)\/primary$/);
      if (primaryMatch && req.method === 'PUT') {
        const result = contactsController.setPrimaryContact(req, res, { id: primaryMatch[1] });
        return sendResponse(res, result.status, result.body);
      }

      // Emergency SOS
      if (pathname === '/api/sos') {
        if (req.method === 'POST') {
          const body = await parseBody(req);
          const result = alertsController.triggerSOS(req, res, body);
          return sendResponse(res, result.status, result.body);
        }
      }

      if (pathname === '/api/sos/active' && req.method === 'GET') {
        const result = alertsController.getActiveSOS(req, res);
        return sendResponse(res, result.status, result.body);
      }

      if (pathname === '/api/sos/resolve' && req.method === 'POST') {
        const body = await parseBody(req);
        const result = alertsController.resolveSOS(req, res, body);
        return sendResponse(res, result.status, result.body);
      }

      if (pathname === '/api/sos/history' && req.method === 'GET') {
        const result = alertsController.getAlertHistory(req, res);
        return sendResponse(res, result.status, result.body);
      }

      // Safe places
      if (pathname === '/api/places') {
        if (req.method === 'GET') {
          const result = placesController.getSafePlaces(req, res, searchParams);
          return sendResponse(res, result.status, result.body);
        }
        if (req.method === 'POST') {
          const body = await parseBody(req);
          const result = placesController.addSafePlace(req, res, body);
          return sendResponse(res, result.status, result.body);
        }
      }

      // Incident reports
      if (pathname === '/api/reports') {
        if (req.method === 'GET') {
          const result = reportsController.getIncidentReports(req, res, searchParams);
          return sendResponse(res, result.status, result.body);
        }
        if (req.method === 'POST') {
          const body = await parseBody(req);
          const result = reportsController.addIncidentReport(req, res, body);
          return sendResponse(res, result.status, result.body);
        }
      }

      const upvoteMatch = pathname.match(/^\/api\/reports\/(\d+)\/upvote$/);
      if (upvoteMatch && req.method === 'POST') {
        const result = reportsController.upvoteIncidentReport(req, res, { id: upvoteMatch[1] });
        return sendResponse(res, result.status, result.body);
      }

      return sendResponse(res, 404, { error: 'API endpoint not found' });
    } catch (err) {
      console.error('API Error:', err);
      return sendResponse(res, 500, { error: 'Internal Server Error', message: err.message });
    }
  }

  // Static files serving from frontend directory
  let safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '\\') {
    safePath = '/index.html';
  }
  const filePath = path.join(FRONTEND_DIR, safePath);
  serveStaticFile(res, filePath);
});

server.listen(PORT, () => {
  console.log(`
=====================================================
🛡️  SafeHer - Women Safety & Emergency Support System
=====================================================
📡 Backend Server running on: http://localhost:${PORT}
💾 SQLite Database: Persistent at ./data/safeher.sqlite
🚀 Frontend Web Application: http://localhost:${PORT}
=====================================================
  `);
});

module.exports = server;
