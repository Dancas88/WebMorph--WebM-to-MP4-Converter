# WebMorph - Installation Guide

🇮🇹 **[Versione Italiana →](INSTALL_IT.md)**

## Quick Installation (Windows)

### Step 1: Download

Download the latest release or clone:
```bash
git clone https://github.com/yourusername/webmorph.git
```

**⚠️ IMPORTANT:** Extract to a simple path like `C:\WebMorph`

❌ **DON'T use:** Downloads folder, Desktop, or Program Files
✅ **DO use:** `C:\WebMorph`, `D:\Tools\WebMorph`, etc.

---

### Step 2: Run Installer

Open the installation folder and double-click:
```
scripts\INSTALL.bat
```

The installer will:
- ✅ Download Python 3.11 (if not already installed) → ~10 MB
- ✅ Download FFmpeg (if not already installed) → ~75 MB
- ✅ Configure native messaging host
- ✅ Register with Firefox

**No admin rights needed!** Everything installs to the local folder.

---

### Step 3: Load Extension in Firefox

1. Open Firefox
2. Type `about:debugging` in the address bar
3. Click **"This Firefox"** (left sidebar)
4. Click **"Load Temporary Add-on..."**
5. Navigate to `[your-install-folder]\extension\`
6. Select `manifest.json`
7. Done! 🎉

---

### Step 4: Verify

Click the WebMorph icon in Firefox toolbar.

You should see:
- ✅ Extension: Active
- ✅ Native Host: Ready
- ✅ FFmpeg: Ready

**All green?** You're ready to use WebMorph!

---

## Common Issues

### "Native Host: Not Found"

**Cause:** Wrong installation path or installer not run

**Fix:**
1. Move folder to `C:\WebMorph`
2. Run `scripts\INSTALL.bat` again
3. Restart Firefox completely

---

### "Disconnected from native host"

**Cause:** Installation in Downloads folder or path with spaces

**Fix:**
1. Move to `C:\WebMorph` (simple path)
2. Run `scripts\INSTALL.bat`
3. Reload extension in Firefox

---

### Still Having Issues?

Check `native-host\host.log` for detailed error messages.

---

## Important Notes

⚠️ **Run installer on EACH computer**
- Configuration files are machine-specific
- Simply copying the folder won't work
- Must run `INSTALL.bat` on each PC

⚠️ **Don't move folder after installation**
- If you need to move it, run installer again
- Paths are stored in configuration files

⚠️ **Use simple paths**
- ✅ Good: `C:\WebMorph`
- ❌ Bad: `C:\Users\Name\Downloads\WebMorph--WebM-to-MP4-Converter-main`

---

## Uninstallation

1. Remove extension from Firefox
2. Delete installation folder
3. Done!

No registry cleaning needed (unless you want to).

---

## Need Help?

- 📖 [Full Documentation](README.md)
- 🐛 [Report Issues](https://github.com/yourusername/webmorph/issues)

---

**WebMorph** - Convert WebM to MP4 automatically in Firefox
Version 1.0.0 | MIT License
