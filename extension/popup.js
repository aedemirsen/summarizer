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

const I18N = {
  en: {
    title: "AI Text Summarizer",
    uiLanguage: "UI language",
    outputLanguage: "Output language",
    mode: "Mode",
    ownApi: "Use my own API key",
    freeMode: "Free",
    provider: "Provider",
    model: "Model",
    customModel: "Custom…",
    apiKey: "API key",
    savedApiKeys: "Saved API keys",
    notSet: "Not set",
    delete: "Delete",
    confirmDeleteApiKey: "Delete saved API key for this provider?",
    apiKeyDeleted: "API key deleted from storage.",
    apiKeySavedMask: "Saved",
    bulletSummary: "Bullet summary",
    save: "Save",
    saved: "Saved.",
    apiKeySaved: "API key saved.",
    apiKeyUnchanged: "Settings saved (API key unchanged).",
    freeNotReady: "Free mode is not available yet.",
    auto: "Auto",
    footer: "Settings are saved in Chrome sync storage.",
    openSummaryPanel: "Open summary panel"
  },
  tr: {
    title: "AI Metin Özetleyici",
    uiLanguage: "Arayüz dili",
    outputLanguage: "Çıktı dili",
    mode: "Mod",
    ownApi: "Kendi API anahtarımı kullan",
    freeMode: "Ücretsiz",
    provider: "Sağlayıcı",
    model: "Model",
    customModel: "Özel…",
    apiKey: "API anahtarı",
    savedApiKeys: "Kayıtlı API anahtarları",
    notSet: "Eklenmemiş",
    delete: "Sil",
    confirmDeleteApiKey: "Bu sağlayıcı için kayıtlı API anahtarını silmek istiyor musunuz?",
    apiKeyDeleted: "API anahtarı storage'dan temizlendi.",
    apiKeySavedMask: "Kayıtlı",
    bulletSummary: "Özeti maddeler halinde oluştur",
    save: "Kaydet",
    saved: "Kaydedildi.",
    apiKeySaved: "API anahtarı kaydedildi.",
    apiKeyUnchanged: "Ayarlar kaydedildi (API anahtarı değişmedi).",
    freeNotReady: "Ücretsiz mod henüz hazır değil.",
    auto: "Otomatik",
    footer: "Ayarlar Chrome sync storage içinde saklanır.",
    openSummaryPanel: "Özet penceresini aç"
  },
  de: {
    title: "KI-Textzusammenfassung",
    uiLanguage: "Sprache der Oberfläche",
    outputLanguage: "Ausgabesprache",
    mode: "Modus",
    ownApi: "Eigenen API-Schlüssel verwenden",
    freeMode: "Kostenlos",
    provider: "Anbieter",
    model: "Modell",
    customModel: "Benutzerdefiniert…",
    apiKey: "API-Schlüssel",
    savedApiKeys: "Gespeicherte API-Schlüssel",
    notSet: "Nicht gesetzt",
    delete: "Löschen",
    confirmDeleteApiKey: "Gespeicherten API-Schlüssel für diesen Anbieter löschen?",
    apiKeyDeleted: "API-Schlüssel aus dem Speicher gelöscht.",
    apiKeySavedMask: "Gespeichert",
    bulletSummary: "Stichpunkt-Zusammenfassung",
    save: "Speichern",
    saved: "Gespeichert.",
    apiKeySaved: "API-Schlüssel gespeichert.",
    apiKeyUnchanged: "Einstellungen gespeichert (API-Schlüssel unverändert).",
    freeNotReady: "Der kostenlose Modus ist noch nicht verfügbar.",
    auto: "Auto",
    footer: "Einstellungen werden in Chrome Sync Storage gespeichert.",
    openSummaryPanel: "Zusammenfassungsfenster öffnen"
  },
  fr: {
    title: "Résumé de texte IA",
    uiLanguage: "Langue de l'interface",
    outputLanguage: "Langue de sortie",
    mode: "Mode",
    ownApi: "Utiliser ma propre clé API",
    freeMode: "Gratuit",
    provider: "Fournisseur",
    model: "Modèle",
    customModel: "Personnalisé…",
    apiKey: "Clé API",
    savedApiKeys: "Clés API enregistrées",
    notSet: "Non défini",
    delete: "Supprimer",
    confirmDeleteApiKey: "Supprimer la clé API enregistrée pour ce fournisseur ?",
    apiKeyDeleted: "Clé API supprimée du stockage.",
    apiKeySavedMask: "Enregistrée",
    bulletSummary: "Résumé en puces",
    save: "Enregistrer",
    saved: "Enregistré.",
    apiKeySaved: "Clé API enregistrée.",
    apiKeyUnchanged: "Paramètres enregistrés (clé API inchangée).",
    freeNotReady: "Le mode gratuit n'est pas encore disponible.",
    auto: "Auto",
    footer: "Les paramètres sont enregistrés dans Chrome Sync Storage.",
    openSummaryPanel: "Ouvrir la fenêtre de résumé"
  },
  es: {
    title: "Resumidor de texto IA",
    uiLanguage: "Idioma de la interfaz",
    outputLanguage: "Idioma de salida",
    mode: "Modo",
    ownApi: "Usar mi propia clave API",
    freeMode: "Gratis",
    provider: "Proveedor",
    model: "Modelo",
    customModel: "Personalizado…",
    apiKey: "Clave API",
    savedApiKeys: "Claves API guardadas",
    notSet: "No configurado",
    delete: "Eliminar",
    confirmDeleteApiKey: "¿Eliminar la clave API guardada para este proveedor?",
    apiKeyDeleted: "Clave API eliminada del almacenamiento.",
    apiKeySavedMask: "Guardada",
    bulletSummary: "Resumen con viñetas",
    save: "Guardar",
    saved: "Guardado.",
    apiKeySaved: "Clave API guardada.",
    apiKeyUnchanged: "Configuración guardada (clave API sin cambios).",
    freeNotReady: "El modo gratuito aún no está disponible.",
    auto: "Auto",
    footer: "La configuración se guarda en Chrome Sync Storage.",
    openSummaryPanel: "Abrir la ventana de resumen"
  },
  it: {
    title: "Riassuntore di testo IA",
    uiLanguage: "Lingua dell'interfaccia",
    outputLanguage: "Lingua di output",
    mode: "Modalità",
    ownApi: "Usa la mia chiave API",
    freeMode: "Gratis",
    provider: "Provider",
    model: "Modello",
    customModel: "Personalizzato…",
    apiKey: "Chiave API",
    savedApiKeys: "Chiavi API salvate",
    notSet: "Non impostato",
    delete: "Elimina",
    confirmDeleteApiKey: "Eliminare la chiave API salvata per questo provider?",
    apiKeyDeleted: "Chiave API eliminata dallo storage.",
    apiKeySavedMask: "Salvata",
    bulletSummary: "Riepilogo a punti",
    save: "Salva",
    saved: "Salvato.",
    apiKeySaved: "Chiave API salvata.",
    apiKeyUnchanged: "Impostazioni salvate (chiave API invariata).",
    freeNotReady: "La modalità gratuita non è ancora disponibile.",
    auto: "Auto",
    footer: "Le impostazioni vengono salvate in Chrome Sync Storage.",
    openSummaryPanel: "Apri la finestra del riepilogo"
  },
  pt: {
    title: "Resumidor de texto IA",
    uiLanguage: "Idioma da interface",
    outputLanguage: "Idioma de saída",
    mode: "Modo",
    ownApi: "Usar minha própria chave de API",
    freeMode: "Grátis",
    provider: "Provedor",
    model: "Modelo",
    customModel: "Personalizado…",
    apiKey: "Chave de API",
    savedApiKeys: "Chaves de API salvas",
    notSet: "Não definido",
    delete: "Excluir",
    confirmDeleteApiKey: "Excluir a chave de API salva para este provedor?",
    apiKeyDeleted: "Chave de API excluída do armazenamento.",
    apiKeySavedMask: "Salva",
    bulletSummary: "Resumo em tópicos",
    save: "Salvar",
    saved: "Salvo.",
    apiKeySaved: "Chave de API salva.",
    apiKeyUnchanged: "Configurações salvas (chave de API inalterada).",
    freeNotReady: "O modo gratuito ainda não está disponível.",
    auto: "Auto",
    footer: "As configurações são salvas no Chrome Sync Storage.",
    openSummaryPanel: "Abrir a janela de resumo"
  },
  ru: {
    title: "ИИ Суммаризатор текста",
    uiLanguage: "Язык интерфейса",
    outputLanguage: "Язык вывода",
    mode: "Режим",
    ownApi: "Использовать свой API-ключ",
    freeMode: "Бесплатно",
    provider: "Провайдер",
    model: "Модель",
    customModel: "Пользовательская…",
    apiKey: "API-ключ",
    savedApiKeys: "Сохранённые API-ключи",
    notSet: "Не задано",
    delete: "Удалить",
    confirmDeleteApiKey: "Удалить сохранённый API-ключ для этого провайдера?",
    apiKeyDeleted: "API-ключ удалён из хранилища.",
    apiKeySavedMask: "Сохранён",
    bulletSummary: "Сводка списком",
    save: "Сохранить",
    saved: "Сохранено.",
    apiKeySaved: "API-ключ сохранён.",
    apiKeyUnchanged: "Настройки сохранены (API-ключ не изменён).",
    freeNotReady: "Бесплатный режим пока недоступен.",
    auto: "Авто",
    footer: "Настройки сохраняются в Chrome Sync Storage.",
    openSummaryPanel: "Открыть окно резюме"
  },
  ar: {
    title: "ملخّص نصوص بالذكاء الاصطناعي",
    uiLanguage: "لغة الواجهة",
    outputLanguage: "لغة الإخراج",
    mode: "الوضع",
    ownApi: "استخدام مفتاح API الخاص بي",
    freeMode: "مجاني",
    provider: "المزوّد",
    model: "النموذج",
    customModel: "مخصص…",
    apiKey: "مفتاح API",
    savedApiKeys: "مفاتيح API المحفوظة",
    notSet: "غير مضبوط",
    delete: "حذف",
    confirmDeleteApiKey: "هل تريد حذف مفتاح API المحفوظ لهذا المزود؟",
    apiKeyDeleted: "تم حذف مفتاح API من التخزين.",
    apiKeySavedMask: "محفوظ",
    bulletSummary: "ملخص بنقاط",
    save: "حفظ",
    saved: "تم الحفظ.",
    apiKeySaved: "تم حفظ مفتاح API.",
    apiKeyUnchanged: "تم حفظ الإعدادات (مفتاح API دون تغيير).",
    freeNotReady: "الوضع المجاني غير متاح بعد.",
    auto: "تلقائي",
    footer: "يتم حفظ الإعدادات في Chrome Sync Storage.",
    openSummaryPanel: "فتح نافذة الملخص"
  },
  zh: {
    title: "AI 文本摘要器",
    uiLanguage: "界面语言",
    outputLanguage: "输出语言",
    mode: "模式",
    ownApi: "使用我自己的 API 密钥",
    freeMode: "免费",
    provider: "提供商",
    model: "模型",
    customModel: "自定义…",
    apiKey: "API 密钥",
    savedApiKeys: "已保存的 API 密钥",
    notSet: "未设置",
    delete: "删除",
    confirmDeleteApiKey: "删除此提供商已保存的 API 密钥？",
    apiKeyDeleted: "API 密钥已从存储中删除。",
    apiKeySavedMask: "已保存",
    bulletSummary: "项目符号摘要",
    save: "保存",
    saved: "已保存。",
    apiKeySaved: "API 密钥已保存。",
    apiKeyUnchanged: "设置已保存（API 密钥未更改）。",
    freeNotReady: "免费模式暂不可用。",
    auto: "自动",
    footer: "设置保存在 Chrome Sync Storage 中。",
    openSummaryPanel: "打开摘要窗口"
  }
};

