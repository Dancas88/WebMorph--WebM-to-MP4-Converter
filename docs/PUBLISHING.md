# WebMorph - Publishing Guide

This document explains how to publish WebMorph for end users.

---

## Publishing Options

### Option 1: Firefox Add-ons (AMO) - **RECOMMENDED**

**Advantages:**
- ✅ One-click installation for users
- ✅ Automatic updates
- ✅ Mozilla signing (trusted by Firefox)
- ✅ Discoverability in add-ons store
- ✅ User reviews and ratings

**Disadvantages:**
- ⏱️ Review process (1-7 days)
- 📋 Must comply with AMO policies
- 🔒 Source code review required

**Process:**

1. **Create Developer Account**
   - Go to: https://addons.mozilla.org/developers/
   - Sign in with Firefox Account
   - Accept Developer Agreement

2. **Prepare Extension Package**
   - Run: `.\build-release.ps1`
   - Get: `release\webmorph-extension.zip`

3. **Submit to AMO**
   - Go to: https://addons.mozilla.org/developers/addon/submit/distribution
   - Upload `webmorph-extension.zip`
   - Fill in metadata:
     - **Name:** WebMorph - WebM to MP4 Converter
     - **Summary:** Automatically converts downloaded WebM files to MP4 format
     - **Description:** (see below)
     - **Category:** Download Management
     - **Tags:** video, converter, webm, mp4, ffmpeg, download
     - **Support email:** your-email@domain.com
     - **Privacy Policy:** "This extension does not collect any user data"

4. **Submit for Review**
   - Mozilla reviews within 1-7 days
   - They may request changes
   - Once approved, extension is published

5. **Updates**
   - Increment version in manifest.json
   - Re-run build script
   - Upload new version to AMO
   - Users get automatic updates

---

### Option 2: Self-Distribution

**Advantages:**
- ✅ Immediate availability
- ✅ Full control over distribution
- ✅ No review process

**Disadvantages:**
- ❌ Users must manually update
- ❌ More complex installation
- ❌ Less trust from users
- ⚠️ Still requires Mozilla signing (for non-Developer Edition)

**Process:**

1. **Get API Credentials**
   - Go to: https://addons.mozilla.org/developers/addon/api/key/
   - Generate API credentials
   - Save JWT Issuer and JWT Secret

2. **Sign the Extension**

   Using web-ext:
   ```bash
   npm install -g web-ext

   web-ext sign \
     --source-dir=extension \
     --api-key=YOUR_JWT_ISSUER \
     --api-secret=YOUR_JWT_SECRET
   ```

   Or manually upload to AMO for signing (without listing):
   - Upload to AMO
   - Select "On your own"
   - Download signed .xpi

3. **Distribute**
   - Host the signed .xpi file
   - Provide download link to users
   - Users click the .xpi link to install

---

## Recommended Description for AMO

```
**WebMorph** automatically converts your downloaded WebM videos to MP4 format using FFmpeg - no manual intervention required!

### 🎯 Features

• **Fully Automatic** - Just download a WebM file, and it's instantly converted to MP4
• **High Quality** - Uses FFmpeg for professional-grade video conversion
• **Customizable** - Adjust quality, presets, and output formats
• **Smart Management** - Optionally delete original WebM files after conversion
• **Privacy First** - All processing happens locally, no data sent anywhere

### 🔧 How It Works

1. Download any WebM file in Firefox
2. WebMorph detects it automatically
3. FFmpeg converts it to MP4
4. You get a notification when it's done!

### ⚙️ Requirements

This extension requires a native host component to run FFmpeg. The installer is included and handles everything automatically:

1. Download the installer from the extension's homepage
2. Run INSTALL.bat (one-time setup)
3. The extension is ready to use!

The installer will download Python and FFmpeg if needed (~200 MB total).

### 🛡️ Privacy & Security

• No data collection or telemetry
• All conversions happen locally on your computer
• No internet connection required after setup
• Open source - review the code yourself!

### 🆘 Support

Having issues? Check the support section on the extension's homepage for troubleshooting guides and contact information.

---

**Supported Formats:** WebM → MP4, MKV, AVI, MOV, and more
**Powered by:** FFmpeg - the industry-standard video conversion tool
```

