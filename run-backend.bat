@echo off
title SafeHer - Backend & Web Server
cd /d "%~dp0backend"
echo ====================================================
echo Starting SafeHer Server at http://localhost:5000
echo ====================================================
echo.
start "" "http://localhost:5000"
node src/server.js
pause
