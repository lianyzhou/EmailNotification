call taskkill /F /FI "WINDOWTITLE eq ApEmailer" /T
call npm install
call node "%~dp0\main"
pause