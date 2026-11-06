@echo off
title SafeHer - Frontend React Dev Server
cd /d "%~dp0frontend"
echo ====================================================
echo Starting SafeHer Frontend (React + Vite)...
echo ====================================================
echo.
call npm.cmd run dev
if %errorlevel% neq 0 (
    echo Installing dependencies first...
    call npm.cmd install
    call npm.cmd run dev
)
pause
