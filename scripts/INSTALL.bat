@echo off
REM WebMorph Installer Launcher
REM This launches the PowerShell installer with proper permissions

title WebMorph Installer

echo ============================================
echo    WebMorph Native Host Installer
echo ============================================
echo.
echo This will install the native components for
echo the WebMorph Firefox extension.
echo.
echo Press any key to start installation...
pause >nul

REM Launch PowerShell installer
powershell.exe -ExecutionPolicy Bypass -File "%~dp0installer.ps1"

REM Check if PowerShell exited successfully
if %ERRORLEVEL% EQU 0 (
    echo.
    echo Installation completed!
) else (
    echo.
    echo Installation failed with error code: %ERRORLEVEL%
    echo Please check the error messages above.
    echo.
    pause
)
