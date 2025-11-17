# WebMorph - WebM to MP4 Converter

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Platform](https://img.shields.io/badge/platform-Firefox-orange)

**WebMorph** is a powerful Firefox extension that automatically converts downloaded WebM files to MP4 format using FFmpeg. Say goodbye to compatibility issues and enjoy your videos in a universally supported format.

## ⚡ Quick Start

WebMorph requires **two simple steps** to install:

### Step 1: Install Firefox Extension (from AMO)

[![Install from Firefox Add-ons](https://img.shields.io/badge/Firefox%20Add--ons-Install-orange?style=for-the-badge&logo=firefox)](https://addons.mozilla.org/firefox/addon/webmorph/)

Click the button above or visit: **https://addons.mozilla.org/firefox/addon/webmorph/**

This installs the browser extension permanently.

### Step 2: Install Native Components (from GitHub)

The extension needs Python and FFmpeg to work. Run our automated installer:

**Windows:**
1. Download this repository (green "Code" button → Download ZIP)
2. Extract the ZIP file
3. Go to the `scripts/` folder
4. Run **`INSTALL.bat`** (double-click)
5. Follow the on-screen instructions

The installer will:
- ✅ Download Python (if needed)
- ✅ Download FFmpeg (if needed)
- ✅ Configure native messaging for Firefox
- ✅ Set up all paths automatically

**That's it!** Restart Firefox and you're ready to go.

---

## Features

✨ **Automatic Conversion** - WebM files are automatically converted to MP4 upon download completion
⚙️ **Customizable Settings** - Control quality, format, notifications, and more
🎨 **Light/Dark Theme** - Respects your system preferences or choose manually
🔔 **Smart Notifications** - Get notified when conversions complete, with clickable links to open folders
📊 **Quality Presets** - Choose between Low, Medium, High, or Custom quality settings
🗑️ **Auto-Cleanup** - Optionally delete original WebM files after successful conversion
📁 **Custom Output Folder** - Save converted files to any location you prefer
🎯 **Badge Indicators** - Visual feedback on extension icon (✓ success, ✗ error, ... converting)

---

## Table of Contents

- [Quick Start](#-quick-start)
- [How It Works](#how-it-works)
- [Usage](#usage)
- [Settings](#settings)
- [Troubleshooting](#troubleshooting)
- [Technical Details](#technical-details)
- [Contributing](#contributing)
- [License](#license)

---

## How It Works

1. **Download any WebM file** from the internet
2. **WebMorph detects** the download automatically
3. **Conversion starts** when download completes
4. **Notification appears** when conversion finishes
5. **Original WebM deleted** (optional, configurable)

All processing happens **locally on your computer** - no data is sent anywhere.

---

## Usage

### First Time Setup Verification

After installing both the extension and native components:

1. Click the **WebMorph icon** in Firefox toolbar
2. Verify all status indicators show **"Ready"**:
   - ✅ Extension: Active
   - ✅ Native Host: Ready
   - ✅ FFmpeg: Ready

If any shows "Not Found", re-run `scripts/INSTALL.bat`

### Converting Videos

**It's automatic!** Just download any `.webm` file and WebMorph handles the rest.

You'll see:
- 🔔 Notification: "WebM Download Detected"
- ⏳ Badge on icon shows "..." (converting)
- 🔔 Notification: "Conversion Completed"
- ✅ Badge shows "✓" for 5 seconds

Click the completion notification to open the folder containing your MP4 file.

---

## Settings

Click the **⚙️ Settings** button in the popup to configure:

### Conversion Settings

- **Enable Auto-Conversion**: Toggle automatic conversion on/off
- **Video Quality**:
  - **Low**: Smaller file size, faster (CRF 28)
  - **Medium**: Balanced quality and size (CRF 23) - *Default*
  - **High**: Best quality, larger files (CRF 18)
  - **Custom**: Advanced settings with CRF and preset control
- **Output Format**: Choose MP4 (recommended), MKV, or AVI

### File Management

- **Delete Original Files**: Remove WebM files after successful conversion
- **Custom Output Folder**: Specify a different location for converted files

### Appearance & Notifications

- **Theme**: System Default, Light, or Dark
- **Show Notifications**: Display browser notifications
- **Show Badge**: Display status on extension icon

### Advanced

- **FFmpeg Custom Arguments**: Add custom command-line arguments
- **Reset to Defaults**: Restore all settings

---

## Troubleshooting

### Extension shows "Native Host: Not Found"

**Solution:**
1. Make sure you ran `scripts/INSTALL.bat`
2. Restart Firefox completely
3. If still not working, re-run `INSTALL.bat`

### Extension shows "FFmpeg: Not Found"

**Solution:**
1. Re-run `scripts/INSTALL.bat`
2. Check if antivirus blocked the download
3. Manually verify FFmpeg is installed

### Conversion Fails

**Check:**
- ✅ Disk space available
- ✅ File isn't locked by another program
- ✅ Antivirus isn't blocking FFmpeg
- ✅ Path doesn't contain special characters

**View Logs:**
- Extension console: `about:debugging` → WebMorph → Inspect → Console
- Native host log: `native-host/host.log`

---

## Technical Details

### Architecture

WebMorph consists of three components:

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

### Project Structure

```
webmorph/
├── extension/               # Firefox extension source
│   ├── manifest.json       # Extension manifest
│   ├── background.js       # Core logic
│   ├── popup/              # Popup UI
│   ├── options/            # Settings page
│   └── icons/              # Extension icons
├── native-host/            # Python native messaging host
│   ├── host.py            # Main native host script
│   └── com.fimp4fx.webm_converter.json
├── scripts/                # Installation scripts
│   ├── INSTALL.bat        # Windows installer
│   └── installer.ps1      # PowerShell installer
├── docs/                   # Documentation
├── README.md              # This file
├── LICENSE                # MIT License
└── CONTRIBUTING.md        # Contribution guidelines
```

---

## Privacy

- ✅ **No data collection** - WebMorph does not collect any personal data
- ✅ **Local processing** - All conversions happen on your computer
- ✅ **No external servers** - No files are uploaded anywhere
- ✅ **Open source** - Full transparency, code available on GitHub

See [PRIVACY-POLICY.md](PRIVACY-POLICY.md) for details.

---

## Requirements

- **Firefox**: Version 79 or later
- **Windows**: 10 or 11 (64-bit)
- **Disk Space**: ~500MB for Python + FFmpeg

**Note:** Currently Windows-only. Linux/macOS support planned for future releases.

---

## Changelog

### Version 1.0.0 (2025-01-17)

**Initial Release:**
- ✅ Automatic WebM to MP4 conversion
- ✅ Native messaging host with Python + FFmpeg
- ✅ Quality presets and customization
- ✅ Smart notifications and badge indicators
- ✅ Comprehensive settings page
- ✅ Light/Dark theme support
- ✅ Published on Firefox Add-ons (AMO)

---

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/webmorph/issues)
- **Documentation**: This README and inline code documentation
- **Firefox Add-ons**: [WebMorph on AMO](https://addons.mozilla.org/firefox/addon/webmorph/)

---

## Acknowledgments

- FFmpeg team for the amazing video conversion tool
- Mozilla for the excellent WebExtensions API and Add-ons platform
- The open-source community

---

**Made with ❤️ for the Firefox community**

**Version**: 1.0.0 | **Platform**: Windows | **License**: MIT
