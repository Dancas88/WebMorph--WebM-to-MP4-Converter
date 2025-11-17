# WebMorph - Installation Guide

## Quick Start

### Step 1: Install Native Components

1. Go to the `scripts/` folder
2. Run **INSTALL.bat** (double-click it)
3. Follow the on-screen instructions

The installer will:
- Download Python (if needed)
- Download FFmpeg (if needed)
- Configure native messaging for Firefox

### Step 2: Install Firefox Extension

**Option A: From Firefox Add-ons (Recommended)**
- Visit: https://addons.mozilla.org/firefox/addon/webmorph/
- Click "Add to Firefox"

**Option B: Load Manually (Development)**
1. Open Firefox
2. Go to: `about:debugging#/runtime/this-firefox`
3. Click "Load Temporary Add-on"
4. Select: `extension/manifest.json`

**Note:** Manual installation is temporary and removed when Firefox restarts.

### Step 3: Test

1. Download any .webm file
2. WebMorph automatically converts it to .mp4!

---

## Full Documentation

See [README.md](README.md) for complete documentation.

## Troubleshooting

### Extension shows "Native Host: Not Found"
1. Make sure you ran `scripts/INSTALL.bat`
2. Restart Firefox completely
3. Re-run INSTALL.bat if needed

### FFmpeg shows "Not Found"
1. Re-run `scripts/INSTALL.bat`
2. Check antivirus settings

---

**Enjoy automatic WebM to MP4 conversion!** ðŸŽ‰
