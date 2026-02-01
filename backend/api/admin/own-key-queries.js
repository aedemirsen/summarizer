const { handleOptions, setCors } = require("../../lib/cors");
const { setJson } = require("../../lib/http");
const { query } = require("../../lib/db");

function requireAdmin(req) {
  const token = (req.headers.authorization || "").replace(/^Bearer\s+/i, "").trim();
  const expected = (process.env.ADMIN_STATS_TOKEN || "").trim();
  if (!expected) {
    const err = new Error("ADMIN_STATS_TOKEN is not configured");
    err.statusCode = 500;
    throw err;
  }
  if (!token || token !== expected) {
    const err = new Error("Unauthorized");
    err.statusCode = 401;
    throw err;
  }
}

module.exports = async (req, res) => {
  setCors(res);
  if (handleOptions(req, res)) return;

  if (req.method !== "GET") {
    setJson(res, 405, { error: "Method not allowed" });
    return;
  }

  try {
    requireAdmin(req);

    // Get own-key queries count from extension_events
    // We track summarize_own_ok events but don't store provider/model in events table
    // So we'll return total count only
    const ownKeyTotal = await query(
      "select count(*)::int as total from extension_events where event_type = 'summarize_own_ok'",
      []
    );

    // Note: To get per-model breakdown, we'd need to add provider/model columns to extension_events
    // For now, returning total count only
    const total = ownKeyTotal.rows[0]?.total || 0;

    setJson(res, 200, {
      ok: true,
      totalOwnKeyQueries: total,
      note: "Per-model breakdown not available. Consider adding provider/model tracking to extension_events table."
    });
  } catch (e) {
    setJson(res, e.statusCode || 500, { error: e?.message || String(e) });
  }
};
