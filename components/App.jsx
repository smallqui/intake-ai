'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { FileUpload } from './FileUpload';
import { InvoiceEditor } from './InvoiceEditor';
import { SessionSidebar } from './SessionSidebar';
import { Navbar } from './Navbar';
import { extractInvoiceData } from '../lib/extractClient';
import {
  Loader2, Download, Wand2, ShieldCheck, AlertCircle, Clock, RefreshCw,
  FileText, Globe2, Plane, Layers, AlertTriangle, Copy, Printer, Table,
} from 'lucide-react';
import { translations } from '../lib/translations';
import { EXAMPLES } from '../lib/exampleData';

const App = () => {
  const [files, setFiles] = useState([]);
  const [invoiceData, setInvoiceData] = useState(null);
  const [sessionHistory, setSessionHistory] = useState([]);
  const [processingState, setProcessingState] = useState({ status: 'idle' });

  // I18N: Interface language (static translations, no AI involved)
  const [interfaceLanguage, setInterfaceLanguage] = useState('English');

  const [targetCurrency, setTargetCurrency] = useState('Original');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [retryCountdown, setRetryCountdown] = useState(0);
  const [showMobileHistory, setShowMobileHistory] = useState(false);
  const [exportNotification, setExportNotification] = useState(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [showHomeConfirm, setShowHomeConfirm] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [exportFormat, setExportFormat] = useState('csv');

  const [duplicateWarning, setDuplicateWarning] = useState({ show: false, invoice: null });
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [clearNotification, setClearNotification] = useState(null);

  const t = translations[interfaceLanguage] || translations['English'];

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const currentView = invoiceData ? 'editor' : (processingState.status === 'processing' || processingState.status === 'quota_cooldown') ? 'processing' : 'home';

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  useEffect(() => {
    if (sessionHistory.length > 0 && sessionStartTime === null) {
      setSessionStartTime(Date.now());
    } else if (sessionHistory.length === 0) {
      setSessionStartTime(null);
    }
  }, [sessionHistory, sessionStartTime]);

  const handleFileSelect = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    setProcessingState({ status: 'idle' });
    setRetryCountdown(0);
  };

  const handleClearFile = () => {
    setFiles([]);
    setProcessingState({ status: 'idle' });
    setRetryCountdown(0);
  };

  const handleError = (message, code) => {
    setProcessingState({ status: 'error', message, errorCode: code });
  };

  const handleLoadExample = async (key) => {
    const dummyFile = new File(['dummy_content'], `${key}_example.jpg`, { type: 'image/jpeg' });
    setFiles([dummyFile]);
    setProcessingState({ status: 'processing', message: t.analyzing });
    await new Promise((r) => setTimeout(r, 1200));
    setProcessingState((prev) => ({ ...prev, message: t.sanitizing }));
    await new Promise((r) => setTimeout(r, 1200));

    const data = EXAMPLES[key];
    if (data) {
      const dataWithId = {
        ...data,
        id: crypto.randomUUID(),
        language: data.language || 'Original',
        originalLineItems: data.lineItems,
      };
      setInvoiceData(dataWithId);
      setSessionHistory((prev) => [dataWithId, ...prev]);
      setProcessingState({ status: 'complete' });
      setFiles([]);
    }
  };

  const handleTransform = async () => {
    if (files.length === 0) return;

    setProcessingState({ status: 'processing', message: t.processing });

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const startTime = Date.now();

      if (files.length > 1) {
        setProcessingState((prev) => ({
          ...prev,
          message: t.processingBatch.replace('{current}', (i + 1).toString()).replace('{total}', files.length.toString()).replace('{filename}', file.name),
        }));
      } else {
        setTimeout(() => {
          if (processingState.status !== 'error') setProcessingState((prev) => ({ ...prev, message: t.analyzing }));
        }, 1500);
        setTimeout(() => {
          if (processingState.status !== 'error') setProcessingState((prev) => ({ ...prev, message: t.sanitizing }));
        }, 3500);
      }

      try {
        const data = await extractInvoiceData(file, isDemoMode);
        const endTime = Date.now();
        const processingTimeMs = endTime - startTime;

        const dataWithId = {
          ...data,
          id: crypto.randomUUID(),
          language: 'Original',
          originalLineItems: data.lineItems,
          processingTimeMs,
          isDemo: isDemoMode,
        };

        const isDuplicateInHistory = sessionHistory.some((inv) => {
          const vendorMatch = inv.vendorName.toLowerCase().trim() === dataWithId.vendorName.toLowerCase().trim();
          const dateMatch = inv.invoiceDate === dataWithId.invoiceDate;
          const amountMatch = Math.abs(inv.totalAmount - dataWithId.totalAmount) < 0.01;
          return vendorMatch && dateMatch && amountMatch;
        });

        if (isDuplicateInHistory) {
          setDuplicateWarning({ show: true, invoice: dataWithId });
          setProcessingState({ status: 'complete' });
          continue;
        }

        setSessionHistory((prev) => [dataWithId, ...prev]);

        if (i === files.length - 1) {
          setInvoiceData(dataWithId);
        }

        if (i < files.length - 1) {
          await new Promise((r) => setTimeout(r, 2000));
        }
      } catch (error: any) {
        const code = error.code || 'GENERIC';
        let message = t.uploadError;

        if (code === 'QUOTA_EXCEEDED') {
          message = t.quotaError;
          setRetryCountdown(60);
          setProcessingState({ status: 'quota_cooldown', message, errorCode: code, retryIn: 60 });
          return;
        } else if (code === 'READ_ERROR') message = t.readError;
        else if (code === 'INVALID_FILE') message = t.fileTypeError;

        setProcessingState({ status: 'error', message, errorCode: code });
        return;
      }
    }

    setProcessingState({ status: 'complete' });
    setRetryCountdown(0);
    setFiles([]);
  };

  const confirmDuplicate = () => {
    if (duplicateWarning.invoice) {
      const inv = duplicateWarning.invoice;
      setSessionHistory((prev) => [inv, ...prev]);
      setInvoiceData(inv);
      setDuplicateWarning({ show: false, invoice: null });
      setFiles([]);
    }
  };

  const cancelDuplicate = () => {
    setDuplicateWarning({ show: false, invoice: null });
  };

  const handleClearAllRequest = () => setShowClearConfirm(true);

  const confirmClearAll = () => {
    setFiles([]);
    setInvoiceData(null);
    setSessionHistory([]);
    setProcessingState({ status: 'idle' });
    setShowClearConfirm(false);
    setClearNotification(t.dataClearedSuccess);
    setTimeout(() => setClearNotification(null), 3000);
  };

  const cancelClearAll = () => setShowClearConfirm(false);

  useEffect(() => {
    if (processingState.status === 'quota_cooldown' && retryCountdown > 0) {
      const timer = setTimeout(() => setRetryCountdown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (processingState.status === 'quota_cooldown' && retryCountdown === 0) {
      handleTransform();
    }
  }, [processingState.status, retryCountdown]);

  const handleInvoiceChange = (newData) => {
    newData.originalLineItems = newData.lineItems;
    setInvoiceData(newData);
    setSessionHistory((prev) => prev.map((item) => (item.id === newData.id ? newData : item)));
  };

  const handleHistorySelect = (data) => {
    setInvoiceData(data);
    setProcessingState({ status: 'complete' });
    setShowMobileHistory(false);
  };

  const handleNavigateHome = () => {
    if (invoiceData) {
      setShowHomeConfirm(true);
    } else {
      setFiles([]);
      setInvoiceData(null);
      setProcessingState({ status: 'idle' });
    }
  };

  const confirmNavigateHome = () => {
    setFiles([]);
    setInvoiceData(null);
    setProcessingState({ status: 'idle' });
    setShowHomeConfirm(false);
  };

  const cancelNavigateHome = () => setShowHomeConfirm(false);

  const handleNewInvoice = useCallback(() => {
    if (invoiceData) {
      if (!window.confirm(t.unsavedChanges)) return;
    }
    setFiles([]);
    setInvoiceData(null);
    setProcessingState({ status: 'idle' });
    setShowMobileHistory(false);
  }, [invoiceData, t.unsavedChanges]);

  const handleInterfaceLanguageChange = (e) => {
    setInterfaceLanguage(e.target.value);
  };

  const handleCurrencyChange = (e) => {
    setTargetCurrency(e.target.value);
  };

  const handleCopyToClipboard = useCallback(async () => {
    if (!invoiceData) return;
    const headers = [t.sku, t.description, t.glCategory, t.qty, t.unitPrice, t.lineTotal];
    const rows = invoiceData.lineItems.map((item) => [
      item.sku,
      item.description,
      item.glCategory,
      item.quantity,
      item.unitPrice,
      (item.totalAmount || 0).toFixed(2),
    ]);
    const tsvContent = [headers.join('\t'), ...rows.map((row) => row.join('\t'))].join('\n');

    try {
      await navigator.clipboard.writeText(tsvContent);
      setExportNotification(t.copied);
      setTimeout(() => setExportNotification(null), 3000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  }, [invoiceData, t]);

  const generateCSV = (data, format) => {
    if (format === 'csv') {
      const headers = [t.csvDocumentType, t.csvVendor, t.csvDate, t.csvTotalAmount, t.csvCurrency, t.csvSku, t.csvDescription, t.csvGlCategory, t.csvQuantity, t.csvUnitPrice, t.csvLineTotal];
      const allRows = data.flatMap((doc) =>
        doc.lineItems.map((item) => [
          `"${(doc.documentType || 'Unknown').replace(/"/g, '""')}"`,
          `"${doc.vendorName.replace(/"/g, '""')}"`,
          doc.invoiceDate,
          doc.totalAmount,
          doc.currencySymbol || '$',
          `"${(item.sku || '').replace(/"/g, '""')}"`,
          `"${item.description.replace(/"/g, '""')}"`,
          `"${(item.glCategory || '').replace(/"/g, '""')}"`,
          item.quantity,
          item.unitPrice,
          (item.totalAmount || 0).toFixed(2),
        ])
      );
      return [headers.join(','), ...allRows.map((row) => row.join(','))].join('\n');
    }
    if (format === 'quickbooks') {
      const headers = ['Customer', 'InvoiceDate', 'Item', 'Quantity', 'Rate', 'Amount'];
      const allRows = data.flatMap((doc) =>
        doc.lineItems.map((item) => {
          const d = new Date(doc.invoiceDate);
          const qbDate = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
          return [
            `"${doc.vendorName.replace(/"/g, '""')}"`,
            qbDate,
            `"${item.description.replace(/"/g, '""')}"`,
            item.quantity,
            item.unitPrice,
            (item.totalAmount || 0).toFixed(2),
          ];
        })
      );
      return [headers.join(','), ...allRows.map((row) => row.join(','))].join('\n');
    }
    return generateCSV(data, 'csv');
  };

  const handleDownloadCSV = useCallback(() => {
    if (!invoiceData) return;
    const csvContent = generateCSV([invoiceData], exportFormat);
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `transformed_${exportFormat}_${(invoiceData.documentType || 'doc').toLowerCase().replace(/\s/g, '_')}_${invoiceData.vendorName || 'export'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setExportNotification(`✓ ${t.batchComplete} (${invoiceData.lineItems.length} items)`);
    setTimeout(() => setExportNotification(null), 3000);
  }, [invoiceData, t, exportFormat]);

  const handleDownloadMain = () => {
    if (exportFormat === 'json') { handleDownloadJSON(); return; }
    if (exportFormat === 'excel') { handleDownloadExcel(); return; }
    handleDownloadCSV();
  };

  const handleDownloadExcel = useCallback(() => {
    if (!invoiceData) return;
    const headers = [t.csvDocumentType, t.csvVendor, t.csvDate, t.csvTotalAmount, t.csvCurrency, t.csvSku, t.csvDescription, t.csvGlCategory, t.csvQuantity, t.csvUnitPrice, t.csvLineTotal];
    let tableHtml = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body><table><thead><tr>';
    headers.forEach((h) => (tableHtml += `<th>${h}</th>`));
    tableHtml += '</tr></thead><tbody>';
    invoiceData.lineItems.forEach((item) => {
      tableHtml += '<tr>';
      tableHtml += `<td>${invoiceData.documentType || ''}</td>`;
      tableHtml += `<td>${invoiceData.vendorName}</td>`;
      tableHtml += `<td>${invoiceData.invoiceDate}</td>`;
      tableHtml += `<td>${invoiceData.totalAmount}</td>`;
      tableHtml += `<td>${invoiceData.currencySymbol}</td>`;
      tableHtml += `<td>${item.sku || ''}</td>`;
      tableHtml += `<td>${item.description}</td>`;
      tableHtml += `<td>${item.glCategory}</td>`;
      tableHtml += `<td>${item.quantity}</td>`;
      tableHtml += `<td>${item.unitPrice}</td>`;
      tableHtml += `<td>${item.totalAmount}</td>`;
      tableHtml += '</tr>';
    });
    tableHtml += '</tbody></table></body></html>';
    const blob = new Blob([tableHtml], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `transformed_${(invoiceData.documentType || 'doc').toLowerCase().replace(/\s/g, '_')}_${invoiceData.vendorName || 'export'}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setExportNotification(`✓ Exported to Excel`);
    setTimeout(() => setExportNotification(null), 3000);
  }, [invoiceData, t]);

  const handleDownloadJSON = () => {
    if (!invoiceData) return;
    const jsonContent = JSON.stringify(invoiceData, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `transformed_${invoiceData.vendorName}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportAll = () => {
    if (sessionHistory.length === 0) return;
    const csvContent = generateCSV(sessionHistory, exportFormat);
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `combined_transformed_${exportFormat}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div dir={interfaceLanguage === 'Arabic' ? 'rtl' : 'ltr'} className="h-screen overflow-hidden transition-colors duration-500 bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#0f172a] text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30">

        <Navbar
          t={t} isDarkMode={isDarkMode} toggleTheme={toggleTheme} currentView={currentView}
          vendorName={invoiceData?.vendorName} totalAmount={invoiceData?.totalAmount} currencySymbol={invoiceData?.currencySymbol}
          onNavigateHome={handleNavigateHome} onNewInvoice={handleNewInvoice} onToggleHistory={() => setShowMobileHistory(!showMobileHistory)}
          targetCurrency={targetCurrency} onCurrencyChange={handleCurrencyChange}
          interfaceLanguage={interfaceLanguage} onInterfaceLanguageChange={handleInterfaceLanguageChange}
        />

        {isDemoMode && (
          <div className="bg-amber-500 text-white text-xs font-bold uppercase tracking-widest text-center py-1.5 shadow-md sticky top-16 z-40 animate-in slide-in-from-top duration-300 flex items-center justify-center space-x-2">
            <AlertTriangle className="w-3.5 h-3.5 text-white" /><span>⚠️ DEMO MODE ACTIVE - Using sample data (No API usage)</span>
          </div>
        )}

        <div className="flex flex-1 overflow-hidden relative">
          <aside className="hidden lg:block w-[250px] shrink-0 h-full overflow-hidden border-r border-slate-200 dark:border-white/5 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
            <SessionSidebar
              history={sessionHistory} currentId={invoiceData?.id} onSelect={handleHistorySelect}
              onNewInvoice={handleNewInvoice} onExportAll={handleExportAll} onClearAll={handleClearAllRequest}
              t={t} isDemoMode={isDemoMode} onToggleDemoMode={() => setIsDemoMode(!isDemoMode)}
              onToggleHistory={() => {}} exportFormat={exportFormat} onExportFormatChange={setExportFormat}
            />
          </aside>

          {showMobileHistory && (
            <div className="absolute inset-0 z-40 lg:hidden flex">
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowMobileHistory(false)} />
              <aside className="relative w-[80%] max-w-[300px] h-full bg-white dark:bg-slate-900 shadow-2xl animate-in slide-in-from-left duration-300">
                <SessionSidebar
                  history={sessionHistory} currentId={invoiceData?.id} onSelect={handleHistorySelect}
                  onNewInvoice={handleNewInvoice} onExportAll={handleExportAll} onClearAll={handleClearAllRequest}
                  t={t} isDemoMode={isDemoMode} onToggleDemoMode={() => setIsDemoMode(!isDemoMode)}
                  onToggleHistory={() => setShowMobileHistory(false)} exportFormat={exportFormat} onExportFormatChange={setExportFormat}
                />
              </aside>
            </div>
          )}

          <main className="flex-1 w-full overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="max-w-[1600px] mx-auto space-y-8 pb-10">
              {currentView === 'home' && (
                <div className="text-center space-y-8 mb-12 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="space-y-4">
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">{t.heroTitle} <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-400 dark:to-blue-400">{t.financialData}</span></h2>
                    <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">{t.heroSubtitle}</p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-4 animate-in fade-in zoom-in duration-500 delay-200">
                    <span className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mr-2">{t.tryExample}</span>
                    <button onClick={() => handleLoadExample('receipt')} className="px-4 py-2 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 rounded-lg shadow-sm flex items-center space-x-2 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-all hover:-translate-y-0.5 hover:shadow-md"><FileText className="w-4 h-4 text-emerald-500" /><span>{t.exampleReceipt}</span></button>
                    <button onClick={() => handleLoadExample('multilang')} className="px-4 py-2 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 rounded-lg shadow-sm flex items-center space-x-2 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-all hover:-translate-y-0.5 hover:shadow-md"><Globe2 className="w-4 h-4 text-indigo-500" /><span>{t.exampleMultilang}</span></button>
                    <button onClick={() => handleLoadExample('multicurrency')} className="px-4 py-2 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 rounded-lg shadow-sm flex items-center space-x-2 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-all hover:-translate-y-0.5 hover:shadow-md"><Plane className="w-4 h-4 text-orange-500" /><span>{t.exampleCurrency}</span></button>
                  </div>
                </div>
              )}

              <div className={`transition-all duration-700 ease-in-out ${currentView === 'editor' ? 'grid grid-cols-1 lg:grid-cols-5 gap-8' : 'max-w-3xl mx-auto'}`}>
                <div className={`space-y-6 ${currentView === 'editor' ? 'lg:col-span-1' : 'w-full'}`}>
                  <FileUpload onFileSelect={handleFileSelect} selectedFiles={files} onClearFile={handleClearFile} disabled={processingState.status === 'processing' || processingState.status === 'quota_cooldown'} onError={handleError} t={t} />
                  {processingState.status === 'error' && (<div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl space-y-3 animate-in fade-in slide-in-from-top-2"><div className="flex items-start space-x-3 text-red-600 dark:text-red-400"><AlertCircle className="w-5 h-5 shrink-0 mt-0.5" /><p className="text-sm font-medium">{processingState.message}</p></div><button onClick={handleTransform} className="w-full py-2 text-xs font-bold uppercase tracking-wide bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-500/30 transition-colors flex items-center justify-center space-x-2"><RefreshCw className="w-3.5 h-3.5" /><span>{t.tryAgain}</span></button></div>)}
                  {processingState.status === 'quota_cooldown' && (<div className="p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl space-y-2 animate-in fade-in slide-in-from-top-2"><div className="flex items-start space-x-3 text-amber-600 dark:text-amber-400"><Clock className="w-5 h-5 shrink-0 mt-0.5" /><div className="flex-1"><p className="text-sm font-bold">{processingState.message}</p><p className="text-xs mt-1 opacity-80">{t.quotaCooldown} <span className="font-mono font-bold">{retryCountdown}s</span>...</p></div></div><div className="w-full bg-amber-200 dark:bg-amber-500/20 rounded-full h-1.5 overflow-hidden"><div className="bg-amber-500 h-full transition-all duration-1000 ease-linear" style={{ width: `${(retryCountdown / 60) * 100}%` }}></div></div></div>)}
                  {files.length > 0 && (!invoiceData || processingState.status === 'idle') && processingState.status !== 'processing' && processingState.status !== 'quota_cooldown' && (<button onClick={handleTransform} className="w-full py-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-xl font-bold tracking-wide shadow-lg shadow-indigo-500/25 flex items-center justify-center space-x-2 transition-all transform hover:scale-[1.02] active:scale-[0.98] ring-1 ring-white/10">{files.length > 1 ? <Layers className="w-5 h-5" /> : <Wand2 className="w-5 h-5" />}<span>{files.length > 1 ? t.sanitizeBatch.replace('{count}', files.length.toString()) : t.sanitizeAction}</span></button>)}
                  {processingState.status === 'processing' && (<div className="text-center py-10 space-y-4 bg-white/50 dark:bg-slate-800/20 rounded-xl border border-slate-200 dark:border-white/5 backdrop-blur-sm"><div className="relative"><div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 animate-pulse rounded-full"></div><Loader2 className="w-10 h-10 text-indigo-600 dark:text-indigo-400 animate-spin mx-auto relative z-10" /></div><p className="text-sm font-medium text-indigo-600 dark:text-indigo-300 animate-pulse tracking-wide transition-all duration-300">{processingState.message}</p></div>)}
                  {currentView === 'editor' && invoiceData && (<div className="bg-white/60 dark:bg-slate-800/40 backdrop-blur-sm p-4 rounded-xl border border-slate-200 dark:border-white/5 text-sm text-slate-500 dark:text-slate-400 shadow-xl dark:shadow-lg transition-colors duration-500"><p className="font-bold text-slate-800 dark:text-slate-300 mb-3 uppercase tracking-wider text-[10px]">{t.activeDoc}</p><div className="flex items-center space-x-3 mb-4"><div className="p-2 bg-slate-100 dark:bg-slate-700/50 rounded-lg shrink-0"><ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /></div><div className="overflow-hidden min-w-0"><p className="truncate font-medium text-slate-800 dark:text-slate-200 text-xs">{invoiceData.vendorName}</p><p className="text-[10px] mt-0.5 text-slate-500">{invoiceData.documentType}</p></div></div></div>)}
                </div>

                {currentView === 'editor' && invoiceData && (
                  <div className="lg:col-span-4 space-y-6 min-w-0 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-wide flex items-center"><span className="w-2 h-6 bg-indigo-500 rounded-full mr-3"></span>{t.extractedData}</h2>
                      <div className="flex items-center gap-2">
                        <button onClick={handleCopyToClipboard} className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-lg shadow-sm transition-all" title={t.copyToClipboard}><Copy className="w-4 h-4" /><span>Copy Data</span></button>
                        <button onClick={handleDownloadExcel} className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-lg shadow-sm transition-all" title="Save as Excel"><Table className="w-4 h-4" /><span>Save Excel</span></button>
                        <button onClick={() => window.print()} className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-lg shadow-sm transition-all" title={t.printPdf}><Printer className="w-4 h-4" /><span>Print / PDF</span></button>
                        <button onClick={handleDownloadMain} className="flex items-center gap-2 px-3 py-2 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/30 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded-lg shadow-sm transition-all ml-1" title={t.exportCsv}><Download className="w-3.5 h-3.5" /><span>Export {exportFormat === 'csv' ? 'CSV' : exportFormat.toUpperCase()}</span></button>
                      </div>
                    </div>
                    {exportNotification && (<div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-lg text-emerald-700 dark:text-emerald-400 text-xs font-bold text-center animate-in fade-in slide-in-from-top-2 duration-300">{exportNotification}</div>)}
                    {invoiceData.hasSensitiveData && (<div className="p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-xl flex items-start space-x-3 animate-in fade-in slide-in-from-top-2"><AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" /><div><h3 className="text-sm font-bold text-amber-800 dark:text-amber-400">{t.sensitiveDetected}: <span className="font-normal text-amber-700 dark:text-amber-300">{invoiceData.sensitiveDataTypes?.join(', ')}</span></h3><p className="text-xs text-amber-600 dark:text-amber-500/80 mt-1">{t.complianceWarning}</p></div></div>)}
                    <InvoiceEditor data={invoiceData} onChange={handleInvoiceChange} t={t} targetCurrency={targetCurrency} />
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>

        {showHomeConfirm && (<div className="fixed inset-0 z-[100] flex items-center justify-center p-4"><div className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm transition-opacity" onClick={cancelNavigateHome} /><div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-700 animate-in zoom-in-95 duration-200"><div className="flex items-start space-x-4"><div className="p-3 bg-amber-100 dark:bg-amber-500/10 rounded-full shrink-0"><AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-500" /></div><div className="flex-1"><h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Unsaved Changes</h3><p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">You have unsaved changes. Starting a new invoice will lose your current work. Are you sure you want to continue?</p></div></div><div className="mt-8 flex items-center justify-end space-x-3"><button onClick={cancelNavigateHome} className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors">Cancel</button><button onClick={confirmNavigateHome} className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-500 rounded-lg shadow-lg shadow-red-500/20 transition-all transform hover:-translate-y-0.5">Start New Invoice</button></div></div></div>)}
        {showClearConfirm && (<div className="fixed inset-0 z-[100] flex items-center justify-center p-4"><div className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm transition-opacity" onClick={cancelClearAll} /><div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-700 animate-in zoom-in-95 duration-200"><div className="flex items-start space-x-4"><div className="p-3 bg-red-100 dark:bg-red-500/10 rounded-full shrink-0"><AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-500" /></div><div className="flex-1"><h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{t.clearDataConfirmTitle}</h3><p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{t.clearDataConfirmMessage.replace('{count}', sessionHistory.length.toString())}</p></div></div><div className="mt-8 flex items-center justify-end space-x-3"><button onClick={cancelClearAll} className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors">Cancel</button><button onClick={confirmClearAll} className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-500 rounded-lg shadow-lg shadow-red-500/20 transition-all transform hover:-translate-y-0.5">Clear All Data</button></div></div></div>)}
        {clearNotification && (<div className="fixed bottom-6 right-6 z-[150] p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl shadow-2xl flex items-center space-x-3 animate-in slide-in-from-bottom-5 duration-300"><div className="p-1 bg-emerald-100 dark:bg-emerald-500/20 rounded-full"><ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /></div><p className="text-sm font-bold text-emerald-800 dark:text-emerald-400">{clearNotification}</p></div>)}
        {duplicateWarning.show && duplicateWarning.invoice && (<div className="fixed inset-0 z-[200] flex items-center justify-center p-4"><div className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm transition-opacity" onClick={cancelDuplicate} /><div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-700 animate-in zoom-in-95 duration-200"><div className="flex items-start space-x-4"><div className="p-3 bg-indigo-100 dark:bg-indigo-500/10 rounded-full shrink-0"><Copy className="w-6 h-6 text-indigo-600 dark:text-indigo-400" /></div><div className="flex-1"><h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Possible Duplicate Detected</h3><p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">An invoice from <span className="font-bold text-slate-900 dark:text-white">{duplicateWarning.invoice.vendorName}</span> {' '}on <span className="font-mono">{duplicateWarning.invoice.invoiceDate}</span> {' '}for <span className="font-bold text-slate-900 dark:text-white">{duplicateWarning.invoice.currencySymbol}{duplicateWarning.invoice.totalAmount.toFixed(2)}</span> {' '}already exists in this session.</p><p className="text-xs text-slate-500 mt-2 italic">This might be a duplicate upload.</p></div></div><div className="mt-8 flex items-center justify-end space-x-3"><button onClick={cancelDuplicate} className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors">Cancel Upload</button><button onClick={confirmDuplicate} className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-lg shadow-indigo-500/20 transition-all transform hover:-translate-y-0.5">Add Anyway</button></div></div></div>)}
      </div>
    </div>
  );
};

export default App;
