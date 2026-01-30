const DEFAULT_SETTINGS = {
  mode: "free",
  bulletSummary: false,
  uiLanguage: "auto",
  outputLanguage: "auto",
  provider: "groq",
  model: "llama-3.1-8b-instant",
  encryptedApiKeys: {},
  encryptedApiKey: null,
  subscription: {
    accessToken: ""
  }
};

const BACKEND_BASE_URL = "http://103.83.87.101:9090";

const INSTALL_ID_KEY = "extensionInstallId";
const LAST_ACTIVE_PING_KEY = "extensionLastActivePing";
const INSTALLED_PING_SENT_KEY = "extensionInstalledPingSent";

function makeInstallId() {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  const b64 = toBase64(bytes)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
  return `i_${b64}`;
}

async function getOrCreateInstallId() {
  const stored = await chrome.storage.local.get([INSTALL_ID_KEY]);
  const existing = stored?.[INSTALL_ID_KEY];
  if (existing && typeof existing === "string") return existing;
  const id = makeInstallId();
  await chrome.storage.local.set({ [INSTALL_ID_KEY]: id });
  return id;
}

async function maybeSendActivePing(settings) {
  const base = (BACKEND_BASE_URL || "").trim().replace(/\/+$/, "");
  if (!base) return;

  // If backend URL was configured after install, emit a one-time install event.
  const installedState = await chrome.storage.local.get([INSTALLED_PING_SENT_KEY]);
  if (!installedState?.[INSTALLED_PING_SENT_KEY]) {
    await chrome.storage.local.set({ [INSTALLED_PING_SENT_KEY]: true });
    await sendTelemetryEvent(settings, "installed");
  }

  const now = Date.now();
  const stored = await chrome.storage.local.get([LAST_ACTIVE_PING_KEY]);
  const last = stored?.[LAST_ACTIVE_PING_KEY] || 0;
  // at most once per 12 hours
  if (last && now - last < 12 * 60 * 60 * 1000) return;

  await chrome.storage.local.set({ [LAST_ACTIVE_PING_KEY]: now });
  await sendTelemetryEvent(settings, "active");
}

async function sendTelemetryEvent(settings, eventType) {
  const base = (BACKEND_BASE_URL || "").trim().replace(/\/+$/, "");
  if (!base) return;

  const installId = await getOrCreateInstallId();
  const version = chrome.runtime.getManifest().version || "";

  try {
    await fetch(`${base}/api/extension/telemetry`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        installId,
        eventType,
        extensionVersion: version
      })
    });
  } catch {
    // ignore
  }
}

async function summarizeViaBackend({ settings, text }) {
  const base = (BACKEND_BASE_URL || "").trim().replace(/\/+$/, "");
  if (!base) {
    return { ok: false, errorCode: "FREE_BACKEND_NOT_SET" };
  }

  const installId = await getOrCreateInstallId();
  const version = chrome.runtime.getManifest().version || "";

  const provider = (settings.provider || "groq").trim().toLowerCase();
  const model = (settings.model || "").trim();
  const bulletSummary = !!settings.bulletSummary;
  const outputLanguage = (settings.outputLanguage || "auto").trim();

  let resp;
  try {
    resp = await fetch(`${base}/api/extension/summarize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        installId,
        extensionVersion: version,
        text,
        provider,
        model,
        bulletSummary,
        outputLanguage
      })
    });
  } catch {
    return { ok: false, errorCode: "NETWORK_ERROR" };
  }

  let data = null;
  try {
    data = await resp.json();
  } catch {
    data = null;
  }

  if (!resp.ok || !data?.ok) {
    const code = data?.errorCode || (resp.status === 429 ? "FREE_LIMIT_REACHED" : "PROVIDER_ERROR");
    return { ok: false, errorCode: code, usage: data?.usage || null };
  }

  return { ok: true, summary: data.summary, usage: data?.usage || null };
}

async function getFreeUsageViaBackend(provider) {
  const base = (BACKEND_BASE_URL || "").trim().replace(/\/+$/, "");
  if (!base) return { ok: false, errorCode: "FREE_BACKEND_NOT_SET" };

  const installId = await getOrCreateInstallId();
  const version = chrome.runtime.getManifest().version || "";
  const prov = (provider || "groq").trim().toLowerCase();

  let resp;
  try {
    resp = await fetch(`${base}/api/extension/usage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        installId,
        extensionVersion: version,
        provider: prov
      })
    });
  } catch {
    return { ok: false, errorCode: "NETWORK_ERROR" };
  }

  let data = null;
  try {
    data = await resp.json();
  } catch {
    data = null;
  }

  if (!resp.ok || !data?.ok) {
    return { ok: false, errorCode: data?.errorCode || "PROVIDER_ERROR" };
  }

  return { ok: true, usage: data?.usage || null };
}

