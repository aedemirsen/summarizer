const { handleOptions, setCors } = require("../../lib/cors");
const { setJson, readJson } = require("../../lib/http");
const { query } = require("../../lib/db");
const { verifyPassword, signAccessToken } = require("../../lib/auth");

module.exports = async (req, res) => {
  setCors(res);
  if (handleOptions(req, res)) return;

  if (req.method !== "POST") {
    setJson(res, 405, { error: "Method not allowed" });
    return;
  }

  try {
    const body = await readJson(req);
    const email = (body.email || "").trim().toLowerCase();
    const password = body.password || "";

    const found = await query(
      "select id, email, plan, password_hash from users where email = $1",
      [email]
    );

    if (found.rows.length === 0) {
      setJson(res, 401, { error: "Invalid credentials" });
      return;
    }

    const userRow = found.rows[0];

    const ok = await verifyPassword(password, userRow.password_hash);
    if (!ok) {
      setJson(res, 401, { error: "Invalid credentials" });
      return;
    }

    const user = { id: userRow.id, email: userRow.email, plan: userRow.plan };
    const accessToken = signAccessToken(user);

    setJson(res, 200, { accessToken, user });
  } catch (e) {
    setJson(res, e.statusCode || 500, { error: e?.message || String(e) });
  }
};
