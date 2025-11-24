# WebMorph - WebM to MP4 Converter

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Platform](https://img.shields.io/badge/platform-Firefox-orange)

**WebMorph** is a powerful Firefox extension that automatically converts downloaded WebM files to MP4 format using FFmpeg. Say goodbye to compatibility issues and enjoy your videos in a universally supported format.

## Features

✨ **Automatic Conversion** - WebM files are automatically converted to MP4 upon download completion
⚙️ **Customizable Settings** - Control quality, format, notifications, and more
🎨 **Light/Dark Theme** - Respects your system preferences or choose manually
🔔 **Smart Notifications** - Get notified when conversions complete, with clickable links to open folders
📊 **Quality Presets** - Choose between Low, Medium, High, or Custom quality settings
🗑️ **Auto-Cleanup** - Optionally delete original WebM files after successful conversion
📁 **Custom Output Folder** - Save converted files to any location you prefer
🎯 **Badge Indicators** - Visual feedback on extension icon (✓ success, ✗ error, ... converting)

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Settings](#settings)
- [Troubleshooting](#troubleshooting)
- [Development](#development)
- [License](#license)

## Prerequisites

Before installing WebMorph, ensure you have:

- **Firefox** 60 or later
- **Python** 3.8 or later
- **FFmpeg** (for video conversion)

### Installing FFmpeg

**Ubuntu/Debian:**
```bash
sudo apt update && sudo apt install ffmpeg
```

**macOS (Homebrew):**
```bash
brew install ffmpeg
```

**Windows:**
```cmd
winget install ffmpeg
```
Or download from [ffmpeg.org](https://ffmpeg.org/download.html) and add to PATH.

### Verify Installation

```bash
python3 --version  # or python --version on Windows
ffmpeg -version
```

## Installation

### Step 1: Download or Clone Repository

```bash
git clone https://github.com/yourusername/webmorph.git
cd webmorph
```

### Step 2: Run Installation Script

**⚠️ IMPORTANT**: The installer must be run on **each PC** where you want to use WebMorph, as it generates machine-specific configuration files.

**Windows:**
```cmd
scripts\INSTALL.bat
```

The installer will automatically:
1. Check for Python 3.11 (downloads portable version if not found)
2. Check for FFmpeg (downloads portable version if not found)
3. Create native messaging host wrapper with correct paths
4. Generate and register the manifest file with Firefox
5. Configure everything for your specific installation directory

**What gets installed:**
- Portable Python (if needed) → `runtime/python/`
- Portable FFmpeg (if needed) → `runtime/ffmpeg/`
- Native host configuration → `native-host/`

**No system-wide changes** - everything is self-contained in the installation folder!

### Step 3: Load Extension in Firefox

1. Open Firefox and navigate to `about:debugging`
2. Click **"This Firefox"** in the sidebar
3. Click **"Load Temporary Add-on..."**
4. Navigate to the `extension/` folder
5. Select `manifest.json`
6. The extension icon should appear in your toolbar

> **Note:** For permanent installation, you can package the extension (see [Packaging](#packaging) section)

## Configuration

### First Launch

After installation:

1. Click the WebMorph icon in the Firefox toolbar
2. Verify the status indicators:
   - **Extension**: Should show "Active"
   - **Native Host**: Should show "Ready"
   - **FFmpeg**: Should show "Ready"

If any component shows "Not Found":
- Click **"Run Setup"** link in the popup
- Follow the setup instructions
- Restart Firefox if necessary

## Usage

### Automatic Conversion

Once installed and configured, WebMorph works automatically:

1. Download any WebM file from the internet
2. WebMorph detects the download
3. Upon completion, conversion starts automatically
4. You'll receive a notification when done
5. Click the notification to open the folder
6. The original WebM is deleted (if enabled in settings)

### Manual Test

To test the extension manually:

1. Click the WebMorph icon
2. The popup shows current status
3. Click **⚙️ Settings** to configure options

## Settings

Access settings by clicking the **⚙️ Settings** button in the popup.

### Appearance

- **Theme**: Choose between System Default, Light, or Dark theme

### Conversion Settings

- **Enable Auto-Conversion**: Toggle automatic conversion on/off
- **Video Quality**:
  - **Low**: Smaller file size, faster (CRF 28)
  - **Medium**: Balanced quality and size (CRF 23) - Default
  - **High**: Best quality, larger files (CRF 18)
  - **Custom**: Advanced settings with CRF and preset control
- **Output Format**: Choose MP4 (recommended), MKV, or AVI

### File Management

- **Delete Original Files**: Remove WebM files after successful conversion
- **Custom Output Folder**: Specify a different location for converted files

### Notifications

- **Show Notifications**: Display browser notifications for conversion status
- **Show Badge**: Display status indicators on the extension icon

### Advanced

- **FFmpeg Custom Arguments**: Add custom command-line arguments for FFmpeg
- **Reset to Defaults**: Restore all settings to default values

## Troubleshooting

### Native Host Not Connecting

**Symptoms:**
- Popup shows "Native Host: Not Found"
- Extension connects then immediately disconnects
- Conversions don't start

**Solutions:**
1. **Did you run the installer on THIS PC?**
   - The installer must be run on each computer where you use WebMorph
   - Downloaded/cloned files don't include machine-specific configuration
   - Run `scripts\INSTALL.bat` to generate the required files

2. **Re-run the installer:**
   ```cmd
   scripts\INSTALL.bat
   ```

3. **Check the log file:**
   - Open `native-host\host.log` to see detailed error messages
   - This will show if Python is missing modules or FFmpeg failed

4. **Restart Firefox completely:**
   - Close ALL Firefox windows
   - Reopen Firefox and test again

### FFmpeg Not Found

**Symptoms:**
- Popup shows "FFmpeg: Not Found"
- Conversions fail with "FFmpeg not available" error

**Solutions:**
1. Verify FFmpeg installation:
   ```bash
   ffmpeg -version
   ```
2. Add FFmpeg to system PATH
3. On Windows, edit `host_wrapper.bat` to include FFmpeg path

### Conversion Fails

**Symptoms:**
- Notification shows "Conversion Failed"
- Badge shows ✗

**Solutions:**
1. Check file permissions (read/write access)
2. Verify disk space is available
3. Check FFmpeg logs in native host
4. Try with a different WebM file

### Windows-Specific Issues

**Issue:** "Permission denied" or "Access denied"
- Run setup.bat as Administrator
- Check antivirus isn't blocking Python/FFmpeg

**Issue:** Native host disconnects immediately
- Verify `host_wrapper.bat` has correct Python path
- Check FFmpeg is in PATH or wrapper includes it

## Project Structure

```
webmorph/
├── extension/
│   ├── manifest.json          # Extension manifest
│   ├── background.js          # Core logic and native messaging
│   ├── popup/
│   │   ├── popup-simple.html  # User-friendly popup UI
│   │   ├── popup-simple.js    # Popup logic
│   │   ├── popup.html         # Developer popup (legacy)
│   │   └── popup.js           # Developer popup logic (legacy)
│   ├── options/
│   │   ├── options.html       # Settings page
│   │   └── options.js         # Settings logic
│   └── icons/
│       ├── icon-48.png        # Extension icon 48x48
│       └── icon-96.png        # Extension icon 96x96
├── native-host/
│   ├── host.py                # Python native messaging host
│   ├── host_wrapper.bat       # Windows wrapper script
│   └── com.fimp4fx.webm_converter.json  # Native messaging manifest
├── setup.sh                   # Linux/macOS setup script
├── setup.bat                  # Windows setup script
├── setup-manual.bat           # Windows manual setup (simpler)
├── README.md                  # This file
└── roadmap.md                 # Development roadmap
```

## Development

### Architecture

WebMorph consists of three main components:

1. **Firefox Extension** (JavaScript)
   - Monitors downloads via `browser.downloads` API
   - Communicates with native host via `browser.runtime.connectNative()`
   - Manages UI, notifications, and storage

2. **Native Messaging Host** (Python)
   - Receives conversion requests via stdin (JSON)
   - Executes FFmpeg with appropriate parameters
   - Returns results via stdout (JSON)

3. **FFmpeg** (External Binary)
   - Performs actual video conversion
   - Supports multiple formats and quality settings

### Message Protocol

Extension → Native Host:
```json
{
  "action": "convert",
  "input_path": "/path/to/video.webm",
  "output_path": "/path/to/output.mp4",
  "crf": 23,
  "preset": "medium",
  "output_format": "mp4",
  "delete_original": true
}
```

Native Host → Extension:
```json
{
  "action": "convert_result",
  "success": true,
  "input_path": "/path/to/video.webm",
  "output_path": "/path/to/video.mp4",
  "deleted_original": true
}
```

### Packaging

To create a distributable `.xpi` package:

1. Remove temporary/dev files from `extension/` folder
2. Update version in `manifest.json`
3. Create package:
   ```bash
   cd extension
   zip -r ../webmorph-1.0.0.xpi *
   ```
4. Sign the package at [addons.mozilla.org](https://addons.mozilla.org)

### Testing

Manual testing checklist:
- [ ] Extension loads without errors
- [ ] Native host connects successfully
- [ ] FFmpeg is detected
- [ ] Download detection works
- [ ] Automatic conversion completes
- [ ] Original file is deleted (if enabled)
- [ ] Notifications appear and are clickable
- [ ] Settings page opens and saves preferences
- [ ] Theme switching works
- [ ] Quality presets produce expected results

## Changelog

### Version 1.0.0 (2025-01-14)

**Phase 1: Proof of Concept** ✅
- ✅ Native messaging host (Python + FFmpeg)
- ✅ Firefox extension with manual conversion
- ✅ Basic UI with status indicators
- ✅ Cross-platform setup scripts

**Phase 2: Automatic Download Interception** ✅
- ✅ Automatic WebM detection on download
- ✅ Conversion triggers on download completion
- ✅ Original file deletion after success
- ✅ Browser notifications with clickable folder links
- ✅ Badge indicators on extension icon
- ✅ Conversion history tracking

**Phase 3: Settings & Polish** ✅
- ✅ Comprehensive settings page
- ✅ Light/Dark theme support
- ✅ Quality presets (Low/Medium/High/Custom)
- ✅ Multiple output formats (MP4/MKV/AVI)
- ✅ Custom output folder selection
- ✅ Toggle auto-conversion on/off
- ✅ Toggle notifications and badge
- ✅ Custom FFmpeg arguments
- ✅ Simplified popup for end users

**Current Version:**
- Renamed project to WebMorph
- Updated all branding and documentation
- Prepared for packaging and distribution

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- FFmpeg team for the amazing video conversion tool
- Mozilla for the excellent WebExtensions API
- The open-source community

## Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/webmorph/issues)
- **Documentation**: [GitHub Wiki](https://github.com/yourusername/webmorph/wiki)
- **Email**: support@webmorph.com

---

**Made with ❤️ by the WebMorph Team**

**Version**: 1.0.0 | **Last Updated**: 2025-01-14
