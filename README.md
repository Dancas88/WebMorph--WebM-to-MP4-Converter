# WebMorph - WebM to MP4 Converter - Extension for Mozilla Firefox

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Platform](https://img.shields.io/badge/platform-Firefox-orange)

**WebMorph** is a powerful Firefox extension that automatically converts downloaded WebM files to MP4 format using FFmpeg. Say goodbye to compatibility issues and enjoy your videos in a universally supported format.

📦 **[Quick Installation Guide →](INSTALL.md)** | 📖 Full Documentation Below

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

**Firefox** 60 or later - That's it! 🎉

Python and FFmpeg are **NOT required** - the installer will download portable versions automatically.

## Installation

### Quick Start (Windows)

**1. Download WebMorph**

Download the latest release from GitHub or clone the repository:
```bash
git clone https://github.com/yourusername/webmorph.git
```

**⚠️ IMPORTANT:** Extract/clone to a simple path like `C:\WebMorph` (not in Downloads or Program Files)

**2. Run the Installer**

Navigate to the installation folder and run:
```cmd
scripts\INSTALL.bat
```

The installer will automatically:
- ✅ Check for system Python (downloads portable Python 3.11 if not found)
- ✅ Check for system FFmpeg (downloads portable FFmpeg if not found)
- ✅ Configure native messaging host with correct paths
- ✅ Register everything with Firefox
- ✅ Create all required configuration files

**What gets downloaded (only if needed):**
- Portable Python 3.11 (~10 MB) → `runtime/python/`
- Portable FFmpeg (~75 MB) → `runtime/ffmpeg/`
- Configuration files → `native-host/`

💡 **No admin rights required!** Everything is self-contained in the installation folder.

**3. Load Extension in Firefox**

1. Open Firefox and go to `about:debugging`
2. Click **"This Firefox"** in the sidebar
3. Click **"Load Temporary Add-on..."**
4. Browse to `[installation-folder]\extension\`
5. Select `manifest.json`
6. ✅ Done! The WebMorph icon appears in your toolbar

**4. Verify Installation**

Click the WebMorph icon - you should see:
- ✅ **Extension**: Active
- ✅ **Native Host**: Ready
- ✅ **FFmpeg**: Ready

If everything shows "Ready", you're all set!

---

### Important Notes

⚠️ **Must run installer on each PC:**
- The installer creates machine-specific configuration files
- Downloaded files from GitHub **do NOT** include these files
- Simply copying the folder to another PC **won't work**
- Run `scripts\INSTALL.bat` on each machine where you use WebMorph

⚠️ **Installation path matters:**
- ✅ **Good**: `C:\WebMorph`, `C:\Tools\WebMorph`, `D:\Apps\WebMorph`
- ❌ **Bad**: `C:\Users\Name\Downloads\...`, `C:\Program Files\...`
- Use short paths without spaces in folder names
- Avoid the Downloads folder (permission issues)

⚠️ **Don't move the folder after installation:**
- If you need to move it, run the installer again after moving
- The configuration files contain absolute paths

---

### Manual Installation (If You Already Have Python/FFmpeg)

If you prefer using your system Python and FFmpeg:

1. Ensure you have Python 3.8+ and FFmpeg installed
2. Run the installer anyway - it will detect them and skip downloads
3. The installer still needs to create configuration files

---

### Uninstallation

To uninstall WebMorph:

1. Remove the extension from Firefox (`about:addons`)
2. Delete the installation folder
3. (Optional) Clean registry: Delete `HKCU\Software\Mozilla\NativeMessagingHosts\com.fimp4fx.webm_converter`

That's it - no other traces left on your system!

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

### ❌ Native Host Not Connecting

**Symptoms:**
- Popup shows "Native Host: Not Found"
- Extension connects then immediately disconnects
- Firefox console shows "Disconnected from native host"

**Solutions:**

**1. Wrong installation path?**
- ❌ If installed in `Downloads`, `Desktop`, or paths with spaces
- ✅ Move to `C:\WebMorph` or similar simple path
- Run `scripts\INSTALL.bat` again

**2. Forgot to run the installer?**
- Downloaded files don't include configuration
- **You MUST run** `scripts\INSTALL.bat` on THIS computer
- Simply copying the folder from another PC won't work

**3. Moved the folder after installation?**
- Configuration files contain absolute paths
- Run `scripts\INSTALL.bat` again from the new location

**4. Check the log file:**
- Open `native-host\host.log` to see detailed errors
- Common issues: Python module errors, FFmpeg not found

**5. Restart Firefox completely:**
- Close **ALL** Firefox windows (check system tray)
- Reopen Firefox
- Reload the extension from `about:debugging`

**6. Registry issues (advanced):**
- Open Registry Editor (`regedit`)
- Navigate to: `HKEY_CURRENT_USER\Software\Mozilla\NativeMessagingHosts\com.fimp4fx.webm_converter`
- Verify the path points to your `native-host\com.fimp4fx.webm_converter.json`
- If wrong, delete the key and run installer again

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
