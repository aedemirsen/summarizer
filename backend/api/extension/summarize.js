const { handleOptions, setCors } = require("../../lib/cors");
const { setJson, readJson } = require("../../lib/http");
const { isValidInstallId, upsertInstall, insertEvent, checkAndIncrementInstallDaily } = require("../../lib/extensionTelemetry");

function clampText(text, maxChars) {
  const cleaned = (text || "")
    .replace(/\u0000/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned.length > maxChars ? cleaned.slice(0, maxChars) : cleaned;
}

function summarizePrompt(text, { bulletSummary, outputLanguage }) {
  const textLength = text.length;
  
  // Determine summary length and detail level based on input text length
  let summaryLength;
  let detailInstruction;
  
  if (textLength < 800) {
    summaryLength = "very short (1-2 sentences)";
    detailInstruction = "Focus on a single core point.";
  } else if (textLength < 2000) {
    summaryLength = "short (3-4 sentences)";
    detailInstruction = "Capture the main argument and key result.";
  } else if (textLength < 4000) {
    summaryLength = "medium (5-7 sentences)";
    detailInstruction = "Cover the primary narrative and supporting evidence. Do not omit crucial context.";
  } else {
    summaryLength = "comprehensive (8-12 sentences)";
    detailInstruction = "Provide a thorough summary that covers all major sections and nuances. Ensure no significant topic or conclusion is missed due to length.";
  }

  const summaryFormat = bulletSummary
    ? `Output format:\n- Bullet points only.\n- ${textLength < 1500 ? '3-5' : textLength < 3000 ? '6-8' : '8-12'} bullets.\n- Each bullet should be a meaningful, informative sentence.`
    : `Output format:\n- A ${summaryLength} paragraph.\n- No bullet points.`;

  const langLabel = (code) => {
    const c = (code || "").toLowerCase();
    const map = {
      en: "English", tr: "Turkish", de: "German", fr: "French",
      es: "Spanish", it: "Italian", pt: "Portuguese", ru: "Russian",
      ar: "Arabic", zh: "Chinese"
    };
    return map[c] || code || "";
  };

  const outLang = (outputLanguage || "auto").trim().toLowerCase();
  const outputRule = outLang && outLang !== "auto"
    ? `- Output MUST be in ${langLabel(outLang)} (even if the input is in a different language).`
    : "- Keep the output in the same language as the input.";

  return `You are an expert summarizer who maintains context and nuance.

Task:
- Read the input and output ONLY the summary.
- Adjust summary length and depth based on input length: ${summaryLength}.
- ${detailInstruction}
- For long texts, ensure the summary captures the structure and all major points of the source.
${outputRule}

${summaryFormat}

Styling:
- Use **bold** for key concepts and *italic* for emphasis.
- No markdown code fences.
- No introduction or filler text (e.g., "This is a summary...").

Input:
"""
${text}
"""`;
}

function getAllowedFreeModels() {
  // You can tune this allowlist without changing the extension.
  // Groq models
  const groq = [
    "llama-3.1-8b-instant"
  ];

  // Gemini models
  const gemini = [
    "gemini-2.5-flash"
  ];

  // OpenAI: keep empty by default (paid)
  const openai = [];

  return { groq, gemini, openai };
}

function getProviderApiKey(provider) {
  if (provider === "gemini") return process.env.GEMINI_API_KEY || "";
  if (provider === "openai") return process.env.OPENAI_API_KEY || "";
  return process.env.GROQ_API_KEY || "";
}

function getEndpoint(provider) {
  if (provider === "gemini") return "https://generativelanguage.googleapis.com/v1beta";
  if (provider === "openai") return "https://api.openai.com/v1/chat/completions";
  return "https://api.groq.com/openai/v1/chat/completions";
}

async function summarizeWithProvider({ provider, apiKey, model, prompt }) {
  if (provider === "gemini") {
    const base = getEndpoint("gemini");
    const url = `${base}/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;

    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }]
      })
    });

    if (!resp.ok) {
      const t = await resp.text().catch(() => "");
      const err = new Error(`LLM error (${resp.status}): ${t || resp.statusText}`);
      err.httpStatus = resp.status;
      throw err;
    }

    const data = await resp.json();
    const parts = data?.candidates?.[0]?.content?.parts;
    const out = Array.isArray(parts) ? parts.map((p) => p?.text || "").join("") : "";
    return out.trim();
  }

  const resp = await fetch(getEndpoint(provider), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt }
      ],
      temperature: 0.2
    })
  });

  if (!resp.ok) {
    const t = await resp.text().catch(() => "");
    const err = new Error(`LLM error (${resp.status}): ${t || resp.statusText}`);
    err.httpStatus = resp.status;
    throw err;
  }

  const data = await resp.json();
  return data?.choices?.[0]?.message?.content?.trim() || "";
}

function errorCodeFromHttpStatus(status, message) {
  if (status === 429) return "FREE_QUOTA_REACHED";
  if (status === 401 || status === 403) return "MANAGED_KEY_INVALID";
  if (status === 404) return "MODEL_NOT_FOUND";
  if (status >= 500) return "PROVIDER_UNAVAILABLE";

  const msg = (message || "").toLowerCase();
  if (msg.includes("quota") || msg.includes("rate")) return "FREE_QUOTA_REACHED";
  return "PROVIDER_ERROR";
}

async function ensureInstallExists(installId, extensionVersion, req) {
  const ua = (req.headers["user-agent"] || "").toString();
  await upsertInstall({ installId, extensionVersion, userAgent: ua });
}

module.exports = async (req, res) => {
  setCors(res);
  if (handleOptions(req, res)) return;

  if (req.method !== "POST") {
    setJson(res, 405, { error: "Method not allowed" });
    return;
  }

  try {
    const body = await readJson(req);
    const installId = (body.installId || "").trim();
    const extensionVersion = (body.extensionVersion || "").trim();

    if (!isValidInstallId(installId)) {
      setJson(res, 400, { error: "Invalid installId" });
      return;
    }

    await ensureInstallExists(installId, extensionVersion, req);

    const text = clampText(body.text, 5000);
    const provider = (body.provider || "").trim().toLowerCase();
    const model = (body.model || "").trim();
    const bulletSummary = !!body.bulletSummary;
    const outputLanguage = (body.outputLanguage || "auto").trim();

    const usage = await checkAndIncrementInstallDaily(installId, provider);
    if (!usage.ok) {
      await insertEvent({ installId, eventType: "free_limit_reached" });
      setJson(res, 429, { ok: false, errorCode: "FREE_LIMIT_REACHED", usage });
      return;
    }

    if (!text) {
      setJson(res, 400, { ok: false, errorCode: "NO_TEXT" });
      return;
    }
    const allowed = getAllowedFreeModels();
    const allowedModels = allowed?.[provider] || [];
    if (!provider || !Array.isArray(allowedModels) || !allowedModels.includes(model)) {
      setJson(res, 400, { ok: false, errorCode: "FREE_MODEL_NOT_ALLOWED" });
      return;
    }

    const apiKey = getProviderApiKey(provider);
    if (!apiKey) {
      setJson(res, 500, { ok: false, errorCode: "MANAGED_KEY_NOT_CONFIGURED" });
      return;
    }

    const prompt = summarizePrompt(text, { bulletSummary, outputLanguage });

    try {
      const summary = await summarizeWithProvider({ provider, apiKey, model, prompt });
      await insertEvent({ installId, eventType: "summarize_free" });
      setJson(res, 200, { ok: true, summary, usage });
    } catch (e) {
      const status = typeof e?.httpStatus === "number" ? e.httpStatus : 500;
      const code = errorCodeFromHttpStatus(status, e?.message || "");
      await insertEvent({ installId, eventType: "summarize_free_error" });
      setJson(res, status, { ok: false, errorCode: code, usage });
    }
  } catch (e) {
    setJson(res, e.statusCode || 500, { ok: false, error: e?.message || String(e) });
  }
};
