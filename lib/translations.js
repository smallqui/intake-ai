/**
 * Default English interface copy used throughout Intake AI.
 *
 * Other locales inherit this object so any missing translation safely
 * falls back to English instead of producing undefined UI labels.
 *
 * @type {Record<string, string>}
 */
const baseEnglish = {
    appTitle: "Intake",
    appSuffix: "AI",

    toggleTheme: "Toggle Theme",
    translateTo: "Data Output",
    interfaceLanguage: "Interface Language",
    targetCurrency: "Target Currency",
    original: "Original",

    heroTitle: "Digitize Your",
    financialData: "Financial Data",
    heroSubtitle:
        "Turn invoices and financial documents into structured, validated, export-ready data.",

    dropZoneMain: "Drop invoices here",
    dropZoneSub: "Batch processing supported (Max 5)",
    uploadError:
        "Failed to extract data. Please try a clearer image.",

    sanitizeAction: "TRANSFORM DOCUMENT",
    processing: "Extracting data...",
    activeDoc: "Active Document",
    sanitizeNew: "Transform New File",
    extractedData: "EXTRACTED DATA",
    translating: "Translating...",

    exportCsv: "Export CSV",

    sessionHistory: "History",
    sessionAnalytics: "Analytics",
    noDocs: "No documents processed yet.",

    riskDetected: "Risk Detected",
    clean: "Transformed",
    riskTag: "RISK",

    totalDocs: "Total Documents",
    totalValue: "Total Value (USD)",
    avgTime: "Avg Transformation Time",
    topCategories: "Top GL Categories",
    languages: "Languages Detected",
    seconds: "s",

    sessionActive: "Session active: {minutes}m",
    sessionPrivacyInfo:
        "All data is stored in your browser session only. Data will be cleared when you close this tab or browser.",

    spendingBreakdown: "Spending by GL Category",
    vendorFrequency: "Top Vendors",
    currencyDist: "Currency Distribution",
    recentActivity: "Session Activity",
    other: "Other",
    docComposition: "Doc Composition",

    documentType: "DOCUMENT TYPE",
    vendorName: "Vendor Name",
    invoiceDate: "Invoice Date",
    currency: "Currency",
    totalAmount: "Total Amount",

    staleDataWarning: "Stale Data (> 2 Years)",
    staleTag: "STALE",

    lineItems: "LINE ITEMS",
    itemsDetected: "items detected",
    sku: "SKU",
    description: "Description",
    glCategory: "GL Category",
    qty: "Qty",
    unitPrice: "Unit Price",
    lineTotal: "Total",
    convertedTotal: "Converted Total",
    exchangeRate: "Rate",

    mathMismatch: "Math Mismatch",
    expected: "Expected",
    noLineItems:
        "No line items extracted. Use the button below to add one.",
    addLineItem: "Add Line Item",
    highRisk: "High Risk",
    recalculate: "Fix",
    fixAll: "Recalculate All",

    sensitiveDetected: "Sensitive Information Detected",
    complianceWarning:
        "Handle with care and ensure compliance with data protection regulations.",

    csvDocumentType: "Document Type",
    csvVendor: "Vendor",
    csvDate: "Date",
    csvTotalAmount: "Total Amount",
    csvCurrency: "Currency",
    csvSku: "SKU",
    csvDescription: "Description",
    csvGlCategory: "GL Category",
    csvQuantity: "Quantity",
    csvUnitPrice: "Unit Price",
    csvLineTotal: "Line Total",

    quotaError: "Processing limit reached.",
    quotaCooldown: "Retrying in",
    readError:
        "Unable to read document. Try a clearer image.",
    fileTypeError:
        "Invalid file. Please upload an Image or PDF.",

    analyzing: "Analyzing document structure...",
    sanitizing: "Transforming input data...",

    confidenceHigh: "High Confidence",
    confidenceReview: "Review Recommended",
    verifyPrices: "Verify Prices",
    lowItemCount: "Low Item Count",
    tryAgain: "Try Again",

    clearData: "Clear All Session Data",
    clearDataConfirmTitle: "Clear All Session Data?",
    clearDataConfirmMessage:
        "This will permanently delete all processed invoices from this session. This action cannot be undone.",
    dataClearedSuccess:
        "All data cleared. Your session is now empty.",

    tryExample: "Try an Example:",
    exampleReceipt: "Simple Receipt (USD)",
    exampleMultilang: "Manufacturing (JPN)",
    exampleCurrency: "Travel Invoice (EUR)",

    home: "Home",
    newInvoice: "New Invoice",
    history: "History",

    unsavedChanges:
        "You have unsaved changes. Are you sure you want to start a new invoice?",

    exportAll: "Export Combined CSV",
    breadcrumbsProcessing: "Processing...",
    sessionMenu: "Session & Analytics",

    filesSelected: "files selected",
    sanitizeBatch: "TRANSFORM {count} DOCUMENTS",
    processingBatch:
        "Transforming {current} of {total}: {filename}...",
    batchComplete: "Batch transformation complete!",

    exportCombined: "Export Combined CSV",
    copied: "Copied to clipboard!",
    copyToClipboard: "Copy to Clipboard",
    printPdf: "Print / Save as PDF",

    initScan: "INITIALIZE SCAN",
    scanInvoice: "Scan Invoice",
};

/**
 * Interface translation registry.
 *
 * Intake AI remains the same product name across every locale. Each language
 * inherits the English dictionary before overriding its translated values,
 * providing a safe fallback if new interface keys are introduced later.
 *
 * Placeholder tokens such as {count}, {minutes}, and {filename} must remain
 * unchanged because they are replaced dynamically by the application.
 *
 * @type {Record<string, typeof baseEnglish>}
 */
