@echo off
title SafeHer - Backend API Server
cd /d "%~dp0backend"
echo ====================================================
echo Starting SafeHer Backend Server...
echo ====================================================
echo.
node src/server.js
pause
