#!/usr/bin/env node
/**
 * Cloud Video Rendering Service for Render.com
 *
 * Endpoint: POST /render
 * Body: { "composition": "ProVertical", "config": {...}, "requestId": "xyz" }
 * Response: { jobId, status, statusUrl }
 */

import express from 'express';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

// ES module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Render jobs in progress
const renderJobs = new Map();

// Temp directory for renders
const RENDERS_DIR = path.join(os.tmpdir(), 'remotion-renders');
if (!fs.existsSync(RENDERS_DIR)) {
  fs.mkdirSync(RENDERS_DIR, { recursive: true });
}

// Middleware
app.use(express.json({ limit: '50mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    activeJobs: renderJobs.size
  });
});

// Get render status
app.get('/status/:jobId', (req, res) => {
  const { jobId } = req.params;
  const job = renderJobs.get(jobId);

  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }

  res.json({
    jobId,
    status: job.status,
    composition: job.composition,
    progress: job.progress || 0,
    error: job.error || null,
    downloadUrl: job.downloadUrl || null,
    createdAt: job.createdAt,
  });
});

// Start render
app.post('/render', async (req, res) => {
  try {
    const { composition = 'ProVertical', config, requestId } = req.body;

    if (!config) {
      return res.status(400).json({ error: 'Missing config' });
    }

    const jobId = requestId || crypto.randomBytes(8).toString('hex');
    const tempDir = path.join(RENDERS_DIR, jobId);
    const configPath = path.join(tempDir, 'config.json');
    const outputPath = path.join(tempDir, 'output.mp4');

    // Create job directory
    fs.mkdirSync(tempDir, { recursive: true });

    // Write config file
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

    // Update video.config.json in the project root (Remotion reads this)
    const projectConfigPath = path.join(__dirname, 'video.config.json');
    fs.writeFileSync(projectConfigPath, JSON.stringify(config, null, 2));

    // Register job
    renderJobs.set(jobId, {
      status: 'queued',
      composition,
      progress: 0,
      createdAt: new Date().toISOString(),
      tempDir,
      outputPath,
      configPath,
    });

    // Start render in background (don't wait)
    startRender(jobId, composition, outputPath);

    // Immediate response with job ID
    res.json({
      jobId,
      status: 'queued',
      statusUrl: `/status/${jobId}`,
      message: 'Render job queued. Check status URL for progress.',
    });

  } catch (err) {
    console.error('Render request error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Download rendered video
app.get('/download/:jobId', (req, res) => {
  const { jobId } = req.params;
  const job = renderJobs.get(jobId);

  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }

  if (job.status !== 'completed') {
    return res.status(409).json({
      error: `Job not ready. Status: ${job.status}`,
      message: job.error || 'Still rendering...'
    });
  }

  if (!fs.existsSync(job.outputPath)) {
    return res.status(404).json({ error: 'Output file not found' });
  }

  const fileSize = fs.statSync(job.outputPath).size;
  res.setHeader('Content-Type', 'video/mp4');
  res.setHeader('Content-Length', fileSize);
  res.setHeader('Content-Disposition', `attachment; filename="${jobId}.mp4"`);

  const fileStream = fs.createReadStream(job.outputPath);
  fileStream.pipe(res);

  // Clean up after 1 hour
  setTimeout(() => {
    try {
      fs.rmSync(job.tempDir, { recursive: true, force: true });
      renderJobs.delete(jobId);
    } catch (e) {
      console.error('Cleanup error:', e);
    }
  }, 3600000);
});

/**
 * Execute Remotion render in background
 */
function startRender(jobId, composition, outputPath) {
  const job = renderJobs.get(jobId);
  if (!job) return;

  job.status = 'rendering';
  job.progress = 5;

  // Container-optimised Chrome flags for Render.com (Linux/Docker)
  const chromeFlags = [
    '--disable-dev-shm-usage',   // Use /tmp instead of /dev/shm (critical in containers)
    '--no-sandbox',               // Required in Docker/Render environments
    '--disable-setuid-sandbox',
    '--disable-gpu',              // No GPU in cloud container
    '--disable-software-rasterizer',
  ].join(' ');

  // Build render command
  const cmd = [
    `REMOTION_CHROME_FLAGS="${chromeFlags}"`,
    'npx', 'remotion', 'render',
    composition,
    outputPath,
    '--log=verbose',
    '--concurrency=1',       // Single-threaded (512MB RAM constraint)
    '--timeout=300000',      // 5 min browser timeout
    '--jpeg-quality=80',     // Reduce memory during encode
  ].join(' ');

  console.log(`[${jobId}] Starting render: composition=${composition}`);

  const child = exec(cmd, {
    cwd: __dirname,           // Run from project root (where src/ and remotion.config.ts live)
    timeout: 900000,          // 15 min max
    env: {
      ...process.env,
      // Reduce Node.js memory overhead
      NODE_OPTIONS: '--max-old-space-size=400',
      // Chrome container flags
      PUPPETEER_DISABLE_HEADLESS_WARNING: '1',
    }
  });

  let lastLog = '';
  child.stdout?.on('data', (data) => {
    const line = data.toString().trim();
    if (line) lastLog = line;
    console.log(`[${jobId}]`, line.slice(0, 120));
    // Parse Remotion progress: "Frame 12/150"
    const m = line.match(/Frame\s+(\d+)\s*\/\s*(\d+)/);
    if (m) {
      const [cur, tot] = [parseInt(m[1]), parseInt(m[2])];
      job.progress = Math.round((cur / tot) * 90) + 5;
    }
  });

  child.stderr?.on('data', (data) => {
    const line = data.toString().trim();
    if (line) console.error(`[${jobId}] ERR:`, line.slice(0, 200));
  });

  child.on('error', (err) => {
    console.error(`[${jobId}] Render error:`, err);
    job.status = 'failed';
    job.error = err.message;
    job.progress = 0;
  });

  child.on('exit', (code) => {
    if (code === 0) {
      console.log(`[${jobId}] ✅ Render completed`);
      job.status = 'completed';
      job.progress = 100;
      job.downloadUrl = `/download/${jobId}`;
    } else {
      console.error(`[${jobId}] ❌ Render failed (exit code ${code}). Last log: ${lastLog}`);
      job.status = 'failed';
      job.error = `Process exited with code ${code}. Last output: ${lastLog.slice(0, 200)}`;
      job.progress = 0;
    }
  });
}

// Error handling
process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err);
});

// Start server
app.listen(PORT, () => {
  console.log(`🎬 Cloud Video Renderer running on port ${PORT}`);
  console.log(`   Health:   GET /health`);
  console.log(`   Render:   POST /render`);
  console.log(`   Status:   GET /status/:jobId`);
  console.log(`   Download: GET /download/:jobId`);
  console.log(`   Project:  ${__dirname}`);
});
