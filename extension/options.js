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
  return key;
}

async function encryptApiKey(apiKey) {
  if (!apiKey) return null;

  const key = await getOrCreateMasterKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const enc = new TextEncoder();

  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    enc.encode(apiKey)
  );

  return {
    scheme: "aes-gcm-v1",
    ciphertextBase64: toBase64(ciphertext),
    ivBase64: toBase64(iv)
  };
}

function $(id) {
  return document.getElementById(id);
}

const MODEL_CUSTOM_VALUE = "__custom__";

const PROVIDER_MODELS = {
  groq: ["llama-3.1-8b-instant", "llama-3.1-70b-versatile"],
  openai: ["gpt-4o-mini", "gpt-4o"],
  gemini: ["gemini-2.5-flash", "gemini-1.5-flash", "gemini-1.5-pro"],
  anthropic: ["claude-3-5-sonnet-20241022", "claude-3-5-haiku-20241022"]
};

const FREE_PROVIDER_MODELS = {
  groq: ["llama-3.1-8b-instant"],
  gemini: ["gemini-2.5-flash"]
};

function getModelsForProvider(provider) {
  const mode = ($("mode")?.value || "own_api").trim();
  if (mode === "free") return FREE_PROVIDER_MODELS[provider] || [];
  return PROVIDER_MODELS[provider] || [];
}

function setModelUIFromSettings({ provider, model }) {
  const select = $("modelSelect");
  const custom = $("modelCustom");

  const models = getModelsForProvider(provider);
  const isFree = ($("mode")?.value || "own_api").trim() === "free";
  const opts = isFree ? [...models] : [...models, MODEL_CUSTOM_VALUE];

  select.innerHTML = "";

  for (const v of opts) {
    const o = document.createElement("option");
    o.value = v;
    o.textContent = v === MODEL_CUSTOM_VALUE ? "Custom…" : v;
    select.appendChild(o);
  }

  const desired = (model || "").trim();
  if (!desired && models.length > 0) {
    select.value = models[0];
    custom.classList.add("hidden");
    custom.value = "";
    return;
  }
  const inList = models.includes(desired);

  if (inList) {
    select.value = desired;
    custom.classList.add("hidden");
    custom.value = "";
    return;
  }

  if (!isFree) {
    select.value = MODEL_CUSTOM_VALUE;
    custom.classList.remove("hidden");
    custom.value = desired;
    return;
  }

  // Free mode: no custom models.
  select.value = models[0] || "";
  custom.classList.add("hidden");
  custom.value = "";
}

function getModelFromUI() {
  const select = $("modelSelect");
  const custom = $("modelCustom");

  if (select.value === MODEL_CUSTOM_VALUE) {
    const v = custom.value.trim();
    return v;
  }

  return select.value;
}

async function getSettings() {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ type: "GET_SETTINGS" }, (resp) => {
      resolve(resp?.settings || null);
    });
  });
}

async function saveSettings(settings) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ type: "SAVE_SETTINGS", settings }, (resp) => resolve(resp));
  });
}

async function main() {
  const settings = (await getSettings()) || {};

  $("mode").value = settings.mode || "free";
  $("provider").value = settings.provider || "groq";
  $("bulletSummary").checked = !!settings.bulletSummary;

  setModelUIFromSettings({
    provider: $("provider").value,
    model: settings.model || ""
  });

  function writeStatus(obj) {
    $("status").textContent = typeof obj === "string" ? obj : JSON.stringify(obj, null, 2);
  }

  function applyModeUI() {
    const isFree = $("mode").value === "free";
    $("apiKey").disabled = isFree;
    $("apiKey").closest("label")?.classList?.toggle("hidden", isFree);

    const providerEl = $("provider");
    const allowedProviders = Object.keys(FREE_PROVIDER_MODELS);
    if (providerEl && providerEl.options) {
      for (const opt of providerEl.options) {
        opt.disabled = isFree && !allowedProviders.includes(opt.value);
        opt.hidden = isFree && !allowedProviders.includes(opt.value);
      }
      if (isFree && !allowedProviders.includes(providerEl.value)) {
        providerEl.value = allowedProviders[0] || "groq";
      }
    }

    setModelUIFromSettings({
      provider: $("provider").value,
      model: ""
    });
  }

  $("mode").addEventListener("change", () => {
    applyModeUI();
  });

  applyModeUI();

  $("save").addEventListener("click", async () => {
    try {
      const mode = $("mode").value;
      const provider = $("provider").value;
      const model = getModelFromUI();
      const bulletSummary = !!$("bulletSummary").checked;

      const rawApiKey = $("apiKey").value.trim();
      const encryptedApiKey = rawApiKey
        ? await encryptApiKey(rawApiKey)
        : (settings.encryptedApiKey || null);

      const next = {
        ...settings,
        mode,
        bulletSummary,
        provider,
        model: model || ((getModelsForProvider(provider)[0]) || ""),
        encryptedApiKey
      };

      await saveSettings(next);
      $("apiKey").value = "";

      settings.provider = provider;
      settings.model = model;
      settings.encryptedApiKey = encryptedApiKey;
      settings.mode = mode;
      settings.bulletSummary = bulletSummary;

      writeStatus({
        ok: true,
        message: mode === "free"
          ? "Saved. Free mode is coming soon."
          : (rawApiKey ? "API key saved." : "Settings saved (API key unchanged).")
      });
    } catch (e) {
      writeStatus({ ok: false, error: e?.message || String(e) });
    }
  });

  $("provider").addEventListener("change", () => {
    setModelUIFromSettings({
      provider: $("provider").value,
      model: getModelFromUI() || ""
    });
  });

  $("modelSelect").addEventListener("change", () => {
    if ($("modelSelect").value === MODEL_CUSTOM_VALUE) {
      $("modelCustom").classList.remove("hidden");
      $("modelCustom").focus();
    } else {
      $("modelCustom").classList.add("hidden");
      $("modelCustom").value = "";
    }
  });
}

main().catch((e) => {
  const el = document.getElementById("status");
  if (el) el.textContent = e?.message || String(e);
});
