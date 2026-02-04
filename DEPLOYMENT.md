# Deployment / Production Guide (Chrome Web Store)

This repository is a **Chrome Extension (Manifest V3)**.

## 1) What "production" means here

- You ship a **zipped extension package** to the **Chrome Web Store (CWS)**.
- Your users install from the store.
- You publish updates by uploading a new zip with an incremented `manifest.json` version.

## 2) Versioning (SemVer)

Chrome expects a version string in `extension/manifest.json` under `version`.

Recommended: **SemVer** `MAJOR.MINOR.PATCH` (e.g. `0.1.0` -> `0.1.1`).

- MAJOR: breaking changes
- MINOR: new features (e.g. History, new provider)
- PATCH: bugfixes

Before every upload to CWS, bump `extension/manifest.json` -> `version`.

## 3) Local testing checklist (pre-release)

### A) Load unpacked

1. Open Chrome
2. Go to `chrome://extensions`
3. Enable **Developer mode**
4. Click **Load unpacked**
5. Select the `extension/` folder

### B) Smoke tests

- Summarize button appears on:
  - normal pages
  - `contenteditable` editors
  - `textarea`/`input` selections
- History stores last 5 summaries
- Popup "Open summary panel" works
- Providers work:
  - Groq
  - OpenAI
  - Gemini
  - Anthropic
- Error messages are sanitized (no raw provider payload)

## 4) Packaging (zip for Chrome Web Store)

The uploaded artifact is a zip that contains the **extension files** (the content of `extension/`), not the entire repo.

### Zip structure

When you open the zip, you should see `manifest.json` at the top level.

### Example commands (macOS)

From repo root:

```bash
zip -r summarizer.zip extension \
  -x "**/.DS_Store" "**/__MACOSX" "**/.git*"
```

Preferred (manifest at zip root):

```bash
cd extension
zip -r ../summarizer.zip . \
  -x "**/.DS_Store" "**/__MACOSX" "**/.git*"
```

## 5) Chrome Web Store submission (step-by-step)

1. Create a CWS developer account (one-time signup fee)
2. Developer Dashboard -> **New item**
3. Upload your packaged zip
4. Fill listing metadata:
   - name, description
   - screenshots
   - icons
   - category
5. Permissions justification (typical):
   - `storage`: settings, encrypted API keys, history, geometry
   - `activeTab`: send message to current tab to open panel
   - `host_permissions` / content scripts: summarize on any website
6. Privacy:
   - Provide a privacy policy URL
   - Disclose that selected text is sent to the chosen AI provider
7. Submit for review

## 6) Update / release checklist

- [ ] Bump `extension/manifest.json` version
- [ ] Test on 3-5 representative sites
- [ ] Verify provider calls (including Anthropic)
- [ ] Verify localization strings still render
- [ ] Package zip (manifest at root)
- [ ] Upload new zip to existing CWS item
- [ ] Submit for review

## 7) API key handling (security)

- Never hardcode API keys.
- Keys are stored encrypted in Chrome storage.
- Treat any provider error responses as sensitive; only show sanitized errors to the UI.

## 8) Chrome extension limitations (important)

Even with the improved selection detection, there are pages where a content script cannot run:

- `chrome://*` pages
- Chrome Web Store pages (`https://chromewebstore.google.com/*`)
- Other restricted internal pages
- Some cross-origin iframes depending on sandbox / permissions

On those pages, the in-page summarize button/panel cannot be injected.

Workarounds:
- Use the action popup UI for manual paste summarization (if you choose to implement it)
- For iframe-heavy sites: ensure permissions and consider injecting into all frames (MV3 has constraints)
