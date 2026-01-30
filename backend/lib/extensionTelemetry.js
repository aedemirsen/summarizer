const { query } = require("./db");

function clampStr(v, maxLen) {
  const s = (v || "").toString().trim();
  if (!s) return "";
  return s.length > maxLen ? s.slice(0, maxLen) : s;
}

function isValidInstallId(id) {
  const s = (id || "").toString();
  if (!s) return false;
  if (s.length < 8 || s.length > 128) return false;
  return /^[a-zA-Z0-9_-]+$/.test(s);
}

async function upsertInstall({ installId, extensionVersion, userAgent }) {
  const id = clampStr(installId, 128);
  const ver = clampStr(extensionVersion, 32);
  const ua = clampStr(userAgent, 300);

  await query(
    "insert into extension_installs (install_id, extension_version, user_agent) values ($1, $2, $3) " +
      "on conflict (install_id) do update set last_seen_at = now(), extension_version = excluded.extension_version, user_agent = excluded.user_agent",
    [id, ver, ua]
  );
}

async function insertEvent({ installId, eventType }) {
  const id = clampStr(installId, 128);
  const type = clampStr(eventType, 40);
  if (!type) return;

  await query(
    "insert into extension_events (install_id, event_type) values ($1, $2)",
    [id, type]
  );
}

function todayUtcDate() {
  const d = new Date();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

async function checkAndIncrementInstallDaily(installId, provider) {
  const dailyLimit = parseInt(process.env.EXTENSION_DAILY_LIMIT || "20", 10);
  const day = todayUtcDate().toISOString().slice(0, 10);
  const prov = (provider || "groq").trim().toLowerCase();

  const res = await query(
    "insert into extension_usage_daily (install_id, day, provider, count) values ($1, $2, $3, 1) " +
      "on conflict (install_id, day, provider) do update set count = extension_usage_daily.count + 1 " +
      "returning count",
    [installId, day, prov]
  );

  const count = res.rows[0].count;
  return { ok: count <= dailyLimit, count, limit: dailyLimit, window: "daily", day, provider: prov };
}

async function getInstallDailyUsage(installId, provider) {
  const dailyLimit = parseInt(process.env.EXTENSION_DAILY_LIMIT || "20", 10);
  const day = todayUtcDate().toISOString().slice(0, 10);
  const prov = (provider || "groq").trim().toLowerCase();

  const res = await query(
    "select count from extension_usage_daily where install_id = $1 and day = $2 and provider = $3",
    [installId, day, prov]
  );

  const count = res.rows?.[0]?.count ? Number(res.rows[0].count) : 0;
  return { ok: count < dailyLimit, count, limit: dailyLimit, window: "daily", day, provider: prov };
}

module.exports = {
  isValidInstallId,
  upsertInstall,
  insertEvent,
  checkAndIncrementInstallDaily,
  getInstallDailyUsage
};