function toBase64(bytes) {
  const bin = String.fromCharCode(...new Uint8Array(bytes));
  return btoa(bin);
}

function fromBase64(b64) {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

async function getSettings() {
  const stored = await chrome.storage.sync.get(["settings"]);
  const merged = { ...DEFAULT_SETTINGS, ...(stored.settings || {}) };

  const provider = (merged.provider || "groq").trim();
  const map = (merged.encryptedApiKeys && typeof merged.encryptedApiKeys === "object")
    ? { ...merged.encryptedApiKeys }
    : {};

  // Backward compat: only migrate legacy encryptedApiKey into the provider map
  // when there are no provider keys saved yet.
  if (merged.encryptedApiKey && Object.keys(map).length === 0 && !map[provider]) {
    map[provider] = merged.encryptedApiKey;
  }

  return {
    ...merged,
    encryptedApiKeys: map
  };
}

async function setSettings(settings) {
  await chrome.storage.sync.set({ settings });
}

async function getOrCreateMasterKey() {
  const stored = await chrome.storage.sync.get(["masterKeyJwk"]);
  const existing = stored.masterKeyJwk;

  if (existing) {
    return crypto.subtle.importKey(
      "jwk",
      existing,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );
  }

  const key = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
  const jwk = await crypto.subtle.exportKey("jwk", key);
  await chrome.storage.sync.set({ masterKeyJwk: jwk });

  return crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

async function encryptApiKey(apiKey) {
  const raw = (apiKey || "").trim();
  if (!raw) return null;

  const key = await getOrCreateMasterKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const enc = new TextEncoder();

  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    enc.encode(raw)
  );

  return {
    scheme: "aes-gcm-v1",
    ciphertextBase64: toBase64(ciphertext),
    ivBase64: toBase64(iv)
  };
}

async function decryptApiKey(encryptedApiKey) {
  if (!encryptedApiKey) return "";

  if (encryptedApiKey.saltBase64 || encryptedApiKey.iterations) {
    const err = new Error("API key format is invalid.");
    err.errorCode = "API_KEY_FORMAT_INVALID";
    throw err;
  }

  if (encryptedApiKey.scheme !== "aes-gcm-v1") {
    const err = new Error("API key format is invalid.");
    err.errorCode = "API_KEY_FORMAT_INVALID";
    throw err;
  }

  const { ciphertextBase64, ivBase64 } = encryptedApiKey;
  if (!ciphertextBase64 || !ivBase64) return "";

  const iv = fromBase64(ivBase64);
  const ciphertext = fromBase64(ciphertextBase64);
  const key = await getOrCreateMasterKey();

  let plaintext;
  try {
    plaintext = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      ciphertext
    );
  } catch {
    const err = new Error("Failed to decrypt API key.");
    err.errorCode = "API_KEY_DECRYPT_FAILED";
    throw err;
  }

  return new TextDecoder().decode(plaintext);
}

function makeProviderError(provider, errorCode, httpStatus) {
  const err = new Error("Provider request failed.");
  err.errorCode = errorCode;
  err.provider = provider;
  if (typeof httpStatus === "number") err.httpStatus = httpStatus;
  return err;
}

