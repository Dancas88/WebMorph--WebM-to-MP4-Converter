# WebMorph Native Host Installer
# Installs Python, FFmpeg, and configures native messaging for Firefox

$ErrorActionPreference = "Stop"

# Get the script's directory and project root
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Determine project root (parent of scripts folder)
if ((Split-Path -Leaf $scriptDir) -eq "scripts") {
    $projectRoot = Split-Path -Parent $scriptDir
} else {
    $projectRoot = $scriptDir
}

# Configuration
$pythonDir = Join-Path $projectRoot "runtime\python"
$ffmpegDir = Join-Path $projectRoot "runtime\ffmpeg"
$nativeHostDir = Join-Path $projectRoot "native-host"
$hostScript = Join-Path $nativeHostDir "host.py"
$hostManifest = Join-Path $nativeHostDir "com.fimp4fx.webm_converter.json"
$wrapperScript = Join-Path $nativeHostDir "host_wrapper.bat"

# Helper function to write colored output
function Write-Color {
    param(
        [string]$Text,
        [string]$Color = "White"
    )
    Write-Host $Text -ForegroundColor $Color
}

# Helper function to download files with progress
function Download-File {
    param(
        [string]$Url,
        [string]$Output
    )

    try {
        Write-Color "  Starting download..." "Yellow"
        Write-Color "  URL: $Url" "Gray"

        # Use BitsTransfer if available (shows better progress)
        if (Get-Command Start-BitsTransfer -ErrorAction SilentlyContinue) {
            Write-Color "  Using BITS transfer (with progress)..." "Gray"
            Start-BitsTransfer -Source $Url -Destination $Output -DisplayName "Downloading file" -Description "Please wait..."

            if (Test-Path $Output) {
                $downloadedSize = [math]::Round((Get-Item $Output).Length / 1MB, 2)
                Write-Color "  [OK] Download completed ($downloadedSize MB)" "Green"
                return $true
            } else {
                throw "Downloaded file not found"
            }
        } else {
            # Fallback to WebClient with simple progress
            Write-Color "  Downloading (please wait, this may take several minutes)..." "Gray"

            $webClient = New-Object System.Net.WebClient
            $webClient.DownloadFile($Url, $Output)
            $webClient.Dispose()

            if (Test-Path $Output) {
                $downloadedSize = [math]::Round((Get-Item $Output).Length / 1MB, 2)
                Write-Color "  [OK] Download completed ($downloadedSize MB)" "Green"
                return $true
            } else {
                throw "Downloaded file not found"
            }
        }

    } catch {
        Write-Color "  [ERROR] Download failed: $_" "Red"
        if (Test-Path $Output) {
            Remove-Item $Output -Force -ErrorAction SilentlyContinue
        }
        return $false
    }
}

# Title
Clear-Host
Write-Color "============================================" "Cyan"
Write-Color "   WebMorph Native Host Installer          " "Cyan"
Write-Color "   WebM to MP4 Automatic Converter          " "Cyan"
Write-Color "============================================" "Cyan"
Write-Host ""
Write-Color "This installer will set up:" "Yellow"
Write-Color "  - Python 3.11 (if needed)" "White"
Write-Color "  - FFmpeg (if needed)" "White"
Write-Color "  - Native messaging host for Firefox" "White"
Write-Host ""
Write-Color "Installation directory: $projectRoot" "Gray"
Write-Host ""

# Ask for confirmation
$confirm = Read-Host "Continue with installation? (Y/N)"
if ($confirm -ne "Y" -and $confirm -ne "y") {
    Write-Color "Installation cancelled." "Yellow"
    exit 0
}

Write-Host ""
Write-Color "Starting installation..." "Green"
Write-Host ""

# ============================================
# Step 1: Check/Install Python
# ============================================
Write-Color "[1/5] Checking Python..." "Cyan"

$pythonExe = ""
$pythonFound = $false

# Check system Python
$systemPython = Get-Command python -ErrorAction SilentlyContinue
if ($systemPython) {
    $version = & python --version 2>&1
    if ($version -match "Python 3") {
        Write-Color "  [OK] Found system Python: $version" "Green"
        $pythonExe = $systemPython.Source
        $pythonFound = $true
    }
}

