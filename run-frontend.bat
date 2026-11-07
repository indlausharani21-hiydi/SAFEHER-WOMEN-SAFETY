@echo off
title SafeHer - Frontend React Dev Server
cd /d "%~dp0frontend"
echo ====================================================
echo Starting SafeHer React Dev Server at http://localhost:5173
echo ====================================================
echo.
start "" "http://localhost:5173"
call npm.cmd run dev
pause
