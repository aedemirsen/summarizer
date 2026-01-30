const MAX_JSON_BYTES = 1024 * 1024;

function setJson(res, statusCode, obj) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(obj));
}

function readRaw(req, maxBytes = MAX_JSON_BYTES) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let total = 0;

    req.on("data", (chunk) => {
      total += chunk.length;
      if (total > maxBytes) {
        reject(new Error("Request body too large"));
        req.destroy();
        return;
      }
      chunks.push(Buffer.from(chunk));
    });

    req.on("end", () => {
      resolve(Buffer.concat(chunks));
    });

    req.on("error", (err) => reject(err));
  });
}

async function readJson(req, maxBytes = MAX_JSON_BYTES) {
  const raw = await readRaw(req, maxBytes);
  if (!raw || raw.length === 0) return {};

  try {
    return JSON.parse(raw.toString("utf8"));
  } catch {
    const err = new Error("Invalid JSON");
    err.statusCode = 400;
    throw err;
  }
}

module.exports = {
  setJson,
  readJson,
  readRaw
};
