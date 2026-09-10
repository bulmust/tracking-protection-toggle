# Tracking Protection Toggle

A minimal Firefox extension to instantly enable or disable **Enhanced Tracking Protection** (`privacy.trackingprotection.enabled`) with a single click.

Project website: <https://github.com/bulmust/tracking-protection-toggle>

## Why you need this

Firefox's Enhanced Tracking Protection (ETP) is a valuable privacy feature, but it sometimes prevents embedded videos from playing on third-party sites — such as training courses, documentation portals, and conference platforms hosted on services like Vimeo or custom CDNs.

This extension lets you quickly turn off ETP to unblock a video, then turn it back on when you are done — without opening `about:preferences`.

This extension has been tested on:

- <https://developer.hashicorp.com>
- <https://training.linuxfoundation.org>

## Warning

When tracking protection is OFF, websites and third-party advertisers can track your browsing activity across the web. Only disable it when necessary, and re-enable it as soon as you are done.

The extension shows a visible red warning banner in the popup and a red "OFF" badge on the toolbar icon whenever protection is turned off.

## Features

- Single-click toggle between enabled and disabled
- Dark glassmorphism popup with Firefox orange accent
- Toolbar badge behaviour:
  - Enabled: no badge (clean icon — no clutter when things are fine)
  - Disabled: red "OFF" badge visible on the toolbar icon
- In-popup confirmation banner when ETP is enabled
- In-popup red warning banner when ETP is disabled
- Restart note reminding you to reload the page after toggling
- No network requests, no data collection — entirely local

## Usage note

After toggling, you need to reload the current page for the change to take effect. The extension changes the Firefox setting immediately, but already-loaded pages are not affected until refreshed.

## How it works

Uses the Firefox WebExtensions [`browser.privacy.websites.trackingProtectionMode`](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/privacy/websites) API to read and write the tracking protection mode.

| State       | Mode value | Badge | Meaning                                       |
| ----------- | ---------- | ----- | --------------------------------------------- |
| Protected   | `"always"` | none  | ETP enabled for all browsing sessions         |
| Unprotected | `"never"`  | OFF   | ETP fully disabled — trackers are not blocked |

The badge is intentionally absent when protection is enabled so the toolbar stays uncluttered. A red "OFF" badge only appears when you have explicitly turned protection off — serving as a persistent reminder.

## Installation (Temporary / Development)

1. Clone this repository
2. Open Firefox and navigate to `about:debugging`
3. Click **This Firefox** in the left sidebar
4. Click **Load Temporary Add-on...**
5. Select `manifest.json` inside `tracking-protection-toggle/`
6. The extension icon will appear in your toolbar

> Note: Temporary add-ons are removed when Firefox restarts. To install permanently, the extension must be signed by Mozilla, or you can use Firefox Developer Edition / Nightly with `xpinstall.signatures.required` set to `false` in `about:config`.

## Permissions

| Permission | Why                                                                          |
| ---------- | ---------------------------------------------------------------------------- |
| `privacy`  | Required to read and write `browser.privacy.websites.trackingProtectionMode` |

## Project Structure

```text
tracking-protection-toggle/
├── manifest.json
├── background/
│   └── background.js      # Reads/writes the privacy setting, updates badge
├── popup/
│   ├── popup.html
│   ├── popup.css          # Dark glassmorphism design, Firefox orange accent
│   └── popup.js           # UI logic, message passing to background
└── icons/
    ├── icon-16.png
    ├── icon-32.png
    ├── icon-48.png
    └── icon-128.png
```

## AI Disclosure

This extension was built with heavy AI assistance. The code, design, and documentation were generated and iterated using an AI coding assistant. The author reviewed, tested, and curated the output.
