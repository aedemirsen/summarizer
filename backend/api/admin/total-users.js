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

    const totalUsers = await query(
      "select count(*)::int as total from extension_installs",
      []
    );

    const active7d = await query(
      "select count(*)::int as total from extension_installs where last_seen_at >= now() - interval '7 days'",
      []
    );

    const active30d = await query(
      "select count(*)::int as total from extension_installs where last_seen_at >= now() - interval '30 days'",
      []
    );

    setJson(res, 200, {
      ok: true,
      totalUsers: totalUsers.rows[0]?.total || 0,
      activeUsers: {
        last7Days: active7d.rows[0]?.total || 0,
        last30Days: active30d.rows[0]?.total || 0
      }
    });
  } catch (e) {
    setJson(res, e.statusCode || 500, { error: e?.message || String(e) });
  }
};
