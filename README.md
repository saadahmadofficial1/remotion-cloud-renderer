# Cloud Video Renderer for Render.com

This is a Node.js + Express server that runs Remotion video rendering on Render.com's free tier. Your Telegram bot can send render jobs here instead of rendering locally.

## ✨ Benefits

- ✅ **Your laptop stays free** — rendering happens in the cloud
- ✅ **Faster rendering** — Render.com's servers are powerful
- ✅ **Async queue** — bot doesn't block while rendering
- ✅ **Free tier** — $0/month with Render.com

## 📦 How to Deploy

### Step 1: Push to GitHub

```bash
cd /path/to/fintech-video/cloud-renderer
git init
git add .
git commit -m "initial: cloud renderer"
git remote add origin https://github.com/YOUR_USERNAME/remotion-cloud-renderer.git
git push -u origin main
```

### Step 2: Create Render.com Web Service

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repo (remotion-cloud-renderer)
4. Fill in:
   - **Name:** `remotion-cloud-renderer`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Click **"Create Web Service"**
6. Wait ~2 min for deploy to finish
7. **Copy your service URL** (looks like `https://remotion-cloud-renderer.onrender.com`)

### Step 3: Tell Your Bot About the Cloud Renderer

In Telegram, send:
```
/setcloudrenderer https://remotion-cloud-renderer.onrender.com
```

Or manually edit `.env` in the bot directory:
```
CLOUD_RENDERER_URL=https://remotion-cloud-renderer.onrender.com
```

Then restart the bot:
```bash
pkill -f "bot.py"
cd /path/to/telegram-bot
python3 bot.py
```

## 🎯 Usage

### Option 1: Automatic (recommended)

Just use `/generate` normally. The bot will:
1. Ask for brief, size, style
2. Generate AI config locally
3. **Send render job to cloud**
4. Download finished MP4
5. Send to Telegram

Your laptop stays 100% free! ⚡

### Option 2: Manual Cloud Render

```
/render cloud
```

This forces rendering on cloud instead of locally.

### Option 3: Disable Cloud (back to local)

```
/setcloudrenderer off
```

## 📊 API Endpoints

- **GET `/health`** — Check if cloud renderer is alive
- **POST `/render`** — Submit render job (used by bot)
- **GET `/status/:jobId`** — Check render progress
- **GET `/download/:jobId`** — Download finished MP4

## ⚠️ Limitations

- **Render.com free tier** has limited memory (512 MB Node.js)
- **Deployment spins down** after 15 min inactivity (takes ~30s to start)
- **Only ONE render at a time** (concurrency=1 to save resources)
- **Maximum render time: 15 minutes**

For heavy usage (multiple renders/day), upgrade to Render's paid tier (~$7/month).

## 🔧 Troubleshooting

**"Connection refused" error:**
- Cloud renderer may be starting up (takes 30s on cold start)
- Wait and try again

**"Job not found" on download:**
- Render jobs auto-delete after 1 hour
- Check `/status/:jobId` for errors

**"Render timed out":**
- Cloud resources may be exhausted
- Try again in 5 minutes

## 📝 Project Structure

The cloud renderer needs access to your Remotion project files. Make sure these are in the root:
- `src/` — React components for video scenes
- `video.config.json` — Updated by cloud renderer
- `package.json` — Remotion dependencies
- `.remotion` config files

When deployed to Render, the entire project should be included in the git repo.