function normalizeUiLang(code) {
  const v = (code || "").toLowerCase();
  if (v.startsWith("tr")) return "tr";
  if (v.startsWith("en")) return "en";
  if (v.startsWith("de")) return "de";
  if (v.startsWith("fr")) return "fr";
  if (v.startsWith("es")) return "es";
  if (v.startsWith("it")) return "it";
  if (v.startsWith("pt")) return "pt";
  if (v.startsWith("ru")) return "ru";
  if (v.startsWith("ar")) return "ar";
  if (v.startsWith("zh")) return "zh";
  return "en";
}

function getSystemUiLang() {
  return normalizeUiLang(navigator.language || "en");
}

let UI_LANG_ACTIVE = getSystemUiLang();

function t(key) {
  return I18N[UI_LANG_ACTIVE]?.[key] || I18N.en[key] || key;
}

const languageOptions = [
  { value: "auto", labelKey: "auto", label: null },
  { value: "en", label: "English" },
  { value: "tr", label: "Türkçe" },
  { value: "de", label: "Deutsch" },
  { value: "fr", label: "Français" },
  { value: "es", label: "Español" },
  { value: "it", label: "Italiano" },
  { value: "pt", label: "Português" },
  { value: "ru", label: "Русский" },
  { value: "ar", label: "العربية" },
  { value: "zh", label: "中文" }
];

