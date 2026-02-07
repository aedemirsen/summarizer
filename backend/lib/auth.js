const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("./config");
const { query } = require("./db");

function signAccessToken(user) {
  const secret = config.auth.jwtSecret();
  return jwt.sign(
    { sub: user.id, email: user.email },
    secret,
    { expiresIn: config.auth.jwtExpiresIn }
  );
}

function verifyAccessToken(token) {
  const secret = config.auth.jwtSecret();
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
  return bcrypt.hash(password, config.auth.bcryptRounds);
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