# Download portable Python if not found
if (-not $pythonFound) {
    Write-Color "  Python not found. Downloading portable Python..." "Yellow"

    if (-not (Test-Path $pythonDir)) {
        New-Item -ItemType Directory -Path $pythonDir -Force | Out-Null
    }

    $pythonZip = Join-Path $pythonDir "python-3.11.7-embed-amd64.zip"
    $pythonUrl = "https://www.python.org/ftp/python/3.11.7/python-3.11.7-embed-amd64.zip"

    if (Download-File -Url $pythonUrl -Output $pythonZip) {
        Write-Color "  Extracting Python..." "Yellow"
        Write-Progress -Activity "Installing Python" -Status "Extracting..." -PercentComplete 0
        Expand-Archive -Path $pythonZip -DestinationPath $pythonDir -Force
        Write-Progress -Activity "Installing Python" -Status "Cleaning up..." -PercentComplete 80
        Remove-Item $pythonZip
        Write-Progress -Activity "Installing Python" -Completed

        $pythonExe = Join-Path $pythonDir "python.exe"

        if (Test-Path $pythonExe) {
            Write-Color "  [OK] Python installed successfully to: $pythonDir" "Green"
            $pythonFound = $true
        } else {
            Write-Color "  [ERROR] Python installation failed - executable not found" "Red"
            exit 1
        }
    } else {
        Write-Color "  [ERROR] Failed to download Python" "Red"
        exit 1
    }
}

Write-Color "  Python executable: $pythonExe" "Gray"

# ============================================
# Step 2: Check/Install FFmpeg
# ============================================
Write-Host ""
Write-Color "[2/5] Checking FFmpeg..." "Cyan"

$ffmpegExe = ""
$ffmpegFound = $false

# Check system FFmpeg
$systemFFmpeg = Get-Command ffmpeg -ErrorAction SilentlyContinue
if ($systemFFmpeg) {
    $version = & ffmpeg -version 2>&1 | Select-Object -First 1
    Write-Color "  [OK] Found system FFmpeg: $version" "Green"
    $ffmpegExe = $systemFFmpeg.Source
    $ffmpegFound = $true
}

# Download portable FFmpeg if not found
if (-not $ffmpegFound) {
    Write-Color "  FFmpeg not found. Downloading portable FFmpeg..." "Yellow"

    if (-not (Test-Path $ffmpegDir)) {
        New-Item -ItemType Directory -Path $ffmpegDir -Force | Out-Null
    }

    $ffmpegZip = Join-Path $ffmpegDir "ffmpeg-release-essentials.zip"
    $ffmpegUrl = "https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip"

    if (Download-File -Url $ffmpegUrl -Output $ffmpegZip) {
        Write-Color "  Extracting FFmpeg archive (this takes 1-2 minutes)..." "Yellow"
        Write-Color "  Please wait, extracting ~100MB archive..." "Gray"

        Write-Progress -Activity "Installing FFmpeg" -Status "Extracting archive..." -PercentComplete 0
        Expand-Archive -Path $ffmpegZip -DestinationPath $ffmpegDir -Force
        Write-Progress -Activity "Installing FFmpeg" -Status "Archive extracted" -PercentComplete 50

        Write-Color "  [OK] Archive extracted" "Green"
        Write-Color "  Locating ffmpeg.exe..." "Yellow"

        # Find ffmpeg.exe in extracted folders
        Write-Progress -Activity "Installing FFmpeg" -Status "Locating ffmpeg.exe..." -PercentComplete 60
        $ffmpegExe = Get-ChildItem -Path $ffmpegDir -Filter "ffmpeg.exe" -Recurse | Select-Object -First 1 -ExpandProperty FullName

        if ($ffmpegExe) {
            Write-Color "  [OK] Found ffmpeg.exe" "Green"
            Write-Color "  Moving binaries to installation directory..." "Yellow"

            # Move ffmpeg binaries to ffmpegDir root
            Write-Progress -Activity "Installing FFmpeg" -Status "Moving binaries..." -PercentComplete 70
            $binDir = Split-Path -Parent $ffmpegExe
            Get-ChildItem -Path $binDir -Filter "*.exe" | ForEach-Object {
                Move-Item $_.FullName $ffmpegDir -Force
            }

            Write-Color "  Cleaning up temporary files..." "Yellow"
            Write-Progress -Activity "Installing FFmpeg" -Status "Cleaning up..." -PercentComplete 85

            # Clean up extraction folders
            Get-ChildItem -Path $ffmpegDir -Directory | Remove-Item -Recurse -Force
            Remove-Item $ffmpegZip

            Write-Progress -Activity "Installing FFmpeg" -Status "Verifying installation..." -PercentComplete 95

            $ffmpegExe = Join-Path $ffmpegDir "ffmpeg.exe"

            if (Test-Path $ffmpegExe) {
                Write-Progress -Activity "Installing FFmpeg" -Completed
                Write-Color "  [OK] FFmpeg installed successfully to: $ffmpegDir" "Green"
                $ffmpegFound = $true
            } else {
                Write-Progress -Activity "Installing FFmpeg" -Completed
                Write-Color "  [ERROR] FFmpeg installation failed - executable not found" "Red"
                exit 1
            }
        } else {
            Write-Progress -Activity "Installing FFmpeg" -Completed
            Write-Color "  [ERROR] Could not find ffmpeg.exe in archive" "Red"
            Write-Color "  This may indicate a corrupted download or archive format change" "Red"
            exit 1
        }
    } else {
        Write-Color "  [ERROR] Failed to download FFmpeg" "Red"
        exit 1
    }
}

