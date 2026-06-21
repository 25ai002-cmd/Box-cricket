@echo off
title BoxCricket Pro Server Starter
echo ===================================================
echo   🏏 BOXCRICKET PRO SERVER STARTER 🏟️
echo ===================================================
echo.

echo [1/2] Starting Express SQL Backend Server on http://localhost:3001...
start "BoxCricket Pro - Backend" cmd /k "node --env-file=.env server.cjs"
timeout /t 2 >nul

echo [2/2] Starting Vite Frontend Dev Server on http://localhost:5173...
start "BoxCricket Pro - Frontend" cmd /k "npm run dev"
timeout /t 2 >nul

echo.
echo ===================================================
echo  ✅ Both servers have been launched in separate windows!
echo  - Backend log window: "BoxCricket Pro - Backend"
echo  - Frontend log window: "BoxCricket Pro - Frontend"
echo ===================================================
echo.
pause