function fillLanguageSelect(selectEl) {
  selectEl.innerHTML = "";
  for (const opt of languageOptions) {
    const o = document.createElement("option");
    o.value = opt.value;
    o.textContent = opt.value === "auto" ? t(opt.labelKey) : opt.label;
    selectEl.appendChild(o);
  }
}

function getModelsForProvider(provider) {
  const mode = ($("mode")?.value || "own_api").trim();
  if (mode === "free") return FREE_PROVIDER_MODELS[provider] || [];
  return PROVIDER_MODELS[provider] || [];
}

function setModelUIFromSettings({ provider, model, modelIsCustom }) {
  const select = $("modelSelect");
  const custom = $("modelCustom");

  const models = getModelsForProvider(provider);
  const isFree = ($("mode")?.value || "own_api").trim() === "free";
  const opts = isFree ? [...models] : [...models, MODEL_CUSTOM_VALUE];

  select.innerHTML = "";

  for (const v of opts) {
    const o = document.createElement("option");
    o.value = v;
    o.textContent = v === MODEL_CUSTOM_VALUE ? t("customModel") : v;
    select.appendChild(o);
  }

  const desired = (model || "").trim();
  if (!desired && models.length > 0) {
    select.value = models[0];
    custom.classList.add("hidden");
    custom.value = "";
    return;
  }

  if (!isFree && modelIsCustom) {
    select.value = MODEL_CUSTOM_VALUE;
    custom.classList.remove("hidden");
    custom.value = desired;
    return;
  }

  const inList = models.includes(desired);
  if (inList) {
    select.value = desired;
    custom.classList.add("hidden");
    custom.value = "";
    return;
  }

  // Mismatch model for provider: fall back to first provider model.
  if (models.length > 0) {
    select.value = models[0];
    custom.classList.add("hidden");
    custom.value = "";
    return;
  }

  if (!isFree) {
    // No known models: allow custom.
    select.value = MODEL_CUSTOM_VALUE;
    custom.classList.remove("hidden");
    custom.value = desired;
    return;
  }

  // Free mode: no custom models.
  custom.classList.add("hidden");
  custom.value = "";
}

