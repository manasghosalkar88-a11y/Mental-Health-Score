@echo off
title MindScope AI - Frontend (Port 5173)
cd /d "%~dp0\frontend"
echo ========================================================
echo   Starting MindScope AI Frontend on Port 5173
echo ========================================================
npm run dev
if errorlevel 1 (
    echo.
    echo Frontend encountered an error.
    pause
)
