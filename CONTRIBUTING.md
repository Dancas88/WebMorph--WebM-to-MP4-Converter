# Contributing to WebMorph

First off, thank you for considering contributing to WebMorph! 🎉

## How Can I Contribute?

### 🐛 Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates.

**When filing a bug report, include:**

- **Description:** Clear and concise description of the bug
- **Steps to Reproduce:** Detailed steps to reproduce the behavior
- **Expected Behavior:** What you expected to happen
- **Actual Behavior:** What actually happened
- **Screenshots:** If applicable
- **Environment:**
  - OS: Windows version
  - Firefox version
  - WebMorph version
- **Logs:**
  - Extension console logs (from `about:debugging`)
  - Native host logs (`native-host/host.log`)

### 💡 Suggesting Features

Feature suggestions are welcome! Please:

- **Check existing issues** first
- **Describe the feature** clearly
- **Explain the use case** - why is it useful?
- **Provide examples** if possible

### 🔧 Pull Requests

1. **Fork the repository**
2. **Create a branch:**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Test thoroughly**
5. **Commit with clear messages:**
   ```bash
   git commit -m "Add amazing feature"
   ```
6. **Push to your fork:**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### 📝 Commit Message Guidelines

Use clear, descriptive commit messages:

- **Format:** `type: description`
- **Types:**
  - `feat:` New feature
  - `fix:` Bug fix
  - `docs:` Documentation changes
  - `style:` Code style changes (formatting, etc.)
  - `refactor:` Code refactoring
  - `test:` Adding tests
  - `chore:` Maintenance tasks

**Examples:**
```
feat: add batch conversion queue
fix: native host connection timeout
docs: update installation instructions
```

## Development Setup

### Prerequisites

- Windows 10/11
- Firefox Developer Edition (recommended)
- Git
- PowerShell
- (Optional) Node.js with `web-ext`

### Getting Started

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/webmorph.git
cd webmorph

# Install dev dependencies (optional)
npm install -g web-ext

# Load extension in Firefox
# Method 1: Using web-ext
web-ext run --source-dir=extension

# Method 2: Manual
# Open Firefox → about:debugging → Load Temporary Add-on
# Select: extension/manifest.json
```

### Testing

Before submitting a PR:

1. **Test the extension:**
   - Load in Firefox
   - Test all features
   - Check console for errors

2. **Test the installer:**
   - Run on clean system (VM recommended)
   - Verify Python/FFmpeg detection
   - Test full installation flow

3. **Test conversion:**
   - Download test .webm files
   - Verify automatic conversion
   - Check notifications
   - Verify history tracking

4. **Check logs:**
   - No errors in browser console
   - No errors in `native-host/host.log`

### Code Style

- **JavaScript:** Follow Mozilla's style guide
- **Python:** Follow PEP 8
- **PowerShell:** Use approved verbs
- **Indentation:** Use spaces, not tabs
- **Line length:** Max 100 characters (when practical)

### Project Structure

```
extension/          - Firefox extension code
native-host/        - Native messaging host (Python)
installer.ps1       - Installation script
build-release.ps1   - Build distribution package
docs/               - Documentation
```

## Documentation

When adding features, update:

- **README.md** - If user-facing
- **Code comments** - For complex logic
- **CHANGELOG.md** - User-visible changes

## Questions?

Feel free to:

- Open a discussion
- Comment on existing issues
- Ask in pull requests

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the project
- Show empathy towards others

## Recognition

Contributors will be:

- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in the project

---

**Thank you for contributing!** 🙏