function getModelFromUI() {
  const select = $("modelSelect");
  const custom = $("modelCustom");

  if (select.value === MODEL_CUSTOM_VALUE) {
    return custom.value.trim();
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

async function notifySettingsUpdatedInActiveTab() {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = Array.isArray(tabs) ? tabs[0] : null;
      if (!tab?.id) return resolve(false);
      chrome.tabs.sendMessage(tab.id, { type: "SETTINGS_UPDATED" }, () => {
        resolve(true);
      });
    });
  });
}

async function previewUiLanguageInActiveTab(uiLanguage) {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = Array.isArray(tabs) ? tabs[0] : null;
      if (!tab?.id) return resolve(false);
      chrome.tabs.sendMessage(tab.id, { type: "PREVIEW_UI_LANGUAGE", uiLanguage }, () => {
        resolve(true);
      });
    });
  });
}

async function saveSettings(settings, rawApiKey) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ type: "SAVE_SETTINGS_UI", settings, rawApiKey }, (resp) => resolve(resp));
  });
}

async function deleteProviderApiKey(provider) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ type: "DELETE_PROVIDER_API_KEY", provider }, (resp) => resolve(resp));
  });
}

function applyUILanguageToDOM() {
  $("title").textContent = t("title");
  $("openSummaryPanel").textContent = t("openSummaryPanel");
  $("uiLanguageLabel").textContent = t("uiLanguage");
  $("outputLanguageLabel").textContent = t("outputLanguage");
  $("modeLabel").textContent = t("mode");
  $("modeOwnApi").textContent = t("ownApi");
  $("modeFree").textContent = t("freeMode");
  $("providerLabel").textContent = t("provider");
  $("modelLabel").textContent = t("model");
  $("apiKeyLabel").textContent = t("apiKey");
  $("savedApiKeysLabel").textContent = t("savedApiKeys");
  $("bulletSummaryLabel").textContent = t("bulletSummary");
  $("save").textContent = t("save");
  $("footer").textContent = t("footer");

  $("modelCustom").placeholder = t("model");
  $("apiKey").placeholder = t("apiKey");

  fillLanguageSelect($("uiLanguage"));
  fillLanguageSelect($("outputLanguage"));

  // keep current values if possible
  // (callers set .value right after this)

  // Re-render API key list to update Delete button text
  (async () => {
    const settings = (await getSettings()) || {};
    renderApiKeyList(settings);
  })();
}

