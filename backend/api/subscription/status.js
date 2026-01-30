const { handleOptions, setCors } = require("../../lib/cors");
const { setJson } = require("../../lib/http");
const { requireUser } = require("../../lib/auth");
const { query } = require("../../lib/db");

module.exports = async (req, res) => {
  setCors(res);
  if (handleOptions(req, res)) return;

  if (req.method !== "GET") {
    setJson(res, 405, { error: "Method not allowed" });
    return;
  }

  try {
    const user = await requireUser(req);

    const full = await query(
      "select plan, stripe_customer_id, stripe_subscription_id, stripe_subscription_status from users where id = $1",
      [user.id]
    );

    setJson(res, 200, {
      user: {
        id: user.id,
        email: user.email
      },
      subscription: full.rows[0]
    });
  } catch (e) {
    setJson(res, e.statusCode || 500, { error: e?.message || String(e) });
  }
};
