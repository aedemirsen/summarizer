function summarizePrompt(text) {
  return `You are a precise summarizer.

Task:
- Read the input and output ONLY the summary.
- Keep ONLY the most important parts. Do not include filler.
- Keep the summary short and precise.
- Output MUST be bullet points only (no title, no intro, no markdown code fences).
- Keep the output in the same language as the input.

Special case (code):
- If the input is code or looks like code, do NOT summarize the text content.
- Instead explain what the code does as bullet points:
  - high-level purpose
  - main functions/classes and their responsibilities
  - important inputs/outputs
  - important side effects (network, storage, DOM)
  - error handling/edge cases

Formatting rules:
- 4-8 bullet points.
- Each bullet should be one sentence.
- Do not quote the input.

Styling:
- Use **bold** for key terms and *italic* for emphasis when helpful.
- Do not use markdown code fences.

Input:
"""
${text}
"""`;
}

function getManagedProvider() {
  return (process.env.MANAGED_PROVIDER || "groq").toLowerCase();
}

function getManagedApiKey(provider) {
  if (provider === "gemini") return process.env.GEMINI_API_KEY || "";
  if (provider === "openai") return process.env.OPENAI_API_KEY || "";
  return process.env.GROQ_API_KEY || "";
}

function getEndpoint(provider) {
  if (provider === "gemini") return "https://generativelanguage.googleapis.com/v1beta";
  if (provider === "openai") return "https://api.openai.com/v1/chat/completions";
  return "https://api.groq.com/openai/v1/chat/completions";
}

async function summarizeWithGemini({ apiKey, text, model }) {
  const candidateModel = model || process.env.DEFAULT_MODEL || "";
  const usedModel = /^gemini-/i.test(candidateModel) ? candidateModel : "gemini-2.5-flash";
  const base = getEndpoint("gemini");

  const url = `${base}/models/${encodeURIComponent(usedModel)}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: summarizePrompt(text) }]
        }
      ]
    })
  });

  if (!resp.ok) {
    const t = await resp.text().catch(() => "");
    throw new Error(`LLM error (${resp.status}): ${t || resp.statusText}`);
  }

  const data = await resp.json();
  const parts = data?.candidates?.[0]?.content?.parts;
  const out = Array.isArray(parts) ? parts.map((p) => p?.text || "").join("") : "";
  return out.trim();
}

async function summarizeWithManagedProvider({ text, model }) {
  const provider = getManagedProvider();
  const apiKey = getManagedApiKey(provider);
  if (!apiKey) {
    throw new Error("Managed LLM API key is not configured on server");
  }

  if (provider === "gemini") {
    return summarizeWithGemini({ apiKey, text, model });
  }

  const usedModel = model || process.env.DEFAULT_MODEL || "llama-3.1-8b-instant";

  const resp = await fetch(getEndpoint(provider), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: usedModel,
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: summarizePrompt(text) }
      ],
      temperature: 0.2
    })
  });

  if (!resp.ok) {
    const t = await resp.text().catch(() => "");
    throw new Error(`LLM error (${resp.status}): ${t || resp.statusText}`);
  }

  const data = await resp.json();
  return data?.choices?.[0]?.message?.content?.trim() || "";
}

module.exports = {
  summarizeWithManagedProvider
};
