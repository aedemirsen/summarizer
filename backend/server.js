require("dotenv").config();
const express = require("express");
const fs = require("fs");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

function log(level, message, meta = {}) {
  const timestamp = new Date().toISOString();
  console.log(JSON.stringify({ timestamp, level, component: 'server', message, ...meta }));
}

function normalizePathname(p) {
  if (!p) return "/";
  if (p.length > 1 && p.endsWith("/")) return p.slice(0, -1);
  return p;
}

function sendJson(res, statusCode, obj) {
  const body = JSON.stringify(obj);
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Content-Length", Buffer.byteLength(body));
  res.end(body);
}

function getHandlerFileForPathname(pathname) {
  const clean = normalizePathname(pathname);
  if (!clean.startsWith("/api/")) return null;
  if (clean.includes("..")) return null;

  const rel = clean.replace(/^\/api\//, "");
  const full = path.join(__dirname, "api", ...rel.split("/")) + ".js";
  return full;
}

const app = express();

// Request logging middleware
app.use((req, res, next) => {
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substring(7);
  req.requestId = requestId;
  
  log('info', 'Incoming request', {
    requestId,
    method: req.method,
    path: req.path,
    query: req.query,
    ip: req.ip
  });
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    log('info', 'Request completed', {
      requestId,
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration
    });
  });
  
  next();
});

// NOTE: Do NOT use express.json() here.
// Existing /api/* handlers read the request body themselves (stream-based).

app.get(["/", "/health"], (req, res) => {
  log('debug', 'Health check', { requestId: req.requestId });
  sendJson(res, 200, { ok: true });
});

app.get("/api-docs.json", (req, res) => {
  sendJson(res, 200, swaggerSpec);
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, { 
  explorer: true,
  swaggerOptions: {
    urls: [
      {
        url: "/api-docs.json",
        name: "Local API"
      }
    ]
  }
}));

app.all(/^\/api\/.*/, async (req, res) => {
  try {
    const pathname = normalizePathname(req.path);
    log('debug', 'Processing API request', { requestId: req.requestId, pathname });

    const handlerFile = getHandlerFileForPathname(pathname);
    if (!handlerFile || !fs.existsSync(handlerFile)) {
      log('warn', 'Handler not found', { requestId: req.requestId, pathname, handlerFile });
      sendJson(res, 404, { error: "Not found" });
      return;
    }

    log('debug', 'Loading handler', { requestId: req.requestId, handlerFile });
    // Ensure fresh loads during dev (optional; harmless in prod)
    delete require.cache[require.resolve(handlerFile)];

    const handler = require(handlerFile);
    if (typeof handler !== "function") {
      log('error', 'Invalid handler type', { requestId: req.requestId, handlerFile, type: typeof handler });
      sendJson(res, 500, { error: "Invalid handler" });
      return;
    }

    log('debug', 'Executing handler', { requestId: req.requestId });
    await handler(req, res);
  } catch (e) {
    log('error', 'Handler execution failed', { 
      requestId: req.requestId, 
      error: e.message, 
      stack: e.stack 
    });
    sendJson(res, 500, { error: e?.message || String(e) });
  }
});

app.use((req, res) => {
  sendJson(res, 404, { error: "Not found" });
});

const port = Number(process.env.PORT || 9090);
log('info', 'Starting server', { port, env: process.env.NODE_ENV || 'development' });
app.listen(port, "0.0.0.0", () => {
  log('info', 'Server listening', { port, host: '0.0.0.0' });
});
