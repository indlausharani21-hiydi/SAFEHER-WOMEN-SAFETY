@echo off
title SafeHer - Women Safety Platform
echo ====================================================
echo Starting SafeHer Full-Stack Application...
echo ====================================================
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found in current PATH.
    echo Trying default installation path...
    if exist "C:\Program Files\nodejs\node.exe" (
        "C:\Program Files\nodejs\node.exe" backend\src\server.js
        goto end
    ) else (
        echo Please ensure Node.js is installed.
        pause
        exit /b 1
    )
)

node backend\src\server.js

:end
pause
