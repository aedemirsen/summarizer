const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { query } = require("./db");

function requireEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`${name} is not set`);
  return v;
}

function signAccessToken(user) {
  const secret = requireEnv("JWT_SECRET");
  return jwt.sign(
    { sub: user.id, email: user.email },
    secret,
    { expiresIn: "30d" }
  );
}

function verifyAccessToken(token) {
  const secret = requireEnv("JWT_SECRET");
  return jwt.verify(token, secret);
}

function getBearerToken(req) {
  const h = req.headers.authorization || "";
  const m = h.match(/^Bearer\s+(.+)$/i);
  return m ? m[1] : "";
}

async function requireUser(req) {
  const token = getBearerToken(req);
  if (!token) {
    const err = new Error("Missing Authorization header");
    err.statusCode = 401;
    throw err;
  }

  let payload;
  try {
    payload = verifyAccessToken(token);
  } catch {
    const err = new Error("Invalid token");
    err.statusCode = 401;
    throw err;
  }

  const userId = payload.sub;
  const res = await query(
    "select id, email, plan, stripe_subscription_status from users where id = $1",
    [userId]
  );

  if (res.rows.length === 0) {
    const err = new Error("User not found");
    err.statusCode = 401;
    throw err;
  }

  return res.rows[0];
}

async function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

module.exports = {
  signAccessToken,
  requireUser,
  hashPassword,
  verifyPassword
};
