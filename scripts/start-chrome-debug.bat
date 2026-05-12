@echo off
REM Start Chrome with remote debugging for Chrome DevTools MCP
REM Run this script first, then restart Claude Code to connect via MCP

set CHROME_PATH=C:\Program Files\Google\Chrome\Application\chrome.exe
if not exist "%CHROME_PATH%" set CHROME_PATH=C:\Program Files (x86)\Google\Chrome\Application\chrome.exe

echo Starting Chrome with remote debugging on port 9222...
echo.
echo After Chrome opens, go to:
echo   1. Log in at: https://demo.smartbi.com.cn
echo   2. Then open Claude Code and MCP will auto-connect
echo.

start "" "%CHROME_PATH%" ^
  --remote-debugging-port=9222 ^
  --user-data-dir="%TEMP%\chrome-devtools-mcp-profile" ^
  https://demo.smartbi.com.cn/smartbi/smartbix/?debug=true^&integrated=true^&showheader=false^&commandid=1923f822-0747-6dad-d91c-2b1f6e856894^&nodeid=I8a8082d2019757be57bef9dc019766e069421270^&isNewWindows=true^&l=zh_CN

echo.
echo Chrome started. Verify with: curl http://127.0.0.1:9222/json/version
