const fs = require("fs");
const path = require("path");

function requiredEnv(name) {
  const v = process.env[name];
  if (!v) {
    console.error(`Missing required env var: ${name}`);
    process.exitCode = 1;
    return "";
  }
  return v;
}

function normalizeBaseUrl(url) {
  const u = (url || "").trim().replace(/\/+$/, "");
  if (!u) return "";
  if (!/^https?:\/\//i.test(u)) {
    console.error("EXTENSION_BACKEND_BASE_URL must start with http:// or https://");
    process.exitCode = 1;
    return "";
  }
  return u;
}

const baseUrl = normalizeBaseUrl(requiredEnv("EXTENSION_BACKEND_BASE_URL"));
if (!baseUrl) process.exit(1);

const outFile = path.join(__dirname, "..", "extension", "config.js");

const content = `// API Configuration\n// This file is generated. Do not edit manually.\nconst API_CONFIG = {\n  baseUrl: ${JSON.stringify(baseUrl)}\n};\n\n// Expose for Chrome extension service worker (importScripts)\nif (typeof self !== \"undefined\") {\n  self.API_CONFIG = API_CONFIG;\n}\n\n// Export for Node.js tooling\nif (typeof module !== \"undefined\" && module.exports) {\n  module.exports = API_CONFIG;\n}\n`;

fs.writeFileSync(outFile, content, "utf8");
console.log(`Generated extension/config.js with baseUrl=${baseUrl}`);