Write-Color "  FFmpeg executable: $ffmpegExe" "Gray"

# ============================================
# Step 3: Create Native Host Wrapper
# ============================================
Write-Host ""
Write-Color "[3/5] Creating native host wrapper..." "Cyan"

# Ensure native-host directory exists
if (-not (Test-Path $nativeHostDir)) {
    Write-Color "  [ERROR] native-host directory not found: $nativeHostDir" "Red"
    exit 1
}

# Create wrapper batch file
$wrapperContent = "@echo off`r`n"
$wrapperContent += "REM WebMorph Native Host Wrapper`r`n"
$wrapperContent += "`r`n"

# Add FFmpeg to PATH if we're using portable version
if (-not $systemFFmpeg) {
    $wrapperContent += "set PATH=$ffmpegDir;%PATH%`r`n"
}

$wrapperContent += "`r`n"
$wrapperContent += "`"$pythonExe`" `"$hostScript`" %*`r`n"

$wrapperContent | Out-File -FilePath $wrapperScript -Encoding ASCII

if (Test-Path $wrapperScript) {
    Write-Color "  [OK] Created host wrapper" "Green"
} else {
    Write-Color "  [ERROR] Failed to create wrapper" "Red"
    exit 1
}

# ============================================
# Step 4: Create/Update Native Host Manifest
# ============================================
Write-Host ""
Write-Color "[4/5] Creating native host manifest..." "Cyan"

# Create manifest JSON
$manifest = @{
    name = "com.fimp4fx.webm_converter"
    description = "Native messaging host for WebM to MP4 converter"
    path = $wrapperScript
    type = "stdio"
    allowed_extensions = @("webmorph@webmorph.com")
}

$manifestJson = $manifest | ConvertTo-Json -Depth 10
$manifestJson | Out-File -FilePath $hostManifest -Encoding UTF8

if (Test-Path $hostManifest) {
    Write-Color "  [OK] Created manifest" "Green"
} else {
    Write-Color "  [ERROR] Failed to create manifest" "Red"
    exit 1
}

# ============================================
# Step 5: Register with Firefox
# ============================================
Write-Host ""
Write-Color "[5/5] Registering with Firefox..." "Cyan"

$regPath = "HKCU:\Software\Mozilla\NativeMessagingHosts\com.fimp4fx.webm_converter"

try {
    # Create registry key
    if (-not (Test-Path $regPath)) {
        New-Item -Path $regPath -Force | Out-Null
    }

    # Set manifest path
    Set-ItemProperty -Path $regPath -Name "(Default)" -Value $hostManifest

    Write-Color "  [OK] Registered with Firefox" "Green"

    # Verify registration
    $registeredPath = (Get-ItemProperty -Path $regPath -Name "(Default)")."(Default)"
    Write-Color "  Manifest location: $registeredPath" "Gray"

} catch {
    Write-Color "  [ERROR] Failed to register with Firefox: $_" "Red"
    exit 1
}

# ============================================
# Installation Complete
# ============================================
Write-Host ""
Write-Color "============================================" "Green"
Write-Color "   Installation Complete!                   " "Green"
Write-Color "============================================" "Green"
Write-Host ""
Write-Color "Summary:" "Yellow"
Write-Color "  [OK] Python:     $pythonExe" "Green"
Write-Color "  [OK] FFmpeg:     $ffmpegExe" "Green"
Write-Color "  [OK] Native Host: Registered" "Green"
Write-Host ""
Write-Color "Next Steps:" "Yellow"
Write-Color "  1. Install the WebMorph extension in Firefox" "White"
Write-Color "  2. The extension will automatically connect to this native host" "White"
Write-Color "  3. Download any .webm file to test automatic conversion!" "White"
Write-Host ""
Write-Color "Important:" "Yellow"
Write-Color "  - Do NOT move or delete this installation folder" "White"
Write-Color "  - If you move it, run this installer again" "White"
Write-Host ""
Write-Color "Troubleshooting:" "Yellow"
Write-Color "  - Check logs in: $nativeHostDir\host.log" "Gray"
Write-Color "  - Restart Firefox completely after installation" "Gray"
Write-Host ""
Write-Color "Installation finished successfully! Press any key to exit..." "Green"
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
