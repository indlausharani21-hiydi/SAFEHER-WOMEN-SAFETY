@echo off
title SafeHer Platform
echo ====================================================
echo Starting SafeHer Full-Stack System...
echo ====================================================
echo.

cd /d "%~dp0backend"

echo Launching browser...
timeout /t 1 /nobreak >nul
start "" "http://localhost:5000"

echo.
echo SafeHer is running! Keep this window open.
echo.
node src/server.js
pause
