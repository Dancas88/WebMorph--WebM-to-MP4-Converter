# Native Messaging Host

This directory contains the Python-based native messaging host that enables communication between the Firefox extension and FFmpeg.

## Files

- **host.py** - Main Python script that handles native messaging
- **host_wrapper.bat** - Generated during installation (Windows only)
- **com.fimp4fx.webm_converter.json** - Generated during installation (manifest file)

## Important Notes

⚠️ **DO NOT manually edit or commit the following files:**
- `host_wrapper.bat`
- `com.fimp4fx.webm_converter.json`

These files are automatically generated during installation with paths specific to your system.

## Installation

Run the installer to generate these files:

**Windows:**
```cmd
scripts\INSTALL.bat
```

The installer will:
1. Download Python (if not installed)
2. Download FFmpeg (if not installed)
3. Generate `host_wrapper.bat` with correct paths
4. Generate `com.fimp4fx.webm_converter.json` manifest
5. Register the native host with Firefox

## How It Works

1. Firefox extension sends messages to the native host via `browser.runtime.connectNative()`
2. `host_wrapper.bat` is called by Firefox (registered in Windows Registry)
3. The wrapper launches `host.py` with the correct Python interpreter
4. `host.py` reads messages from stdin, processes them, and sends responses to stdout
5. FFmpeg is called by Python to perform video conversion

## Logging

Logs are written to `host.log` in this directory. Check this file if you encounter issues.
