const { handleOptions, setCors } = require("../../lib/cors");
const { setJson, readJson } = require("../../lib/http");
const { isValidInstallId, upsertInstall, getInstallDailyUsage } = require("../../lib/extensionTelemetry");

async function ensureInstallExists(installId, extensionVersion, req) {
  const ua = (req.headers["user-agent"] || "").toString();
  await upsertInstall({ installId, extensionVersion, userAgent: ua });
}

module.exports = async (req, res) => {
  setCors(res);
  if (handleOptions(req, res)) return;

  if (req.method !== "POST") {
    setJson(res, 405, { error: "Method not allowed" });
    return;
  }

  try {
    const body = await readJson(req);
    const installId = (body.installId || "").trim();
    const extensionVersion = (body.extensionVersion || "").trim();
    const provider = (body.provider || "groq").trim().toLowerCase();

    if (!isValidInstallId(installId)) {
      setJson(res, 400, { error: "Invalid installId" });
      return;
    }

    await ensureInstallExists(installId, extensionVersion, req);

    const usage = await getInstallDailyUsage(installId, provider);
    setJson(res, 200, { ok: true, usage });
  } catch (e) {
    setJson(res, e.statusCode || 500, { ok: false, error: e?.message || String(e) });
  }
};
