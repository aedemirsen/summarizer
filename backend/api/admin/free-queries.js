const { handleOptions, setCors } = require("../../lib/cors");
const { setJson } = require("../../lib/http");
const { query } = require("../../lib/db");
const config = require("../../lib/config");

function requireAdmin(req) {
  const token = (req.headers.authorization || "").replace(/^Bearer\s+/i, "").trim();
  const expected = config.auth.adminStatsToken();
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

    // Get free queries breakdown by provider from extension_usage_daily
    const queriesByProvider = await query(
      "select provider, sum(count)::int as total from extension_usage_daily group by provider order by total desc",
      []
    );

    const breakdown = {};
    let grandTotal = 0;

    for (const row of queriesByProvider.rows) {
      const provider = row.provider || "unknown";
      const total = row.total || 0;
      breakdown[provider] = total;
      grandTotal += total;
    }

    setJson(res, 200, {
      ok: true,
      totalFreeQueries: grandTotal,
      byProvider: breakdown
    });
  } catch (e) {
    setJson(res, e.statusCode || 500, { error: e?.message || String(e) });
  }
};