function providerDisplayName(provider) {
  if (provider === "groq") return "Groq";
  if (provider === "openai") return "OpenAI";
  if (provider === "gemini") return "Gemini";
  if (provider === "anthropic") return "Anthropic";
  return provider;
}

function providerHasSavedApiKey(settings, provider) {
  const encryptedApiKeys = (settings?.encryptedApiKeys && typeof settings.encryptedApiKeys === "object")
    ? settings.encryptedApiKeys
    : {};
  return !!encryptedApiKeys?.[provider];
}

function applyApiKeyMaskState(settings) {
  const input = $("apiKey");
  if (!input) return;

  const provider = ($("provider")?.value || settings?.provider || "groq").trim();
  const hasKey = providerHasSavedApiKey(settings, provider);

  // If user already typed a new value (not masked), don't override.
  if (input.dataset?.masked === "false" && (input.value || "").trim()) return;

  if (hasKey) {
    input.value = "••••••••••••";
    input.dataset.masked = "true";
    input.placeholder = t("apiKeySavedMask");
  } else {
    input.value = "";
    input.dataset.masked = "false";
    input.placeholder = t("apiKey");
  }
}

function renderApiKeyList(settings) {
  const container = $("keyList");
  if (!container) return;
  container.innerHTML = "";

  const encryptedApiKeys = (settings?.encryptedApiKeys && typeof settings.encryptedApiKeys === "object")
    ? settings.encryptedApiKeys
    : {};

  const providers = ["groq", "openai", "gemini", "anthropic"];
  for (const p of providers) {
    const hasKey = !!encryptedApiKeys[p];

    if (!hasKey) continue;

    const row = document.createElement("div");
    row.className = "keyRow";

    const meta = document.createElement("div");
    meta.className = "keyMeta";

    const prov = document.createElement("div");
    prov.className = "keyProvider";
    prov.textContent = providerDisplayName(p);

    const masked = document.createElement("div");
    masked.className = "keyMasked";
    masked.textContent = hasKey ? "••••••••••••" : t("notSet");

    meta.appendChild(prov);
    meta.appendChild(masked);

    row.appendChild(meta);

    if (hasKey) {
      const del = document.createElement("button");
      del.className = "btnDanger";
      del.type = "button";
      del.textContent = t("delete");
      del.addEventListener("click", async () => {
        try {
          setStatus("", true);

          const confirmed = window.confirm(t("confirmDeleteApiKey"));
          if (!confirmed) return;

          const resp = await deleteProviderApiKey(p);
          if (!resp || !resp.ok) throw new Error(resp?.error || "Unknown error");
          // Refresh settings and re-render.
          const refreshed = (await getSettings()) || {};
          Object.assign(settings, refreshed);
          renderApiKeyList(settings);
          applyApiKeyMaskState(settings);

          // If current provider was deleted, clear the masked input.
          if (($("provider")?.value || "").trim() === p) {
            const input = $("apiKey");
            if (input) {
              input.value = "";
              input.dataset.masked = "false";
            }
            applyApiKeyMaskState(settings);
          }

          setStatus(t("apiKeyDeleted"), true);
        } catch (e) {
          setStatus(e?.message || String(e), false);
        }
      });
      row.appendChild(del);
    }

    container.appendChild(row);
  }
}

