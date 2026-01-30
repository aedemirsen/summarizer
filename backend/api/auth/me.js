const { handleOptions, setCors } = require("../../lib/cors");
const { setJson } = require("../../lib/http");
const { requireUser } = require("../../lib/auth");

module.exports = async (req, res) => {
  setCors(res);
  if (handleOptions(req, res)) return;

  if (req.method !== "GET") {
    setJson(res, 405, { error: "Method not allowed" });
    return;
  }

  try {
    const user = await requireUser(req);
    setJson(res, 200, { user });
  } catch (e) {
    setJson(res, e.statusCode || 500, { error: e?.message || String(e) });
  }
};