function errorCodeFromHttp(provider, status, parsedBody) {
  if (status === 401 || status === 403) return "INVALID_API_KEY";
  if (status === 429) return "RATE_LIMITED";
  if (status === 404) return "MODEL_NOT_FOUND";
  if (status >= 500) return "PROVIDER_UNAVAILABLE";

  const msg = (parsedBody?.error?.message || parsedBody?.message || "").toLowerCase();
  if (msg.includes("invalid api key") || msg.includes("api key not valid") || msg.includes("incorrect api key") || msg.includes("unauthorized") || msg.includes("unauthenticated")) {
    return "INVALID_API_KEY";
  }
  if (msg.includes("rate limit") || msg.includes("too many") || msg.includes("quota")) return "RATE_LIMITED";
  if (msg.includes("model") && (msg.includes("not found") || msg.includes("does not exist"))) return "MODEL_NOT_FOUND";
  return "PROVIDER_ERROR";
}

async function readJsonBodySafe(resp) {
  const text = await resp.text().catch(() => "");
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

function languageLabel(code) {
  const c = (code || "").toLowerCase();
  if (c === "en") return "English";
  if (c === "tr") return "Turkish";
  if (c === "de") return "German";
  if (c === "fr") return "French";
  if (c === "es") return "Spanish";
  if (c === "it") return "Italian";
  if (c === "pt") return "Portuguese";
  if (c === "ru") return "Russian";
  if (c === "ar") return "Arabic";
  if (c === "zh") return "Chinese";
  return code || "";
}

function summarizePrompt(text, { bulletSummary, outputLanguage }) {
  const summaryFormat = bulletSummary
    ? `Output format:
- Bullet points only.
- 4-8 bullets.
- Each bullet should be one sentence.`
    : `Output format:
- A short paragraph (2-5 sentences).
- No bullet points.`;

  const outLang = (outputLanguage || "auto").trim().toLowerCase();
  const outputRule = outLang && outLang !== "auto"
    ? `- Output MUST be in ${languageLabel(outLang)} (even if the input is in a different language).`
    : "- Keep the output in the same language as the input.";

  return `You are a precise summarizer.

Task:
- Read the input and output ONLY the summary.
- Keep ONLY the most important parts. Do not include filler.
- Keep the summary short and precise.
${outputRule}

Special case (code):
- If the input is code or looks like code, do NOT summarize the text content.
- Instead explain what the code does as bullet points:
  - high-level purpose
  - main functions/classes and their responsibilities
  - important inputs/outputs
  - important side effects (network, storage, DOM)
  - error handling/edge cases

${summaryFormat}

Styling:
- Use **bold** for key terms, *italic* for emphasis, and \`inline code\` for identifiers when helpful.
- Do not use markdown code fences.
- Do not quote the input.

Input:
"""
${text}
"""`;
}

async function callGroq({ apiKey, model, text }) {
  let resp;
  try {
    resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: text }
        ],
        temperature: 0.2
      })
    });
  } catch {
    throw makeProviderError("groq", "NETWORK_ERROR");
  }

  if (!resp.ok) {
    const body = await readJsonBodySafe(resp);
    throw makeProviderError("groq", errorCodeFromHttp("groq", resp.status, body), resp.status);
  }

  const data = await resp.json();
  return data?.choices?.[0]?.message?.content?.trim() || "";
}

async function callAnthropic({ apiKey, model, text }) {
  const usedModel = typeof model === "string" && /^claude-/i.test(model)
    ? model
    : "claude-3-5-haiku-20241022";

  let resp;
  try {
    resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: usedModel,
        max_tokens: 700,
        temperature: 0.2,
        messages: [{ role: "user", content: text }]
      })
    });
  } catch {
    throw makeProviderError("anthropic", "NETWORK_ERROR");
  }

  if (!resp.ok) {
    const body = await readJsonBodySafe(resp);
    throw makeProviderError("anthropic", errorCodeFromHttp("anthropic", resp.status, body), resp.status);
  }

  const data = await resp.json();
  const parts = data?.content;
  const out = Array.isArray(parts)
    ? parts.map((p) => (p?.type === "text" ? (p?.text || "") : "")).join("")
    : "";
  return out.trim();
}

