const EXT_UI_ID = "ai-summarizer-ui-root";

const SYSTEM_UI_LANG = normalizeUiLang(navigator.language || "en");
let UI_LANG_ACTIVE = SYSTEM_UI_LANG;
const I18N = {
  en: {
    summarize: "Summarize selection",
    summary: "Summary",
    settings: "Settings",
    summarizing: "Summarizing…",
    loading: "Loading…",
    error: "Error",
    close: "Close",
    copy: "Copy",
    copied: "Copied",
    pinned: "Pinned",
    unpinned: "Unpinned",
    tts: "Read aloud",
    openSettings: "Open settings",
    tooltipPin: "Pin panel",
    tooltipUnpin: "Unpin panel",
    tooltipCopy: "Copy summary",
    tooltipClose: "Close panel",
    tooltipTts: "Read summary aloud",
    mode: "Mode",
    ownApi: "Use my own API key",
    freeMode: "Free",
    provider: "Provider",
    model: "Model",
    customModel: "Custom…",
    apiKey: "API key",
    bulletSummary: "Bullet summary",
    uiLanguage: "UI language",
    outputLanguage: "Output language",
    auto: "Auto",
    history: "History",
    historyToggle: "Show/Hide History",
    outputInfoAuto: "Output language: same as input",
    outputInfoFixed: "Output: ",
    tooShortText: "Please select a larger text (at least 3 sentences and 30 words).",
    tooShortCode: "Please select more code (at least 4 lines).",
    save: "Save",
    saved: "Saved.",
    apiKeySaved: "API key saved.",
    apiKeyUnchanged: "Settings saved (API key unchanged).",
    freeNotReady: "Free mode is not available yet.",
    freeBackendNotSet: "Free mode is temporarily unavailable.",
    freeLimitReached: "Free usage limit reached. Switch to another free model or upgrade.",
    freeQuotaReached: "Provider quota/rate limit reached. Try another free model or upgrade.",
    freeModelNotAllowed: "Selected model is not available in free mode.",
    freeServiceMisconfigured: "Free service is not configured correctly. Please try later.",
    errInvalidApiKey: "Invalid API key for this provider/model.",
    errApiKeyNotSet: "API key is not set. Open extension settings.",
    errRateLimited: "Rate limit reached. Please try again later.",
    errModelNotFound: "Selected model was not found for this provider.",
    errProviderUnavailable: "Provider is temporarily unavailable. Please try again.",
    errNetwork: "Network error. Check your connection and try again.",
    errApiKeyDecryptFailed: "Failed to read the saved API key. Please re-save it in settings.",
    errApiKeyFormatInvalid: "Saved API key format is invalid. Please re-save it in settings.",
    errUnknown: "Something went wrong. Please try again.",
    history: "History",
    historyEmpty: "No recent summaries yet.",
    historyDelete: "Delete",
    historyClear: "Clear history",
    openSummaryPanel: "Open summary panel"
  },
  tr: {
    summarize: "Seçimi özetle",
    summary: "Özet",
    settings: "Ayarlar",
    summarizing: "Özetleniyor…",
    loading: "Yükleniyor…",
    error: "Hata",
    close: "Kapat",
    copy: "Kopyala",
    copied: "Kopyalandı",
    pinned: "Sabitlendi",
    unpinned: "Sabitleme kapalı",
    tts: "Sesli oku",
    openSettings: "Ayarları aç",
    tooltipPin: "Paneli sabitle",
    tooltipUnpin: "Sabitlemeyi kaldır",
    tooltipCopy: "Özeti kopyala",
    tooltipClose: "Paneli kapat",
    tooltipTts: "Özeti sesli oku",
    mode: "Mod",
    ownApi: "Kendi API anahtarımı kullan",
    freeMode: "Ücretsiz",
    provider: "Sağlayıcı",
    model: "Model",
    customModel: "Özel…",
    apiKey: "API anahtarı",
    bulletSummary: "Özeti maddeler halinde oluştur",
    uiLanguage: "Arayüz dili",
    outputLanguage: "Çıktı dili",
    auto: "Otomatik",
    history: "Geçmiş",
    historyToggle: "Geçmişi Göster/Gizle",
    outputInfoAuto: "Çıktı Dili: metin ile aynı",
    outputInfoFixed: "Çıktı: ",
    tooShortText: "Daha büyük bir alan seçmelisiniz (en az 3 cümle ve 30 kelime).",
    tooShortCode: "Daha fazla kod seçmelisiniz (en az 4 satır).",
    save: "Kaydet",
    saved: "Kaydedildi.",
    apiKeySaved: "API anahtarı kaydedildi.",
    apiKeyUnchanged: "Ayarlar kaydedildi (API anahtarı değişmedi).",
    freeNotReady: "Ücretsiz mod henüz hazır değil.",
    freeBackendNotSet: "Ücretsiz mod geçici olarak kullanılamıyor.",
    freeLimitReached: "Ücretsiz kullanım limitiniz doldu. Diğer ücretsiz modele geçin veya satın alın.",
    freeQuotaReached: "Sağlayıcı kotası/limitine ulaşıldı. Diğer ücretsiz modele geçin veya satın alın.",
    freeModelNotAllowed: "Seçilen model ücretsiz modda kullanılamıyor.",
    freeServiceMisconfigured: "Ücretsiz servis yapılandırılmamış. Lütfen daha sonra tekrar deneyin.",
    errInvalidApiKey: "Bu sağlayıcı/model için geçersiz API anahtarı.",
    errApiKeyNotSet: "API anahtarı ayarlı değil. Ayarlardan ekleyin.",
    errRateLimited: "Çok fazla istek gönderildi. Lütfen biraz sonra tekrar deneyin.",
    errModelNotFound: "Seçilen model bu sağlayıcıda bulunamadı.",
    errProviderUnavailable: "Servis geçici olarak kullanılamıyor. Lütfen tekrar deneyin.",
    errNetwork: "Ağ hatası. Bağlantınızı kontrol edip tekrar deneyin.",
    errApiKeyDecryptFailed: "Kayıtlı API anahtarı okunamadı. Lütfen ayarlardan tekrar kaydedin.",
    errApiKeyFormatInvalid: "Kayıtlı API anahtarı formatı geçersiz. Lütfen ayarlardan tekrar kaydedin.",
    errUnknown: "Bir hata oluştu. Lütfen tekrar deneyin.",
    history: "Geçmiş",
    historyEmpty: "Henüz kayıtlı özet yok.",
    historyDelete: "Sil",
    historyClear: "Geçmişi temizle",
    openSummaryPanel: "Özet penceresini aç"
  },
  de: {
    summarize: "Auswahl zusammenfassen",
    summary: "Zusammenfassung",
    settings: "Einstellungen",
    summarizing: "Wird zusammengefasst…",
    loading: "Wird geladen…",
    error: "Fehler",
    close: "Schließen",
    copy: "Kopieren",
    copied: "Kopiert",
    pinned: "Angeheftet",
    unpinned: "Nicht angeheftet",
    tts: "Vorlesen",
    openSettings: "Einstellungen öffnen",
    mode: "Modus",
    ownApi: "Eigenen API-Schlüssel verwenden",
    freeMode: "Kostenlos",
    provider: "Anbieter",
    model: "Modell",
    customModel: "Benutzerdefiniert…",
    apiKey: "API-Schlüssel",
    bulletSummary: "Stichpunkt-Zusammenfassung",
    uiLanguage: "Sprache der Oberfläche",
    outputLanguage: "Ausgabesprache",
    auto: "Auto",
    outputInfoAuto: "Ausgabesprache: wie Eingabe",
    outputInfoFixed: "Ausgabe: ",
    tooShortText: "Bitte wähle einen längeren Text (mindestens 3 Sätze und 30 Wörter).",
    tooShortCode: "Bitte wähle mehr Code (mindestens 4 Zeilen).",
    save: "Speichern",
    saved: "Gespeichert.",
    apiKeySaved: "API-Schlüssel gespeichert.",
    apiKeyUnchanged: "Einstellungen gespeichert (API-Schlüssel unverändert).",
    freeNotReady: "Der kostenlose Modus ist noch nicht verfügbar.",
    errInvalidApiKey: "Ungültiger API-Schlüssel für diesen Anbieter/dieses Modell.",
    errApiKeyNotSet: "API-Schlüssel ist nicht gesetzt. Öffne die Erweiterungseinstellungen.",
    errRateLimited: "Rate-Limit erreicht. Bitte später erneut versuchen.",
    errModelNotFound: "Das ausgewählte Modell wurde beim Anbieter nicht gefunden.",
    errProviderUnavailable: "Anbieter ist vorübergehend nicht verfügbar. Bitte erneut versuchen.",
    errNetwork: "Netzwerkfehler. Bitte Verbindung prüfen und erneut versuchen.",
    errApiKeyDecryptFailed: "Gespeicherter API-Schlüssel konnte nicht gelesen werden. Bitte erneut speichern.",
    errApiKeyFormatInvalid: "Format des gespeicherten API-Schlüssels ist ungültig. Bitte erneut speichern.",
    errUnknown: "Etwas ist schiefgelaufen. Bitte erneut versuchen.",
    historyClear: "Verlauf löschen",
    openSummaryPanel: "Zusammenfassungsfenster öffnen"
  },
  fr: {
    summarize: "Résumer la sélection",
    summary: "Résumé",
    settings: "Paramètres",
    summarizing: "Résumé en cours…",
    loading: "Chargement…",
    error: "Erreur",
    close: "Fermer",
    copy: "Copier",
    copied: "Copié",
    pinned: "Épinglé",
    unpinned: "Non épinglé",
    tts: "Lecture à voix haute",
    openSettings: "Ouvrir les paramètres",
    mode: "Mode",
    ownApi: "Utiliser ma propre clé API",
    freeMode: "Gratuit",
    provider: "Fournisseur",
    model: "Modèle",
    customModel: "Personnalisé…",
    apiKey: "Clé API",
    bulletSummary: "Résumé en puces",
    uiLanguage: "Langue de l'interface",
    outputLanguage: "Langue de sortie",
    auto: "Auto",
    outputInfoAuto: "Langue de sortie : identique à l'entrée",
    outputInfoFixed: "Sortie : ",
    tooShortText: "Veuillez sélectionner un texte plus long (au moins 3 phrases et 30 mots).",
    tooShortCode: "Veuillez sélectionner plus de code (au moins 4 lignes).",
    save: "Enregistrer",
    saved: "Enregistré.",
    apiKeySaved: "Clé API enregistrée.",
    apiKeyUnchanged: "Paramètres enregistrés (clé API inchangée).",
    freeNotReady: "Le mode gratuit n'est pas encore disponible.",
    errInvalidApiKey: "Clé API invalide pour ce fournisseur/modèle.",
    errApiKeyNotSet: "La clé API n'est pas définie. Ouvrez les paramètres de l'extension.",
    errRateLimited: "Limite de requêtes atteinte. Réessayez plus tard.",
    errModelNotFound: "Le modèle sélectionné est introuvable pour ce fournisseur.",
    errProviderUnavailable: "Le fournisseur est temporairement indisponible. Réessayez.",
    errNetwork: "Erreur réseau. Vérifiez votre connexion et réessayez.",
    errApiKeyDecryptFailed: "Impossible de lire la clé API enregistrée. Veuillez l'enregistrer à nouveau.",
    errApiKeyFormatInvalid: "Format de la clé API enregistrée invalide. Veuillez l'enregistrer à nouveau.",
    errUnknown: "Une erreur est survenue. Veuillez réessayer.",
    historyClear: "Effacer l'historique",
    openSummaryPanel: "Ouvrir la fenêtre de résumé"
  },
  es: {
    summarize: "Resumir selección",
    summary: "Resumen",
    settings: "Ajustes",
    summarizing: "Resumiendo…",
    loading: "Cargando…",
    error: "Error",
    close: "Cerrar",
    copy: "Copiar",
    copied: "Copiado",
    pinned: "Fijado",
    unpinned: "No fijado",
    tts: "Leer en voz alta",
    openSettings: "Abrir ajustes",
    mode: "Modo",
    ownApi: "Usar mi propia clave API",
    freeMode: "Gratis",
    provider: "Proveedor",
    model: "Modelo",
    customModel: "Personalizado…",
    apiKey: "Clave API",
    bulletSummary: "Resumen con viñetas",
    uiLanguage: "Idioma de la interfaz",
    outputLanguage: "Idioma de salida",
    auto: "Auto",
    outputInfoAuto: "Idioma de salida: igual que entrada",
    outputInfoFixed: "Salida: ",
    tooShortText: "Selecciona un texto más largo (al menos 3 frases y 30 palabras).",
    tooShortCode: "Selecciona más código (al menos 4 líneas).",
    save: "Guardar",
    saved: "Guardado.",
    apiKeySaved: "Clave API guardada.",
    apiKeyUnchanged: "Configuración guardada (clave API sin cambios).",
    freeNotReady: "El modo gratuito aún no está disponible.",
    errInvalidApiKey: "Clave API no válida para este proveedor/modelo.",
    errApiKeyNotSet: "La clave API no está configurada. Abre los ajustes de la extensión.",
    errRateLimited: "Límite de solicitudes alcanzado. Inténtalo más tarde.",
    errModelNotFound: "El modelo seleccionado no se encontró para este proveedor.",
    errProviderUnavailable: "El proveedor no está disponible temporalmente. Inténtalo de nuevo.",
    errNetwork: "Error de red. Comprueba tu conexión e inténtalo de nuevo.",
    errApiKeyDecryptFailed: "No se pudo leer la clave API guardada. Vuelve a guardarla en ajustes.",
    errApiKeyFormatInvalid: "Formato de clave API guardada inválido. Vuelve a guardarla en ajustes.",
    errUnknown: "Algo salió mal. Inténtalo de nuevo.",
    historyClear: "Borrar historial",
    openSummaryPanel: "Abrir la ventana de resumen"
  },
  it: {
    summarize: "Riassumi selezione",
    summary: "Riassunto",
    settings: "Impostazioni",
    summarizing: "Riassumendo…",
    loading: "Caricamento…",
    error: "Errore",
    close: "Chiudi",
    copy: "Copia",
    copied: "Copiato",
    pinned: "Fissato",
    unpinned: "Non fissato",
    tts: "Leggi ad alta voce",
    openSettings: "Apri impostazioni",
    mode: "Modalità",
    ownApi: "Usa la mia chiave API",
    freeMode: "Gratis",
    provider: "Provider",
    model: "Modello",
    customModel: "Personalizzato…",
    apiKey: "Chiave API",
    bulletSummary: "Riassunto a punti",
    uiLanguage: "Lingua dell'interfaccia",
    outputLanguage: "Lingua di output",
    auto: "Auto",
    outputInfoAuto: "Lingua di uscita: come input",
    outputInfoFixed: "Output: ",
    tooShortText: "Seleziona un testo più lungo (almeno 3 frasi e 30 parole).",
    tooShortCode: "Seleziona più codice (almeno 4 righe).",
    save: "Salva",
    saved: "Salvato.",
    apiKeySaved: "Chiave API salvata.",
    apiKeyUnchanged: "Impostazioni salvate (chiave API invariata).",
    freeNotReady: "La modalità gratuita non è ancora disponibile.",
    errInvalidApiKey: "Chiave API non valida per questo provider/modello.",
    errApiKeyNotSet: "La chiave API non è impostata. Apri le impostazioni dell'estensione.",
    errRateLimited: "Limite di richieste raggiunto. Riprova più tardi.",
    errModelNotFound: "Il modello selezionato non è stato trovato per questo provider.",
    errProviderUnavailable: "Il provider non è disponibile temporaneamente. Riprova.",
    errNetwork: "Errore di rete. Controlla la connessione e riprova.",
    errApiKeyDecryptFailed: "Impossibile leggere la chiave API salvata. Salvala di nuovo nelle impostazioni.",
    errApiKeyFormatInvalid: "Formato della chiave API salvata non valido. Salvala di nuovo nelle impostazioni.",
    errUnknown: "Qualcosa è andato storto. Riprova.",
    historyClear: "Cancella cronologia",
    openSummaryPanel: "Apri la finestra del riepilogo"
  },
  pt: {
    summarize: "Resumir seleção",
    summary: "Resumo",
    settings: "Configurações",
    summarizing: "Resumindo…",
    loading: "Carregando…",
    error: "Erro",
    close: "Fechar",
    copy: "Copiar",
    copied: "Copiado",
    pinned: "Fixado",
    unpinned: "Não fixado",
    tts: "Ler em voz alta",
    openSettings: "Abrir configurações",
    mode: "Modo",
    ownApi: "Usar minha própria chave de API",
    freeMode: "Grátis",
    provider: "Provedor",
    model: "Modelo",
    customModel: "Personalizado…",
    apiKey: "Chave de API",
    bulletSummary: "Resumo em tópicos",
    uiLanguage: "Idioma da interface",
    outputLanguage: "Idioma de saída",
    auto: "Auto",
    outputInfoAuto: "Idioma de saída: igual à entrada",
    outputInfoFixed: "Saída: ",
    tooShortText: "Selecione um texto maior (pelo menos 3 frases e 30 palavras).",
    tooShortCode: "Selecione mais código (pelo menos 4 linhas).",
    save: "Salvar",
    saved: "Salvo.",
    apiKeySaved: "Chave de API salva.",
    apiKeyUnchanged: "Configurações salvas (chave de API inalterada).",
    freeNotReady: "O modo grátis ainda não está disponível.",
    errInvalidApiKey: "Chave de API inválida para este provedor/modelo.",
    errApiKeyNotSet: "A chave de API não está definida. Abra as configurações da extensão.",
    errRateLimited: "Limite de solicitações atingido. Tente novamente mais tarde.",
    errModelNotFound: "O modelo selecionado não foi encontrado para este provedor.",
    errProviderUnavailable: "O provedor está temporariamente indisponível. Tente novamente.",
    errNetwork: "Erro de rede. Verifique sua conexão e tente novamente.",
    errApiKeyDecryptFailed: "Não foi possível ler a chave de API salva. Salve novamente nas configurações.",
    errApiKeyFormatInvalid: "Formato de chave de API salva inválido. Salve novamente nas configurações.",
    errUnknown: "Algo deu errado. Tente novamente.",
    historyClear: "Limpar histórico",
    openSummaryPanel: "Abrir a janela de resumo"
  },
  ru: {
    summarize: "Суммировать выделение",
    summary: "Сводка",
    settings: "Настройки",
    summarizing: "Суммирование…",
    loading: "Загрузка…",
    error: "Ошибка",
    close: "Закрыть",
    copy: "Копировать",
    copied: "Скопировано",
    pinned: "Закреплено",
    unpinned: "Не закреплено",
    tts: "Озвучить",
    openSettings: "Открыть настройки",
    mode: "Режим",
    ownApi: "Использовать свой API-ключ",
    freeMode: "Бесплатно",
    provider: "Провайдер",
    model: "Модель",
    customModel: "Пользовательская…",
    apiKey: "API-ключ",
    bulletSummary: "Сводка списком",
    uiLanguage: "Язык интерфейса",
    outputLanguage: "Язык вывода",
    auto: "Авто",
    outputInfoAuto: "Язык вывода: как во входном тексте",
    outputInfoFixed: "Вывод: ",
    tooShortText: "Выберите текст побольше (минимум 3 предложения и 30 слов).",
    tooShortCode: "Выберите больше кода (минимум 4 строки).",
    save: "Сохранить",
    saved: "Сохранено.",
    apiKeySaved: "API-ключ сохранён.",
    apiKeyUnchanged: "Настройки сохранены (API-ключ не изменён).",
    freeNotReady: "Бесплатный режим пока недоступен.",
    errInvalidApiKey: "Неверный API-ключ для этого провайдера/модели.",
    errApiKeyNotSet: "API-ключ не задан. Откройте настройки расширения.",
    errRateLimited: "Достигнут лимит запросов. Попробуйте позже.",
    errModelNotFound: "Выбранная модель не найдена у провайдера.",
    errProviderUnavailable: "Провайдер временно недоступен. Попробуйте снова.",
    errNetwork: "Ошибка сети. Проверьте соединение и попробуйте снова.",
    errApiKeyDecryptFailed: "Не удалось прочитать сохранённый API-ключ. Сохраните его заново.",
    errApiKeyFormatInvalid: "Неверный формат сохранённого API-ключа. Сохраните его заново.",
    errUnknown: "Произошла ошибка. Попробуйте снова.",
    historyClear: "Очистить историю",
    openSummaryPanel: "Открыть окно резюме"
  },
  ar: {
    summarize: "تلخيص التحديد",
    summary: "الملخص",
    settings: "الإعدادات",
    summarizing: "جارٍ التلخيص…",
    loading: "جارٍ التحميل…",
    error: "خطأ",
    close: "إغلاق",
    copy: "نسخ",
    copied: "تم النسخ",
    pinned: "مثبّت",
    unpinned: "غير مثبّت",
    tts: "قراءة بصوت عالٍ",
    openSettings: "فتح الإعدادات",
    mode: "الوضع",
    ownApi: "استخدام مفتاح API الخاص بي",
    freeMode: "مجاني",
    provider: "المزوّد",
    model: "النموذج",
    customModel: "مخصص…",
    apiKey: "مفتاح API",
    bulletSummary: "ملخص بنقاط",
    uiLanguage: "لغة الواجهة",
    outputLanguage: "لغة الإخراج",
    auto: "تلقائي",
    outputInfoAuto: "لغة الإخراج: مثل الإدخال",
    outputInfoFixed: "الإخراج: ",
    tooShortText: "يرجى تحديد نص أطول (على الأقل 3 جمل و 30 كلمة).",
    tooShortCode: "يرجى تحديد المزيد من الكود (على الأقل 4 أسطر).",
    save: "حفظ",
    saved: "تم الحفظ.",
    apiKeySaved: "تم حفظ مفتاح API.",
    apiKeyUnchanged: "تم حفظ الإعدادات (مفتاح API دون تغيير).",
    freeNotReady: "الوضع المجاني غير متاح بعد.",
    errInvalidApiKey: "مفتاح API غير صالح لهذا المزوّد/النموذج.",
    errApiKeyNotSet: "مفتاح API غير مضبوط. افتح إعدادات الإضافة.",
    errRateLimited: "تم الوصول إلى حد الطلبات. حاول لاحقًا.",
    errModelNotFound: "لم يتم العثور على النموذج المحدد لدى هذا المزوّد.",
    errProviderUnavailable: "المزوّد غير متاح مؤقتًا. حاول مرة أخرى.",
    errNetwork: "خطأ في الشبكة. تحقق من الاتصال وحاول مرة أخرى.",
    errApiKeyDecryptFailed: "تعذر قراءة مفتاح API المحفوظ. يرجى حفظه مرة أخرى.",
    errApiKeyFormatInvalid: "تنسيق مفتاح API المحفوظ غير صالح. يرجى حفظه مرة أخرى في الإعدادات.",
    errUnknown: "حدث خطأ ما. يرجى المحاولة مرة أخرى.",
    historyClear: "مسح السجل",
    openSummaryPanel: "فتح نافذة الملخص"
  },
  zh: {
    summarize: "总结所选内容",
    summary: "摘要",
    settings: "设置",
    summarizing: "正在总结…",
    loading: "加载中…",
    error: "错误",
    close: "关闭",
    copy: "复制",
    copied: "已复制",
    pinned: "已固定",
    unpinned: "未固定",
    tts: "朗读",
    openSettings: "打开设置",
    mode: "模式",
    ownApi: "使用我自己的 API 密钥",
    freeMode: "免费",
    provider: "提供商",
    model: "模型",
    customModel: "自定义…",
    apiKey: "API 密钥",
    bulletSummary: "项目符号摘要",
    uiLanguage: "界面语言",
    outputLanguage: "输出语言",
    auto: "自动",
    outputInfoAuto: "输出语言：与输入相同",
    outputInfoFixed: "输出：",
    tooShortText: "请选择更长的文本（至少 3 句且 30 个词）。",
    tooShortCode: "请选择更多代码（至少 4 行）。",
    save: "保存",
    saved: "已保存。",
    apiKeySaved: "API 密钥已保存。",
    apiKeyUnchanged: "设置已保存（API 密钥未更改）。",
    freeNotReady: "免费模式暂不可用。",
    errInvalidApiKey: "此提供商/模型的 API 密钥无效。",
    errApiKeyNotSet: "未设置 API 密钥。请打开扩展设置。",
    errRateLimited: "已达到请求限制。请稍后重试。",
    errModelNotFound: "在此提供商中找不到所选模型。",
    errProviderUnavailable: "提供商暂时不可用。请重试。",
    errNetwork: "网络错误。请检查连接后重试。",
    errApiKeyDecryptFailed: "无法读取已保存的 API 密钥。请在设置中重新保存。",
    errApiKeyFormatInvalid: "已保存的 API 密钥格式无效。请在设置中重新保存。",
    errUnknown: "发生错误。请重试。",
    historyClear: "清除历史记录",
    openSummaryPanel: "打开摘要窗口"
  }
};

