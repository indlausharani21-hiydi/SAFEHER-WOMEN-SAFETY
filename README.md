# SafeHer 🛡️

**SafeHer** is a full-stack personal safety and emergency response web application for women's safety.

---

## 📁 Project Structure

The project is structured into three clean, dedicated folders:

```
safeher/
│
├── 📂 backend/                  # Node.js API Server
│   ├── src/
│   │   ├── db/
│   │   │   └── database.js      # Database connection & queries
│   │   ├── routes/
│   │   │   ├── alerts.js        # SOS trigger, active status, resolve
│   │   │   ├── contacts.js      # CRUD emergency contacts
│   │   │   ├── places.js        # Safe havens & distance calculations
│   │   │   ├── reports.js       # Hazard incident reports & upvotes
│   │   │   └── user.js          # Emergency user profile
│   │   └── server.js            # Node HTTP server & static frontend serving
│   └── package.json             # Backend configuration
│
├── 📂 frontend/                 # React.js + Vite Web Application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx       # SafeHer logo, navigation, hotline badge
│   │   │   ├── Hero.jsx         # Hero section ("Your Safety, Our Priority")
│   │   │   ├── EmergencyModal.jsx # Interactive SOS modal with Web Audio siren
│   │   │   ├── Features.jsx     # Safety features grid
│   │   │   ├── AboutUs.jsx      # Mission, values & legal rights
│   │   │   ├── Contact.jsx      # Contact form & national helplines
│   │   │   └── Footer.jsx       # Footer links & copyright
│   │   ├── App.jsx              # Main React application shell
│   │   ├── index.css            # Tailwind directives & custom animations
│   │   └── main.jsx             # React DOM entry point
│   ├── index.html               # Main entry HTML
│   ├── dashboard.html           # Full GPS radar & fake call dashboard
│   ├── vite.config.js           # Vite build & dev server config
│   ├── tailwind.config.js       # Pink, purple, and white color themes
│   ├── postcss.config.js        # PostCSS configuration
│   └── package.json             # Frontend React & Vite dependencies
│
└── 📂 database/                 # Persistent SQLite Database & SQL Scripts
    ├── safeher.sqlite           # Persistent SQLite database file
    ├── schema.sql               # Database table schemas
    └── seed.sql                 # Initial seed data for police, hospitals, contacts
```

---

## 🚀 Running the Project

### 1. Run the Backend Server
```powershell
node backend/src/server.js
```
The backend API and web interface will be live at:
👉 **http://localhost:5000**

### 2. Run the React + Vite Frontend
```powershell
cd frontend
npm install
npm run dev
```
The React development server will start at:
👉 **http://localhost:5173**

---

## 🎨 Color Theme
- **Pink**: `#ec4899`, `#f43f5e`, `#fdf2f8` (Warmth, care, empowerment)
- **Purple**: `#7c3aed`, `#9333ea`, `#faf5ff` (Strength, dignity, trust)
- **White**: `#ffffff` (Clarity, modern glassmorphic contrast)
- **Emergency Red**: `#ef4444`, `#dc2626` (High-priority SOS alarms)