---

## Distribution Package Contents

After running `build-release.ps1`, you'll have:

```
release/
├── webmorph-extension.zip     # Firefox extension (for AMO upload)
├── INSTALL.bat                 # User-friendly installer launcher
├── webmorph-installer.ps1     # PowerShell installation script
├── native-host/               # Native messaging components
│   ├── host.py
│   └── com.fimp4fx.webm_converter.json
└── README.txt                 # User installation instructions
```

---

## Distributing to End Users

### Full Package Distribution

1. Zip the entire `release/` folder
2. Name it: `WebMorph-v1.0.0-Setup.zip`
3. Upload to your website/GitHub releases
4. Provide download link

**User Instructions:**
1. Extract the zip file
2. Run `INSTALL.bat`
3. Install the Firefox extension from AMO (or load the .zip manually)

---

### Minimal Distribution (If Extension is on AMO)

If the extension is published on AMO, users only need:

1. **From AMO:** Install extension with one click
2. **Download installer:** Get `webmorph-installer.ps1` and `INSTALL.bat`
3. **Run installer:** Execute `INSTALL.bat`

You can host just the installer files and link to the AMO page.

---

## Versioning

Follow [Semantic Versioning](https://semver.org/):

- **Major.Minor.Patch** (e.g., 1.2.3)
- **Major:** Breaking changes (e.g., 2.0.0)
- **Minor:** New features (e.g., 1.3.0)
- **Patch:** Bug fixes (e.g., 1.2.4)

Update version in:
- `extension/manifest.json`
- `PUBLISHING.md` (this file)
- Release notes

---

## Testing Before Release

### Checklist

- [ ] Test on clean Windows installation
- [ ] Verify installer downloads Python/FFmpeg correctly
- [ ] Test with system-installed Python/FFmpeg
- [ ] Verify extension loads without errors
- [ ] Test automatic WebM → MP4 conversion
- [ ] Check notifications appear
- [ ] Verify settings page works
- [ ] Test on Firefox Developer Edition
- [ ] Test on Firefox Release
- [ ] Check all console logs for errors
- [ ] Verify host.log shows correct messages
- [ ] Test uninstallation process

### Test Environments

1. **Clean Windows 10/11 VM**
   - No Python installed
   - No FFmpeg installed
   - Fresh Firefox installation

2. **Windows with Existing Tools**
   - Python 3.11+ already installed
   - FFmpeg in PATH
   - Multiple Firefox profiles

---

## Release Checklist

- [ ] Update version in manifest.json
- [ ] Update CHANGELOG.md (if exists)
- [ ] Run `build-release.ps1`
- [ ] Test the release package
- [ ] Create Git tag: `git tag v1.0.0`
- [ ] Push tag: `git push origin v1.0.0`
- [ ] Upload to AMO (or sign for self-distribution)
- [ ] Create GitHub Release (optional)
- [ ] Update documentation
- [ ] Announce release

---

## Support Resources

**For AMO Submission:**
- Extension Workshop: https://extensionworkshop.com/
- Submission Guide: https://extensionworkshop.com/documentation/publish/
- Review Criteria: https://extensionworkshop.com/documentation/publish/add-on-policies/

**For Signing:**
- Signing API: https://addons-server.readthedocs.io/en/latest/topics/api/signing.html
- web-ext Tool: https://extensionworkshop.com/documentation/develop/web-ext-command-reference/

**For Native Messaging:**
- MDN Docs: https://developer.mozilla.org/docs/Mozilla/Add-ons/WebExtensions/Native_messaging

---

## License & Legal

Make sure to include:

- **LICENSE file** (e.g., MIT, GPL, Apache)
- **Privacy Policy** (required by AMO)
- **Proper attribution** for FFmpeg and other dependencies

---

## Marketing & Promotion

Once published:

- Share on Reddit: r/firefox, r/opensource
- Post on Mozilla Discourse
- Tweet with #Firefox #WebExtensions
- Blog post about the development process
- Demo video on YouTube

---

**Questions?** Check the Mozilla Add-ons Community forum: https://discourse.mozilla.org/c/add-ons/35
