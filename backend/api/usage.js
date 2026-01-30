const { handleOptions, setCors } = require("../lib/cors");
const { setJson } = require("../lib/http");
const { requireUser } = require("../lib/auth");
const { getUsage } = require("../lib/usage");

module.exports = async (req, res) => {
  setCors(res);
  if (handleOptions(req, res)) return;

  if (req.method !== "GET") {
    setJson(res, 405, { error: "Method not allowed" });
    return;
  }

  try {
    const user = await requireUser(req);
    const usage = await getUsage(user.id);

    setJson(res, 200, {
      user: {
        id: user.id,
        email: user.email,
        plan: user.plan,
        stripe_subscription_status: user.stripe_subscription_status
      },
      usage
    });
  } catch (e) {
    setJson(res, e.statusCode || 500, { error: e?.message || String(e) });
  }
};
