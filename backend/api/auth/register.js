const { handleOptions, setCors } = require("../../lib/cors");
const { setJson, readJson } = require("../../lib/http");
const { query } = require("../../lib/db");
const { hashPassword, signAccessToken } = require("../../lib/auth");

function isValidEmail(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

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

    if (!isValidEmail(email)) {
      setJson(res, 400, { error: "Invalid email" });
      return;
    }

    if (typeof password !== "string" || password.length < 8) {
      setJson(res, 400, { error: "Password must be at least 8 characters" });
      return;
    }

    const passwordHash = await hashPassword(password);

    const inserted = await query(
      "insert into users (email, password_hash) values ($1, $2) returning id, email, plan",
      [email, passwordHash]
    );

    const user = inserted.rows[0];
    const accessToken = signAccessToken(user);

    setJson(res, 200, { accessToken, user });
  } catch (e) {
    const msg = e?.message || String(e);

    if (msg.toLowerCase().includes("duplicate") || msg.toLowerCase().includes("unique")) {
      setJson(res, 409, { error: "Email already registered" });
      return;
    }

    setJson(res, e.statusCode || 500, { error: msg });
  }
};
