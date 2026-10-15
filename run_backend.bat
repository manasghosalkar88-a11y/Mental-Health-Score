@echo off
title MindScope AI - FastAPI Backend (Port 2200)
cd /d "%~dp0"
echo ========================================================
echo   Starting MindScope AI Backend on Port 2200
echo ========================================================
python main.py
if errorlevel 1 (
    echo.
    echo Backend encountered an error.
    pause
)
