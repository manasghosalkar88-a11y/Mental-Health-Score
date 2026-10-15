@echo off
title MindScope AI Launcher
cd /d "%~dp0"
echo ========================================================
echo   Launching MindScope AI (Backend + Frontend)
echo ========================================================
start "MindScope Backend (Port 2200)" "%~dp0run_backend.bat"
start "MindScope Frontend (Port 5173)" "%~dp0run_frontend.bat"
timeout /t 4 /nobreak >nul
start http://localhost:5173
echo.
echo Both servers have been launched in separate windows!
echo Frontend: http://localhost:5173
echo Backend:  http://127.0.0.1:2200
echo.
