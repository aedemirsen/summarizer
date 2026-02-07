const config = require('./config');

function setCors(res, origin = null) {
  const allowedOrigin = origin || config.cors.origin;
  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization,Stripe-Signature");
  res.setHeader("Access-Control-Max-Age", "86400"); // 24 hours
  
  // Security headers
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
}

function handleOptions(req, res) {
  if (req.method === "OPTIONS") {
    setCors(res);
    res.statusCode = 204;
    res.end();
    return true;
  }
  return false;
}

module.exports = {
  setCors,
  handleOptions
};
