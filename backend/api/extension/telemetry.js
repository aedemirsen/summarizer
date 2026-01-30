const { handleOptions, setCors } = require("../../lib/cors");
const { setJson, readJson } = require("../../lib/http");
const { isValidInstallId, upsertInstall, insertEvent } = require("../../lib/extensionTelemetry");

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
    const eventType = (body.eventType || "").trim();
    const extensionVersion = (body.extensionVersion || "").trim();

    if (!isValidInstallId(installId)) {
      setJson(res, 400, { error: "Invalid installId" });
      return;
    }

    // Keep it permissive: we don't reject unknown event types, but we clamp length.
    const ua = (req.headers["user-agent"] || "").toString();

    await upsertInstall({ installId, extensionVersion, userAgent: ua });
    if (eventType) await insertEvent({ installId, eventType });

    setJson(res, 200, { ok: true });
  } catch (e) {
    setJson(res, e.statusCode || 500, { error: e?.message || String(e) });
  }
};
