const { handleOptions, setCors } = require("../lib/cors");
const { setJson, readJson } = require("../lib/http");
const { requireUser } = require("../lib/auth");
const { checkAndIncrement } = require("../lib/usage");
const { summarizeWithManagedProvider } = require("../lib/llm");

function clampText(text, maxChars) {
  const cleaned = (text || "")
    .replace(/\u0000/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned.length > maxChars ? cleaned.slice(0, maxChars) : cleaned;
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

    const text = clampText(body.text, 5000);
    const model = typeof body.model === "string" ? body.model : "";

    if (!text) {
      setJson(res, 400, { error: "Missing text" });
      return;
    }

    const effectivePlan = user.stripe_subscription_status === "active" ? "paid" : "free";

    const usage = await checkAndIncrement(user.id, effectivePlan);
    if (!usage.ok) {
      setJson(res, 429, {
        error: "Usage limit reached",
        usage
      });
      return;
    }

    const summary = await summarizeWithManagedProvider({ text, model });

    setJson(res, 200, { summary, usage });
  } catch (e) {
    setJson(res, e.statusCode || 500, { error: e?.message || String(e) });
  }
};
