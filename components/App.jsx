"use client";

import React, { useState, useEffect, useCallback } from "react";
import { FileUpload } from "./FileUpload";
import { InvoiceEditor } from "./InvoiceEditor";
import { SessionSidebar } from "./SessionSidebar";
import { Navbar } from "./Navbar";
import { extractInvoiceData } from "../lib/extractClient";
import { Loader2, Download, Wand2, ShieldCheck, AlertCircle, Clock, RefreshCw, FileText, Globe2, Plane, Layers, AlertTriangle, Copy, Printer, Table } from "lucide-react";
import { translations } from "../lib/translations";
import { EXAMPLES } from "../lib/exampleData";

const App = () => {
    const [files, setFiles] = useState([]);
    const [invoiceData, setInvoiceData] = useState(null);
    const [sessionHistory, setSessionHistory] = useState([]);
    const [processingState, setProcessingState] = useState({ status: "idle" });

    const [interfaceLanguage, setInterfaceLanguage] = useState("English");
    const [targetCurrency, setTargetCurrency] = useState("Original");
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [retryCountdown, setRetryCountdown] = useState(0);
    const [showMobileHistory, setShowMobileHistory] = useState(false);
    const [exportNotification, setExportNotification] = useState(null);
    const [isDemoMode, setIsDemoMode] = useState(false);
    const [showHomeConfirm, setShowHomeConfirm] = useState(false);
    const [sessionStartTime, setSessionStartTime] = useState(null);
    const [exportFormat, setExportFormat] = useState("csv");

    const [duplicateWarning, setDuplicateWarning] = useState({
        show: false,
        invoice: null,
    });
    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const [clearNotification, setClearNotification] = useState(null);

    const t = translations[interfaceLanguage] || translations.English;

    const toggleTheme = () => setIsDarkMode(!isDarkMode);

    const currentView = invoiceData
        ? "editor"
        : processingState.status === "processing" ||
            processingState.status === "quota_cooldown"
          ? "processing"
          : "home";

    useEffect(() => {
        if (isDarkMode){
            document.documentElement.classList.add("dark");
        } 
        else {
            document.documentElement.classList.remove("dark");
        }
    }, [isDarkMode]);

    useEffect(() => {
        if (sessionHistory.length > 0 && sessionStartTime === null){
            setSessionStartTime(Date.now());
        } 
        else if (sessionHistory.length === 0){
            setSessionStartTime(null);
        }
    }, [sessionHistory, sessionStartTime]);

    const handleFileSelect = (selectedFiles) => {
        setFiles(selectedFiles);
        setProcessingState({ status: "idle" });
        setRetryCountdown(0);
    };

    const handleClearFile = () => {
        setFiles([]);
        setProcessingState({ status: "idle" });
        setRetryCountdown(0);
    };

    const handleError = (message, code) => {
        setProcessingState({
            status: "error",
            message,
            errorCode: code,
        });
    };

    const handleLoadExample = async (key) => {
        const dummyFile = new File(
            ["dummy_content"],
            `${key}_example.jpg`,
            { type: "image/jpeg" },
        );

        setFiles([dummyFile]);
        setProcessingState({
            status: "processing",
            message: t.analyzing,
        });

        await new Promise((resolve) => setTimeout(resolve, 1200));

        setProcessingState((prev) => ({
            ...prev,
            message: t.sanitizing,
        }));

        await new Promise((resolve) => setTimeout(resolve, 1200));

        const data = EXAMPLES[key];

        if (data){
            const dataWithId = {
                ...data,
                id: crypto.randomUUID(),
                language: data.language || "Original",
                originalLineItems: data.lineItems,
            };

            setInvoiceData(dataWithId);
            setSessionHistory((prev) => [dataWithId, ...prev]);
            setProcessingState({ status: "complete" });
            setFiles([]);
        }
    };

    const handleTransform = async () => {
        if (files.length === 0) return;

        setProcessingState({
            status: "processing",
            message: t.processing,
        });

        for (let i = 0; i < files.length; i++){
            const file = files[i];
            const startTime = Date.now();

            if (files.length > 1){
                setProcessingState((prev) => ({
                    ...prev,
                    message: t.processingBatch
                        .replace("{current}", (i + 1).toString())
                        .replace("{total}", files.length.toString())
                        .replace("{filename}", file.name),
                }));
            } 
            else {
                setTimeout(() => {
                    if (processingState.status !== "error"){
                        setProcessingState((prev) => ({
                            ...prev,
                            message: t.analyzing,
                        }));
                    }
                }, 1500);

                setTimeout(() => {
                    if (processingState.status !== "error"){
                        setProcessingState((prev) => ({
                            ...prev,
                            message: t.sanitizing,
                        }));
                    }
                }, 3500);
            }

            try {
                const data = await extractInvoiceData(file, isDemoMode);
                const processingTimeMs = Date.now() - startTime;

                const dataWithId = {
                    ...data,
                    id: crypto.randomUUID(),
                    language: "Original",
                    originalLineItems: data.lineItems,
                    processingTimeMs,
                    isDemo: isDemoMode,
                };

                const isDuplicateInHistory = sessionHistory.some((invoice) => {
                    const vendorMatch =
                        invoice.vendorName.toLowerCase().trim() ===
                        dataWithId.vendorName.toLowerCase().trim();

                    const dateMatch =
                        invoice.invoiceDate === dataWithId.invoiceDate;

                    const amountMatch =
                        Math.abs(
                            invoice.totalAmount - dataWithId.totalAmount,
                        ) < 0.01;

                    return vendorMatch && dateMatch && amountMatch;
                });

                if (isDuplicateInHistory){
                    setDuplicateWarning({
                        show: true,
                        invoice: dataWithId,
                    });
                    setProcessingState({ status: "complete" });
                    continue;
                }

                setSessionHistory((prev) => [dataWithId, ...prev]);

                if (i === files.length - 1){
                    setInvoiceData(dataWithId);
                }

                if (i < files.length - 1){
                    await new Promise((resolve) =>
                        setTimeout(resolve, 2000),
                    );
                }
            } 
            catch (error){
                const code = error.code || "GENERIC";
                let message = t.uploadError;

                if (code === "QUOTA_EXCEEDED"){
                    message = t.quotaError;
                    setRetryCountdown(60);
                    setProcessingState({
                        status: "quota_cooldown",
                        message,
                        errorCode: code,
                        retryIn: 60,
                    });
                    return;
                }

                if (code === "READ_ERROR"){
                    message = t.readError;
                }
                else if (code === "INVALID_FILE"){
                    message = t.fileTypeError;
                }

                setProcessingState({
                    status: "error",
                    message,
                    errorCode: code,
                });

                return;
            }
        }

        setProcessingState({ status: "complete" });
        setRetryCountdown(0);
        setFiles([]);
    };

    const confirmDuplicate = () => {
        if (!duplicateWarning.invoice) return;

        const invoice = duplicateWarning.invoice;

        setSessionHistory((prev) => [invoice, ...prev]);
        setInvoiceData(invoice);
        setDuplicateWarning({
            show: false,
            invoice: null,
        });
        setFiles([]);
    };

    const cancelDuplicate = () => {
        setDuplicateWarning({
            show: false,
            invoice: null,
        });
    };

    const handleClearAllRequest = () => {
        setShowClearConfirm(true);
    };

    const confirmClearAll = () => {
        setFiles([]);
        setInvoiceData(null);
        setSessionHistory([]);
        setProcessingState({ status: "idle" });
        setShowClearConfirm(false);
        setClearNotification(t.dataClearedSuccess);

        setTimeout(() => {
            setClearNotification(null);
        }, 3000);
    };

    const cancelClearAll = () => {
        setShowClearConfirm(false);
    };

    useEffect(() => {
        if (
            processingState.status === "quota_cooldown" &&
            retryCountdown > 0
        ){
            const timer = setTimeout(() => {
                setRetryCountdown((prev) => prev - 1);
            }, 1000);

            return () => clearTimeout(timer);
        }

        if (
            processingState.status === "quota_cooldown" &&
            retryCountdown === 0
        ){
            handleTransform();
        }
    }, [processingState.status, retryCountdown]);

    const handleInvoiceChange = (newData) => {
        newData.originalLineItems = newData.lineItems;

        setInvoiceData(newData);
        setSessionHistory((prev) =>
            prev.map((item) =>
                item.id === newData.id ? newData : item,
            ),
        );
    };

    const handleHistorySelect = (data) => {
        setInvoiceData(data);
        setProcessingState({ status: "complete" });
        setShowMobileHistory(false);
    };

    const handleNavigateHome = () => {
        if (invoiceData){
            setShowHomeConfirm(true);
            return;
        }

        setFiles([]);
        setInvoiceData(null);
        setProcessingState({ status: "idle" });
    };

    const confirmNavigateHome = () => {
        setFiles([]);
        setInvoiceData(null);
        setProcessingState({ status: "idle" });
        setShowHomeConfirm(false);
    };

    const cancelNavigateHome = () => {
        setShowHomeConfirm(false);
    };

    const handleNewInvoice = useCallback(() => {
        if (invoiceData){
            if (!window.confirm(t.unsavedChanges)) return;
        }

        setFiles([]);
        setInvoiceData(null);
        setProcessingState({ status: "idle" });
        setShowMobileHistory(false);
    }, [invoiceData, t.unsavedChanges]);

    const handleInterfaceLanguageChange = (event) => {
        setInterfaceLanguage(event.target.value);
    };

    const handleCurrencyChange = (event) => {
        setTargetCurrency(event.target.value);
    };

    const handleCopyToClipboard = useCallback(async () => {
        if (!invoiceData) return;

        const headers = [
            t.sku,
            t.description,
            t.glCategory,
            t.qty,
            t.unitPrice,
            t.lineTotal,
        ];

        const rows = invoiceData.lineItems.map((item) => [
            item.sku,
            item.description,
            item.glCategory,
            item.quantity,
            item.unitPrice,
            (item.totalAmount || 0).toFixed(2),
        ]);

        const tsvContent = [
            headers.join("\t"),
            ...rows.map((row) => row.join("\t")),
        ].join("\n");

        try {
            await navigator.clipboard.writeText(tsvContent);
            setExportNotification(t.copied);

            setTimeout(() => {
                setExportNotification(null);
            }, 3000);
        } 
        catch (error){
            console.error("Failed to copy", error);
        }
    }, [invoiceData, t]);

    const generateCSV = (data, format) => {
        if (format === "csv"){
            const headers = [
                t.csvDocumentType,
                t.csvVendor,
                t.csvDate,
                t.csvTotalAmount,
                t.csvCurrency,
                t.csvSku,
                t.csvDescription,
                t.csvGlCategory,
                t.csvQuantity,
                t.csvUnitPrice,
                t.csvLineTotal,
            ];

            const allRows = data.flatMap((doc) =>
                doc.lineItems.map((item) => [
                    `"${(doc.documentType || "Unknown").replace(/"/g, '""')}"`,
                    `"${doc.vendorName.replace(/"/g, '""')}"`,
                    doc.invoiceDate,
                    doc.totalAmount,
                    doc.currencySymbol || "$",
                    `"${(item.sku || "").replace(/"/g, '""')}"`,
                    `"${item.description.replace(/"/g, '""')}"`,
                    `"${(item.glCategory || "").replace(/"/g, '""')}"`,
                    item.quantity,
                    item.unitPrice,
                    (item.totalAmount || 0).toFixed(2),
                ]),
            );

            return [
                headers.join(","),
                ...allRows.map((row) => row.join(",")),
            ].join("\n");
        }

        if (format === "quickbooks"){
            const headers = [
                "Customer",
                "InvoiceDate",
                "Item",
                "Quantity",
                "Rate",
                "Amount",
            ];

            const allRows = data.flatMap((doc) =>
                doc.lineItems.map((item) => {
                    const date = new Date(doc.invoiceDate);
                    const quickBooksDate =
                        `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

                    return [
                        `"${doc.vendorName.replace(/"/g, '""')}"`,
                        quickBooksDate,
                        `"${item.description.replace(/"/g, '""')}"`,
                        item.quantity,
                        item.unitPrice,
                        (item.totalAmount || 0).toFixed(2),
                    ];
                }),
            );

            return [
                headers.join(","),
                ...allRows.map((row) => row.join(",")),
            ].join("\n");
        }

        return generateCSV(data, "csv");
    };

    const handleDownloadCSV = useCallback(() => {
        if (!invoiceData) return;

        const csvContent = generateCSV(
            [invoiceData],
            exportFormat,
        );

        const blob = new Blob(
            ["\uFEFF" + csvContent],
            { type: "text/csv;charset=utf-8;" },
        );

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.setAttribute("href", url);
        link.setAttribute(
            "download",
            `transformed_${exportFormat}_${(
                invoiceData.documentType || "doc"
            )
                .toLowerCase()
                .replace(/\s/g, "_")}_${
                invoiceData.vendorName || "export"
            }.csv`,
        );

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setExportNotification(
            `✓ ${t.batchComplete} (${invoiceData.lineItems.length} items)`,
        );

        setTimeout(() => {
            setExportNotification(null);
        }, 3000);
    }, [invoiceData, t, exportFormat]);

    const handleDownloadMain = () => {
        if (exportFormat === "json"){
            handleDownloadJSON();
            return;
        }

        if (exportFormat === "excel"){
            handleDownloadExcel();
            return;
        }

        handleDownloadCSV();
    };

    const handleDownloadExcel = useCallback(() => {
        if (!invoiceData) return;

        const headers = [
            t.csvDocumentType,
            t.csvVendor,
            t.csvDate,
            t.csvTotalAmount,
            t.csvCurrency,
            t.csvSku,
            t.csvDescription,
            t.csvGlCategory,
            t.csvQuantity,
            t.csvUnitPrice,
            t.csvLineTotal,
        ];

        let tableHtml =
            '<html xmlns:o="urn:schemas-microsoft-com:office:office" ' +
            'xmlns:x="urn:schemas-microsoft-com:office:excel" ' +
            'xmlns="http://www.w3.org/TR/REC-html40">' +
            '<head><meta http-equiv="content-type" ' +
            'content="text/plain; charset=UTF-8"/></head>' +
            "<body><table><thead><tr>";

        headers.forEach((header) => {
            tableHtml += `<th>${header}</th>`;
        });

        tableHtml += "</tr></thead><tbody>";

        invoiceData.lineItems.forEach((item) => {
            tableHtml += "<tr>";
            tableHtml += `<td>${invoiceData.documentType || ""}</td>`;
            tableHtml += `<td>${invoiceData.vendorName}</td>`;
            tableHtml += `<td>${invoiceData.invoiceDate}</td>`;
            tableHtml += `<td>${invoiceData.totalAmount}</td>`;
            tableHtml += `<td>${invoiceData.currencySymbol}</td>`;
            tableHtml += `<td>${item.sku || ""}</td>`;
            tableHtml += `<td>${item.description}</td>`;
            tableHtml += `<td>${item.glCategory}</td>`;
            tableHtml += `<td>${item.quantity}</td>`;
            tableHtml += `<td>${item.unitPrice}</td>`;
            tableHtml += `<td>${item.totalAmount}</td>`;
            tableHtml += "</tr>";
        });

        tableHtml += "</tbody></table></body></html>";

        const blob = new Blob([tableHtml], {
            type: "application/vnd.ms-excel",
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download =
            `transformed_${(
                invoiceData.documentType || "doc"
            )
                .toLowerCase()
                .replace(/\s/g, "_")}_${
                invoiceData.vendorName || "export"
            }.xls`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setExportNotification("✓ Exported to Excel");

        setTimeout(() => {
            setExportNotification(null);
        }, 3000);
    }, [invoiceData, t]);

    const handleDownloadJSON = () => {
        if (!invoiceData) return;

        const jsonContent = JSON.stringify(
            invoiceData,
            null,
            2,
        );

        const blob = new Blob([jsonContent], {
            type: "application/json",
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.setAttribute("href", url);
        link.setAttribute(
            "download",
            `transformed_${invoiceData.vendorName}.json`,
        );

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExportAll = () => {
        if (sessionHistory.length === 0) return;

        const csvContent = generateCSV(
            sessionHistory,
            exportFormat,
        );

        const blob = new Blob(
            ["\uFEFF" + csvContent],
            { type: "text/csv;charset=utf-8;" },
        );

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.setAttribute("href", url);
        link.setAttribute(
            "download",
            `combined_transformed_${exportFormat}_${
                new Date().toISOString().split("T")[0]
            }.csv`,
        );

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className={isDarkMode ? "dark" : ""}>
            <div
                dir={interfaceLanguage === "Arabic" ? "rtl" : "ltr"}
                className="h-screen overflow-hidden transition-colors duration-300 bg-[#f7f7f8] dark:bg-[#1e1f22] text-[#313338] dark:text-[#f2f3f5] flex flex-col font-sans selection:bg-[#e5484d]/30"
            >
                <Navbar
                    t={t}
                    isDarkMode={isDarkMode}
                    toggleTheme={toggleTheme}
                    currentView={currentView}
                    vendorName={invoiceData?.vendorName}
                    totalAmount={invoiceData?.totalAmount}
                    currencySymbol={invoiceData?.currencySymbol}
                    onNavigateHome={handleNavigateHome}
                    onNewInvoice={handleNewInvoice}
                    onToggleHistory={() =>
                        setShowMobileHistory(!showMobileHistory)
                    }
                    targetCurrency={targetCurrency}
                    onCurrencyChange={handleCurrencyChange}
                    interfaceLanguage={interfaceLanguage}
                    onInterfaceLanguageChange={
                        handleInterfaceLanguageChange
                    }
                />

                {isDemoMode && (
                    <div className="bg-[#f59e0b] text-[#1e1f22] text-xs font-bold uppercase tracking-widest text-center py-1.5 shadow-md sticky top-16 z-40 animate-in slide-in-from-top duration-300 flex items-center justify-center space-x-2">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>
                            ⚠️ DEMO MODE ACTIVE - Using sample data
                            (No API usage)
                        </span>
                    </div>
                )}

                <div className="flex flex-1 overflow-hidden relative">
                    <aside className="hidden lg:block w-[250px] shrink-0 h-full overflow-hidden border-r border-[#d8d9dc] dark:border-[#3f4147] bg-[#efeff1]/80 dark:bg-[#2b2d31]/80 backdrop-blur-xl">
                        <SessionSidebar
                            history={sessionHistory}
                            currentId={invoiceData?.id}
                            onSelect={handleHistorySelect}
                            onNewInvoice={handleNewInvoice}
                            onExportAll={handleExportAll}
                            onClearAll={handleClearAllRequest}
                            t={t}
                            isDemoMode={isDemoMode}
                            onToggleDemoMode={() =>
                                setIsDemoMode(!isDemoMode)
                            }
                            onToggleHistory={() => {}}
                            exportFormat={exportFormat}
                            onExportFormatChange={setExportFormat}
                        />
                    </aside>

                    {showMobileHistory && (
                        <div className="absolute inset-0 z-40 lg:hidden flex">
                            <div
                                className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                                onClick={() =>
                                    setShowMobileHistory(false)
                                }
                            />

                            <aside className="relative w-[80%] max-w-[300px] h-full bg-[#f7f7f8] dark:bg-[#2b2d31] border-r border-[#d8d9dc] dark:border-[#3f4147] shadow-2xl animate-in slide-in-from-left duration-300">
                                <SessionSidebar
                                    history={sessionHistory}
                                    currentId={invoiceData?.id}
                                    onSelect={handleHistorySelect}
                                    onNewInvoice={handleNewInvoice}
                                    onExportAll={handleExportAll}
                                    onClearAll={handleClearAllRequest}
                                    t={t}
                                    isDemoMode={isDemoMode}
                                    onToggleDemoMode={() =>
                                        setIsDemoMode(!isDemoMode)
                                    }
                                    onToggleHistory={() =>
                                        setShowMobileHistory(false)
                                    }
                                    exportFormat={exportFormat}
                                    onExportFormatChange={
                                        setExportFormat
                                    }
                                />
                            </aside>
                        </div>
                    )}

                    <main className="flex-1 w-full overflow-y-auto p-4 sm:p-6 lg:p-8">
                        <div className="max-w-[1600px] mx-auto space-y-8 pb-10">
                            {currentView === "home" && (
                                <div className="text-center space-y-8 mb-12 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                    <div className="space-y-4">
                                        <h2 className="text-4xl md:text-5xl font-bold text-[#313338] dark:text-[#f2f3f5] tracking-tight">
                                            {t.heroTitle}{" "}
                                            <span className="text-[#e5484d]">
                                                {t.financialData}
                                            </span>
                                        </h2>

                                        <p className="text-[#6d6f78] dark:text-[#b5bac1] text-lg max-w-2xl mx-auto leading-relaxed">
                                            {t.heroSubtitle}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap items-center justify-center gap-4 animate-in fade-in zoom-in duration-500 delay-200">
                                        <span className="text-sm font-bold text-[#6d6f78] dark:text-[#949ba4] uppercase tracking-wide mr-2">
                                            {t.tryExample}
                                        </span>

                                        <button
                                            onClick={() =>
                                                handleLoadExample("receipt")
                                            }
                                            className="px-4 py-2 bg-white dark:bg-[#2b2d31] border border-[#d8d9dc] dark:border-[#3f4147] hover:border-[#e5484d]/50 hover:bg-[#fff5f5] dark:hover:bg-[#313338] rounded-lg shadow-sm flex items-center space-x-2 text-xs font-semibold text-[#4e5058] dark:text-[#dbdee1] transition-all hover:-translate-y-0.5 hover:shadow-md"
                                        >
                                            <FileText className="w-4 h-4 text-[#e5484d]" />
                                            <span>{t.exampleReceipt}</span>
                                        </button>

                                        <button
                                            onClick={() =>
                                                handleLoadExample(
                                                    "multilang",
                                                )
                                            }
                                            className="px-4 py-2 bg-white dark:bg-[#2b2d31] border border-[#d8d9dc] dark:border-[#3f4147] hover:border-[#e5484d]/50 hover:bg-[#fff5f5] dark:hover:bg-[#313338] rounded-lg shadow-sm flex items-center space-x-2 text-xs font-semibold text-[#4e5058] dark:text-[#dbdee1] transition-all hover:-translate-y-0.5 hover:shadow-md"
                                        >
                                            <Globe2 className="w-4 h-4 text-[#e5484d]" />
                                            <span>
                                                {t.exampleMultilang}
                                            </span>
                                        </button>

                                        <button
                                            onClick={() =>
                                                handleLoadExample(
                                                    "multicurrency",
                                                )
                                            }
                                            className="px-4 py-2 bg-white dark:bg-[#2b2d31] border border-[#d8d9dc] dark:border-[#3f4147] hover:border-[#e5484d]/50 hover:bg-[#fff5f5] dark:hover:bg-[#313338] rounded-lg shadow-sm flex items-center space-x-2 text-xs font-semibold text-[#4e5058] dark:text-[#dbdee1] transition-all hover:-translate-y-0.5 hover:shadow-md"
                                        >
                                            <Plane className="w-4 h-4 text-[#e5484d]" />
                                            <span>
                                                {t.exampleCurrency}
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div
                                className={`transition-all duration-700 ease-in-out ${
                                    currentView === "editor"
                                        ? "grid grid-cols-1 lg:grid-cols-5 gap-8"
                                        : "max-w-3xl mx-auto"
                                }`}
                            >
                                <div
                                    className={`space-y-6 ${
                                        currentView === "editor"
                                            ? "lg:col-span-1"
                                            : "w-full"
                                    }`}
                                >
                                    <FileUpload
                                        onFileSelect={handleFileSelect}
                                        selectedFiles={files}
                                        onClearFile={handleClearFile}
                                        disabled={
                                            processingState.status ===
                                                "processing" ||
                                            processingState.status ===
                                                "quota_cooldown"
                                        }
                                        onError={handleError}
                                        t={t}
                                    />

                                    {processingState.status ===
                                        "error" && (
                                        <div className="p-4 bg-[#fff1f2] dark:bg-[#dc2626]/10 border border-[#fecdd3] dark:border-[#dc2626]/30 rounded-xl space-y-3 animate-in fade-in slide-in-from-top-2">
                                            <div className="flex items-start space-x-3 text-[#dc2626] dark:text-[#f87171]">
                                                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />

                                                <p className="text-sm font-medium">
                                                    {
                                                        processingState.message
                                                    }
                                                </p>
                                            </div>

                                            <button
                                                onClick={
                                                    handleTransform
                                                }
                                                className="w-full py-2 text-xs font-bold uppercase tracking-wide bg-[#fee2e2] dark:bg-[#dc2626]/20 text-[#b91c1c] dark:text-[#fca5a5] rounded-lg hover:bg-[#fecaca] dark:hover:bg-[#dc2626]/30 transition-colors flex items-center justify-center space-x-2"
                                            >
                                                <RefreshCw className="w-3.5 h-3.5" />
                                                <span>
                                                    {t.tryAgain}
                                                </span>
                                            </button>
                                        </div>
                                    )}

                                    {processingState.status ===
                                        "quota_cooldown" && (
                                        <div className="p-4 bg-[#fffbeb] dark:bg-[#f59e0b]/10 border border-[#fde68a] dark:border-[#f59e0b]/30 rounded-xl space-y-2 animate-in fade-in slide-in-from-top-2">
                                            <div className="flex items-start space-x-3 text-[#b45309] dark:text-[#fbbf24]">
                                                <Clock className="w-5 h-5 shrink-0 mt-0.5" />

                                                <div className="flex-1">
                                                    <p className="text-sm font-bold">
                                                        {
                                                            processingState.message
                                                        }
                                                    </p>

                                                    <p className="text-xs mt-1 opacity-80">
                                                        {
                                                            t.quotaCooldown
                                                        }{" "}
                                                        <span className="font-mono font-bold">
                                                            {
                                                                retryCountdown
                                                            }
                                                            s
                                                        </span>
                                                        ...
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="w-full bg-[#fde68a] dark:bg-[#f59e0b]/20 rounded-full h-1.5 overflow-hidden">
                                                <div
                                                    className="bg-[#f59e0b] h-full transition-all duration-1000 ease-linear"
                                                    style={{
                                                        width: `${(retryCountdown / 60) * 100}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {files.length > 0 &&
                                        (!invoiceData ||
                                            processingState.status ===
                                                "idle") &&
                                        processingState.status !==
                                            "processing" &&
                                        processingState.status !==
                                            "quota_cooldown" && (
                                            <button
                                                onClick={
                                                    handleTransform
                                                }
                                                className="w-full py-4 bg-[#e5484d] hover:bg-[#d13f44] text-white rounded-xl font-bold tracking-wide shadow-lg shadow-[#e5484d]/20 flex items-center justify-center space-x-2 transition-all transform hover:scale-[1.02] active:scale-[0.98] ring-1 ring-black/5 dark:ring-white/10"
                                            >
                                                {files.length > 1 ? (
                                                    <Layers className="w-5 h-5" />
                                                ) : (
                                                    <Wand2 className="w-5 h-5" />
                                                )}

                                                <span>
                                                    {files.length > 1
                                                        ? t.sanitizeBatch.replace(
                                                              "{count}",
                                                              files.length.toString(),
                                                          )
                                                        : t.sanitizeAction}
                                                </span>
                                            </button>
                                        )}

                                    {processingState.status ===
                                        "processing" && (
                                        <div className="text-center py-10 space-y-4 bg-white/70 dark:bg-[#2b2d31]/70 rounded-xl border border-[#d8d9dc] dark:border-[#3f4147] backdrop-blur-sm">
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-[#e5484d] blur-xl opacity-20 animate-pulse rounded-full" />

                                                <Loader2 className="w-10 h-10 text-[#e5484d] animate-spin mx-auto relative z-10" />
                                            </div>

                                            <p className="text-sm font-medium text-[#d13f44] dark:text-[#f77479] animate-pulse tracking-wide transition-all duration-300">
                                                {
                                                    processingState.message
                                                }
                                            </p>
                                        </div>
                                    )}

                                    {currentView === "editor" &&
                                        invoiceData && (
                                            <div className="bg-white/80 dark:bg-[#2b2d31]/80 backdrop-blur-sm p-4 rounded-xl border border-[#d8d9dc] dark:border-[#3f4147] text-sm text-[#6d6f78] dark:text-[#b5bac1] shadow-lg transition-colors duration-300">
                                                <p className="font-bold text-[#313338] dark:text-[#dbdee1] mb-3 uppercase tracking-wider text-[10px]">
                                                    {t.activeDoc}
                                                </p>

                                                <div className="flex items-center space-x-3 mb-4">
                                                    <div className="p-2 bg-[#efeff1] dark:bg-[#313338] rounded-lg shrink-0">
                                                        <ShieldCheck className="w-5 h-5 text-[#e5484d]" />
                                                    </div>

                                                    <div className="overflow-hidden min-w-0">
                                                        <p className="truncate font-medium text-[#313338] dark:text-[#f2f3f5] text-xs">
                                                            {
                                                                invoiceData.vendorName
                                                            }
                                                        </p>

                                                        <p className="text-[10px] mt-0.5 text-[#6d6f78] dark:text-[#949ba4]">
                                                            {
                                                                invoiceData.documentType
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                </div>

                                {currentView === "editor" &&
                                    invoiceData && (
                                        <div className="lg:col-span-4 space-y-6 min-w-0 animate-in fade-in slide-in-from-right-4 duration-500">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                <h2 className="text-xl font-bold text-[#313338] dark:text-[#f2f3f5] tracking-wide flex items-center">
                                                    <span className="w-2 h-6 bg-[#e5484d] rounded-full mr-3" />
                                                    {t.extractedData}
                                                </h2>

                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={
                                                            handleCopyToClipboard
                                                        }
                                                        className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-[#2b2d31] border border-[#d8d9dc] dark:border-[#3f4147] hover:bg-[#efeff1] dark:hover:bg-[#313338] hover:border-[#e5484d]/40 text-[#4e5058] dark:text-[#dbdee1] text-xs font-bold rounded-lg shadow-sm transition-all"
                                                        title={
                                                            t.copyToClipboard
                                                        }
                                                    >
                                                        <Copy className="w-4 h-4" />
                                                        <span>
                                                            Copy Data
                                                        </span>
                                                    </button>

                                                    <button
                                                        onClick={
                                                            handleDownloadExcel
                                                        }
                                                        className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-[#2b2d31] border border-[#d8d9dc] dark:border-[#3f4147] hover:bg-[#efeff1] dark:hover:bg-[#313338] hover:border-[#e5484d]/40 text-[#4e5058] dark:text-[#dbdee1] text-xs font-bold rounded-lg shadow-sm transition-all"
                                                        title="Save as Excel"
                                                    >
                                                        <Table className="w-4 h-4" />
                                                        <span>
                                                            Save Excel
                                                        </span>
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            window.print()
                                                        }
                                                        className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-[#2b2d31] border border-[#d8d9dc] dark:border-[#3f4147] hover:bg-[#efeff1] dark:hover:bg-[#313338] hover:border-[#e5484d]/40 text-[#4e5058] dark:text-[#dbdee1] text-xs font-bold rounded-lg shadow-sm transition-all"
                                                        title={
                                                            t.printPdf
                                                        }
                                                    >
                                                        <Printer className="w-4 h-4" />
                                                        <span>
                                                            Print / PDF
                                                        </span>
                                                    </button>

                                                    <button
                                                        onClick={
                                                            handleDownloadMain
                                                        }
                                                        className="flex items-center gap-2 px-3 py-2 bg-[#e5484d]/10 border border-[#e5484d]/30 hover:bg-[#e5484d]/20 hover:border-[#e5484d]/50 text-[#d13f44] dark:text-[#f77479] text-xs font-bold rounded-lg shadow-sm transition-all ml-1"
                                                        title={
                                                            t.exportCsv
                                                        }
                                                    >
                                                        <Download className="w-3.5 h-3.5" />

                                                        <span>
                                                            Export{" "}
                                                            {exportFormat ===
                                                            "csv"
                                                                ? "CSV"
                                                                : exportFormat.toUpperCase()}
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>

                                            {exportNotification && (
                                                <div className="p-3 bg-[#ecfdf5] dark:bg-[#10b981]/10 border border-[#a7f3d0] dark:border-[#10b981]/30 rounded-lg text-[#047857] dark:text-[#6ee7b7] text-xs font-bold text-center animate-in fade-in slide-in-from-top-2 duration-300">
                                                    {
                                                        exportNotification
                                                    }
                                                </div>
                                            )}

                                            {invoiceData.hasSensitiveData && (
                                                <div className="p-4 bg-[#fffbeb] dark:bg-[#f59e0b]/10 border border-[#fde68a] dark:border-[#f59e0b]/30 rounded-xl flex items-start space-x-3 animate-in fade-in slide-in-from-top-2">
                                                    <AlertTriangle className="w-5 h-5 text-[#b45309] dark:text-[#fbbf24] shrink-0 mt-0.5" />

                                                    <div>
                                                        <h3 className="text-sm font-bold text-[#92400e] dark:text-[#fbbf24]">
                                                            {
                                                                t.sensitiveDetected
                                                            }
                                                            :{" "}
                                                            <span className="font-normal text-[#b45309] dark:text-[#fcd34d]">
                                                                {invoiceData.sensitiveDataTypes?.join(
                                                                    ", ",
                                                                )}
                                                            </span>
                                                        </h3>

                                                        <p className="text-xs text-[#b45309] dark:text-[#fbbf24]/80 mt-1">
                                                            {
                                                                t.complianceWarning
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            <InvoiceEditor
                                                data={invoiceData}
                                                onChange={
                                                    handleInvoiceChange
                                                }
                                                t={t}
                                                targetCurrency={
                                                    targetCurrency
                                                }
                                            />
                                        </div>
                                    )}
                            </div>
                        </div>
                    </main>
                </div>

                {showHomeConfirm && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                            onClick={cancelNavigateHome}
                        />

                        <div className="relative bg-white dark:bg-[#2b2d31] rounded-2xl shadow-2xl max-w-md w-full p-6 border border-[#d8d9dc] dark:border-[#3f4147] animate-in zoom-in-95 duration-200">
                            <div className="flex items-start space-x-4">
                                <div className="p-3 bg-[#fffbeb] dark:bg-[#f59e0b]/10 rounded-full shrink-0">
                                    <AlertTriangle className="w-6 h-6 text-[#b45309] dark:text-[#fbbf24]" />
                                </div>

                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-[#313338] dark:text-[#f2f3f5] mb-2">
                                        Unsaved Changes
                                    </h3>

                                    <p className="text-sm text-[#6d6f78] dark:text-[#b5bac1] leading-relaxed">
                                        You have unsaved changes.
                                        Starting a new invoice will lose
                                        your current work. Are you sure
                                        you want to continue?
                                    </p>
                                </div>
                            </div>

                            <div className="mt-8 flex items-center justify-end space-x-3">
                                <button
                                    onClick={cancelNavigateHome}
                                    className="px-4 py-2 text-sm font-semibold text-[#4e5058] dark:text-[#dbdee1] bg-[#efeff1] dark:bg-[#3f4147] hover:bg-[#d8d9dc] dark:hover:bg-[#4e5058] rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={confirmNavigateHome}
                                    className="px-4 py-2 text-sm font-semibold text-white bg-[#e5484d] hover:bg-[#d13f44] rounded-lg shadow-lg shadow-[#e5484d]/20 transition-all transform hover:-translate-y-0.5"
                                >
                                    Start New Invoice
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {showClearConfirm && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                            onClick={cancelClearAll}
                        />

                        <div className="relative bg-white dark:bg-[#2b2d31] rounded-2xl shadow-2xl max-w-md w-full p-6 border border-[#d8d9dc] dark:border-[#3f4147] animate-in zoom-in-95 duration-200">
                            <div className="flex items-start space-x-4">
                                <div className="p-3 bg-[#fff1f2] dark:bg-[#dc2626]/10 rounded-full shrink-0">
                                    <AlertTriangle className="w-6 h-6 text-[#dc2626] dark:text-[#f87171]" />
                                </div>

                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-[#313338] dark:text-[#f2f3f5] mb-2">
                                        {t.clearDataConfirmTitle}
                                    </h3>

                                    <p className="text-sm text-[#6d6f78] dark:text-[#b5bac1] leading-relaxed">
                                        {t.clearDataConfirmMessage.replace(
                                            "{count}",
                                            sessionHistory.length.toString(),
                                        )}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-8 flex items-center justify-end space-x-3">
                                <button
                                    onClick={cancelClearAll}
                                    className="px-4 py-2 text-sm font-semibold text-[#4e5058] dark:text-[#dbdee1] bg-[#efeff1] dark:bg-[#3f4147] hover:bg-[#d8d9dc] dark:hover:bg-[#4e5058] rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={confirmClearAll}
                                    className="px-4 py-2 text-sm font-semibold text-white bg-[#b91c1c] hover:bg-[#991b1b] rounded-lg shadow-lg shadow-[#b91c1c]/20 transition-all transform hover:-translate-y-0.5"
                                >
                                    Clear All Data
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {clearNotification && (
                    <div className="fixed bottom-6 right-6 z-[150] p-4 bg-[#ecfdf5] dark:bg-[#10b981]/10 border border-[#a7f3d0] dark:border-[#10b981]/30 rounded-xl shadow-2xl flex items-center space-x-3 animate-in slide-in-from-bottom-5 duration-300">
                        <div className="p-1 bg-[#d1fae5] dark:bg-[#10b981]/20 rounded-full">
                            <ShieldCheck className="w-5 h-5 text-[#047857] dark:text-[#6ee7b7]" />
                        </div>

                        <p className="text-sm font-bold text-[#065f46] dark:text-[#6ee7b7]">
                            {clearNotification}
                        </p>
                    </div>
                )}

                {duplicateWarning.show &&
                    duplicateWarning.invoice && (
                        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                            <div
                                className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
                                onClick={cancelDuplicate}
                            />

                            <div className="relative bg-white dark:bg-[#2b2d31] rounded-2xl shadow-2xl max-w-md w-full p-6 border border-[#d8d9dc] dark:border-[#3f4147] animate-in zoom-in-95 duration-200">
                                <div className="flex items-start space-x-4">
                                    <div className="p-3 bg-[#e5484d]/10 rounded-full shrink-0">
                                        <Copy className="w-6 h-6 text-[#e5484d]" />
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-[#313338] dark:text-[#f2f3f5] mb-2">
                                            Possible Duplicate Detected
                                        </h3>

                                        <p className="text-sm text-[#6d6f78] dark:text-[#b5bac1] leading-relaxed">
                                            An invoice from{" "}
                                            <span className="font-bold text-[#313338] dark:text-[#f2f3f5]">
                                                {
                                                    duplicateWarning
                                                        .invoice
                                                        .vendorName
                                                }
                                            </span>{" "}
                                            on{" "}
                                            <span className="font-mono">
                                                {
                                                    duplicateWarning
                                                        .invoice
                                                        .invoiceDate
                                                }
                                            </span>{" "}
                                            for{" "}
                                            <span className="font-bold text-[#313338] dark:text-[#f2f3f5]">
                                                {
                                                    duplicateWarning
                                                        .invoice
                                                        .currencySymbol
                                                }
                                                {duplicateWarning.invoice.totalAmount.toFixed(
                                                    2,
                                                )}
                                            </span>{" "}
                                            already exists in this
                                            session.
                                        </p>

                                        <p className="text-xs text-[#6d6f78] dark:text-[#949ba4] mt-2 italic">
                                            This might be a duplicate
                                            upload.
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-8 flex items-center justify-end space-x-3">
                                    <button
                                        onClick={cancelDuplicate}
                                        className="px-4 py-2 text-sm font-semibold text-[#4e5058] dark:text-[#dbdee1] bg-[#efeff1] dark:bg-[#3f4147] hover:bg-[#d8d9dc] dark:hover:bg-[#4e5058] rounded-lg transition-colors"
                                    >
                                        Cancel Upload
                                    </button>

                                    <button
                                        onClick={confirmDuplicate}
                                        className="px-4 py-2 text-sm font-semibold text-white bg-[#e5484d] hover:bg-[#d13f44] rounded-lg shadow-lg shadow-[#e5484d]/20 transition-all transform hover:-translate-y-0.5"
                                    >
                                        Add Anyway
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
            </div>
        </div>
    );
};

export default App;