export const translations = {
    English: {
        ...baseEnglish,
    },

    Spanish: {
        ...baseEnglish,

        toggleTheme: "Cambiar tema",
        translateTo: "Salida de datos",
        interfaceLanguage: "Idioma de la interfaz",
        targetCurrency: "Moneda de destino",
        original: "Original",

        heroTitle: "Digitaliza tus",
        financialData: "Datos financieros",
        heroSubtitle:
            "Convierte facturas y documentos financieros en datos estructurados, validados y listos para exportar.",

        dropZoneMain: "Arrastra facturas aquí",
        dropZoneSub:
            "Procesamiento por lotes disponible (Máx. 5)",
        uploadError:
            "No se pudieron extraer los datos. Intenta usar una imagen más clara.",

        sanitizeAction: "TRANSFORMAR DOCUMENTO",
        processing: "Extrayendo datos...",
        activeDoc: "Documento activo",
        sanitizeNew: "Transformar nuevo archivo",
        extractedData: "DATOS EXTRAÍDOS",
        translating: "Traduciendo...",

        exportCsv: "Exportar CSV",

        sessionHistory: "Historial",
        sessionAnalytics: "Análisis",
        noDocs: "Aún no se han procesado documentos.",

        riskDetected: "Riesgo detectado",
        clean: "Transformado",
        riskTag: "RIESGO",

        totalDocs: "Total de documentos",
        totalValue: "Valor total (USD)",
        avgTime: "Tiempo promedio de transformación",
        topCategories: "Principales categorías GL",
        languages: "Idiomas detectados",
        seconds: "s",

        sessionActive: "Sesión activa: {minutes}m",
        sessionPrivacyInfo:
            "Todos los datos se almacenan únicamente en la sesión de tu navegador. Los datos se eliminarán cuando cierres esta pestaña o el navegador.",

        spendingBreakdown: "Gastos por categoría GL",
        vendorFrequency: "Principales proveedores",
        currencyDist: "Distribución de monedas",
        recentActivity: "Actividad de la sesión",
        other: "Otro",
        docComposition: "Composición de documentos",

        documentType: "TIPO DE DOCUMENTO",
        vendorName: "Proveedor",
        invoiceDate: "Fecha de factura",
        currency: "Moneda",
        totalAmount: "Importe total",

        staleDataWarning: "Datos antiguos (> 2 años)",
        staleTag: "ANTIGUO",

        lineItems: "LÍNEAS DE FACTURA",
        itemsDetected: "elementos detectados",
        sku: "SKU",
        description: "Descripción",
        glCategory: "Categoría GL",
        qty: "Cant.",
        unitPrice: "Precio unitario",
        lineTotal: "Total",
        convertedTotal: "Total convertido",
        exchangeRate: "Tasa",

        mathMismatch: "Discrepancia matemática",
        expected: "Esperado",
        noLineItems:
            "No se extrajeron líneas. Usa el botón de abajo para agregar una.",
        addLineItem: "Agregar línea",
        highRisk: "Alto riesgo",
        recalculate: "Corregir",
        fixAll: "Recalcular todo",

        sensitiveDetected: "Información sensible detectada",
        complianceWarning:
            "Maneja estos datos con cuidado y asegúrate de cumplir con las normas de protección de datos.",

        csvDocumentType: "Tipo de documento",
        csvVendor: "Proveedor",
        csvDate: "Fecha",
        csvTotalAmount: "Importe total",
        csvCurrency: "Moneda",
        csvSku: "SKU",
        csvDescription: "Descripción",
        csvGlCategory: "Categoría GL",
        csvQuantity: "Cantidad",
        csvUnitPrice: "Precio unitario",
        csvLineTotal: "Total de línea",

        quotaError: "Se alcanzó el límite de procesamiento.",
        quotaCooldown: "Reintentando en",
        readError:
            "No se pudo leer el documento. Intenta usar una imagen más clara.",
        fileTypeError:
            "Archivo no válido. Sube una imagen o un PDF.",

        analyzing: "Analizando la estructura del documento...",
        sanitizing: "Transformando los datos de entrada...",

        confidenceHigh: "Alta confianza",
        confidenceReview: "Revisión recomendada",
        verifyPrices: "Verificar precios",
        lowItemCount: "Pocas líneas detectadas",
        tryAgain: "Intentar de nuevo",

        clearData: "Borrar todos los datos de la sesión",
        clearDataConfirmTitle: "¿Borrar todos los datos?",
        clearDataConfirmMessage:
            "Esto eliminará permanentemente todas las facturas procesadas de esta sesión. Esta acción no se puede deshacer.",
        dataClearedSuccess:
            "Todos los datos fueron eliminados. La sesión está vacía.",

        tryExample: "Prueba un ejemplo:",
        exampleReceipt: "Recibo simple (USD)",
        exampleMultilang: "Manufactura (JPN)",
        exampleCurrency: "Factura de viaje (EUR)",

        home: "Inicio",
        newInvoice: "Nueva factura",
        history: "Historial",

        unsavedChanges:
            "Tienes cambios sin guardar. ¿Seguro que quieres iniciar una nueva factura?",

        exportAll: "Exportar CSV combinado",
        breadcrumbsProcessing: "Procesando...",
        sessionMenu: "Sesión y análisis",

        filesSelected: "archivos seleccionados",
        sanitizeBatch: "TRANSFORMAR {count} DOCUMENTOS",
        processingBatch:
            "Transformando {current} de {total}: {filename}...",
        batchComplete: "¡Transformación por lotes completada!",

        exportCombined: "Exportar CSV combinado",
        copied: "¡Copiado al portapapeles!",
        copyToClipboard: "Copiar al portapapeles",
        printPdf: "Imprimir / Guardar como PDF",

        initScan: "INICIAR ESCANEO",
        scanInvoice: "Escanear factura",
    },

    French: {
        ...baseEnglish,

        toggleTheme: "Changer le thème",
        translateTo: "Sortie des données",
        interfaceLanguage: "Langue de l'interface",
        targetCurrency: "Devise cible",
        original: "Original",

        heroTitle: "Numérisez vos",
        financialData: "Données financières",
        heroSubtitle:
            "Transformez les factures et documents financiers en données structurées, validées et prêtes à l'exportation.",

        dropZoneMain: "Déposez les factures ici",
        dropZoneSub:
            "Traitement par lots pris en charge (Max. 5)",
        uploadError:
            "Impossible d'extraire les données. Essayez avec une image plus nette.",

        sanitizeAction: "TRANSFORMER LE DOCUMENT",
        processing: "Extraction des données...",
        activeDoc: "Document actif",
        sanitizeNew: "Transformer un nouveau fichier",
        extractedData: "DONNÉES EXTRAITES",
        translating: "Traduction...",

        exportCsv: "Exporter en CSV",

        sessionHistory: "Historique",
        sessionAnalytics: "Analyses",
        noDocs: "Aucun document traité pour le moment.",

        riskDetected: "Risque détecté",
        clean: "Transformé",
        riskTag: "RISQUE",

        totalDocs: "Nombre de documents",
        totalValue: "Valeur totale (USD)",
        avgTime: "Temps moyen de transformation",
        topCategories: "Principales catégories GL",
        languages: "Langues détectées",
        seconds: "s",

        sessionActive: "Session active : {minutes}m",
        sessionPrivacyInfo:
            "Toutes les données sont stockées uniquement dans la session de votre navigateur. Elles seront supprimées lorsque vous fermerez cet onglet ou votre navigateur.",

        spendingBreakdown: "Dépenses par catégorie GL",
        vendorFrequency: "Principaux fournisseurs",
        currencyDist: "Répartition des devises",
        recentActivity: "Activité de la session",
        other: "Autre",
        docComposition: "Composition des documents",

        documentType: "TYPE DE DOCUMENT",
        vendorName: "Fournisseur",
        invoiceDate: "Date de facture",
        currency: "Devise",
        totalAmount: "Montant total",

        staleDataWarning: "Données anciennes (> 2 ans)",
        staleTag: "ANCIEN",

        lineItems: "LIGNES",
        itemsDetected: "éléments détectés",
        sku: "SKU",
        description: "Description",
        glCategory: "Catégorie GL",
        qty: "Qté",
        unitPrice: "Prix unitaire",
        lineTotal: "Total",
        convertedTotal: "Total converti",
        exchangeRate: "Taux",

        mathMismatch: "Écart de calcul",
        expected: "Attendu",
        noLineItems:
            "Aucune ligne extraite. Utilisez le bouton ci-dessous pour en ajouter une.",
        addLineItem: "Ajouter une ligne",
        highRisk: "Risque élevé",
        recalculate: "Corriger",
        fixAll: "Tout recalculer",

        sensitiveDetected: "Informations sensibles détectées",
        complianceWarning:
            "Manipulez ces données avec précaution et veillez au respect des réglementations sur la protection des données.",

        csvDocumentType: "Type de document",
        csvVendor: "Fournisseur",
        csvDate: "Date",
        csvTotalAmount: "Montant total",
        csvCurrency: "Devise",
        csvSku: "SKU",
        csvDescription: "Description",
        csvGlCategory: "Catégorie GL",
        csvQuantity: "Quantité",
        csvUnitPrice: "Prix unitaire",
        csvLineTotal: "Total de ligne",

        quotaError: "Limite de traitement atteinte.",
        quotaCooldown: "Nouvelle tentative dans",
        readError:
            "Impossible de lire le document. Essayez avec une image plus nette.",
        fileTypeError:
            "Fichier non valide. Veuillez importer une image ou un PDF.",

        analyzing: "Analyse de la structure du document...",
        sanitizing: "Transformation des données d'entrée...",

        confidenceHigh: "Confiance élevée",
        confidenceReview: "Vérification recommandée",
        verifyPrices: "Vérifier les prix",
        lowItemCount: "Faible nombre d'éléments",
        tryAgain: "Réessayer",

        clearData: "Effacer toutes les données de session",
        clearDataConfirmTitle:
            "Effacer toutes les données de session ?",
        clearDataConfirmMessage:
            "Toutes les factures traitées pendant cette session seront définitivement supprimées. Cette action est irréversible.",
        dataClearedSuccess:
            "Toutes les données ont été effacées. Votre session est maintenant vide.",

        tryExample: "Essayer un exemple :",
        exampleReceipt: "Reçu simple (USD)",
        exampleMultilang: "Fabrication (JPN)",
        exampleCurrency: "Facture de voyage (EUR)",

        home: "Accueil",
        newInvoice: "Nouvelle facture",
        history: "Historique",

        unsavedChanges:
            "Vous avez des modifications non enregistrées. Voulez-vous vraiment commencer une nouvelle facture ?",

        exportAll: "Exporter le CSV combiné",
        breadcrumbsProcessing: "Traitement...",
        sessionMenu: "Session et analyses",

        filesSelected: "fichiers sélectionnés",
        sanitizeBatch: "TRANSFORMER {count} DOCUMENTS",
        processingBatch:
            "Transformation de {current} sur {total} : {filename}...",
        batchComplete: "Traitement par lots terminé !",

        exportCombined: "Exporter le CSV combiné",
        copied: "Copié dans le presse-papiers !",
        copyToClipboard: "Copier dans le presse-papiers",
        printPdf: "Imprimer / Enregistrer en PDF",

        initScan: "INITIALISER L'ANALYSE",
        scanInvoice: "Scanner la facture",
    },

    German: {
        ...baseEnglish,

        toggleTheme: "Design wechseln",
        translateTo: "Datenausgabe",
        interfaceLanguage: "Sprache der Benutzeroberfläche",
        targetCurrency: "Zielwährung",
        original: "Original",

        heroTitle: "Digitalisieren Sie Ihre",
        financialData: "Finanzdaten",
        heroSubtitle:
            "Wandeln Sie Rechnungen und Finanzdokumente in strukturierte, validierte und exportbereite Daten um.",

        dropZoneMain: "Rechnungen hier ablegen",
        dropZoneSub:
            "Stapelverarbeitung unterstützt (Max. 5)",
        uploadError:
            "Daten konnten nicht extrahiert werden. Versuchen Sie es mit einem deutlicheren Bild.",

        sanitizeAction: "DOKUMENT TRANSFORMIEREN",
        processing: "Daten werden extrahiert...",
        activeDoc: "Aktives Dokument",
        sanitizeNew: "Neue Datei transformieren",
        extractedData: "EXTRAHIERTE DATEN",
        translating: "Wird übersetzt...",

        exportCsv: "CSV exportieren",

        sessionHistory: "Verlauf",
        sessionAnalytics: "Analysen",
        noDocs: "Noch keine Dokumente verarbeitet.",

        riskDetected: "Risiko erkannt",
        clean: "Transformiert",
        riskTag: "RISIKO",

        totalDocs: "Dokumente insgesamt",
        totalValue: "Gesamtwert (USD)",
        avgTime: "Durchschn. Transformationszeit",
        topCategories: "Häufigste GL-Kategorien",
        languages: "Erkannte Sprachen",
        seconds: "s",

        sessionActive: "Sitzung aktiv: {minutes}m",
        sessionPrivacyInfo:
            "Alle Daten werden ausschließlich in Ihrer Browsersitzung gespeichert. Sie werden gelöscht, wenn Sie diesen Tab oder Browser schließen.",

        spendingBreakdown: "Ausgaben nach GL-Kategorie",
        vendorFrequency: "Häufigste Lieferanten",
        currencyDist: "Währungsverteilung",
        recentActivity: "Sitzungsaktivität",
        other: "Sonstige",
        docComposition: "Dokumentzusammensetzung",

        documentType: "DOKUMENTTYP",
        vendorName: "Lieferant",
        invoiceDate: "Rechnungsdatum",
        currency: "Währung",
        totalAmount: "Gesamtbetrag",

        staleDataWarning: "Veraltete Daten (> 2 Jahre)",
        staleTag: "VERALTET",

        lineItems: "POSITIONEN",
        itemsDetected: "Positionen erkannt",
        sku: "SKU",
        description: "Beschreibung",
        glCategory: "GL-Kategorie",
        qty: "Menge",
        unitPrice: "Stückpreis",
        lineTotal: "Gesamt",
        convertedTotal: "Umgerechneter Gesamtbetrag",
        exchangeRate: "Kurs",

        mathMismatch: "Rechenabweichung",
        expected: "Erwartet",
        noLineItems:
            "Keine Positionen extrahiert. Verwenden Sie die Schaltfläche unten, um eine hinzuzufügen.",
        addLineItem: "Position hinzufügen",
        highRisk: "Hohes Risiko",
        recalculate: "Korrigieren",
        fixAll: "Alles neu berechnen",

        sensitiveDetected: "Sensible Informationen erkannt",
        complianceWarning:
            "Behandeln Sie diese Daten mit Sorgfalt und beachten Sie die geltenden Datenschutzbestimmungen.",

        csvDocumentType: "Dokumenttyp",
        csvVendor: "Lieferant",
        csvDate: "Datum",
        csvTotalAmount: "Gesamtbetrag",
        csvCurrency: "Währung",
        csvSku: "SKU",
        csvDescription: "Beschreibung",
        csvGlCategory: "GL-Kategorie",
        csvQuantity: "Menge",
        csvUnitPrice: "Stückpreis",
        csvLineTotal: "Positionssumme",

        quotaError: "Verarbeitungslimit erreicht.",
        quotaCooldown: "Erneuter Versuch in",
        readError:
            "Dokument konnte nicht gelesen werden. Versuchen Sie es mit einem deutlicheren Bild.",
        fileTypeError:
            "Ungültige Datei. Bitte laden Sie ein Bild oder PDF hoch.",

        analyzing: "Dokumentstruktur wird analysiert...",
        sanitizing: "Eingabedaten werden transformiert...",

        confidenceHigh: "Hohe Konfidenz",
        confidenceReview: "Überprüfung empfohlen",
        verifyPrices: "Preise überprüfen",
        lowItemCount: "Wenige Positionen erkannt",
        tryAgain: "Erneut versuchen",

        clearData: "Alle Sitzungsdaten löschen",
        clearDataConfirmTitle: "Alle Sitzungsdaten löschen?",
        clearDataConfirmMessage:
            "Dadurch werden alle in dieser Sitzung verarbeiteten Rechnungen dauerhaft gelöscht. Diese Aktion kann nicht rückgängig gemacht werden.",
        dataClearedSuccess:
            "Alle Daten wurden gelöscht. Ihre Sitzung ist jetzt leer.",

        tryExample: "Beispiel ausprobieren:",
        exampleReceipt: "Einfacher Beleg (USD)",
        exampleMultilang: "Fertigung (JPN)",
        exampleCurrency: "Reiserechnung (EUR)",

        home: "Startseite",
        newInvoice: "Neue Rechnung",
        history: "Verlauf",

        unsavedChanges:
            "Sie haben nicht gespeicherte Änderungen. Möchten Sie wirklich eine neue Rechnung beginnen?",

        exportAll: "Kombinierte CSV exportieren",
        breadcrumbsProcessing: "Verarbeitung...",
        sessionMenu: "Sitzung & Analyse",

        filesSelected: "Dateien ausgewählt",
        sanitizeBatch: "{count} DOKUMENTE TRANSFORMIEREN",
        processingBatch:
            "{current} von {total} wird transformiert: {filename}...",
        batchComplete: "Stapelverarbeitung abgeschlossen!",

        exportCombined: "Kombinierte CSV exportieren",
        copied: "In die Zwischenablage kopiert!",
        copyToClipboard: "In Zwischenablage kopieren",
        printPdf: "Drucken / Als PDF speichern",

        initScan: "SCAN STARTEN",
        scanInvoice: "Rechnung scannen",
    },

    Chinese: {
        ...baseEnglish,

        toggleTheme: "切换主题",
        translateTo: "数据输出",
        interfaceLanguage: "界面语言",
        targetCurrency: "目标货币",
        original: "原始",

        heroTitle: "数字化您的",
        financialData: "财务数据",
        heroSubtitle:
            "将发票和财务文档转换为结构化、已验证且可直接导出的数据。",

        dropZoneMain: "将发票拖放到此处",
        dropZoneSub: "支持批量处理（最多 5 个）",
        uploadError:
            "无法提取数据。请尝试使用更清晰的图像。",

        sanitizeAction: "转换文档",
        processing: "正在提取数据...",
        activeDoc: "当前文档",
        sanitizeNew: "转换新文件",
        extractedData: "已提取数据",
        translating: "正在翻译...",

        exportCsv: "导出 CSV",

        sessionHistory: "历史记录",
        sessionAnalytics: "分析",
        noDocs: "尚未处理任何文档。",

        riskDetected: "检测到风险",
        clean: "已转换",
        riskTag: "风险",

        totalDocs: "文档总数",
        totalValue: "总价值 (USD)",
        avgTime: "平均转换时间",
        topCategories: "主要 GL 类别",
        languages: "检测到的语言",
        seconds: "秒",

        sessionActive: "会话已运行：{minutes} 分钟",
        sessionPrivacyInfo:
            "所有数据仅存储在当前浏览器会话中。关闭此标签页或浏览器后，数据将被清除。",

        spendingBreakdown: "按 GL 类别统计支出",
        vendorFrequency: "主要供应商",
        currencyDist: "货币分布",
        recentActivity: "会话活动",
        other: "其他",
        docComposition: "文档构成",

        documentType: "文档类型",
        vendorName: "供应商名称",
        invoiceDate: "发票日期",
        currency: "货币",
        totalAmount: "总金额",

        staleDataWarning: "旧数据（> 2 年）",
        staleTag: "过期",

        lineItems: "明细项目",
        itemsDetected: "个项目已检测",
        sku: "SKU",
        description: "描述",
        glCategory: "GL 类别",
        qty: "数量",
        unitPrice: "单价",
        lineTotal: "总计",
        convertedTotal: "换算后总计",
        exchangeRate: "汇率",

        mathMismatch: "计算不一致",
        expected: "预期",
        noLineItems:
            "未提取到明细项目。请使用下方按钮添加。",
        addLineItem: "添加明细",
        highRisk: "高风险",
        recalculate: "修正",
        fixAll: "全部重新计算",

        sensitiveDetected: "检测到敏感信息",
        complianceWarning:
            "请谨慎处理，并确保遵守相关数据保护法规。",

        csvDocumentType: "文档类型",
        csvVendor: "供应商",
        csvDate: "日期",
        csvTotalAmount: "总金额",
        csvCurrency: "货币",
        csvSku: "SKU",
        csvDescription: "描述",
        csvGlCategory: "GL 类别",
        csvQuantity: "数量",
        csvUnitPrice: "单价",
        csvLineTotal: "行总计",

        quotaError: "已达到处理上限。",
        quotaCooldown: "将在以下时间后重试",
        readError:
            "无法读取文档。请尝试使用更清晰的图像。",
        fileTypeError:
            "文件无效。请上传图像或 PDF 文件。",

        analyzing: "正在分析文档结构...",
        sanitizing: "正在转换输入数据...",

        confidenceHigh: "高置信度",
        confidenceReview: "建议审核",
        verifyPrices: "核对价格",
        lowItemCount: "项目数量较少",
        tryAgain: "重试",

        clearData: "清除所有会话数据",
        clearDataConfirmTitle: "清除所有会话数据？",
        clearDataConfirmMessage:
            "这将永久删除本次会话中所有已处理的发票。此操作无法撤销。",
        dataClearedSuccess:
            "所有数据已清除。当前会话为空。",

        tryExample: "尝试示例：",
        exampleReceipt: "简单收据 (USD)",
        exampleMultilang: "制造业 (JPN)",
        exampleCurrency: "旅行发票 (EUR)",

        home: "首页",
        newInvoice: "新建发票",
        history: "历史记录",

        unsavedChanges:
            "您有尚未保存的更改。确定要开始新的发票吗？",

        exportAll: "导出合并 CSV",
        breadcrumbsProcessing: "处理中...",
        sessionMenu: "会话与分析",

        filesSelected: "个文件已选择",
        sanitizeBatch: "转换 {count} 个文档",
        processingBatch:
            "正在转换第 {current}/{total} 个：{filename}...",
        batchComplete: "批量转换完成！",

        exportCombined: "导出合并 CSV",
        copied: "已复制到剪贴板！",
        copyToClipboard: "复制到剪贴板",
        printPdf: "打印 / 保存为 PDF",

        initScan: "开始扫描",
        scanInvoice: "扫描发票",
    },

    Japanese: {
        ...baseEnglish,

        toggleTheme: "テーマを切り替え",
        translateTo: "データ出力",
        interfaceLanguage: "インターフェース言語",
        targetCurrency: "変換先通貨",
        original: "元の通貨",

        heroTitle: "財務データを",
        financialData: "デジタル化",
        heroSubtitle:
            "請求書や財務文書を、構造化・検証済み・エクスポート可能なデータに変換します。",

        dropZoneMain: "請求書をここにドロップ",
        dropZoneSub: "一括処理対応（最大5件）",
        uploadError:
            "データを抽出できませんでした。より鮮明な画像をお試しください。",

        sanitizeAction: "文書を変換",
        processing: "データを抽出中...",
        activeDoc: "現在の文書",
        sanitizeNew: "新しいファイルを変換",
        extractedData: "抽出データ",
        translating: "翻訳中...",

        exportCsv: "CSVをエクスポート",

        sessionHistory: "履歴",
        sessionAnalytics: "分析",
        noDocs: "まだ文書が処理されていません。",

        riskDetected: "リスクを検出",
        clean: "変換済み",
        riskTag: "リスク",

        totalDocs: "文書数",
        totalValue: "合計金額 (USD)",
        avgTime: "平均変換時間",
        topCategories: "主要GLカテゴリ",
        languages: "検出言語",
        seconds: "秒",

        sessionActive: "セッション時間: {minutes}分",
        sessionPrivacyInfo:
            "すべてのデータは現在のブラウザセッション内にのみ保存されます。このタブまたはブラウザを閉じるとデータは消去されます。",

        spendingBreakdown: "GLカテゴリ別支出",
        vendorFrequency: "主要ベンダー",
        currencyDist: "通貨分布",
        recentActivity: "セッションアクティビティ",
        other: "その他",
        docComposition: "文書構成",

        documentType: "文書タイプ",
        vendorName: "ベンダー名",
        invoiceDate: "請求日",
        currency: "通貨",
        totalAmount: "合計金額",

        staleDataWarning: "古いデータ（2年以上）",
        staleTag: "古い",

        lineItems: "明細項目",
        itemsDetected: "件を検出",
        sku: "SKU",
        description: "説明",
        glCategory: "GLカテゴリ",
        qty: "数量",
        unitPrice: "単価",
        lineTotal: "合計",
        convertedTotal: "換算後合計",
        exchangeRate: "レート",

        mathMismatch: "計算不一致",
        expected: "期待値",
        noLineItems:
            "明細項目が抽出されませんでした。下のボタンから追加できます。",
        addLineItem: "明細を追加",
        highRisk: "高リスク",
        recalculate: "修正",
        fixAll: "すべて再計算",

        sensitiveDetected: "機密情報を検出",
        complianceWarning:
            "慎重に取り扱い、データ保護規制への準拠を確認してください。",

        csvDocumentType: "文書タイプ",
        csvVendor: "ベンダー",
        csvDate: "日付",
        csvTotalAmount: "合計金額",
        csvCurrency: "通貨",
        csvSku: "SKU",
        csvDescription: "説明",
        csvGlCategory: "GLカテゴリ",
        csvQuantity: "数量",
        csvUnitPrice: "単価",
        csvLineTotal: "明細合計",

        quotaError: "処理上限に達しました。",
        quotaCooldown: "再試行まで",
        readError:
            "文書を読み取れませんでした。より鮮明な画像をお試しください。",
        fileTypeError:
            "無効なファイルです。画像またはPDFをアップロードしてください。",

        analyzing: "文書構造を解析中...",
        sanitizing: "入力データを変換中...",

        confidenceHigh: "高信頼度",
        confidenceReview: "確認を推奨",
        verifyPrices: "価格を確認",
        lowItemCount: "明細数が少ない",
        tryAgain: "再試行",

        clearData: "すべてのセッションデータを削除",
        clearDataConfirmTitle:
            "すべてのセッションデータを削除しますか？",
        clearDataConfirmMessage:
            "このセッションで処理したすべての請求書が完全に削除されます。この操作は元に戻せません。",
        dataClearedSuccess:
            "すべてのデータを削除しました。セッションは空です。",

        tryExample: "サンプルを試す:",
        exampleReceipt: "シンプルな領収書 (USD)",
        exampleMultilang: "製造業 (JPN)",
        exampleCurrency: "旅行請求書 (EUR)",

        home: "ホーム",
        newInvoice: "新しい請求書",
        history: "履歴",

        unsavedChanges:
            "保存されていない変更があります。新しい請求書を開始しますか？",

        exportAll: "結合CSVをエクスポート",
        breadcrumbsProcessing: "処理中...",
        sessionMenu: "セッションと分析",

        filesSelected: "ファイル選択済み",
        sanitizeBatch: "{count}件の文書を変換",
        processingBatch:
            "{total}件中{current}件目を変換中: {filename}...",
        batchComplete: "一括変換が完了しました！",

        exportCombined: "結合CSVをエクスポート",
        copied: "クリップボードにコピーしました！",
        copyToClipboard: "クリップボードにコピー",
        printPdf: "印刷 / PDFとして保存",

        initScan: "スキャン開始",
        scanInvoice: "請求書をスキャン",
    },

    Portuguese: {
        ...baseEnglish,

        toggleTheme: "Alternar tema",
        translateTo: "Saída de dados",
        interfaceLanguage: "Idioma da interface",
        targetCurrency: "Moeda de destino",
        original: "Original",

        heroTitle: "Digitalize seus",
        financialData: "Dados financeiros",
        heroSubtitle:
            "Transforme faturas e documentos financeiros em dados estruturados, validados e prontos para exportação.",

        dropZoneMain: "Solte as faturas aqui",
        dropZoneSub:
            "Processamento em lote disponível (Máx. 5)",
        uploadError:
            "Não foi possível extrair os dados. Tente uma imagem mais nítida.",

        sanitizeAction: "TRANSFORMAR DOCUMENTO",
        processing: "Extraindo dados...",
        activeDoc: "Documento ativo",
        sanitizeNew: "Transformar novo arquivo",
        extractedData: "DADOS EXTRAÍDOS",
        translating: "Traduzindo...",

        exportCsv: "Exportar CSV",

        sessionHistory: "Histórico",
        sessionAnalytics: "Análises",
        noDocs: "Nenhum documento processado ainda.",

        riskDetected: "Risco detectado",
        clean: "Transformado",
        riskTag: "RISCO",

        totalDocs: "Total de documentos",
        totalValue: "Valor total (USD)",
        avgTime: "Tempo médio de transformação",
        topCategories: "Principais categorias GL",
        languages: "Idiomas detectados",
        seconds: "s",

        sessionActive: "Sessão ativa: {minutes}m",
        sessionPrivacyInfo:
            "Todos os dados são armazenados apenas na sessão do seu navegador. Eles serão apagados quando você fechar esta aba ou o navegador.",

        spendingBreakdown: "Gastos por categoria GL",
        vendorFrequency: "Principais fornecedores",
        currencyDist: "Distribuição de moedas",
        recentActivity: "Atividade da sessão",
        other: "Outro",
        docComposition: "Composição dos documentos",

        documentType: "TIPO DE DOCUMENTO",
        vendorName: "Fornecedor",
        invoiceDate: "Data da fatura",
        currency: "Moeda",
        totalAmount: "Valor total",

        staleDataWarning: "Dados antigos (> 2 anos)",
        staleTag: "ANTIGO",

        lineItems: "ITENS",
        itemsDetected: "itens detectados",
        sku: "SKU",
        description: "Descrição",
        glCategory: "Categoria GL",
        qty: "Qtd.",
        unitPrice: "Preço unitário",
        lineTotal: "Total",
        convertedTotal: "Total convertido",
        exchangeRate: "Taxa",

        mathMismatch: "Divergência de cálculo",
        expected: "Esperado",
        noLineItems:
            "Nenhum item foi extraído. Use o botão abaixo para adicionar um.",
        addLineItem: "Adicionar item",
        highRisk: "Alto risco",
        recalculate: "Corrigir",
        fixAll: "Recalcular tudo",

        sensitiveDetected: "Informações sensíveis detectadas",
        complianceWarning:
            "Manuseie com cuidado e garanta a conformidade com as normas de proteção de dados.",

        csvDocumentType: "Tipo de documento",
        csvVendor: "Fornecedor",
        csvDate: "Data",
        csvTotalAmount: "Valor total",
        csvCurrency: "Moeda",
        csvSku: "SKU",
        csvDescription: "Descrição",
        csvGlCategory: "Categoria GL",
        csvQuantity: "Quantidade",
        csvUnitPrice: "Preço unitário",
        csvLineTotal: "Total do item",

        quotaError: "Limite de processamento atingido.",
        quotaCooldown: "Tentando novamente em",
        readError:
            "Não foi possível ler o documento. Tente uma imagem mais nítida.",
        fileTypeError:
            "Arquivo inválido. Envie uma imagem ou PDF.",

        analyzing: "Analisando a estrutura do documento...",
        sanitizing: "Transformando os dados de entrada...",

        confidenceHigh: "Alta confiança",
        confidenceReview: "Revisão recomendada",
        verifyPrices: "Verificar preços",
        lowItemCount: "Poucos itens detectados",
        tryAgain: "Tentar novamente",

        clearData: "Limpar todos os dados da sessão",
        clearDataConfirmTitle:
            "Limpar todos os dados da sessão?",
        clearDataConfirmMessage:
            "Isso excluirá permanentemente todas as faturas processadas nesta sessão. Esta ação não pode ser desfeita.",
        dataClearedSuccess:
            "Todos os dados foram apagados. Sua sessão está vazia.",

        tryExample: "Experimente um exemplo:",
        exampleReceipt: "Recibo simples (USD)",
        exampleMultilang: "Fabricação (JPN)",
        exampleCurrency: "Fatura de viagem (EUR)",

        home: "Início",
        newInvoice: "Nova fatura",
        history: "Histórico",

        unsavedChanges:
            "Você possui alterações não salvas. Tem certeza de que deseja iniciar uma nova fatura?",

        exportAll: "Exportar CSV combinado",
        breadcrumbsProcessing: "Processando...",
        sessionMenu: "Sessão e análises",

        filesSelected: "arquivos selecionados",
        sanitizeBatch: "TRANSFORMAR {count} DOCUMENTOS",
        processingBatch:
            "Transformando {current} de {total}: {filename}...",
        batchComplete: "Transformação em lote concluída!",

        exportCombined: "Exportar CSV combinado",
        copied: "Copiado para a área de transferência!",
        copyToClipboard: "Copiar para a área de transferência",
        printPdf: "Imprimir / Salvar como PDF",

        initScan: "INICIAR DIGITALIZAÇÃO",
        scanInvoice: "Digitalizar fatura",
    },

    Hindi: {
        ...baseEnglish,

        toggleTheme: "थीम बदलें",
        translateTo: "डेटा आउटपुट",
        interfaceLanguage: "इंटरफ़ेस भाषा",
        targetCurrency: "लक्षित मुद्रा",
        original: "मूल",

        heroTitle: "डिजिटाइज़ करें अपना",
        financialData: "वित्तीय डेटा",
        heroSubtitle:
            "इनवॉइस और वित्तीय दस्तावेज़ों को संरचित, सत्यापित और एक्सपोर्ट के लिए तैयार डेटा में बदलें।",

        dropZoneMain: "इनवॉइस यहाँ छोड़ें",
        dropZoneSub: "बैच प्रोसेसिंग समर्थित (अधिकतम 5)",
        uploadError:
            "डेटा निकाला नहीं जा सका। कृपया अधिक स्पष्ट चित्र का प्रयास करें।",

        sanitizeAction: "दस्तावेज़ बदलें",
        processing: "डेटा निकाला जा रहा है...",
        activeDoc: "सक्रिय दस्तावेज़",
        sanitizeNew: "नई फ़ाइल बदलें",
        extractedData: "निकाला गया डेटा",
        translating: "अनुवाद हो रहा है...",

        exportCsv: "CSV एक्सपोर्ट करें",

        sessionHistory: "इतिहास",
        sessionAnalytics: "विश्लेषण",
        noDocs: "अभी तक कोई दस्तावेज़ प्रोसेस नहीं हुआ।",

        riskDetected: "जोखिम मिला",
        clean: "बदला गया",
        riskTag: "जोखिम",

        totalDocs: "कुल दस्तावेज़",
        totalValue: "कुल मूल्य (USD)",
        avgTime: "औसत परिवर्तन समय",
        topCategories: "शीर्ष GL श्रेणियाँ",
        languages: "पहचानी गई भाषाएँ",
        seconds: "सेकंड",

        sessionActive: "सेशन सक्रिय: {minutes} मिनट",
        sessionPrivacyInfo:
            "सारा डेटा केवल आपके वर्तमान ब्राउज़र सेशन में संग्रहीत होता है। टैब या ब्राउज़र बंद करने पर डेटा हटा दिया जाएगा।",

        spendingBreakdown: "GL श्रेणी के अनुसार खर्च",
        vendorFrequency: "शीर्ष विक्रेता",
        currencyDist: "मुद्रा वितरण",
        recentActivity: "सेशन गतिविधि",
        other: "अन्य",
        docComposition: "दस्तावेज़ संरचना",

        documentType: "दस्तावेज़ प्रकार",
        vendorName: "विक्रेता का नाम",
        invoiceDate: "इनवॉइस की तारीख",
        currency: "मुद्रा",
        totalAmount: "कुल राशि",

        staleDataWarning: "पुराना डेटा (> 2 वर्ष)",
        staleTag: "पुराना",

        lineItems: "लाइन आइटम",
        itemsDetected: "आइटम मिले",
        sku: "SKU",
        description: "विवरण",
        glCategory: "GL श्रेणी",
        qty: "मात्रा",
        unitPrice: "इकाई मूल्य",
        lineTotal: "कुल",
        convertedTotal: "परिवर्तित कुल",
        exchangeRate: "दर",

        mathMismatch: "गणना में अंतर",
        expected: "अपेक्षित",
        noLineItems:
            "कोई लाइन आइटम नहीं मिला। नीचे दिए गए बटन से एक जोड़ें।",
        addLineItem: "लाइन आइटम जोड़ें",
        highRisk: "उच्च जोखिम",
        recalculate: "सुधारें",
        fixAll: "सभी को पुनर्गणित करें",

        sensitiveDetected: "संवेदनशील जानकारी मिली",
        complianceWarning:
            "सावधानी से संभालें और डेटा सुरक्षा नियमों का पालन सुनिश्चित करें।",

        csvDocumentType: "दस्तावेज़ प्रकार",
        csvVendor: "विक्रेता",
        csvDate: "तारीख",
        csvTotalAmount: "कुल राशि",
        csvCurrency: "मुद्रा",
        csvSku: "SKU",
        csvDescription: "विवरण",
        csvGlCategory: "GL श्रेणी",
        csvQuantity: "मात्रा",
        csvUnitPrice: "इकाई मूल्य",
        csvLineTotal: "लाइन कुल",

        quotaError: "प्रोसेसिंग सीमा पूरी हो गई।",
        quotaCooldown: "पुनः प्रयास होगा",
        readError:
            "दस्तावेज़ पढ़ा नहीं जा सका। अधिक स्पष्ट चित्र का प्रयास करें।",
        fileTypeError:
            "अमान्य फ़ाइल। कृपया चित्र या PDF अपलोड करें।",

        analyzing: "दस्तावेज़ संरचना का विश्लेषण हो रहा है...",
        sanitizing: "इनपुट डेटा बदला जा रहा है...",

        confidenceHigh: "उच्च विश्वसनीयता",
        confidenceReview: "समीक्षा की सलाह",
        verifyPrices: "मूल्य सत्यापित करें",
        lowItemCount: "कम आइटम मिले",
        tryAgain: "फिर प्रयास करें",

        clearData: "सभी सेशन डेटा साफ़ करें",
        clearDataConfirmTitle: "सभी सेशन डेटा साफ़ करें?",
        clearDataConfirmMessage:
            "यह इस सेशन में प्रोसेस किए गए सभी इनवॉइस स्थायी रूप से हटा देगा। इस कार्रवाई को वापस नहीं किया जा सकता।",
        dataClearedSuccess:
            "सारा डेटा साफ़ कर दिया गया। आपका सेशन अब खाली है।",

        tryExample: "एक उदाहरण आज़माएँ:",
        exampleReceipt: "सरल रसीद (USD)",
        exampleMultilang: "निर्माण (JPN)",
        exampleCurrency: "यात्रा इनवॉइस (EUR)",

        home: "होम",
        newInvoice: "नया इनवॉइस",
        history: "इतिहास",

        unsavedChanges:
            "आपके पास सहेजे नहीं गए बदलाव हैं। क्या आप नया इनवॉइस शुरू करना चाहते हैं?",

        exportAll: "संयुक्त CSV एक्सपोर्ट करें",
        breadcrumbsProcessing: "प्रोसेस हो रहा है...",
        sessionMenu: "सेशन और एनालिटिक्स",

        filesSelected: "फ़ाइलें चुनी गईं",
        sanitizeBatch: "{count} दस्तावेज़ बदलें",
        processingBatch:
            "{total} में से {current} बदला जा रहा है: {filename}...",
        batchComplete: "बैच परिवर्तन पूरा हुआ!",

        exportCombined: "संयुक्त CSV एक्सपोर्ट करें",
        copied: "क्लिपबोर्ड पर कॉपी किया गया!",
        copyToClipboard: "क्लिपबोर्ड पर कॉपी करें",
        printPdf: "प्रिंट / PDF के रूप में सहेजें",

        initScan: "स्कैन शुरू करें",
        scanInvoice: "इनवॉइस स्कैन करें",
    },

    Arabic: {
        ...baseEnglish,

        toggleTheme: "تبديل المظهر",
        translateTo: "إخراج البيانات",
        interfaceLanguage: "لغة الواجهة",
        targetCurrency: "العملة المستهدفة",
        original: "الأصلية",

        heroTitle: "رقمن",
        financialData: "بياناتك المالية",
        heroSubtitle:
            "حوّل الفواتير والمستندات المالية إلى بيانات منظمة ومدققة وجاهزة للتصدير.",

        dropZoneMain: "أسقط الفواتير هنا",
        dropZoneSub: "يدعم المعالجة المجمعة (الحد الأقصى 5)",
        uploadError:
            "تعذر استخراج البيانات. حاول استخدام صورة أوضح.",

        sanitizeAction: "تحويل المستند",
        processing: "جارٍ استخراج البيانات...",
        activeDoc: "المستند النشط",
        sanitizeNew: "تحويل ملف جديد",
        extractedData: "البيانات المستخرجة",
        translating: "جارٍ الترجمة...",

        exportCsv: "تصدير CSV",

        sessionHistory: "السجل",
        sessionAnalytics: "التحليلات",
        noDocs: "لم تتم معالجة أي مستندات بعد.",

        riskDetected: "تم اكتشاف خطر",
        clean: "تم التحويل",
        riskTag: "خطر",

        totalDocs: "إجمالي المستندات",
        totalValue: "القيمة الإجمالية (USD)",
        avgTime: "متوسط وقت التحويل",
        topCategories: "أهم فئات GL",
        languages: "اللغات المكتشفة",
        seconds: "ث",

        sessionActive: "الجلسة نشطة: {minutes}د",
        sessionPrivacyInfo:
            "يتم تخزين جميع البيانات في جلسة المتصفح الحالية فقط. سيتم مسح البيانات عند إغلاق علامة التبويب أو المتصفح.",

        spendingBreakdown: "الإنفاق حسب فئة GL",
        vendorFrequency: "أهم الموردين",
        currencyDist: "توزيع العملات",
        recentActivity: "نشاط الجلسة",
        other: "أخرى",
        docComposition: "تكوين المستندات",

        documentType: "نوع المستند",
        vendorName: "اسم المورد",
        invoiceDate: "تاريخ الفاتورة",
        currency: "العملة",
        totalAmount: "المبلغ الإجمالي",

        staleDataWarning: "بيانات قديمة (> سنتين)",
        staleTag: "قديم",

        lineItems: "بنود الفاتورة",
        itemsDetected: "بنود مكتشفة",
        sku: "SKU",
        description: "الوصف",
        glCategory: "فئة GL",
        qty: "الكمية",
        unitPrice: "سعر الوحدة",
        lineTotal: "الإجمالي",
        convertedTotal: "الإجمالي المحول",
        exchangeRate: "السعر",

        mathMismatch: "عدم تطابق الحساب",
        expected: "المتوقع",
        noLineItems:
            "لم يتم استخراج أي بنود. استخدم الزر أدناه لإضافة بند.",
        addLineItem: "إضافة بند",
        highRisk: "خطر مرتفع",
        recalculate: "تصحيح",
        fixAll: "إعادة حساب الكل",

        sensitiveDetected: "تم اكتشاف معلومات حساسة",
        complianceWarning:
            "تعامل معها بعناية وتأكد من الالتزام بلوائح حماية البيانات.",

        csvDocumentType: "نوع المستند",
        csvVendor: "المورد",
        csvDate: "التاريخ",
        csvTotalAmount: "المبلغ الإجمالي",
        csvCurrency: "العملة",
        csvSku: "SKU",
        csvDescription: "الوصف",
        csvGlCategory: "فئة GL",
        csvQuantity: "الكمية",
        csvUnitPrice: "سعر الوحدة",
        csvLineTotal: "إجمالي البند",

        quotaError: "تم الوصول إلى حد المعالجة.",
        quotaCooldown: "إعادة المحاولة خلال",
        readError:
            "تعذر قراءة المستند. حاول استخدام صورة أوضح.",
        fileTypeError:
            "ملف غير صالح. يرجى رفع صورة أو ملف PDF.",

        analyzing: "جارٍ تحليل بنية المستند...",
        sanitizing: "جارٍ تحويل بيانات الإدخال...",

        confidenceHigh: "ثقة عالية",
        confidenceReview: "يوصى بالمراجعة",
        verifyPrices: "التحقق من الأسعار",
        lowItemCount: "عدد بنود منخفض",
        tryAgain: "حاول مرة أخرى",

        clearData: "مسح جميع بيانات الجلسة",
        clearDataConfirmTitle: "مسح جميع بيانات الجلسة؟",
        clearDataConfirmMessage:
            "سيؤدي هذا إلى حذف جميع الفواتير التي تمت معالجتها في هذه الجلسة نهائيًا. لا يمكن التراجع عن هذا الإجراء.",
        dataClearedSuccess:
            "تم مسح جميع البيانات. الجلسة الآن فارغة.",

        tryExample: "جرّب مثالًا:",
        exampleReceipt: "إيصال بسيط (USD)",
        exampleMultilang: "تصنيع (JPN)",
        exampleCurrency: "فاتورة سفر (EUR)",

        home: "الرئيسية",
        newInvoice: "فاتورة جديدة",
        history: "السجل",

        unsavedChanges:
            "لديك تغييرات غير محفوظة. هل أنت متأكد من بدء فاتورة جديدة؟",

        exportAll: "تصدير CSV مدمج",
        breadcrumbsProcessing: "جارٍ المعالجة...",
        sessionMenu: "الجلسة والتحليلات",

        filesSelected: "ملفات محددة",
        sanitizeBatch: "تحويل {count} مستندات",
        processingBatch:
            "جارٍ تحويل {current} من {total}: {filename}...",
        batchComplete: "اكتمل التحويل المجمع!",

        exportCombined: "تصدير CSV مدمج",
        copied: "تم النسخ إلى الحافظة!",
        copyToClipboard: "نسخ إلى الحافظة",
        printPdf: "طباعة / حفظ كملف PDF",

        initScan: "بدء المسح",
        scanInvoice: "مسح الفاتورة",
    },

    Korean: {
        ...baseEnglish,

        toggleTheme: "테마 전환",
        translateTo: "데이터 출력",
        interfaceLanguage: "인터페이스 언어",
        targetCurrency: "대상 통화",
        original: "원본",

        heroTitle: "재무 데이터를",
        financialData: "디지털화하세요",
        heroSubtitle:
            "송장과 재무 문서를 구조화되고 검증된 내보내기용 데이터로 변환합니다.",

        dropZoneMain: "송장을 여기에 놓으세요",
        dropZoneSub: "일괄 처리 지원 (최대 5개)",
        uploadError:
            "데이터를 추출하지 못했습니다. 더 선명한 이미지를 사용해 보세요.",

        sanitizeAction: "문서 변환",
        processing: "데이터 추출 중...",
        activeDoc: "활성 문서",
        sanitizeNew: "새 파일 변환",
        extractedData: "추출된 데이터",
        translating: "번역 중...",

        exportCsv: "CSV 내보내기",

        sessionHistory: "기록",
        sessionAnalytics: "분석",
        noDocs: "아직 처리된 문서가 없습니다.",

        riskDetected: "위험 감지",
        clean: "변환됨",
        riskTag: "위험",

        totalDocs: "전체 문서",
        totalValue: "총 금액 (USD)",
        avgTime: "평균 변환 시간",
        topCategories: "주요 GL 카테고리",
        languages: "감지된 언어",
        seconds: "초",

        sessionActive: "세션 활성: {minutes}분",
        sessionPrivacyInfo:
            "모든 데이터는 현재 브라우저 세션에만 저장됩니다. 탭이나 브라우저를 닫으면 데이터가 삭제됩니다.",

        spendingBreakdown: "GL 카테고리별 지출",
        vendorFrequency: "주요 공급업체",
        currencyDist: "통화 분포",
        recentActivity: "세션 활동",
        other: "기타",
        docComposition: "문서 구성",

        documentType: "문서 유형",
        vendorName: "공급업체 이름",
        invoiceDate: "송장 날짜",
        currency: "통화",
        totalAmount: "총 금액",

        staleDataWarning: "오래된 데이터 (> 2년)",
        staleTag: "오래됨",

        lineItems: "라인 항목",
        itemsDetected: "개 항목 감지",
        sku: "SKU",
        description: "설명",
        glCategory: "GL 카테고리",
        qty: "수량",
        unitPrice: "단가",
        lineTotal: "합계",
        convertedTotal: "환산 합계",
        exchangeRate: "환율",

        mathMismatch: "계산 불일치",
        expected: "예상값",
        noLineItems:
            "추출된 항목이 없습니다. 아래 버튼을 사용해 추가하세요.",
        addLineItem: "항목 추가",
        highRisk: "높은 위험",
        recalculate: "수정",
        fixAll: "전체 재계산",

        sensitiveDetected: "민감한 정보 감지",
        complianceWarning:
            "주의해서 처리하고 데이터 보호 규정을 준수하는지 확인하세요.",

        csvDocumentType: "문서 유형",
        csvVendor: "공급업체",
        csvDate: "날짜",
        csvTotalAmount: "총 금액",
        csvCurrency: "통화",
        csvSku: "SKU",
        csvDescription: "설명",
        csvGlCategory: "GL 카테고리",
        csvQuantity: "수량",
        csvUnitPrice: "단가",
        csvLineTotal: "항목 합계",

        quotaError: "처리 한도에 도달했습니다.",
        quotaCooldown: "재시도까지",
        readError:
            "문서를 읽을 수 없습니다. 더 선명한 이미지를 사용해 보세요.",
        fileTypeError:
            "잘못된 파일입니다. 이미지 또는 PDF를 업로드하세요.",

        analyzing: "문서 구조 분석 중...",
        sanitizing: "입력 데이터 변환 중...",

        confidenceHigh: "높은 신뢰도",
        confidenceReview: "검토 권장",
        verifyPrices: "가격 확인",
        lowItemCount: "항목 수 부족",
        tryAgain: "다시 시도",

        clearData: "모든 세션 데이터 삭제",
        clearDataConfirmTitle: "모든 세션 데이터를 삭제할까요?",
        clearDataConfirmMessage:
            "이 세션에서 처리된 모든 송장이 영구적으로 삭제됩니다. 이 작업은 되돌릴 수 없습니다.",
        dataClearedSuccess:
            "모든 데이터가 삭제되었습니다. 세션이 비어 있습니다.",

        tryExample: "예제 사용:",
        exampleReceipt: "간단한 영수증 (USD)",
        exampleMultilang: "제조업 (JPN)",
        exampleCurrency: "여행 송장 (EUR)",

        home: "홈",
        newInvoice: "새 송장",
        history: "기록",

        unsavedChanges:
            "저장되지 않은 변경 사항이 있습니다. 새 송장을 시작하시겠습니까?",

        exportAll: "통합 CSV 내보내기",
        breadcrumbsProcessing: "처리 중...",
        sessionMenu: "세션 및 분석",

        filesSelected: "개 파일 선택됨",
        sanitizeBatch: "{count}개 문서 변환",
        processingBatch:
            "{total}개 중 {current}번째 변환 중: {filename}...",
        batchComplete: "일괄 변환 완료!",

        exportCombined: "통합 CSV 내보내기",
        copied: "클립보드에 복사되었습니다!",
        copyToClipboard: "클립보드에 복사",
        printPdf: "인쇄 / PDF로 저장",

        initScan: "스캔 시작",
        scanInvoice: "송장 스캔",
    },

    Italian: {
        ...baseEnglish,

        toggleTheme: "Cambia tema",
        translateTo: "Output dati",
        interfaceLanguage: "Lingua dell'interfaccia",
        targetCurrency: "Valuta di destinazione",
        original: "Originale",

        heroTitle: "Digitalizza i tuoi",
        financialData: "Dati finanziari",
        heroSubtitle:
            "Trasforma fatture e documenti finanziari in dati strutturati, verificati e pronti per l'esportazione.",

        dropZoneMain: "Trascina qui le fatture",
        dropZoneSub:
            "Elaborazione in batch supportata (Max 5)",
        uploadError:
            "Impossibile estrarre i dati. Prova con un'immagine più nitida.",

        sanitizeAction: "TRASFORMA DOCUMENTO",
        processing: "Estrazione dei dati...",
        activeDoc: "Documento attivo",
        sanitizeNew: "Trasforma nuovo file",
        extractedData: "DATI ESTRATTI",
        translating: "Traduzione...",

        exportCsv: "Esporta CSV",

        sessionHistory: "Cronologia",
        sessionAnalytics: "Analisi",
        noDocs: "Nessun documento elaborato.",

        riskDetected: "Rischio rilevato",
        clean: "Trasformato",
        riskTag: "RISCHIO",

        totalDocs: "Documenti totali",
        totalValue: "Valore totale (USD)",
        avgTime: "Tempo medio di trasformazione",
        topCategories: "Principali categorie GL",
        languages: "Lingue rilevate",
        seconds: "s",

        sessionActive: "Sessione attiva: {minutes}m",
        sessionPrivacyInfo:
            "Tutti i dati vengono memorizzati esclusivamente nella sessione corrente del browser. I dati verranno eliminati alla chiusura della scheda o del browser.",

        spendingBreakdown: "Spesa per categoria GL",
        vendorFrequency: "Principali fornitori",
        currencyDist: "Distribuzione delle valute",
        recentActivity: "Attività della sessione",
        other: "Altro",
        docComposition: "Composizione documenti",

        documentType: "TIPO DI DOCUMENTO",
        vendorName: "Fornitore",
        invoiceDate: "Data fattura",
        currency: "Valuta",
        totalAmount: "Importo totale",

        staleDataWarning: "Dati obsoleti (> 2 anni)",
        staleTag: "OBSOLETO",

        lineItems: "VOCI",
        itemsDetected: "voci rilevate",
        sku: "SKU",
        description: "Descrizione",
        glCategory: "Categoria GL",
        qty: "Qtà",
        unitPrice: "Prezzo unitario",
        lineTotal: "Totale",
        convertedTotal: "Totale convertito",
        exchangeRate: "Tasso",

        mathMismatch: "Errore di calcolo",
        expected: "Previsto",
        noLineItems:
            "Nessuna voce estratta. Usa il pulsante qui sotto per aggiungerne una.",
        addLineItem: "Aggiungi voce",
        highRisk: "Rischio elevato",
        recalculate: "Correggi",
        fixAll: "Ricalcola tutto",

        sensitiveDetected: "Informazioni sensibili rilevate",
        complianceWarning:
            "Gestisci questi dati con attenzione e assicurati di rispettare le normative sulla protezione dei dati.",

        csvDocumentType: "Tipo di documento",
        csvVendor: "Fornitore",
        csvDate: "Data",
        csvTotalAmount: "Importo totale",
        csvCurrency: "Valuta",
        csvSku: "SKU",
        csvDescription: "Descrizione",
        csvGlCategory: "Categoria GL",
        csvQuantity: "Quantità",
        csvUnitPrice: "Prezzo unitario",
        csvLineTotal: "Totale voce",

        quotaError: "Limite di elaborazione raggiunto.",
        quotaCooldown: "Nuovo tentativo tra",
        readError:
            "Impossibile leggere il documento. Prova con un'immagine più nitida.",
        fileTypeError:
            "File non valido. Carica un'immagine o un PDF.",

        analyzing: "Analisi della struttura del documento...",
        sanitizing: "Trasformazione dei dati di input...",

        confidenceHigh: "Affidabilità elevata",
        confidenceReview: "Revisione consigliata",
        verifyPrices: "Verifica prezzi",
        lowItemCount: "Numero ridotto di voci",
        tryAgain: "Riprova",

        clearData: "Cancella tutti i dati della sessione",
        clearDataConfirmTitle:
            "Cancellare tutti i dati della sessione?",
        clearDataConfirmMessage:
            "Questa operazione eliminerà definitivamente tutte le fatture elaborate durante la sessione. L'azione non può essere annullata.",
        dataClearedSuccess:
            "Tutti i dati sono stati cancellati. La sessione è ora vuota.",

        tryExample: "Prova un esempio:",
        exampleReceipt: "Ricevuta semplice (USD)",
        exampleMultilang: "Produzione (JPN)",
        exampleCurrency: "Fattura di viaggio (EUR)",

        home: "Home",
        newInvoice: "Nuova fattura",
        history: "Cronologia",

        unsavedChanges:
            "Hai modifiche non salvate. Vuoi davvero iniziare una nuova fattura?",

        exportAll: "Esporta CSV combinato",
        breadcrumbsProcessing: "Elaborazione...",
        sessionMenu: "Sessione e analisi",

        filesSelected: "file selezionati",
        sanitizeBatch: "TRASFORMA {count} DOCUMENTI",
        processingBatch:
            "Trasformazione {current} di {total}: {filename}...",
        batchComplete: "Trasformazione batch completata!",

        exportCombined: "Esporta CSV combinato",
        copied: "Copiato negli appunti!",
        copyToClipboard: "Copia negli appunti",
        printPdf: "Stampa / Salva come PDF",

        initScan: "AVVIA SCANSIONE",
        scanInvoice: "Scansiona fattura",
    },
};