function setStatus(message, ok) {
  const el = $("status");
  el.textContent = message || "";
  el.style.color = ok ? "#0b6b2f" : "#b00020";
}

function applyModeUI() {
  const isFree = $("mode").value === "free";
  const apiKeyRow = $("apiKeyRow");
  if (apiKeyRow) apiKeyRow.style.display = isFree ? "none" : "";

  const providerEl = $("provider");
  const allowedProviders = Object.keys(FREE_PROVIDER_MODELS);
  if (providerEl && providerEl.options) {
    for (const opt of providerEl.options) {
      opt.disabled = isFree && !allowedProviders.includes(opt.value);
      if (isFree && !allowedProviders.includes(opt.value)) {
        opt.hidden = true;
      } else {
        opt.hidden = false;
      }
    }
    if (isFree && !allowedProviders.includes(providerEl.value)) {
      providerEl.value = allowedProviders[0] || "groq";
    }
  }

  // Rebuild model list for the current mode.
  setModelUIFromSettings({
    provider: $("provider").value,
    model: "",
    modelIsCustom: false
  });
}

async function openSummaryPanelInActiveTab() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = Array.isArray(tabs) ? tabs[0] : null;
      if (!tab?.id) return reject(new Error("No active tab."));

      chrome.tabs.sendMessage(
        tab.id,
        { type: "OPEN_SUMMARY_PANEL" },
        (resp) => {
          const err = chrome.runtime.lastError;
          if (err) return reject(new Error(err.message));
          if (resp && resp.ok) return resolve(resp);
          resolve(resp || { ok: true });
        }
      );
    });
  });
}

