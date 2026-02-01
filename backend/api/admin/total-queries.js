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

    // Total queries from extension_events (free mode)
    const freeQueries = await query(
      "select count(*)::int as total from extension_events where event_type in ('summarize_free', 'summarize_free_ok')",
      []
    );

    // Total queries from extension_events (own API key mode)
    const ownKeyQueries = await query(
      "select count(*)::int as total from extension_events where event_type in ('summarize_own_ok')",
      []
    );

    const totalFree = freeQueries.rows[0]?.total || 0;
    const totalOwnKey = ownKeyQueries.rows[0]?.total || 0;
    const grandTotal = totalFree + totalOwnKey;

    setJson(res, 200, {
      ok: true,
      totalQueries: grandTotal,
      breakdown: {
        freeMode: totalFree,
        ownApiKey: totalOwnKey
      }
    });
  } catch (e) {
    setJson(res, e.statusCode || 500, { error: e?.message || String(e) });
  }
};
