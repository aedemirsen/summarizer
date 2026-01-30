const Stripe = require("stripe");
const { handleOptions, setCors } = require("../../lib/cors");
const { setJson, readJson } = require("../../lib/http");
const { requireUser } = require("../../lib/auth");
const { query } = require("../../lib/db");

function stripeClient() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return new Stripe(key, { apiVersion: "2023-10-16" });
}

module.exports = async (req, res) => {
  setCors(res);
  if (handleOptions(req, res)) return;

  if (req.method !== "POST") {
    setJson(res, 405, { error: "Method not allowed" });
    return;
  }

  try {
    const user = await requireUser(req);
    const body = await readJson(req);

    const interval = body.interval === "year" ? "year" : "month";

    const priceId =
      interval === "year"
        ? process.env.STRIPE_PRICE_YEARLY_ID
        : process.env.STRIPE_PRICE_MONTHLY_ID;

    if (!priceId) {
      setJson(res, 500, { error: "Stripe price ID is not configured" });
      return;
    }

    const appUrl = (process.env.APP_URL || "").replace(/\/$/, "");
    if (!appUrl) {
      setJson(res, 500, { error: "APP_URL is not set" });
      return;
    }

    const stripe = stripeClient();

    const row = await query(
      "select stripe_customer_id from users where id = $1",
      [user.id]
    );

    let customerId = row.rows[0]?.stripe_customer_id || "";

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { userId: user.id }
      });
      customerId = customer.id;

      await query(
        "update users set stripe_customer_id = $1 where id = $2",
        [customerId, user.id]
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/success`,
      cancel_url: `${appUrl}/cancel`,
      allow_promotion_codes: true
    });

    setJson(res, 200, {
      url: session.url,
      sessionId: session.id
    });
  } catch (e) {
    setJson(res, e.statusCode || 500, { error: e?.message || String(e) });
  }
};
