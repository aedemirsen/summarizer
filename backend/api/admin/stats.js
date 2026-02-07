const { handleOptions, setCors } = require("../../lib/cors");
const { setJson } = require("../../lib/http");
const { query } = require("../../lib/db");
const config = require("../../lib/config");

function log(level, message, meta = {}) {
  const timestamp = new Date().toISOString();
  console.log(JSON.stringify({ timestamp, level, component: 'admin/stats', message, ...meta }));
}

function requireAdmin(req) {
  const token = (req.headers.authorization || "").replace(/^Bearer\s+/i, "").trim();
  const expected = config.auth.adminStatsToken();
  
  if (!token || token !== expected) {
    log('warn', 'Unauthorized access attempt', { hasToken: !!token });
    const err = new Error("Unauthorized");
    err.statusCode = 401;
    throw err;
  }
  log('debug', 'Admin authenticated successfully');
}

function parseDaysParam(req) {
  try {
    const url = new URL(req.url, "http://localhost");
    const raw = url.searchParams.get("days") || "30";
    const n = parseInt(raw, 10);
    if (!Number.isFinite(n)) return 30;
    return Math.min(Math.max(n, 1), 365);
  } catch {
    return 30;
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

    const days = parseDaysParam(req);

    const totalInstalls = await query(
      "select count(*)::int as c from extension_installs",
      []
    );

    const active7d = await query(
      "select count(*)::int as c from extension_installs where last_seen_at >= now() - interval '7 days'",
      []
    );

    const active30d = await query(
      "select count(*)::int as c from extension_installs where last_seen_at >= now() - interval '30 days'",
      []
    );

    const eventsByType = await query(
      "select event_type, count(*)::int as c from extension_events where created_at >= now() - ($1 || ' days')::interval group by event_type order by c desc",
      [String(days)]
    );

    const eventsDaily = await query(
      "select to_char(created_at::date, 'YYYY-MM-DD') as day, count(*)::int as c " +
        "from extension_events where created_at >= now() - ($1 || ' days')::interval " +
        "group by day order by day asc",
      [String(days)]
    );

    setJson(res, 200, {
      ok: true,
      windowDays: days,
      installs: {
        total: totalInstalls.rows[0]?.c || 0,
        active7d: active7d.rows[0]?.c || 0,
        active30d: active30d.rows[0]?.c || 0
      },
      events: {
        byType: eventsByType.rows,
        daily: eventsDaily.rows
      }
    });
  } catch (e) {
    setJson(res, e.statusCode || 500, { error: e?.message || String(e) });
  }
};
