const express = require("express");
const fs = require("fs");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

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

// NOTE: Do NOT use express.json() here.
// Existing /api/* handlers read the request body themselves (stream-based).

app.get(["/", "/health"], (req, res) => {
  sendJson(res, 200, { ok: true });
});

app.get("/api-docs.json", (req, res) => {
  sendJson(res, 200, swaggerSpec);
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));

app.all(/^\/api\/.*/, async (req, res) => {
  try {
    const pathname = normalizePathname(req.path);

    const handlerFile = getHandlerFileForPathname(pathname);
    if (!handlerFile || !fs.existsSync(handlerFile)) {
      sendJson(res, 404, { error: "Not found" });
      return;
    }

    // Ensure fresh loads during dev (optional; harmless in prod)
    delete require.cache[require.resolve(handlerFile)];

    const handler = require(handlerFile);
    if (typeof handler !== "function") {
      sendJson(res, 500, { error: "Invalid handler" });
      return;
    }

    await handler(req, res);
  } catch (e) {
    sendJson(res, 500, { error: e?.message || String(e) });
  }
});

app.use((req, res) => {
  sendJson(res, 404, { error: "Not found" });
});

const port = Number(process.env.PORT || 9090);
app.listen(port, "0.0.0.0");
