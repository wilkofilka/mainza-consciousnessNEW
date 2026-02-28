# Mainza ChatGPT Wrapper (Extension)

This is a ready-to-load Chrome/Edge extension that injects a **Mainza 1:1 wrapper panel** directly into the global web ChatGPT UI (`chatgpt.com`).

## What it does
- Adds a floating button: **Open Mainza 1:1**.
- Opens a docked panel with an iframe to your Mainza frontend (`http://localhost` by default).
- Lets you reload/close the panel without leaving ChatGPT.

## Install (Developer Mode)
1. Open `chrome://extensions` (or `edge://extensions`).
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select folder: `wrapper/chatgpt-extension`.
5. Open `https://chatgpt.com` and click **Open Mainza 1:1**.

## Notes
- Start Mainza frontend first (`npm run dev` or docker stack) so `http://localhost` responds.
- If your Mainza frontend runs on a different URL/port, edit `MAINZA_URL` in `content.js`.
