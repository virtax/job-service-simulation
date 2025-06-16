@echo off
REM Simulate random success/failure
set /a rand=%RANDOM% %% 2
powershell -Command "Start-Sleep -Seconds 2"
exit /b %rand%