async function main() {
  const settings = (await getSettings()) || {};

  const uiLanguageSetting = (settings.uiLanguage || "auto").trim();
  UI_LANG_ACTIVE = uiLanguageSetting === "auto" ? getSystemUiLang() : normalizeUiLang(uiLanguageSetting);

  applyUILanguageToDOM();

  $("uiLanguage").value = uiLanguageSetting;
  $("outputLanguage").value = (settings.outputLanguage || "auto").trim();

  $("mode").value = (settings.mode || "free").trim();
  $("provider").value = (settings.provider || "groq").trim();
  $("bulletSummary").checked = !!settings.bulletSummary;

  setModelUIFromSettings({
    provider: $("provider").value,
    model: settings.model || "",
    modelIsCustom: !!settings.modelIsCustom
  });

  renderApiKeyList(settings);
  applyApiKeyMaskState(settings);

  applyModeUI();

  $("openSummaryPanel").addEventListener("click", async () => {
    try {
      setStatus("", true);
      await openSummaryPanelInActiveTab();
      window.close();
    } catch (e) {
      setStatus(e?.message || String(e), false);
    }
  });

  $("mode").addEventListener("change", () => {
    applyModeUI();
  });

  $("provider").addEventListener("change", () => {
    // Provider changed: reset to first model for that provider to avoid cross-provider mismatches.
    setModelUIFromSettings({
      provider: $("provider").value,
      model: "",
      modelIsCustom: false
    });

    applyApiKeyMaskState(settings);
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

  $("uiLanguage").addEventListener("change", () => {
    const next = $("uiLanguage").value;
    UI_LANG_ACTIVE = next === "auto" ? getSystemUiLang() : normalizeUiLang(next);

    const prevUi = $("uiLanguage").value;
    const prevOut = $("outputLanguage").value;

    applyUILanguageToDOM();

    $("uiLanguage").value = prevUi;
    $("outputLanguage").value = prevOut;

    // Re-apply API key placeholder/mask language.
    applyApiKeyMaskState(settings);
    setStatus("", true);

    previewUiLanguageInActiveTab(next).catch(() => {});
  });

  $("outputLanguage").addEventListener("change", () => {
    const next = $("outputLanguage").value;
    const prevOut = $("outputLanguage").value;

    // Keep current value in UI (will be saved on Save click)
    $("outputLanguage").value = prevOut;

    // Notify in-page panel to preview output language change
    (async () => {
      try {
        const settings = (await getSettings()) || {};
        const [tab] = await new Promise(resolve => chrome.tabs.query({ active: true, currentWindow: true }, resolve));
        if (!tab?.id) return;
        await chrome.tabs.sendMessage(tab.id, {
          type: "PREVIEW_OUTPUT_LANGUAGE",
          outputLanguage: next
        });
      } catch {}
    })();
  });

  // If the field is showing a masked placeholder, clear it on user intent.
  $("apiKey").addEventListener("focus", () => {
    const input = $("apiKey");
    if (!input) return;
    if (input.dataset.masked === "true") {
      input.value = "";
      input.dataset.masked = "false";
      input.placeholder = t("apiKey");
    }
  });

  $("apiKey").addEventListener("input", () => {
    const input = $("apiKey");
    if (!input) return;
    input.dataset.masked = "false";
  });

  $("save").addEventListener("click", async () => {
    try {
      setStatus("", true);

      const mode = $("mode").value;
      const provider = $("provider").value;
      const modelSelectValue = $("modelSelect").value;
      const modelIsCustom = modelSelectValue === MODEL_CUSTOM_VALUE;
      const model = getModelFromUI();
      const bulletSummary = !!$("bulletSummary").checked;
      const uiLanguage = $("uiLanguage").value;
      const outputLanguage = $("outputLanguage").value;

      const apiInput = $("apiKey");
      const rawApiKey = apiInput?.dataset?.masked === "true" ? "" : (apiInput?.value || "").trim();

      const payload = {
        ...settings,
        mode,
        bulletSummary,
        uiLanguage,
        outputLanguage,
        provider,
        modelIsCustom,
        model: model || ((getModelsForProvider(provider)[0]) || "")
      };

      const resp = await saveSettings(payload, rawApiKey);
      if (!resp || !resp.ok) {
        throw new Error(resp?.error || "Unknown error");
      }

      // Reset field to masked state (if a key exists) after saving.
      if ($("apiKey")) {
        $("apiKey").value = "";
        $("apiKey").dataset.masked = "false";
      }

      // update local copy for next save
      settings.mode = payload.mode;
      settings.bulletSummary = payload.bulletSummary;
      settings.uiLanguage = payload.uiLanguage;
      settings.outputLanguage = payload.outputLanguage;
      if (payload.provider) settings.provider = payload.provider;
      if (payload.model) settings.model = payload.model;
      settings.modelIsCustom = !!payload.modelIsCustom;

      // Refresh settings from background to pick up encryptedApiKeys changes.
      const refreshed = (await getSettings()) || {};
      Object.assign(settings, refreshed);
      renderApiKeyList(settings);
      applyApiKeyMaskState(settings);

      notifySettingsUpdatedInActiveTab().catch(() => {});

      if (mode === "free") {
        setStatus(t("saved"), true);
      } else {
        setStatus(rawApiKey ? t("apiKeySaved") : t("apiKeyUnchanged"), true);
      }
    } catch (e) {
      setStatus(e?.message || String(e), false);
    }
  });
}

main().catch((e) => {
  setStatus(e?.message || String(e), false);
});
