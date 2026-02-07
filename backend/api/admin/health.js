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

    const startTime = Date.now();
    
    // Test database connection
    const dbResult = await query("SELECT NOW() as now, version() as version", []);
    const dbTime = Date.now() - startTime;
    
    // Get database stats
    const poolStats = await query(
      "SELECT count(*) as total_connections FROM pg_stat_activity WHERE datname = current_database()",
      []
    );
    
    const dbSize = await query(
      "SELECT pg_size_pretty(pg_database_size(current_database())) as size",
      []
    );

    setJson(res, 200, {
      ok: true,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: config.nodeEnv,
      database: {
        connected: true,
        responseTime: dbTime,
        version: dbResult.rows[0]?.version?.split(' ')[1] || 'unknown',
        connections: parseInt(poolStats.rows[0]?.total_connections || 0),
        size: dbSize.rows[0]?.size || 'unknown'
      },
      memory: {
        heapUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        heapTotal: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        rss: Math.round(process.memoryUsage().rss / 1024 / 1024),
        external: Math.round(process.memoryUsage().external / 1024 / 1024)
      },
      process: {
        pid: process.pid,
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch
      }
    });
  } catch (e) {
    setJson(res, e.statusCode || 500, { 
      ok: false,
      error: e?.message || String(e) 
    });
  }
};
