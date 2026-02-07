const { handleOptions, setCors } = require("../../lib/cors");
const { setJson, readJson } = require("../../lib/http");
const { isValidInstallId, upsertInstall, getInstallDailyUsage } = require("../../lib/extensionTelemetry");

async function ensureInstallExists(installId, extensionVersion, req) {
  const ua = (req.headers["user-agent"] || "").toString();
  await upsertInstall({ installId, extensionVersion, userAgent: ua });
}

function log(level, message, meta = {}) {
  const timestamp = new Date().toISOString();
  console.log(JSON.stringify({ timestamp, level, component: 'extension/usage', message, ...meta }));
}

module.exports = async (req, res) => {
  setCors(res);
  if (handleOptions(req, res)) return;

  if (req.method !== "GET" && req.method !== "POST") {
    setJson(res, 405, { error: "Method not allowed" });
    return;
  }

  try {
    let installId, extensionVersion, provider;
    
    if (req.method === "GET") {
      // Parse query parameters for GET requests
      const url = new URL(req.url, "http://localhost");
      installId = (url.searchParams.get("installId") || "").trim();
      extensionVersion = (url.searchParams.get("extensionVersion") || "").trim();
      provider = (url.searchParams.get("provider") || "groq").trim().toLowerCase();
    } else {
      // Parse body for POST requests
      const body = await readJson(req);
      installId = (body.installId || "").trim();
      extensionVersion = (body.extensionVersion || "").trim();
      provider = (body.provider || "groq").trim().toLowerCase();
    }

    log('debug', 'Usage check request', { installId, provider, method: req.method });

    if (!isValidInstallId(installId)) {
      log('warn', 'Invalid installId', { installId });
      setJson(res, 400, { error: "Invalid installId" });
      return;
    }

    await ensureInstallExists(installId, extensionVersion, req);

    const usage = await getInstallDailyUsage(installId, provider);
    log('info', 'Usage retrieved', { installId, provider, usage });
    setJson(res, 200, { ok: true, usage });
  } catch (e) {
    log('error', 'Usage check failed', { error: e.message, stack: e.stack });
    setJson(res, e.statusCode || 500, { ok: false, error: e?.message || String(e) });
  }
};
