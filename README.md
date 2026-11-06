# SafeHer 🛡️

**SafeHer** is a production-grade, full-stack personal safety and emergency response web application designed for women's safety. Built with a high-performance **Node.js** backend, **SQLite** persistent database, and a responsive **Tailwind CSS + Leaflet.js** frontend.

---

## 🌟 Key Features

### 1. 🚨 Instant Emergency SOS System
- **Pulsating SOS Button** with 3-second abort countdown option to prevent accidental false alarms.
- **Instant SOS** & **Silent SOS** mode (discreet distress beacon).
- Real-time **GPS coordinates capture** (`navigator.geolocation`).
- Pre-compiles direct **WhatsApp** and **SMS** distress links with exact Google Maps coordinates (`https://maps.google.com/?q=lat,lng`) for registered emergency guardians.
- Active SOS state persistence with resolve/cancel confirmation.

### 2. 📢 Web Audio Emergency Siren
- 100% offline-ready police/distress wailing siren synthesized using the browser's native **HTML5 Web Audio API** (no external audio files or mp3s needed).
- High-visibility visual red/blue strobe alert.

### 3. 📱 Realistic Fake Call Simulator (Escape Tool)
- Realistic simulated incoming phone call screen (custom caller name, avatar, and telephone dual-tone ring synthesized in real-time).
- Answer/Decline controls.
- Active call duration timer with simulated conversational murmur so you can excuse yourself from unsafe situations.
- Schedule call feature (instant, 10s, 30s, 60s delay).

### 4. 🕶️ Stealth / Panic Disguise Mode
- One-click stealth switch: Immediately transforms the entire screen into a harmless **functional calculator** to hide the app if someone approaches.

### 5. 🗺️ Live Safety Map & Radar (Leaflet.js)
- Real-time GPS user tracking with pulsing radar beacon.
- Verified Safe Haven pins:
  - 👮 Police Stations & 24/7 Women Helpdesks
  - 🏥 Round-the-clock Emergency Hospitals
  - 💊 24/7 All-night Pharmacies
  - 🏠 Crisis Shelters
- **"Find Nearest Safe Haven"**: Automatically calculates Haversine distance and pans to the closest sanctuary.
- Community hazard pins: broken streetlights, deserted stretches, harassment alerts.

### 6. 👥 Emergency Guardians Network
- Manage trusted emergency contacts with tags (Mom, Sister, Best Friend, Partner).
- Assign primary emergency contact.
- One-tap WhatsApp & SMS broadcast.

### 7. ⚠️ Community Safety Reporter
- Crowdsourced hazard reporting with severity tags and community upvotes.

### 8. 📖 Legal Rights & Self-Defense Guide
- Instant reference for Zero FIR, sunset arrest protections, free medical/legal aid, and direct emergency dialers (112, 1091, 108, 1930).

---

## 📁 Project Architecture

```
safeher/
├── backend/
│   ├── src/
│   │   ├── db/
│   │   │   └── database.js      # Persistent SQLite setup & auto-seeding
│   │   ├── routes/
│   │   │   ├── alerts.js        # SOS trigger, active status, resolve, history
│   │   │   ├── contacts.js      # CRUD for emergency contacts
│   │   │   ├── places.js        # Safe havens with Haversine distance calculation
│   │   │   ├── reports.js       # Hazard reports and community upvotes
│   │   │   └── user.js          # User emergency profile
│   │   └── server.js            # Node HTTP server, CORS & static file server
├── frontend/
│   ├── css/
│   │   └── style.css            # Radar pulse, strobe siren, custom styles
│   ├── js/
│   │   ├── api.js               # Centralized REST API client
│   │   ├── audio.js             # Web Audio API synthesizer (siren, ring, voice)
│   │   ├── fakecall.js          # Interactive fake call simulator
│   │   ├── map.js               # Leaflet map, GPS tracking & haven markers
│   │   └── app.js               # Main UI controller & lifecycle
│   └── index.html               # Semantic, mobile-first responsive web app
├── data/
│   └── safeher.sqlite           # Persistent SQLite database file
├── package.json
├── start.bat                    # One-click Windows launcher
└── README.md
```

---

## 🚀 Quick Start Guide

### Option 1: Direct Node Execution (Instant, Zero Setup)
SafeHer uses Node.js standard libraries and built-in SQLite (`node:sqlite`). No heavy downloads required.

```powershell
# In the safeher folder:
node backend/src/server.js
```
*(Or double-click `start.bat` on Windows)*

### Option 2: Using npm
```bash
npm start
```

Open your browser at:
👉 **`http://localhost:5000`**

---

## 🔌 REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Server health check |
| `GET` | `/api/user` | Fetch current user emergency profile |
| `PUT` | `/api/user` | Update emergency profile & custom SOS text |
| `GET` | `/api/contacts` | List all emergency contacts |
| `POST` | `/api/contacts` | Add a new emergency contact |
| `DELETE` | `/api/contacts/:id` | Delete an emergency contact |
| `PUT` | `/api/contacts/:id/primary` | Set primary emergency contact |
| `POST` | `/api/sos` | Trigger emergency SOS & generate WhatsApp/SMS alerts |
| `GET` | `/api/sos/active` | Check active SOS status |
| `POST` | `/api/sos/resolve` | Resolve/cancel active SOS alert |
| `GET` | `/api/sos/history` | Retrieve past emergency alerts history |
| `GET` | `/api/places?category=&lat=&lng=` | Safe havens sorted by distance |
| `POST` | `/api/places` | Add verified safe haven |
| `GET` | `/api/reports?category=` | Get community hazard reports |
| `POST` | `/api/reports` | Submit safety hazard report |
| `POST` | `/api/reports/:id/upvote` | Upvote/confirm a hazard report |

---

## 🛡️ Database Schema (SQLite)

- **`users`**: `id`, `name`, `phone`, `blood_group`, `medical_notes`, `emergency_message`, `created_at`
- **`contacts`**: `id`, `name`, `phone`, `relationship`, `is_primary`, `notify_sms`, `notify_whatsapp`, `created_at`
- **`alerts`**: `id`, `timestamp`, `latitude`, `longitude`, `address`, `status`, `alert_type`, `battery_level`, `notes`, `resolved_at`
- **`safe_places`**: `id`, `name`, `category`, `address`, `phone`, `latitude`, `longitude`, `is_verified`, `open_24_7`, `notes`
- **`incident_reports`**: `id`, `title`, `category`, `description`, `latitude`, `longitude`, `address`, `severity`, `upvotes`, `timestamp`

---

## 💡 Designed For
- Women commuting late at night
- College students and solo travelers
- Anyone in an unsafe or uncomfortable situation requiring quick, discreet action