async function callGemini({ apiKey, model, text }) {
  const usedModel = typeof model === "string" && /^gemini-/i.test(model)
    ? model
    : "gemini-2.5-flash";

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    usedModel
  )}:generateContent?key=${encodeURIComponent(apiKey)}`;

  let resp;
  try {
    resp = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text }]
          }
        ]
      })
    });
  } catch {
    throw makeProviderError("gemini", "NETWORK_ERROR");
  }

  if (!resp.ok) {
    const body = await readJsonBodySafe(resp);
    throw makeProviderError("gemini", errorCodeFromHttp("gemini", resp.status, body), resp.status);
  }

  const data = await resp.json();
  const parts = data?.candidates?.[0]?.content?.parts;
  const out = Array.isArray(parts) ? parts.map((p) => p?.text || "").join("") : "";
  return out.trim();
}

async function callOpenAI({ apiKey, model, text }) {
  let resp;
  try {
    resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: text }
        ],
        temperature: 0.2
      })
    });
  } catch {
    throw makeProviderError("openai", "NETWORK_ERROR");
  }

  if (!resp.ok) {
    const body = await readJsonBodySafe(resp);
    throw makeProviderError("openai", errorCodeFromHttp("openai", resp.status, body), resp.status);
  }

  const data = await resp.json();
  return data?.choices?.[0]?.message?.content?.trim() || "";
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  (async () => {
    if (msg?.type === "GET_SETTINGS") {
      const settings = await getSettings();
      maybeSendActivePing(settings).catch(() => {});
      sendResponse({ ok: true, settings });
      return;
    }

    if (msg?.type === "GET_FREE_USAGE") {
      const settings = await getSettings();
      maybeSendActivePing(settings).catch(() => {});

      if (settings.mode !== "free") {
        sendResponse({ ok: true, usage: null });
        return;
      }

      const provider = (msg.provider || settings.provider || "groq").trim().toLowerCase();
      const r = await getFreeUsageViaBackend(provider);
      if (r.ok) {
        sendResponse({ ok: true, usage: r.usage || null });
      } else {
        sendResponse({ ok: false, errorCode: r.errorCode || "UNKNOWN_ERROR" });
      }
      return;
    }

    if (msg?.type === "SAVE_SETTINGS_UI") {
      const existing = await getSettings();
      const incoming = msg?.settings || {};
      const rawApiKey = (msg?.rawApiKey || "").trim();
      const provider = (incoming.provider || existing.provider || "groq").trim();
      const encryptedApiKeys = {
        ...(existing.encryptedApiKeys && typeof existing.encryptedApiKeys === "object" ? existing.encryptedApiKeys : {})
      };
      if (rawApiKey) {
        encryptedApiKeys[provider] = await encryptApiKey(rawApiKey);
      }

      const encryptedApiKey = existing.encryptedApiKey || null;

      const next = {
        ...existing,
        ...incoming,
        encryptedApiKeys,
        encryptedApiKey
      };

      await setSettings(next);
      sendResponse({ ok: true });
      return;
    }

    if (msg?.type === "DELETE_PROVIDER_API_KEY") {
      const existing = await getSettings();
      const provider = (msg?.provider || "").trim();
      if (!provider) {
        sendResponse({ ok: false, error: "Missing provider." });
        return;
      }

      const encryptedApiKeys = {
        ...(existing.encryptedApiKeys && typeof existing.encryptedApiKeys === "object" ? existing.encryptedApiKeys : {})
      };
      delete encryptedApiKeys[provider];

      // If there are no provider keys left, also clear legacy encryptedApiKey.
      // Otherwise deleted keys could reappear due to backward-compat fallback.
      const noKeysLeft = Object.keys(encryptedApiKeys).length === 0;

      const next = {
        ...existing,
        encryptedApiKeys,
        encryptedApiKey: noKeysLeft ? null : existing.encryptedApiKey
      };

      await setSettings(next);
      sendResponse({ ok: true });
      return;
    }

    if (msg?.type === "SAVE_SETTINGS") {
      const existing = await getSettings();
      const incoming = msg.settings || {};

      const encryptedApiKeys = incoming.encryptedApiKeys && typeof incoming.encryptedApiKeys === "object"
        ? { ...incoming.encryptedApiKeys }
        : { ...(existing.encryptedApiKeys && typeof existing.encryptedApiKeys === "object" ? existing.encryptedApiKeys : {}) };

      const settings = {
        ...existing,
        ...incoming,
        encryptedApiKeys
      };

      await setSettings(settings);
      sendResponse({ ok: true });
      return;
    }

    if (msg?.type === "SUMMARIZE") {
      const settings = await getSettings();
      maybeSendActivePing(settings).catch(() => {});
      const text = (msg.text || "").trim();
      if (!text) {
        sendResponse({ ok: false, errorCode: "NO_TEXT" });
        return;
      }

      if (settings.mode === "free") {
        sendTelemetryEvent(settings, "summarize_free_attempt").catch(() => {});
        const r = await summarizeViaBackend({ settings, text });
        if (r.ok) {
          sendTelemetryEvent(settings, "summarize_free_ok").catch(() => {});
          sendResponse({ ok: true, summary: r.summary, usage: r.usage || null });
        } else {
          sendTelemetryEvent(settings, "summarize_free_error").catch(() => {});
          sendResponse({ ok: false, errorCode: r.errorCode || "UNKNOWN_ERROR", usage: r.usage || null });
        }
        return;
      }

      const provider = (settings.provider || "groq").trim();
      const keysMap = (settings.encryptedApiKeys && typeof settings.encryptedApiKeys === "object")
        ? settings.encryptedApiKeys
        : {};

      // Prefer provider-specific key. Only fall back to legacy encryptedApiKey
      // if no provider keys exist at all.
      const encryptedApiKeyForProvider = keysMap?.[provider]
        || (Object.keys(keysMap).length === 0 ? settings.encryptedApiKey : null);
      let apiKey = "";
      try {
        apiKey = await decryptApiKey(encryptedApiKeyForProvider);
      } catch (e) {
        sendResponse({ ok: false, errorCode: e?.errorCode || "UNKNOWN_ERROR", provider });
        return;
      }
      if (!apiKey) {
        sendResponse({ ok: false, errorCode: "API_KEY_NOT_SET", provider });
        return;
      }

      const bulletSummary = !!settings.bulletSummary;
      const outputLanguage = (settings.outputLanguage || "auto").trim();
      const prompt = summarizePrompt(text, { bulletSummary, outputLanguage });
      let summary = "";
      try {
        if (provider === "openai") {
          summary = await callOpenAI({ apiKey, model: settings.model, text: prompt });
        } else if (provider === "gemini") {
          summary = await callGemini({ apiKey, model: settings.model, text: prompt });
        } else if (provider === "anthropic") {
          summary = await callAnthropic({ apiKey, model: settings.model, text: prompt });
        } else {
          summary = await callGroq({ apiKey, model: settings.model, text: prompt });
        }

        sendTelemetryEvent(settings, "summarize_own_ok").catch(() => {});
        sendResponse({ ok: true, summary });
      } catch (e) {
        sendTelemetryEvent(settings, "summarize_own_error").catch(() => {});
        sendResponse({ ok: false, errorCode: e?.errorCode || "PROVIDER_ERROR", provider });
      }
      return;
    }

    sendResponse({ ok: false, error: "Unknown message." });
  })().catch((e) => {
    sendResponse({ ok: false, errorCode: e?.errorCode || "UNKNOWN_ERROR", provider: e?.provider });
  });

  return true;
});
