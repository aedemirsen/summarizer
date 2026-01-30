const { query } = require("./db");

function getLimitsForPlan(plan) {
  const freeDaily = parseInt(process.env.FREE_DAILY_LIMIT || "5", 10);
  const paidMonthly = parseInt(process.env.PAID_MONTHLY_LIMIT || "500", 10);

  if (plan === "paid") {
    return { type: "monthly", limit: paidMonthly };
  }

  return { type: "daily", limit: freeDaily };
}

function todayUtcDate() {
  const d = new Date();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

function monthStartUtcDate() {
  const d = new Date();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
}

async function checkAndIncrement(userId, plan) {
  const limits = getLimitsForPlan(plan);

  if (limits.type === "daily") {
    const day = todayUtcDate().toISOString().slice(0, 10);

    const res = await query(
      "insert into usage_daily (user_id, day, count) values ($1, $2, 1) " +
        "on conflict (user_id, day) do update set count = usage_daily.count + 1 " +
        "returning count",
      [userId, day]
    );

    const count = res.rows[0].count;
    return { ok: count <= limits.limit, count, limit: limits.limit, window: "daily" };
  }

  const month = monthStartUtcDate().toISOString().slice(0, 10);

  const res = await query(
    "insert into usage_monthly (user_id, month, count) values ($1, $2, 1) " +
      "on conflict (user_id, month) do update set count = usage_monthly.count + 1 " +
      "returning count",
    [userId, month]
  );

  const count = res.rows[0].count;
  return { ok: count <= limits.limit, count, limit: limits.limit, window: "monthly" };
}

async function getUsage(userId) {
  const day = todayUtcDate().toISOString().slice(0, 10);
  const month = monthStartUtcDate().toISOString().slice(0, 10);

  const daily = await query(
    "select count from usage_daily where user_id = $1 and day = $2",
    [userId, day]
  );
  const monthly = await query(
    "select count from usage_monthly where user_id = $1 and month = $2",
    [userId, month]
  );

  return {
    day,
    month,
    dailyCount: daily.rows[0]?.count || 0,
    monthlyCount: monthly.rows[0]?.count || 0
  };
}

module.exports = {
  checkAndIncrement,
  getUsage
};
