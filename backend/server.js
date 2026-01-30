const http = require("http");
const fs = require("fs");
const path = require("path");

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

const server = http.createServer(async (req, res) => {
  try {
    const u = new URL(req.url || "", `http://${req.headers.host || "localhost"}`);
    const pathname = normalizePathname(u.pathname);

    if (pathname === "/" || pathname === "/health") {
      sendJson(res, 200, { ok: true });
      return;
    }

    const handlerFile = getHandlerFileForPathname(pathname);
    if (!handlerFile || !fs.existsSync(handlerFile)) {
      sendJson(res, 404, { error: "Not found" });
      return;
    }

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

const port = Number(process.env.PORT || 9090);
server.listen(port, "0.0.0.0");