const RECENT_SUMMARIES_KEY = "recentSummaries";
const MAX_RECENT_SUMMARIES = 5;
const LAST_PANEL_GEOMETRY_KEY = "lastSummaryPanelGeometry";

function nowTs() {
  return Date.now();
}

function makeId() {
  try {
    if (crypto?.randomUUID) return crypto.randomUUID();
  } catch {
    // ignore
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function safeOneLine(text, maxLen) {
  const s = (text || "").replace(/\s+/g, " ").trim();
  if (!s) return "";
  if (s.length <= maxLen) return s;
  return `${s.slice(0, maxLen - 1)}…`;
}

async function loadRecentSummaries() {
  return new Promise((resolve) => {
    try {
      chrome.storage.local.get([RECENT_SUMMARIES_KEY], (res) => {
        const raw = res?.[RECENT_SUMMARIES_KEY];
        resolve(Array.isArray(raw) ? raw : []);
      });
    } catch {
      resolve([]);
    }
  });
}

function normalizeErrorMessage(err) {
  const msg = err?.message || String(err);
  if (msg === "EXTENSION_CONTEXT_INVALIDATED") return t("errUnknown");
  return msg;
}

async function saveRecentSummaries(items) {
  const normalized = Array.isArray(items) ? items.slice(0, MAX_RECENT_SUMMARIES) : [];
  return new Promise((resolve) => {
    try {
      chrome.storage.local.set({ [RECENT_SUMMARIES_KEY]: normalized }, () => resolve());
    } catch {
      resolve();
    }
  });
}

async function addRecentSummary(item) {
  const existing = await loadRecentSummaries();
  const next = [item, ...existing.filter((x) => x && x.id !== item.id)];
  await saveRecentSummaries(next.slice(0, MAX_RECENT_SUMMARIES));
  return next.slice(0, MAX_RECENT_SUMMARIES);
}

async function deleteRecentSummary(id) {
  const existing = await loadRecentSummaries();
  const next = existing.filter((x) => x && x.id !== id);
  await saveRecentSummaries(next);
  return next;
}

async function clearRecentSummaries() {
  await saveRecentSummaries([]);
  return [];
}

async function loadLastPanelGeometry() {
  return new Promise((resolve) => {
    try {
      chrome.storage.local.get([LAST_PANEL_GEOMETRY_KEY], (res) => {
        const g = res?.[LAST_PANEL_GEOMETRY_KEY];
        if (!g || typeof g !== "object") return resolve(null);
        resolve(g);
      });
    } catch {
      resolve(null);
    }
  });
}

async function saveLastPanelGeometry(geom) {
  const g = geom && typeof geom === "object" ? geom : null;
  if (!g) return;
  return new Promise((resolve) => {
    try {
      chrome.storage.local.set({ [LAST_PANEL_GEOMETRY_KEY]: g }, () => resolve());
    } catch {
      resolve();
    }
  });
}

function t(key) {
  return I18N[UI_LANG_ACTIVE]?.[key] || I18N.en[key] || key;
}

function mapErrorCodeToMessage(errorCode) {
  const code = (errorCode || "").trim();
  if (code === "NO_TEXT") return t("tooShortText");
  if (code === "FREE_NOT_AVAILABLE") return t("freeNotReady");

  if (code === "FREE_BACKEND_NOT_SET") return t("freeBackendNotSet");
  if (code === "FREE_LIMIT_REACHED") return t("freeLimitReached");
  if (code === "FREE_MODEL_NOT_ALLOWED") return t("freeModelNotAllowed");
  if (code === "MANAGED_KEY_NOT_CONFIGURED") return t("freeServiceMisconfigured");
  if (code === "MANAGED_KEY_INVALID") return t("freeServiceMisconfigured");
  if (code === "FREE_QUOTA_REACHED") return t("freeQuotaReached");

  if (code === "API_KEY_NOT_SET") return t("errApiKeyNotSet");
  if (code === "INVALID_API_KEY") return t("errInvalidApiKey");
  if (code === "RATE_LIMITED") return t("errRateLimited");
  if (code === "MODEL_NOT_FOUND") return t("errModelNotFound");
  if (code === "PROVIDER_UNAVAILABLE") return t("errProviderUnavailable");
  if (code === "NETWORK_ERROR") return t("errNetwork");
  if (code === "API_KEY_DECRYPT_FAILED") return t("errApiKeyDecryptFailed");
  if (code === "API_KEY_FORMAT_INVALID") return t("errApiKeyFormatInvalid");

  return t("errUnknown");
}

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

function normalizeOutputLang(code) {
  // Output language normalization uses same mapping as UI language
  return normalizeUiLang(code);
}

function applyUiLangSetting(uiLanguageSetting) {
  if (!uiLanguageSetting || uiLanguageSetting === "auto") {
    UI_LANG_ACTIVE = SYSTEM_UI_LANG;
    return;
  }
  UI_LANG_ACTIVE = normalizeUiLang(uiLanguageSetting);
}

function applyOutputLangSetting(outputLanguageSetting) {
  if (!outputLanguageSetting || outputLanguageSetting === "auto") {
    OUTPUT_LANG_ACTIVE = SYSTEM_OUTPUT_LANG;
    return;
  }
  OUTPUT_LANG_ACTIVE = normalizeOutputLang(outputLanguageSetting);
}

function getLanguageLabel(code) {
  const c = (code || "").toLowerCase();
  if (!c || c === "auto") return t("auto");
  if (c === "en") return "English";
  if (c === "tr") return "Türkçe";
  if (c === "de") return "Deutsch";
  if (c === "fr") return "Français";
  if (c === "es") return "Español";
  if (c === "it") return "Italiano";
  if (c === "pt") return "Português";
  if (c === "ru") return "Русский";
  if (c === "ar") return "العربية";
  if (c === "zh") return "中文";
  return code;
}

function clampText(text, maxChars) {
  const cleaned = (text || "")
    .replace(/\u0000/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned.length > maxChars ? cleaned.slice(0, maxChars) : cleaned;
}

function looksLikeCode(text) {
  const lines = (text || "").split(/\r?\n/);
  if (lines.length < 2) return false;

  const nonEmpty = lines.map((l) => l.trim()).filter(Boolean);
  if (nonEmpty.length < 2) return false;

  let score = 0;
  for (const l of nonEmpty) {
    if (/^\s{2,}/.test(l)) score += 1;
    if (/[{};=<>()[\]]/.test(l)) score += 1;
    if (/\b(const|let|var|function|class|import|export|return|def|public|private|static|if|else|for|while|try|catch)\b/.test(l)) score += 1;
    if (/^\s*(#|\/\/)/.test(l)) score += 1;
  }

  return score / nonEmpty.length >= 1.2;
}

function countNonEmptyLines(text) {
  return (text || "").split(/\r?\n/).map((l) => l.trim()).filter(Boolean).length;
}

function countWords(text) {
  return (text || "").trim().split(/\s+/).filter(Boolean).length;
}

function countSentences(text) {
  const cleaned = (text || "").replace(/\s+/g, " ").trim();
  if (!cleaned) return 0;
  const parts = cleaned.split(/[.!?]+\s*/).map((s) => s.trim()).filter(Boolean);
  return parts.length;
}

function estimateSummaryPanelHeight(text) {
  const raw = (text || "").trim();
  if (!raw) return 240;

  const lineCount = raw.split(/\r?\n/).filter((l) => l.trim()).length;
  const charCount = raw.length;
  const estimatedLines = Math.max(lineCount, Math.ceil(charCount / 70));

  const contentHeight = estimatedLines * 18;
  return 150 + Math.min(720, contentHeight);
}

function maybeGrowPanelForSummary(text) {
  // We use CSS auto-height now, so we don't need to manually grow the panel height
  // but we might want to ensure it doesn't jump too much.
  // For now, we'll let CSS handle it.
}

function expandPanelForHistory() {
  // We use CSS auto-height now, so we don't need this manual calculation
}

function renderCurrentPanel() {
  const showCopied = currentState.copyToastUntil && Date.now() < currentState.copyToastUntil;

  const settings = currentState.settings || {};
  const provider = (settings.provider || "").trim();
  const model = (settings.model || "").trim();
  const modelSuffix = model ? ` (${model})` : "";

  const isFreeMode = (settings.mode || "").trim() === "free";
  const u = currentState.freeUsage;
  const usageSuffix = (isFreeMode && u && typeof u.count === "number" && typeof u.limit === "number")
    ? ` • ${Math.min(u.count, u.limit)}/${u.limit}`
    : "";

  const title = currentState.view === "settings"
    ? t("settings")
    : (currentState.loading
      ? `${t("summarizing")}${modelSuffix}${usageSuffix}`
      : (currentState.errorMessage
        ? `${t("error")}${usageSuffix}`
        : `${t("summary")}${modelSuffix}${usageSuffix}${showCopied ? ` • ${t("copied")}` : ""}`));

  renderPanel({
    x: currentState.panelX,
    y: currentState.panelY,
    w: currentState.panelW,
    h: currentState.panelH,
    title,
    loading: currentState.loading,
    view: currentState.view,
    historyExpanded: currentState.historyExpanded,
    errorMessage: currentState.errorMessage,
    rawText: showCopied ? t("copied") : currentState.summaryText,
    body: currentState.summaryText,
    ttsActive: currentState.ttsActive,
    pinned: currentState.pinned,
    settings: currentState.settings,
    recentSummaries: currentState.recentSummaries,
    settingsDraft: currentState.settingsDraft,
    settingsStatus: currentState.settingsStatus,
    onClose: hideUI,
    onTogglePin: () => {
      currentState.pinned = !currentState.pinned;
      renderCurrentPanel();
    },
    onOpenSettings: () => {
      if (currentState.view === "settings") {
        currentState.view = "summary";
        currentState.settingsStatus = "";

        const last = currentState.lastSummaryPanel;
        if (last && typeof last.x === "number") {
          currentState.panelW = clamp(last.w || currentState.panelW, 280, window.innerWidth - 16);
          currentState.panelH = clamp(last.h || currentState.panelH, 160, window.innerHeight - 16);
          currentState.panelX = clamp(last.x, 8, window.innerWidth - 120);
          currentState.panelY = clamp(last.y, 8, window.innerHeight - 80);
        }

        renderCurrentPanel();
        return;
      }
      showSettingsPanel();
    },
    onOpenSummaryPanel: () => {
      openSummaryPanelAtLastPosition();
    },
    onCopied: () => {
      currentState.copyToastUntil = Date.now() + 1200;
      renderCurrentPanel();
      setTimeout(() => {
        if (Date.now() >= currentState.copyToastUntil && currentState.showing === "panel") {
          renderCurrentPanel();
        }
      }, 1250);
    },
    onError: (msg) => {
      currentState.errorMessage = msg;
      renderCurrentPanel();
    },
    onOpenHistoryItem: (item) => {
      currentState.view = "summary";
      currentState.loading = false;
      currentState.errorMessage = "";
      currentState.settingsStatus = "";
      currentState.settingsDraft = null;
      currentState.summaryText = item?.summary || "";
      currentState.ttsActive = false;
      stopSpeaking();
      maybeGrowPanelForSummary(currentState.summaryText);
      renderCurrentPanel();
    },
    onDeleteHistoryItem: async (item) => {
      const id = item?.id;
      if (!id) return;
      currentState.recentSummaries = await deleteRecentSummary(id);
      renderCurrentPanel();
    },
    onClearHistory: async () => {
      currentState.recentSummaries = await clearRecentSummaries();
      renderCurrentPanel();
    },
    onToggleSpeak: () => {
      if (!currentState.summaryText) return;
      if (currentState.ttsActive || window.speechSynthesis.speaking || window.speechSynthesis.paused) {
        stopSpeaking();
        if (currentState.showing === "panel") renderCurrentPanel();
        return;
      }

      speakWithOptionalBulletPauses(currentState.summaryText);
      if (currentState.showing === "panel") renderCurrentPanel();
    },
    onDragStart: (e) => {
      currentState.dragging = true;
      currentState.dragStart = {
        mx: e.clientX,
        my: e.clientY,
        x: currentState.panelX,
        y: currentState.panelY
      };
    },
    onResizeStart: (e, dir) => {
      currentState.resizing = true;
      currentState.resizeDir = dir;
      currentState.resizeStart = {
        mx: e.clientX,
        my: e.clientY,
        x: currentState.panelX,
        y: currentState.panelY,
        w: currentState.panelW,
        h: currentState.panelH
      };
    }
  });

  if (currentState.showing === "panel" && currentState.view === "settings") {
    scheduleFitSettingsPanel();
  }
}

let fitSettingsRaf = 0;
let lastFitSettingsHeight = 0;

function scheduleFitSettingsPanel() {
  if (fitSettingsRaf) cancelAnimationFrame(fitSettingsRaf);
  fitSettingsRaf = requestAnimationFrame(() => {
    fitSettingsRaf = 0;
    fitSettingsPanelToContent();
  });
}

function fitSettingsPanelToContent() {
  const host = document.getElementById(EXT_UI_ID);
  const shadow = host?.shadowRoot;
  const body = shadow?.querySelector?.(".panelBody");
  const header = shadow?.querySelector?.(".panelHeader");
  if (!body) return;

  const headerH = header?.getBoundingClientRect ? header.getBoundingClientRect().height : 44;
  const desiredH = Math.ceil(headerH + body.scrollHeight + 8);

  const minH = 280;
  const maxH = Math.max(minH, window.innerHeight - 16);
  const nextH = clamp(desiredH, minH, maxH);

  // If we hit the viewport limit, we must allow scroll to avoid cutting off controls.
  body.style.overflow = nextH >= maxH - 1 ? "auto" : "visible";

  if (Math.abs(nextH - currentState.panelH) >= 2 && nextH !== lastFitSettingsHeight) {
    lastFitSettingsHeight = nextH;
    currentState.panelH = nextH;

    const maxX = Math.max(8, window.innerWidth - currentState.panelW - 8);
    const maxY = Math.max(8, window.innerHeight - currentState.panelH - 8);
    currentState.panelX = clamp(currentState.panelX, 8, maxX);
    currentState.panelY = clamp(currentState.panelY, 8, maxY);

    renderCurrentPanel();
  }
}

function onGlobalMove(e) {
  if (currentState.dragging && currentState.dragStart) {
    const dx = e.clientX - currentState.dragStart.mx;
    const dy = e.clientY - currentState.dragStart.my;
    const nextX = currentState.dragStart.x + dx;
    const nextY = currentState.dragStart.y + dy;

    currentState.panelX = clamp(nextX, 8, window.innerWidth - 120);
    currentState.panelY = clamp(nextY, 8, window.innerHeight - 80);
    renderCurrentPanel();
    return;
  }

  if (currentState.resizing && currentState.resizeStart) {
    const dx = e.clientX - currentState.resizeStart.mx;
    const dy = e.clientY - currentState.resizeStart.my;
    const dir = currentState.resizeDir;

    let x = currentState.resizeStart.x;
    let y = currentState.resizeStart.y;
    let w = currentState.resizeStart.w;
    let h = currentState.resizeStart.h;

    const minW = 280;
    const minH = 160;

    if (dir.includes("e")) w = currentState.resizeStart.w + dx;
    if (dir.includes("s")) h = currentState.resizeStart.h + dy;
    if (dir.includes("w")) {
      w = currentState.resizeStart.w - dx;
      x = currentState.resizeStart.x + dx;
    }
    if (dir.includes("n")) {
      h = currentState.resizeStart.h - dy;
      y = currentState.resizeStart.y + dy;
    }

    const maxW = Math.max(minW, window.innerWidth - 16);
    const maxH = Math.max(minH, window.innerHeight - 16);

    w = clamp(w, minW, maxW);
    h = clamp(h, minH, maxH);

    currentState.panelX = clamp(x, 8, window.innerWidth - 120);
    currentState.panelY = clamp(y, 8, window.innerHeight - 80);
    currentState.panelW = w;
    currentState.panelH = h;
    renderCurrentPanel();
    return;
  }
}

function onGlobalUp() {
  currentState.dragging = false;
  currentState.resizing = false;
  currentState.resizeDir = "";
  currentState.dragStart = null;
  currentState.resizeStart = null;

  if (currentState.showing === "panel") {
    saveLastPanelGeometry({
      x: currentState.panelX,
      y: currentState.panelY,
      w: currentState.panelW,
      h: currentState.panelH
    }).catch(() => {});
  }
}

window.addEventListener("mousemove", onGlobalMove, true);
window.addEventListener("mouseup", onGlobalUp, true);

function getSelectionText() {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return "";
  return sel.toString();
}

function getSelectionRect() {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return null;
  const range = sel.getRangeAt(0);

  const rects = range.getClientRects ? Array.from(range.getClientRects()) : [];
  const nonEmpty = rects.filter((r) => r && (r.width > 0 || r.height > 0));
  if (nonEmpty.length > 0) return nonEmpty[nonEmpty.length - 1];

  const rect = range.getBoundingClientRect ? range.getBoundingClientRect() : null;
  if (rect && (rect.width > 0 || rect.height > 0)) return rect;

  const node = sel.focusNode || sel.anchorNode;
  const el = node && node.nodeType === 1 ? node : node?.parentElement;
  if (el?.getBoundingClientRect) {
    const er = el.getBoundingClientRect();
    if (er && (er.width > 0 || er.height > 0)) return er;
  }

  return null;
}

function getActiveElementSelectedText() {
  const el = document.activeElement;
  if (!el) return "";

  const tag = (el.tagName || "").toLowerCase();
  const isTextInput = tag === "textarea" || (tag === "input" && /^(text|search|url|email|tel|password)$/i.test(el.type || "text"));
  if (!isTextInput) return "";

  const start = typeof el.selectionStart === "number" ? el.selectionStart : 0;
  const end = typeof el.selectionEnd === "number" ? el.selectionEnd : 0;
  if (start === end) return "";

  const v = el.value || "";
  return v.slice(Math.min(start, end), Math.max(start, end));
}

function getActiveElementRectForSelection() {
  const el = document.activeElement;
  if (!el || !el.getBoundingClientRect) return null;

  const tag = (el.tagName || "").toLowerCase();
  const isTextInput = tag === "textarea" || (tag === "input" && /^(text|search|url|email|tel|password)$/i.test(el.type || "text"));
  if (!isTextInput) return null;

  const start = typeof el.selectionStart === "number" ? el.selectionStart : 0;
  const end = typeof el.selectionEnd === "number" ? el.selectionEnd : 0;
  if (start === end) return null;

  return el.getBoundingClientRect();
}

function getSelectionInfo() {
  const selText = getSelectionText();
  const selRect = getSelectionRect();
  const cleaned = clampText(selText, 5000);
  if (selRect && cleaned) return { text: cleaned, rect: selRect };

  const inputText = clampText(getActiveElementSelectedText(), 5000);
  const inputRect = getActiveElementRectForSelection();
  if (inputRect && inputText) return { text: inputText, rect: inputRect };

  return { text: cleaned || inputText || "", rect: selRect || inputRect || null };
}

function ensureUI() {
  let host = document.getElementById(EXT_UI_ID);
  if (host) return host;

  host = document.createElement("div");
  host.id = EXT_UI_ID;
  host.style.position = "fixed";
  host.style.top = "0";
  host.style.left = "0";
  host.style.zIndex = "2147483647";
  host.style.pointerEvents = "none";

  document.documentElement.appendChild(host);
  return host;
}

function createShadowUI() {
  const host = ensureUI();

  if (host.shadowRoot) {
    return { host, shadow: host.shadowRoot };
  }

  const shadow = host.attachShadow({ mode: "open" });

  shadow.addEventListener("click", (e) => {
    const path = e.composedPath();
    const historyHeader = path.find(el => el.classList && el.classList.contains("historyHeader"));
    if (historyHeader) {
      const isTrashBtn = path.find(el => el.classList && el.classList.contains("historyClearBtn"));
      if (!isTrashBtn) {
        currentState.historyExpanded = !currentState.historyExpanded;
        renderCurrentPanel();
      }
    }
  });

  const style = document.createElement("style");
  style.textContent = `
    :host { all: initial; }
    .srOnly {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }
    .btn {
      pointer-events: auto;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border-radius: 999px;
      border: 1px solid rgba(0,0,0,0.12);
      background: #ffffff;
      box-shadow: 0 6px 20px rgba(0,0,0,0.15);
      cursor: pointer;
      user-select: none;
    }
    .btn:hover { background: #f7f7f7; }
    .icon { width: 16px; height: 16px; }

    .panel {
      pointer-events: auto;
      display: flex;
      flex-direction: column;
      width: 420px;
      /* removed fixed height to allow auto-growth */
      max-width: min(720px, calc(100vw - 16px));
      max-height: min(70vh, calc(100vh - 16px));
      min-width: 280px;
      min-height: 160px;
      overflow: hidden;
      border-radius: 12px;
      border: 1px solid rgba(0,0,0,0.12);
      background: #ffffff;
      box-shadow: 0 12px 40px rgba(0,0,0,0.22);
      font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
      color: #111;
      position: relative;
    }

    .panelHeader {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 10px;
      border-bottom: 1px solid rgba(0,0,0,0.08);
      gap: 8px;
      cursor: grab;
      user-select: none;
    }
    .panelHeader:active { cursor: grabbing; }

    .panelTitle {
      font-size: 12px;
      font-weight: 600;
      opacity: 0.9;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .panelActions { display: flex; gap: 6px; align-items: center; }
    .actionBtn {
      pointer-events: auto;
      font-size: 12px;
      border-radius: 8px;
      border: 1px solid rgba(0,0,0,0.12);
      background: #fff;
      padding: 6px 8px;
      cursor: pointer;
      line-height: 0;
    }
    .actionBtn:hover { background: #f7f7f7; }
    .actionBtn[aria-pressed="true"] {
      background: #111;
      border-color: #111;
      color: #fff;
    }
    .actionIcon { width: 16px; height: 16px; display: block; }

    .panelBody {
      padding: 10px;
      padding-bottom: 14px;
      font-size: 13px;
      line-height: 1.45;
      overflow: auto;
      flex: 1 1 auto;
      min-height: 0;
      white-space: normal;
    }

    .contentText { white-space: pre-wrap; }
    .contentText p { margin: 0 0 8px; }
    .contentText p:last-child { margin-bottom: 0; }
    .contentText ul { margin: 0; padding-left: 18px; }
    .contentText li { margin: 0 0 6px; }
    .contentText li:last-child { margin-bottom: 0; }
    .contentText code {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      background: rgba(0,0,0,0.06);
      border: 1px solid rgba(0,0,0,0.08);
      border-radius: 6px;
      padding: 1px 4px;
      font-size: 12px;
    }

    .muted { opacity: 0.75; }
    .error { color: #b00020; }

    .historySection {
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px solid rgba(0,0,0,0.08);
    }
    .historyHeader {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      cursor: pointer;
      user-select: none;
      padding: 4px 0;
    }
    .historyTitle {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      font-weight: 600;
      opacity: 0.85;
    }
    .historyChevron {
      width: 14px;
      height: 14px;
      transition: transform 0.2s ease;
      opacity: 0.6;
    }
    .historyChevron.expanded {
      transform: rotate(180deg);
    }
    .historyTitleMain {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .historyContent {
      display: none;
      margin-top: 10px;
    }
    .historyContent.expanded {
      display: block;
    }
    .historyClearBtn {
      pointer-events: auto;
      border: 0;
      background: transparent;
      padding: 2px 4px;
      cursor: pointer;
      color: #b00020;
      border-radius: 8px;
      line-height: 0;
      flex: 0 0 auto;
    }
    .historyClearBtn:hover { background: rgba(176,0,32,0.08); }
    .historyClearBtn .actionIcon { width: 16px; height: 16px; }
    .historyList { display: flex; flex-direction: column; gap: 6px; }
    .historyItem {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      padding: 8px 10px;
      border-radius: 10px;
      border: 1px solid rgba(0,0,0,0.12);
      background: #fff;
      cursor: pointer;
    }
    .historyItem:hover { background: #f7f7f7; }
    .historyItemMain { min-width: 0; flex: 1 1 auto; display: flex; flex-direction: column; gap: 2px; }
    .historyItemTitle {
      font-size: 12px;
      font-weight: 600;
      opacity: 0.9;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100%;
    }
    .historyItemMeta {
      font-size: 11px;
      opacity: 0.7;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100%;
    }
    .historyDeleteBtn {
      font-size: 12px;
      border-radius: 10px;
      border: 1px solid rgba(0,0,0,0.12);
      background: #fff;
      padding: 6px 10px;
      cursor: pointer;
      flex: 0 0 auto;
    }
    .historyDeleteBtn:hover { background: #f7f7f7; }

    .spinnerWrap {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      gap: 10px;
      flex-direction: column;
    }
    .spinner {
      width: 22px;
      height: 22px;
      border-radius: 999px;
      border: 3px solid rgba(0,0,0,0.14);
      border-top-color: rgba(0,0,0,0.7);
      animation: spin 0.85s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .resizeHandle {
      position: absolute;
      z-index: 10;
      pointer-events: auto;
    }
    .h-n { top: -4px; left: 10px; right: 10px; height: 8px; cursor: ns-resize; }
    .h-s { bottom: -4px; left: 10px; right: 10px; height: 8px; cursor: ns-resize; }
    .h-e { top: 10px; right: -4px; bottom: 10px; width: 8px; cursor: ew-resize; }
    .h-w { top: 10px; left: -4px; bottom: 10px; width: 8px; cursor: ew-resize; }
    .h-ne { top: -4px; right: -4px; width: 12px; height: 12px; cursor: nesw-resize; }
    .h-nw { top: -4px; left: -4px; width: 12px; height: 12px; cursor: nwse-resize; }
    .h-se { bottom: -4px; right: -4px; width: 12px; height: 12px; cursor: nwse-resize; }
    .h-sw { bottom: -4px; left: -4px; width: 12px; height: 12px; cursor: nesw-resize; }
  `;

  const container = document.createElement("div");
  container.id = "container";

  const buttonLayer = document.createElement("div");
  buttonLayer.id = "buttonLayer";
  buttonLayer.style.position = "absolute";
  buttonLayer.style.inset = "0";
  buttonLayer.style.pointerEvents = "none";

  const panelLayer = document.createElement("div");
  panelLayer.id = "panelLayer";
  panelLayer.style.position = "absolute";
  panelLayer.style.inset = "0";
  panelLayer.style.pointerEvents = "none";

  container.appendChild(buttonLayer);
  container.appendChild(panelLayer);

  shadow.appendChild(style);
  shadow.appendChild(container);

  return { host, shadow };
}

function renderButton({ x, y, onClick }) {
  const { shadow } = createShadowUI();
  const layer = shadow.getElementById("buttonLayer") || shadow.getElementById("container");
  if (layer) layer.innerHTML = "";

  const btn = document.createElement("button");
  btn.className = "btn";
  btn.setAttribute("aria-label", t("summarize"));
  btn.title = t("summarize");

  btn.innerHTML = `
    <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 6h16M4 12h10M4 18h16" stroke="#111" stroke-width="1.8" stroke-linecap="round"/>
    </svg>
  `;

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    onClick();
  });

  const wrapper = document.createElement("div");
  wrapper.style.position = "absolute";
  wrapper.style.left = `${Math.round(x)}px`;
  wrapper.style.top = `${Math.round(y)}px`;

  wrapper.appendChild(btn);
  if (layer) layer.appendChild(wrapper);
}

function clearButtonOnly() {
  const host = document.getElementById(EXT_UI_ID);
  if (!host || !host.shadowRoot) return;
  const layer = host.shadowRoot.getElementById("buttonLayer") || host.shadowRoot.getElementById("container");
  if (layer) layer.innerHTML = "";
}

function iconSvg(name) {
  if (name === "close") {
    return `
      <svg class="actionIcon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `;
  }
  if (name === "copy") {
    return `
      <svg class="actionIcon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 8h10v12H8V8Z" stroke="currentColor" stroke-width="2"/>
        <path d="M6 16H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" stroke="currentColor" stroke-width="2"/>
      </svg>
    `;
  }
  if (name === "pin") {
    return `
      <svg class="actionIcon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 3l7 7-2 2-2-2-6 6 2 2-2 2-7-7 2-2 2 2 6-6-2-2 2-2Z" fill="currentColor"/>
      </svg>
    `;
  }
  if (name === "settings") {
    return `
      <svg class="actionIcon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" stroke="currentColor" stroke-width="2"/>
        <path d="M19.4 15a8.5 8.5 0 0 0 .1-2l2-1.5-2-3.5-2.4 1a8.6 8.6 0 0 0-1.7-1l-.3-2.6H9l-.3 2.6a8.6 8.6 0 0 0-1.7 1l-2.4-1-2 3.5 2 1.5a8.5 8.5 0 0 0 .1 2l-2 1.5 2 3.5 2.4-1a8.6 8.6 0 0 0 1.7 1l.3 2.6h6l.3-2.6a8.6 8.6 0 0 0 1.7-1l2.4 1 2-3.5-2-1.5Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
      </svg>
    `;
  }
  if (name === "trash") {
    return `
      <svg class="actionIcon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 3h6l1 2h5v2H3V5h5l1-2Z" fill="currentColor"/>
        <path d="M6 9h12l-1 12H7L6 9Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
        <path d="M10 12v6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path d="M14 12v6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `;
  }
  if (name === "chevron-down") {
    return `
      <svg class="historyChevron" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
  }
  return `
    <svg class="actionIcon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3Z" stroke="currentColor" stroke-width="2"/>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <path d="M12 19v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `;
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

function isMostlyBulletsText(text) {
  const lines = (text || "").split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const bulletLines = lines.filter((l) => /^[-*•]\s+/.test(l));
  return lines.length > 0 && bulletLines.length / lines.length >= 0.6;
}

function extractBulletsForTts(text) {
  const lines = (text || "").split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const bullets = [];
  for (const l of lines) {
    const m = l.match(/^[-*•]\s+(.+)$/);
    if (m) bullets.push(m[1].trim());
  }
  return bullets;
}

function detectLanguageHintFromText(text) {
  const t = (text || "").trim();
  if (!t) return "";

  // Very lightweight heuristics by Unicode blocks / distinctive letters.
  if (/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(t)) return "ar";
  if (/[\u0400-\u04FF]/.test(t)) return "ru";
  if (/[çğıİöşüÇĞİÖŞÜ]/.test(t)) return "tr";
  if (/[\u4E00-\u9FFF]/.test(t)) return "zh";

  return "en";
}

function getPreferredTtsLang(text) {
  const out = (currentState?.settings?.outputLanguage || "auto").trim().toLowerCase();
  if (out && out !== "auto") return out;
  return detectLanguageHintFromText(text);
}

function getVoicesAsync() {
  return new Promise((resolve) => {
    const done = () => resolve(window.speechSynthesis.getVoices() || []);
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      done();
      return;
    }

    let settled = false;
    const onChange = () => {
      if (settled) return;
      settled = true;
      window.speechSynthesis.removeEventListener("voiceschanged", onChange);
      done();
    };

    window.speechSynthesis.addEventListener("voiceschanged", onChange);
    setTimeout(() => {
      if (settled) return;
      settled = true;
      window.speechSynthesis.removeEventListener("voiceschanged", onChange);
      done();
    }, 700);
  });
}

function preferredLocaleFromLang(lang) {
  const l = (lang || "").trim().toLowerCase();
  if (!l) return "";
  if (l === "en") return "en-US";
  if (l === "tr") return "tr-TR";
  if (l === "ar") return "ar-SA";
  if (l === "ru") return "ru-RU";
  if (l === "zh") return "zh-CN";
  return l;
}

async function pickVoiceForLang(lang) {
  const l = (lang || "").trim().toLowerCase();
  if (!l) return null;

  const voices = await getVoicesAsync();
  if (!voices || voices.length === 0) return null;

  const locale = preferredLocaleFromLang(l).toLowerCase();

  const exactLocale = voices.find((v) => (v.lang || "").toLowerCase() === locale);
  const exactLang = voices.find((v) => (v.lang || "").toLowerCase() === l);
  const prefix = voices.find((v) => (v.lang || "").toLowerCase().startsWith(`${l}-`));
  const anyPrefix = voices.find((v) => (v.lang || "").toLowerCase().startsWith(l));
  return exactLocale || exactLang || prefix || anyPrefix || null;
}

function speakWithOptionalBulletPauses(text) {
  const raw = text || "";
  const isBullets = isMostlyBulletsText(raw);
  const preferredLang = getPreferredTtsLang(raw);
  if (!isBullets) {
    speakText(raw, preferredLang);
    return;
  }

  const items = extractBulletsForTts(raw);
  if (items.length === 0) {
    speakText(raw, preferredLang);
    return;
  }

  stopSpeaking();
  currentState.ttsRunId = (currentState.ttsRunId || 0) + 1;
  const runId = currentState.ttsRunId;
  currentState.ttsActive = true;

  const pauseMs = 450;

  const speakNext = (idx, voice) => {
    if (currentState.ttsRunId !== runId) return;
    if (!currentState.ttsActive) return;
    if (idx >= items.length) {
      currentState.ttsActive = false;
      if (currentState.showing === "panel") renderCurrentPanel();
      return;
    }

    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(stripMarkdownInline(items[idx]));
    utter.lang = preferredLocaleFromLang(preferredLang);
    utter.rate = 1;
    utter.pitch = 1;
    if (voice) utter.voice = voice;
    utter.onend = () => {
      if (currentState.ttsRunId !== runId) return;
      setTimeout(() => speakNext(idx + 1, voice), pauseMs);
    };
    utter.onerror = () => {
      currentState.ttsActive = false;
      if (currentState.showing === "panel") renderCurrentPanel();
    };
    window.speechSynthesis.speak(utter);
  };

  (async () => {
    const voice = await pickVoiceForLang(preferredLang);
    if (currentState.ttsRunId !== runId) return;
    if (!currentState.ttsActive) return;
    speakNext(0, voice);
  })().catch(() => {
    if (currentState.ttsRunId !== runId) return;
    if (!currentState.ttsActive) return;
    speakNext(0, null);
  });
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function stripMarkdownInline(text) {
  return (text || "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/`(.+?)`/g, "$1");
}

function parseInlineMarkdown(line) {
  const nodes = [];
  let i = 0;

  function pushText(s) {
    if (!s) return;
    nodes.push(document.createTextNode(s));
  }

  while (i < line.length) {
    const rest = line.slice(i);

    const codeMatch = rest.match(/^`([^`]+)`/);
    if (codeMatch) {
      const el = document.createElement("code");
      el.textContent = codeMatch[1];
      nodes.push(el);
      i += codeMatch[0].length;
      continue;
    }

    const boldMatch = rest.match(/^\*\*([^*]+)\*\*/);
    if (boldMatch) {
      const el = document.createElement("strong");
      el.textContent = boldMatch[1];
      nodes.push(el);
      i += boldMatch[0].length;
      continue;
    }

    const italicMatch = rest.match(/^\*([^*]+)\*/);
    if (italicMatch) {
      const el = document.createElement("em");
      el.textContent = italicMatch[1];
      nodes.push(el);
      i += italicMatch[0].length;
      continue;
    }

    pushText(line[i]);
    i += 1;
  }

  return nodes;
}

function renderRichText(container, text) {
  container.innerHTML = "";
  const wrap = document.createElement("div");
  wrap.className = "contentText";

  const lines = (text || "").split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const bulletLines = lines.filter((l) => /^[-*•]\s+/.test(l));
  const isMostlyBullets = lines.length > 0 && bulletLines.length / lines.length >= 0.6;

  if (isMostlyBullets) {
    const ul = document.createElement("ul");
    for (const l of lines) {
      const li = document.createElement("li");
      const content = l.replace(/^[-*•]\s+/, "");
      for (const n of parseInlineMarkdown(content)) li.appendChild(n);
      ul.appendChild(li);
    }
    wrap.appendChild(ul);
  } else {
    const paragraphs = (text || "").split(/\n\n+/);
    for (const p of paragraphs) {
      const trimmed = p.trim();
      if (!trimmed) continue;
      const el = document.createElement("p");
      const singleLine = trimmed.replace(/\r?\n/g, " ");
      for (const n of parseInlineMarkdown(singleLine)) el.appendChild(n);
      wrap.appendChild(el);
    }
  }

  container.appendChild(wrap);
}

async function copyToClipboard(text) {
  const value = text || "";
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const ta = document.createElement("textarea");
  ta.value = value;
  ta.style.position = "fixed";
  ta.style.left = "-9999px";
  ta.style.top = "-9999px";
  document.documentElement.appendChild(ta);
  ta.select();
  document.execCommand("copy");
  ta.remove();
}

function renderPanel(state) {
  const { shadow } = createShadowUI();
  const container = shadow.getElementById("panelLayer") || shadow.getElementById("container");
  if (!container) return;

  container.innerHTML = "";

  const panelWrapper = document.createElement("div");
  panelWrapper.style.position = "absolute";
  panelWrapper.style.left = `${Math.round(state.x)}px`;
  panelWrapper.style.top = `${Math.round(state.y)}px`;

  const panel = document.createElement("div");
  panel.className = "panel";
  panel.style.width = `${Math.round(state.w)}px`;
  // If we are in summary view, we let it height auto-grow. 
  // If we are in settings or it was manually resized, we might use fixed height.
  if (state.view === "settings") {
    panel.style.height = `${Math.round(state.h)}px`;
    panel.style.maxHeight = `calc(100vh - 16px)`;
  } else {
    // For summary view, we don't force height unless it's being resized.
    // We removed currentState.pinned from here to allow auto-height when pinned,
    // so it can grow with the history dropdown even if it's pinned.
    if (currentState.resizing) {
       panel.style.height = `${Math.round(state.h)}px`;
    } else {
       panel.style.height = "auto";
    }
  }

  const header = document.createElement("div");
  header.className = "panelHeader";

  const panelTitle = document.createElement("div");
  panelTitle.className = "panelTitle";
  panelTitle.textContent = state.title;

  const actions = document.createElement("div");
  actions.className = "panelActions";

  const pin = document.createElement("button");
  pin.className = "actionBtn";
  pin.setAttribute("aria-label", state.pinned ? t("tooltipUnpin") : t("tooltipPin"));
  pin.setAttribute("aria-pressed", state.pinned ? "true" : "false");
  pin.title = state.pinned ? t("tooltipUnpin") : t("tooltipPin");
  pin.innerHTML = iconSvg("pin");
  pin.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    state.onTogglePin();
  });

  const copy = document.createElement("button");
  copy.className = "actionBtn";
  copy.setAttribute("aria-label", t("tooltipCopy"));
  copy.title = t("tooltipCopy");
  copy.innerHTML = iconSvg("copy");
  copy.addEventListener("click", async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await copyToClipboard(state.rawText || "");
      state.onCopied();
    } catch (err) {
      state.onError(err?.message || String(err));
    }
  });

  const speak = document.createElement("button");
  speak.className = "actionBtn";
  speak.setAttribute("aria-label", t("tooltipTts"));
  speak.setAttribute("aria-pressed", state.ttsActive ? "true" : "false");
  speak.title = t("tooltipTts");
  speak.innerHTML = iconSvg("voice");
  speak.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    state.onToggleSpeak();
  });

  const close = document.createElement("button");
  close.className = "actionBtn";
  close.setAttribute("aria-label", t("tooltipClose"));
  close.title = t("tooltipClose");
  close.innerHTML = iconSvg("close");
  close.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    state.onClose();
  });

  actions.appendChild(pin);
  if (state.view !== "settings") actions.appendChild(copy);
  if (state.view !== "settings") actions.appendChild(speak);
  actions.appendChild(close);

  header.appendChild(panelTitle);
  header.appendChild(actions);

  const bodyEl = document.createElement("div");
  bodyEl.className = "panelBody";
  bodyEl.style.overflow = state.view === "settings" ? "visible" : "auto";

  if (state.view === "settings") {
    renderSettingsBody(bodyEl, state);
  } else if (state.loading) {
    const wrap = document.createElement("div");
    wrap.className = "spinnerWrap";
    const sp = document.createElement("div");
    sp.className = "spinner";
    const label = document.createElement("div");
    label.className = "muted";
    label.textContent = t("loading");
    wrap.appendChild(sp);
    wrap.appendChild(label);
    bodyEl.appendChild(wrap);
  } else if (state.errorMessage) {
    const err = document.createElement("div");
    err.className = "error";
    err.textContent = state.errorMessage;
    bodyEl.appendChild(err);
  } else {
    const outputLang = (state?.settings?.outputLanguage || "auto").trim();
    const info = document.createElement("div");
    info.className = "muted";
    info.style.fontSize = "12px";
    info.style.marginBottom = "8px";
    info.textContent = outputLang === "auto"
      ? t("outputInfoAuto")
      : `${t("outputInfoFixed")}${getLanguageLabel(outputLang)}`;
    bodyEl.appendChild(info);

    const content = document.createElement("div");
    bodyEl.appendChild(content);
    renderRichText(content, state.body || "");

    const section = document.createElement("div");
    section.className = "historySection";

    const header = document.createElement("div");
    header.className = "historyHeader";
    header.title = t("historyToggle");

    const titleContainer = document.createElement("div");
    titleContainer.className = "historyTitle";

    const chevron = document.createElement("div");
    chevron.className = `historyChevron ${state.historyExpanded ? "expanded" : ""}`;
    chevron.innerHTML = iconSvg("chevron-down");
    titleContainer.appendChild(chevron);

    const titleText = document.createElement("div");
    titleText.textContent = t("history");
    titleContainer.appendChild(titleText);
    header.appendChild(titleContainer);

    const clearAll = document.createElement("button");
    clearAll.className = "historyClearBtn";
    clearAll.type = "button";
    clearAll.setAttribute("aria-label", t("historyClear"));
    clearAll.title = t("historyClear");
    clearAll.innerHTML = iconSvg("trash");
    clearAll.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (state.recentSummaries.length === 0) return;
      if (typeof state.onClearHistory === "function") state.onClearHistory();
    });
    header.appendChild(clearAll);
    section.appendChild(header);

    const historyContent = document.createElement("div");
    historyContent.className = `historyContent ${state.historyExpanded ? "expanded" : ""}`;

    if (state.recentSummaries.length === 0) {
      const empty = document.createElement("div");
      empty.className = "muted";
      empty.style.fontSize = "12px";
      empty.textContent = t("historyEmpty");
      historyContent.appendChild(empty);
    } else {
      const list = document.createElement("div");
      list.className = "historyList";
      for (const it of state.recentSummaries) {
        const row = document.createElement("div");
        row.className = "historyItem";
        row.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          state.onOpenHistoryItem(it);
        });

        const main = document.createElement("div");
        main.className = "historyItemMain";

        const tt = document.createElement("div");
        tt.className = "historyItemTitle";
        tt.textContent = it?.sourceTitle || it?.sourceHost || it?.provider || t("summary");
        main.appendChild(tt);

        const meta = document.createElement("div");
        meta.className = "historyItemMeta";
        const providerModel = `${it?.provider || ""}${it?.model ? ` / ${it.model}` : ""}`.trim();
        const preview = safeOneLine(it?.inputPreview || it?.summaryPreview || "", 80);
        meta.textContent = `${providerModel}${providerModel && preview ? " • " : ""}${preview}`.trim();
        main.appendChild(meta);

        const del = document.createElement("button");
        del.className = "historyDeleteBtn";
        del.type = "button";
        del.textContent = t("historyDelete");
        del.title = t("historyDelete");
        del.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          state.onDeleteHistoryItem(it);
        });

        row.appendChild(main);
        row.appendChild(del);
        list.appendChild(row);
      }
      historyContent.appendChild(list);
    }
    section.appendChild(historyContent);
    bodyEl.appendChild(section);
  }

  panel.appendChild(header);
  panel.appendChild(bodyEl);

  const handles = [
    ["h-n", "n"],
    ["h-s", "s"],
    ["h-e", "e"],
    ["h-w", "w"],
    ["h-ne", "ne"],
    ["h-nw", "nw"],
    ["h-se", "se"],
    ["h-sw", "sw"]
  ];
  for (const [cls, dir] of handles) {
    const h = document.createElement("div");
    h.className = `resizeHandle ${cls}`;
    h.addEventListener("mousedown", (e) => {
      e.preventDefault();
      e.stopPropagation();
      state.onResizeStart(e, dir);
    });
    panel.appendChild(h);
  }

  header.addEventListener("mousedown", (e) => {
    if (e.button !== 0) return;
    const target = e.target;
    if (target && target.closest && target.closest(".panelActions")) return;
    state.onDragStart(e);
  });

  panelWrapper.appendChild(panel);
  container.appendChild(panelWrapper);
}

function renderSettingsBody(container, state) {
  const settings = state.settings || {};
  const draft = state.settingsDraft || { ...settings };

  const mode = (draft.mode ?? settings.mode ?? "free").trim();
  const providerRaw = (draft.provider ?? settings.provider ?? "groq").trim();
  const selectedModelRaw = (draft.model ?? settings.model ?? "").trim();
  const bulletSummary = !!(draft.bulletSummary ?? settings.bulletSummary);
  const uiLanguage = (draft.uiLanguage ?? settings.uiLanguage ?? "auto").trim();
  const outputLanguage = (draft.outputLanguage ?? settings.outputLanguage ?? "auto").trim();

  const isFreeMode = mode === "free";
  const allowedProviders = Object.keys(FREE_PROVIDER_MODELS);
  const provider = isFreeMode && !allowedProviders.includes(providerRaw)
    ? (allowedProviders[0] || "groq")
    : providerRaw;

  const providerModels = isFreeMode
    ? (FREE_PROVIDER_MODELS[provider] || [])
    : (PROVIDER_MODELS[provider] || []);

  let modelIsCustom = false;
  let modelCustomValue = "";
  let modelSelectValue = "";

  if (isFreeMode) {
    modelSelectValue = providerModels.includes(selectedModelRaw)
      ? selectedModelRaw
      : (providerModels[0] || "");
    modelCustomValue = "";
    modelIsCustom = false;
  } else {
    if (!selectedModelRaw) {
      modelSelectValue = providerModels[0] || MODEL_CUSTOM_VALUE;
      modelCustomValue = "";
      modelIsCustom = false;
    } else if (providerModels.includes(selectedModelRaw)) {
      modelSelectValue = selectedModelRaw;
      modelCustomValue = "";
      modelIsCustom = false;
    } else {
      modelSelectValue = MODEL_CUSTOM_VALUE;
      modelCustomValue = selectedModelRaw;
      modelIsCustom = true;
    }
  }

  const effectiveModel = isFreeMode
    ? (modelSelectValue || "")
    : (modelIsCustom ? modelCustomValue : (modelSelectValue || ""));

  currentState.settingsDraft = {
    ...draft,
    mode,
    provider,
    bulletSummary,
    model: effectiveModel,
    uiLanguage,
    outputLanguage
  };

  container.innerHTML = "";

  const wrap = document.createElement("div");
  wrap.style.display = "flex";
  wrap.style.flexDirection = "column";
  wrap.style.gap = "12px";

  const openSummaryBtn = document.createElement("button");
  openSummaryBtn.className = "actionBtn";
  openSummaryBtn.style.width = "fit-content";
  openSummaryBtn.style.alignSelf = "flex-start";
  openSummaryBtn.style.lineHeight = "1";
  openSummaryBtn.textContent = t("openSummaryPanel");
  openSummaryBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    state.onOpenSummaryPanel();
  });
  wrap.appendChild(openSummaryBtn);

  const row = (labelText, controlEl) => {
    const r = document.createElement("div");
    r.style.display = "flex";
    r.style.flexDirection = "column";
    r.style.gap = "4px";
    const label = document.createElement("div");
    label.style.fontSize = "12px";
    label.style.fontWeight = "600";
    label.style.opacity = "0.85";
    label.textContent = labelText;
    r.appendChild(label);
    r.appendChild(controlEl);
    return r;
  };

  const selectEl = (options) => {
    const s = document.createElement("select");
    s.style.width = "100%";
    s.style.padding = "6px 10px";
    s.style.borderRadius = "10px";
    s.style.border = "1px solid rgba(0,0,0,0.16)";
    s.style.background = "#fff";
    s.style.fontSize = "13px";
    for (const { value, label } of options) {
      const o = document.createElement("option");
      o.value = value;
      o.textContent = label;
      s.appendChild(o);
    }
    return s;
  };

  const inputEl = (type = "text") => {
    const i = document.createElement("input");
    i.type = type;
    i.style.width = "100%";
    i.style.padding = "6px 10px";
    i.style.borderRadius = "10px";
    i.style.border = "1px solid rgba(0,0,0,0.16)";
    i.style.fontSize = "13px";
    return i;
  };

  const checkboxRow = (labelText, checked, onChange) => {
    const r = document.createElement("label");
    r.style.display = "flex";
    r.style.alignItems = "center";
    r.style.gap = "8px";
    r.style.userSelect = "none";
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = !!checked;
    cb.addEventListener("change", () => onChange(!!cb.checked));
    const tEl = document.createElement("div");
    tEl.textContent = labelText;
    tEl.style.fontSize = "13px";
    r.appendChild(cb);
    r.appendChild(tEl);
    return r;
  };

  const modeSelect = selectEl([
    { value: "free", label: t("freeMode") },
    { value: "own_api", label: t("ownApi") }
  ]);
  modeSelect.value = mode;
  modeSelect.addEventListener("change", () => {
    currentState.settingsDraft = { ...currentState.settingsDraft, mode: modeSelect.value };
    renderCurrentPanel();
  });

  const providerSelect = selectEl(
    isFreeMode
      ? [
        { value: "groq", label: "Groq" },
        { value: "gemini", label: "Gemini" }
      ]
      : [
        { value: "groq", label: "Groq" },
        { value: "openai", label: "OpenAI" },
        { value: "gemini", label: "Gemini" },
        { value: "anthropic", label: "Anthropic" }
      ]
  );
  providerSelect.value = isFreeMode && !allowedProviders.includes(provider)
    ? (allowedProviders[0] || "groq")
    : provider;
  providerSelect.addEventListener("change", () => {
    const p = providerSelect.value;
    const nextModels = (isFreeMode ? (FREE_PROVIDER_MODELS[p] || []) : (PROVIDER_MODELS[p] || []));
    const nextModel = nextModels[0] || "";
    currentState.settingsDraft = {
      ...currentState.settingsDraft,
      provider: p,
      model: nextModel
    };
    renderCurrentPanel();
  });

  const modelOptions = (isFreeMode ? [...providerModels] : [...providerModels, MODEL_CUSTOM_VALUE]).map((v) => ({
    value: v,
    label: v === MODEL_CUSTOM_VALUE ? t("customModel") : v
  }));
  const modelSelect = selectEl(modelOptions);
  modelSelect.value = modelSelectValue || (providerModels[0] || (isFreeMode ? "" : MODEL_CUSTOM_VALUE));

  const modelCustom = inputEl("text");
  modelCustom.placeholder = "model";
  modelCustom.value = modelIsCustom ? modelCustomValue : "";
  modelCustom.style.display = modelSelect.value === MODEL_CUSTOM_VALUE ? "block" : "none";

  modelSelect.addEventListener("change", () => {
    if (modelSelect.value === MODEL_CUSTOM_VALUE) {
      modelCustom.style.display = "block";
      modelCustom.focus();
      currentState.settingsDraft = { ...currentState.settingsDraft, model: modelCustom.value.trim() };
      return;
    }
    modelCustom.style.display = "none";
    modelCustom.value = "";
    currentState.settingsDraft = { ...currentState.settingsDraft, model: modelSelect.value };
  });
  modelCustom.addEventListener("input", () => {
    currentState.settingsDraft = { ...currentState.settingsDraft, model: modelCustom.value.trim() };
  });

  const apiKeyInput = inputEl("password");
  apiKeyInput.placeholder = t("apiKey");
  apiKeyInput.value = "";

  const languageOptions = [
    { value: "auto", label: t("auto") },
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

  const uiLangSelect = selectEl(languageOptions);
  uiLangSelect.value = uiLanguage;
  uiLangSelect.addEventListener("change", () => {
    currentState.settingsDraft = { ...currentState.settingsDraft, uiLanguage: uiLangSelect.value };
    applyUiLangSetting(uiLangSelect.value);
    renderCurrentPanel();
  });

  const outLangSelect = selectEl(languageOptions);
  outLangSelect.value = outputLanguage;
  outLangSelect.addEventListener("change", () => {
    currentState.settingsDraft = { ...currentState.settingsDraft, outputLanguage: outLangSelect.value };
    renderCurrentPanel();
  });

  const bulletRow = checkboxRow(t("bulletSummary"), bulletSummary, (v) => {
    currentState.settingsDraft = { ...currentState.settingsDraft, bulletSummary: v };
  });

  const saveBtn = document.createElement("button");
  saveBtn.className = "actionBtn";
  saveBtn.style.width = "fit-content";
  saveBtn.style.alignSelf = "flex-start";
  saveBtn.style.lineHeight = "1";
  saveBtn.style.marginTop = "4px";
  saveBtn.textContent = t("save");
  saveBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const d = currentState.settingsDraft || {};
    const m = (d.mode || "own_api").trim();
    const isFree = m === "free";

    const payload = {
      mode: m,
      bulletSummary: !!d.bulletSummary,
      uiLanguage: (d.uiLanguage || "auto").trim(),
      outputLanguage: (d.outputLanguage || "auto").trim(),
      provider: (d.provider || "groq").trim(),
      model: (d.model || "").trim() || (((isFree
        ? (FREE_PROVIDER_MODELS[(d.provider || "groq").trim()] || [])
        : (PROVIDER_MODELS[(d.provider || "groq").trim()] || []))
      )[0] || "")
    };

    const rawApiKey = apiKeyInput.value.trim();

    try {
      const resp = await runtimeSendMessage({
        type: "SAVE_SETTINGS_UI",
        settings: payload,
        rawApiKey
      });
      if (!resp || !resp.ok) throw new Error(resp?.error || "Unknown error");

      apiKeyInput.value = "";
      currentState.settings = { ...(currentState.settings || {}), ...payload };
      applyUiLangSetting(payload.uiLanguage);
      currentState.settingsStatus = isFree
        ? t("saved")
        : (rawApiKey ? t("apiKeySaved") : t("apiKeyUnchanged"));
      renderCurrentPanel();
    } catch (err) {
      currentState.settingsStatus = normalizeErrorMessage(err);
      renderCurrentPanel();
    }
  });

  const isFree = mode === "free";
  apiKeyInput.disabled = isFree;

  if (isFree) {
    for (const opt of providerSelect.options) {
      opt.disabled = !allowedProviders.includes(opt.value);
    }
  }

  modelSelect.disabled = false;
  modelCustom.disabled = isFree;

  wrap.appendChild(row(t("mode"), modeSelect));
  wrap.appendChild(row(t("uiLanguage"), uiLangSelect));
  wrap.appendChild(row(t("outputLanguage"), outLangSelect));
  wrap.appendChild(row(t("provider"), providerSelect));

  const modelWrap = document.createElement("div");
  modelWrap.style.display = "flex";
  modelWrap.style.flexDirection = "column";
  modelWrap.style.gap = "6px";
  modelWrap.appendChild(modelSelect);
  modelWrap.appendChild(modelCustom);
  wrap.appendChild(row(t("model"), modelWrap));

  if (!isFree) {
    wrap.appendChild(row(t("apiKey"), apiKeyInput));
  }
  wrap.appendChild(bulletRow);
  wrap.appendChild(saveBtn);

  if (state.settingsStatus) {
    const status = document.createElement("div");
    status.style.fontSize = "12px";
    status.style.opacity = "0.85";
    status.style.whiteSpace = "pre-wrap";
    status.style.color = state.settingsStatus === t("saved") || state.settingsStatus === t("apiKeySaved") || state.settingsStatus === t("apiKeyUnchanged")
      ? "#0b6b2f"
      : "#b00020";
    status.style.marginTop = "4px";
    status.textContent = state.settingsStatus;
    wrap.appendChild(status);
  }

  container.appendChild(wrap);
}

let currentState = {
  showing: null,
  lastSelectionText: "",
  lastSelectionRect: null,
  ttsActive: false,
  pinned: false,
  loading: false,
  errorMessage: "",
  summaryText: "",
  freeUsage: null,
  panelX: 0,
  panelY: 0,
  panelW: 420,
  panelH: 240,
  historyExpanded: false,
  dragging: false,
  resizing: false,
  resizeDir: "",
  dragStart: null,
  resizeStart: null,
  copyToastUntil: 0,
  view: "summary",
  settings: null,
  settingsDraft: null,
  settingsStatus: "",
  ttsRunId: 0,
  recentSummaries: [],
  lastSummaryPanel: null
};

function canUseChromeRuntime() {
  return typeof chrome !== "undefined"
    && !!chrome?.runtime
    && typeof chrome.runtime.sendMessage === "function";
}

function runtimeSendMessage(message) {
  return new Promise((resolve, reject) => {
    if (!canUseChromeRuntime()) {
      reject(new Error("EXTENSION_CONTEXT_INVALIDATED"));
      return;
    }

    try {
      chrome.runtime.sendMessage(message, (resp) => {
        const err = chrome?.runtime?.lastError;
        if (err) return reject(new Error(err.message));
        resolve(resp);
      });
    } catch (e) {
      reject(e);
    }
  });
}

function hideUI() {
  const host = document.getElementById(EXT_UI_ID);
  if (host && host.shadowRoot) {
    const buttonLayer = host.shadowRoot.getElementById("buttonLayer");
    const panelLayer = host.shadowRoot.getElementById("panelLayer");
    if (buttonLayer) buttonLayer.innerHTML = "";
    if (panelLayer) panelLayer.innerHTML = "";
    if (!buttonLayer && !panelLayer) {
      const container = host.shadowRoot.getElementById("container");
      if (container) container.innerHTML = "";
    }
  }
  currentState.showing = null;
  currentState.ttsActive = false;
  currentState.loading = false;
  currentState.errorMessage = "";
  currentState.settingsStatus = "";
  stopSpeaking();
}

async function loadSettingsIntoState() {
  try {
    const resp = await runtimeSendMessage({ type: "GET_SETTINGS" });
    const settings = resp?.settings || null;
    currentState.settings = settings;
    currentState.settingsDraft = settings ? { ...settings } : null;
    applyUiLangSetting(settings?.uiLanguage || "auto");
    return settings;
  } catch {
    currentState.settings = null;
    currentState.settingsDraft = null;
    applyUiLangSetting("auto");
    return null;
  }
}

async function showSettingsPanel() {
  if (currentState.view !== "settings") {
    currentState.lastSummaryPanel = {
      x: currentState.panelX,
      y: currentState.panelY,
      w: currentState.panelW,
      h: currentState.panelH
    };
  }

  await loadSettingsIntoState();

  const isFreeMode = (currentState.settings?.mode || "").trim() === "free";
  if (isFreeMode) refreshFreeUsage().catch(() => {});
  currentState.recentSummaries = await loadRecentSummaries();
  currentState.showing = "panel";
  currentState.view = "settings";
  currentState.loading = false;
  currentState.errorMessage = "";
  currentState.summaryText = currentState.summaryText || "";
  currentState.ttsActive = false;
  stopSpeaking();

  // Make settings view tall enough to fit all controls (no scroll) within viewport.
  currentState.panelH = clamp(window.innerHeight - 16, 320, window.innerHeight - 16);

  const desiredX = Math.max(8, Math.min(16, window.innerWidth - currentState.panelW - 8));
  const desiredY = 16;

  const maxX = Math.max(8, window.innerWidth - currentState.panelW - 8);
  const maxY = Math.max(8, window.innerHeight - currentState.panelH - 8);
  currentState.panelX = clamp(desiredX, 8, maxX);
  currentState.panelY = clamp(desiredY, 8, maxY);
  renderCurrentPanel();
}

async function openSummaryPanelAtLastPosition() {
  const last = currentState.lastSummaryPanel;
  let use = last && typeof last.x === "number" ? last : null;

  if (!use) {
    const stored = await loadLastPanelGeometry();
    if (stored && typeof stored.x === "number") use = stored;
  }

  if (use) {
    currentState.panelW = clamp(use.w || currentState.panelW, 280, window.innerWidth - 16);
    currentState.panelH = clamp(use.h || currentState.panelH, 160, window.innerHeight - 16);
    currentState.panelX = clamp(use.x, 8, window.innerWidth - 120);
    currentState.panelY = clamp(use.y, 8, window.innerHeight - 80);
  }

  currentState.showing = "panel";
  currentState.view = "summary";
  currentState.loading = false;
  currentState.errorMessage = "";
  currentState.settingsStatus = "";
  currentState.settingsDraft = null;
  currentState.ttsActive = false;
  stopSpeaking();
  if (currentState.summaryText) maybeGrowPanelForSummary(currentState.summaryText);
  renderCurrentPanel();
}

if (typeof chrome !== "undefined" && chrome?.runtime?.onMessage?.addListener) {
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg?.type === "OPEN_SUMMARY_PANEL") {
      (async () => {
        await openSummaryPanelAtLastPosition();
        sendResponse({ ok: true });
      })().catch(() => sendResponse({ ok: false }));
      return true;
    }

    if (msg?.type === "SETTINGS_UPDATED") {
      (async () => {
        await loadSettingsIntoState();
        if (currentState.showing === "panel") renderCurrentPanel();
        if (currentState.showing === "button") maybeShowButton();
        sendResponse({ ok: true });
      })().catch(() => sendResponse({ ok: false }));
      return true;
    }

    if (msg?.type === "PREVIEW_UI_LANGUAGE") {
      try {
        applyUiLangSetting((msg?.uiLanguage || "auto").trim());
        if (currentState.showing === "panel") renderCurrentPanel();
        if (currentState.showing === "button") maybeShowButton();
        sendResponse({ ok: true });
      } catch {
        sendResponse({ ok: false });
      }
      return true;
    }

    if (msg?.type === "PREVIEW_OUTPUT_LANGUAGE") {
      try {
        applyOutputLangSetting((msg?.outputLanguage || "auto").trim());
        if (currentState.showing === "panel") renderCurrentPanel();
        if (currentState.showing === "button") maybeShowButton();
        sendResponse({ ok: true });
      } catch {
        sendResponse({ ok: false });
      }
      return true;
    }
  });
}

function positionNearRect(rect) {
  const padding = 8;
  const x = Math.min(rect.right + padding, window.innerWidth - 40);
  const y = Math.max(rect.top - 6, padding);
  return { x, y };
}

async function requestSummary(text) {
  const resp = await runtimeSendMessage({
    type: "SUMMARIZE",
    text
  });

  if (!resp || !resp.ok) {
    const err = new Error(resp?.errorCode ? mapErrorCodeToMessage(resp.errorCode) : t("errUnknown"));
    if (resp?.usage) err.usage = resp.usage;
    throw err;

    const message = resp?.error || "Unknown error";
    if (message === "Free mode is not available yet.") {
      throw new Error(t("freeNotReady"));
    }
    throw new Error(t("errUnknown"));
  }

  return resp;
}

async function refreshFreeUsage() {
  try {
    const settings = currentState.settings || {};
    const provider = (settings.provider || "groq").trim().toLowerCase();
    const resp = await runtimeSendMessage({ type: "GET_FREE_USAGE", provider });
    if (resp?.ok && resp?.usage) {
      currentState.freeUsage = resp.usage;
    }
  } catch {
    // ignore
  }
}

function speakText(text, preferredLang) {
  window.speechSynthesis.cancel();
  currentState.ttsRunId = (currentState.ttsRunId || 0) + 1;
  const runId = currentState.ttsRunId;
  currentState.ttsActive = true;

  const utter = new SpeechSynthesisUtterance(stripMarkdownInline(text));
  utter.lang = preferredLocaleFromLang(preferredLang);
  utter.rate = 1;
  utter.pitch = 1;
  utter.onend = () => {
    currentState.ttsActive = false;
    if (currentState.showing === "panel") renderCurrentPanel();
  };
  utter.onerror = () => {
    currentState.ttsActive = false;
    if (currentState.showing === "panel") renderCurrentPanel();
  };

  (async () => {
    const voice = await pickVoiceForLang(preferredLang);
    if (currentState.ttsRunId !== runId) return;
    if (!currentState.ttsActive) return;
    if (voice) utter.voice = voice;
    window.speechSynthesis.speak(utter);
  })().catch(() => {
    if (currentState.ttsRunId !== runId) return;
    if (!currentState.ttsActive) return;
    window.speechSynthesis.speak(utter);
  });
}

function togglePauseResume() {
  if (window.speechSynthesis.speaking || window.speechSynthesis.paused) {
    window.speechSynthesis.cancel();
    currentState.ttsActive = false;
    if (currentState.showing === "panel") renderCurrentPanel();
  }
}

function stopSpeaking() {
  window.speechSynthesis.cancel();
  currentState.ttsActive = false;
  currentState.ttsRunId = (currentState.ttsRunId || 0) + 1;
}

async function showSummaryFlow(passedSelection) {
  const info = passedSelection && typeof passedSelection === "object"
    ? passedSelection
    : getSelectionInfo();

  const rect = info?.rect;
  const text = clampText(info?.text || "", 5000);
  if (!rect || !text) return;

  await loadSettingsIntoState();

  const { x: nearX, y: nearY } = positionNearRect(rect);

  // Prefer opening the summary panel at its last known position.
  // Fallback to opening near selection if we have no stored geometry yet.
  let geom = null;
  if (currentState.showing === "panel" && currentState.view === "summary") {
    geom = {
      x: currentState.panelX,
      y: currentState.panelY,
      w: currentState.panelW,
      h: currentState.panelH
    };
  } else if (currentState.lastSummaryPanel && typeof currentState.lastSummaryPanel.x === "number") {
    geom = currentState.lastSummaryPanel;
  } else {
    const stored = await loadLastPanelGeometry();
    if (stored && typeof stored.x === "number") geom = stored;
  }

  const nextW = clamp(geom?.w || currentState.panelW, 280, window.innerWidth - 16);
  const nextH = clamp(geom?.h || currentState.panelH, 160, window.innerHeight - 16);
  const maxX = Math.max(8, window.innerWidth - nextW - 8);
  const maxY = Math.max(8, window.innerHeight - nextH - 8);
  const nextX = clamp((typeof geom?.x === "number" ? geom.x : nearX), 8, maxX);
  const nextY = clamp((typeof geom?.y === "number" ? geom.y : nearY), 8, maxY);

  const isCodeOnly = looksLikeCode(text);
  if (isCodeOnly) {
    const lineCount = countNonEmptyLines(text);
    if (lineCount <= 3) {
      currentState.showing = "panel";
      currentState.panelW = nextW;
      currentState.panelH = nextH;
      currentState.panelX = nextX;
      currentState.panelY = nextY;
      currentState.view = "summary";
      currentState.loading = false;
      currentState.errorMessage = t("tooShortCode");
      currentState.summaryText = "";
      currentState.ttsActive = false;
      stopSpeaking();
      renderCurrentPanel();
      return;
    }
  } else {
    const sentenceCount = countSentences(text);
    const wordCount = countWords(text);
    if (sentenceCount < 3 || wordCount < 30) {
      currentState.showing = "panel";
      currentState.panelW = nextW;
      currentState.panelH = nextH;
      currentState.panelX = nextX;
      currentState.panelY = nextY;
      currentState.view = "summary";
      currentState.loading = false;
      currentState.errorMessage = t("tooShortText");
      currentState.summaryText = "";
      currentState.ttsActive = false;
      stopSpeaking();
      renderCurrentPanel();
      return;
    }
  }

  currentState.showing = "panel";
  currentState.panelW = nextW;
  currentState.panelH = nextH;
  currentState.panelX = nextX;
  currentState.panelY = nextY;
  currentState.view = "summary";
  currentState.settingsStatus = "";
  currentState.settingsDraft = null;
  currentState.loading = true;
  currentState.errorMessage = "";
  currentState.summaryText = "";
  currentState.ttsActive = false;
  stopSpeaking();
  renderCurrentPanel();

  try {
    const summaryResp = await requestSummary(text);
    const summary = summaryResp?.summary || "";

    if (summaryResp?.usage) {
      currentState.freeUsage = summaryResp.usage;
    }

    const settings = currentState.settings || {};
    const provider = (settings.provider || "").trim();
    const model = (settings.model || "").trim();
    const sourceUrl = location?.href || "";
    let sourceHost = "";
    try {
      sourceHost = sourceUrl ? new URL(sourceUrl).host : "";
    } catch {
      sourceHost = "";
    }

    const entry = {
      id: makeId(),
      ts: nowTs(),
      provider,
      model,
      sourceUrl,
      sourceHost,
      sourceTitle: (document?.title || "").trim(),
      inputPreview: safeOneLine(text, 120),
      summaryPreview: safeOneLine(summary, 120),
      summary
    };
    currentState.recentSummaries = await addRecentSummary(entry);

    currentState.loading = false;
    currentState.errorMessage = "";
    currentState.summaryText = summary;
    maybeGrowPanelForSummary(summary);
    renderCurrentPanel();
  } catch (e) {
    currentState.loading = false;
    currentState.summaryText = "";
    currentState.errorMessage = normalizeErrorMessage(e);
    if (e?.usage) currentState.freeUsage = e.usage;
    renderCurrentPanel();
  }
}

function maybeShowButton() {
  const info = getSelectionInfo();
  const rect = info?.rect;
  const text = clampText(info?.text || "", 5000);

  if (!rect || !text) {
    if (currentState.showing === "button") clearButtonOnly();
    if (currentState.showing !== "panel") hideUI();
    return;
  }

  // If the panel is pinned, keep it visible and still allow showing the summarize button
  if (currentState.showing === "panel" && !currentState.pinned) return;

  const { x, y } = positionNearRect(rect);
  currentState.showing = currentState.showing === "panel" ? "panel" : "button";
  currentState.lastSelectionText = text;
  currentState.lastSelectionRect = rect;

  renderButton({
    x,
    y,
    onClick: () => {
      showSummaryFlow({ text: currentState.lastSelectionText, rect: currentState.lastSelectionRect });
    }
  });
}

let selectionChangeDebounceTimer = 0;
function scheduleMaybeShowButton() {
  if (selectionChangeDebounceTimer) clearTimeout(selectionChangeDebounceTimer);
  selectionChangeDebounceTimer = setTimeout(() => {
    selectionChangeDebounceTimer = 0;
    maybeShowButton();
  }, 120);
}

document.addEventListener(
  "mouseup",
  () => {
    setTimeout(maybeShowButton, 0);
  },
  true
);

// Some editors (e.g., contenteditable / virtualized editors) don't reliably trigger mouseup selection updates.
// selectionchange fires frequently, so we debounce.
document.addEventListener(
  "selectionchange",
  () => {
    scheduleMaybeShowButton();
  },
  true
);

document.addEventListener(
  "keyup",
  () => {
    scheduleMaybeShowButton();
  },
  true
);

document.addEventListener(
  "touchend",
  () => {
    setTimeout(maybeShowButton, 0);
  },
  true
);

document.addEventListener(
  "mousedown",
  (e) => {
    const host = document.getElementById(EXT_UI_ID);
    if (!host || !host.shadowRoot) {
      hideUI();
      return;
    }

    const path = e.composedPath ? e.composedPath() : [];
    if (!path.includes(host)) {
      if (currentState.showing === "panel" && currentState.pinned) return;
      hideUI();
    }
  },
  true
);

window.addEventListener("scroll", () => {
  if (currentState.showing === "button") hideUI();
  if (currentState.showing === "panel" && currentState.pinned) clearButtonOnly();
});
