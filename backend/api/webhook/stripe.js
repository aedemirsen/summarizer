const Stripe = require("stripe");
const { setCors } = require("../../lib/cors");
const { setJson, readRaw } = require("../../lib/http");
const { query } = require("../../lib/db");

function stripeClient() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return new Stripe(key, { apiVersion: "2023-10-16" });
}

async function updateUserByCustomer(customerId, patch) {
  const fields = [];
  const vals = [];
  let i = 1;

  for (const [k, v] of Object.entries(patch)) {
    fields.push(`${k} = $${i}`);
    vals.push(v);
    i += 1;
  }

  vals.push(customerId);

  await query(
    `update users set ${fields.join(", ")} where stripe_customer_id = $${i}`,
    vals
  );
}

module.exports = async (req, res) => {
  setCors(res);

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== "POST") {
    setJson(res, 405, { error: "Method not allowed" });
    return;
  }

  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      setJson(res, 500, { error: "STRIPE_WEBHOOK_SECRET is not set" });
      return;
    }

    const stripe = stripeClient();

    const sig = req.headers["stripe-signature"];
    const raw = await readRaw(req, 2 * 1024 * 1024);

    let event;
    try {
      event = stripe.webhooks.constructEvent(raw, sig, webhookSecret);
    } catch (err) {
      setJson(res, 400, { error: `Webhook signature verification failed: ${err.message}` });
      return;
    }

    const type = event.type;

    if (type === "checkout.session.completed") {
      const session = event.data.object;
      if (session.mode === "subscription" && session.customer) {
        await updateUserByCustomer(session.customer, {
          stripe_subscription_id: session.subscription || null,
          stripe_subscription_status: "active",
          plan: "paid"
        });
      }
    }

    if (type.startsWith("customer.subscription.")) {
      const sub = event.data.object;
      const customerId = sub.customer;
      const status = sub.status;

      await updateUserByCustomer(customerId, {
        stripe_subscription_id: sub.id,
        stripe_subscription_status: status,
        plan: status === "active" ? "paid" : "free"
      });
    }

    setJson(res, 200, { received: true });
  } catch (e) {
    setJson(res, 500, { error: e?.message || String(e) });
  }
};
