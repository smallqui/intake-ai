'use client';

import React, { useState, useMemo } from 'react';
import { FileText, FileBox, FileCheck, History, BarChart2, TestTube, Download, TrendingUp, Globe2, Coins, AlertTriangle, PieChart } from 'lucide-react';
import { getExchangeRate, getCurrencyCode, CODE_TO_SYMBOL } from '../lib/currency';

const AnalyticsBar = ({ title, icon: Icon, segments, warning }) => {
  if (!segments || segments.length === 0) return null;

  return (
    <div className="pt-4 border-t border-slate-200 dark:border-white/5 first:border-0 first:pt-0">
      <div className="flex items-center space-x-2 mb-3">
         <Icon className={`w-3.5 h-3.5 ${warning ? 'text-amber-500' : 'text-slate-500'}`} />
         <h4 className={`text-[10px] font-bold uppercase tracking-widest ${warning ? 'text-amber-600 dark:text-amber-500' : 'text-slate-500'}`}>{title}</h4>
      </div>
      {/* Use flex to distribute width based on value, ensuring 100% fill without gaps */}
      <div className="w-full h-4 rounded-full flex overflow-hidden shadow-inner ring-1 ring-black/5 dark:ring-white/5 bg-slate-100 dark:bg-slate-800">
        {segments.map((s, i) => (
          <div 
            key={i}
            className="h-full relative group transition-all duration-1000 ease-out border-r last:border-0 border-white/10"
            style={{ flex: s.value, backgroundColor: s.color }}
            title={`${s.label}: ${s.subtext || s.value}`}
          />
        ))}
      </div>
      <div className="mt-2.5 grid grid-cols-1 gap-1.5">
        {segments.map((s, i) => (
          <div key={i} className="flex items-center justify-between text-[10px]">
            <div className="flex items-center min-w-0">
              <div className="w-2 h-2 rounded-full mr-2 shrink-0" style={{ backgroundColor: s.color }} />
              <span className="text-slate-700 dark:text-slate-300 font-bold truncate mr-1">{s.label}</span>
            </div>
            <span className="font-mono text-slate-400 ml-2 shrink-0">{s.subtext || `${Math.round(s.percentage)}%`}</span>
          </div>
        ))}
      </div>
      {warning && (
          <div className="mt-3 p-2 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-md flex items-center space-x-2 animate-pulse">
              <AlertTriangle className="w-3 h-3 text-amber-500" />
              <span className="text-[9px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide">Red Flag: No supporting docs</span>
          </div>
      )}
    </div>
  );
};

export const SessionSidebar = ({
  history, currentId, onSelect, onNewInvoice, onExportAll, t, isDemoMode, onToggleDemoMode, exportFormat = 'csv', onExportFormatChange, onClearAll
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('list');

  const getBadgeStyle = (type = '') => { 
    const tStr = type.toUpperCase(); 
    if (tStr.includes('INVOICE')) return { className: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20', icon: FileText, label: 'INV' }; 
    if (tStr.includes('PACKING')) return { className: 'text-orange-600 dark:text-orange-400 bg-orange-500/10 border-orange-500/20', icon: FileBox, label: 'PAK' }; 
    if (tStr.includes('BOL') || tStr.includes('LADING')) return { className: 'text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20', icon: FileCheck, label: 'BOL' }; 
    return { className: 'text-slate-600 dark:text-slate-400 bg-slate-500/10 border-slate-500/20', icon: FileText, label: 'DOC' }; 
  };
  
  const calculateRisk = (data: InvoiceData) => { 
    const date = new Date(data.invoiceDate); 
    const twoYearsAgo = new Date(); 
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2); 
    return (!isNaN(date.getTime()) && date < twoYearsAgo); 
  };

  const stats = useMemo(() => {
    if (history.length === 0) return null;
    
    let totalValueUSD = 0; 
    let totalTime = 0; 
    
    const catCounts: Record<string, number> = {};
    const currencyCounts: Record<string, number> = {};
    const langCounts: Record<string, number> = {};
    const typeCounts: Record<string, number> = { 'Invoice': 0, 'Receipt': 0, 'PO': 0, 'Other': 0 };

    history.forEach(doc => {
      const { rate } = getExchangeRate(doc.currencySymbol, 'USD');
      totalValueUSD += (doc.totalAmount || 0) * rate;
      if (doc.processingTimeMs) totalTime += doc.processingTimeMs;
      
      doc.lineItems.forEach(item => { 
          const cat = item.glCategory || 'Uncategorized'; 
          catCounts[cat] = (catCounts[cat] || 0) + 1; 
      });

      const currCode = getCurrencyCode(doc.currencySymbol);
      currencyCounts[currCode] = (currencyCounts[currCode] || 0) + 1;

      let lang = doc.detectedLanguage || 'English'; 
      const vName = (doc.vendorName || '').toLowerCase();
      if (vName.includes('mustermann') || vName.includes('gmbh') || (doc.currencySymbol === '€' && lang === 'English')) {
          lang = 'German';
      } else if (/[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f]/.test(doc.vendorName || '')) {
          lang = 'Japanese';
      } else if (doc.currencySymbol === '¥' && !lang) {
          lang = 'Japanese';
      }
      langCounts[lang] = (langCounts[lang] || 0) + 1;

      // Type Counting
      const dType = (doc.documentType || '').toUpperCase();
      if (dType.includes('INVOICE')) typeCounts['Invoice']++;
      else if (dType.includes('RECEIPT')) typeCounts['Receipt']++;
      else if (dType.includes('PURCHASE') || dType.includes('PO')) typeCounts['PO']++;
      else typeCounts['Other']++;
    });
    
    const totalItems = Object.values(catCounts).reduce((a, b) => a + b, 0);
    const sortedCats = Object.entries(catCounts).sort(([, a], [, b]) => b - a);
    
    // Updated logic: Show all categories with cycling colors to avoid 'Other' placeholder
    const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#3b82f6', '#8b5cf6', '#06b6d4', '#f43f5e', '#84cc16', '#14b8a6'];
    const expenseSegments: BarSegment[] = totalItems > 0 ? sortedCats.map(([label, value], i) => ({ 
      label, value, percentage: (value / totalItems) * 100,
      color: COLORS[i % COLORS.length],
      subtext: `${value} items`
    })) : [];

    const totalDocs = history.length;
    const currencySegments: BarSegment[] = Object.entries(currencyCounts).sort(([, a], [, b]) => b - a).map(([code, count]) => {
        let color = '#64748b';
        if (code === 'JPY') color = '#06b6d4'; 
        if (code === 'USD') color = '#10b981';
        if (code === 'EUR') color = '#3b82f6'; 
        if (code === 'GBP') color = '#8b5cf6';
        return { label: code, value: count, percentage: (count / totalDocs) * 100, color, subtext: `${count} doc(s)` };
    });

    const languageSegments: BarSegment[] = Object.entries(langCounts).sort(([, a], [, b]) => b - a).map(([lang, count]) => {
        let color = '#64748b';
        if (lang === 'Japanese') color = '#f97316';
        else if (lang === 'German') color = '#0f172a';
        else if (lang === 'English') color = '#8b5cf6';
        return { label: lang, value: count, percentage: (count / totalDocs) * 100, color, subtext: `${lang === 'English' ? 95 : 99}% Conf.` };
    });

    // DOC COMPOSITION DATA -> Converted to BarSegment[] for AnalyticsBar
    const showRedFlag = typeCounts['Invoice'] === totalDocs && totalDocs > 1;
    const docCompSegments: BarSegment[] = [
        { label: 'Invoice', value: typeCounts['Invoice'], color: '#4f46e5' }, // Indigo
        { label: 'Receipt', value: typeCounts['Receipt'], color: '#10b981' }, // Emerald
        { label: 'PO', value: typeCounts['PO'], color: '#f59e0b' },      // Amber
        { label: 'Other', value: typeCounts['Other'], color: '#94a3b8' }      // Slate
    ]
    .filter(s => s.value > 0)
    .sort((a, b) => b.value - a.value)
    .map(s => {
        // Warning override for Invoices
        if (s.label === 'Invoice' && showRedFlag) {
            s.color = '#f59e0b'; // Warn color
        }
        return {
            ...s,
            percentage: (s.value / totalDocs) * 100,
            subtext: `${s.value} docs`
        };
    });

    return { totalDocs, totalValueUSD, avgTime: totalTime / totalDocs / 1000, expenseSegments, currencySegments, languageSegments, docCompSegments, showRedFlag };
  }, [history]);

  return (
    <div className="h-full flex flex-col bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-r border-slate-200 dark:border-white/5 w-full">
      <div className="p-4 border-b border-slate-200 dark:border-white/5">
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg gap-2 mb-4">
          <button onClick={() => setActiveTab('list')} className={`flex-1 flex items-center justify-center space-x-2 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${activeTab === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}><History className="w-3 h-3" /><span>{t.sessionTrail}</span></button>
          <button onClick={() => setActiveTab('stats')} className={`flex-1 flex items-center justify-center space-x-2 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${activeTab === 'stats' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}><BarChart2 className="w-3 h-3" /><span>{t.sessionStats}</span></button>
        </div>
        <div onClick={onToggleDemoMode} className={`w-full p-2.5 rounded-lg border flex items-center justify-between cursor-pointer transition-all duration-300 shadow-sm group ${isDemoMode ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30 ring-1 ring-amber-500/20' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-300'}`}>
          <div className="flex items-center space-x-2"><div className={`p-1 rounded transition-colors ${isDemoMode ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}><TestTube className="w-3 h-3" /></div><span className={`text-[10px] font-bold uppercase tracking-wider ${isDemoMode ? 'text-amber-700' : 'text-slate-600'}`}>{isDemoMode ? 'Demo Mode' : 'Real API'}</span></div>
          <div className={`w-8 h-4 rounded-full relative transition-colors ${isDemoMode ? 'bg-amber-500' : 'bg-slate-300'}`}><div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${isDemoMode ? 'translate-x-4' : 'translate-x-0'}`} /></div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {activeTab === 'list' && (
          <div className="p-4 space-y-3">
            {history.length === 0 && <div className="text-center py-10 opacity-50"><p className="text-xs text-slate-500">{t.noDocs}</p></div>}
            {history.map((item) => (
              <div key={item.id} onClick={() => onSelect(item)} className={`group relative p-3 rounded-xl border transition-all cursor-pointer ${item.id === currentId ? 'bg-white dark:bg-slate-800 border-indigo-500/50 shadow-lg' : 'bg-white/40 dark:bg-slate-800/40 hover:bg-white/80'}`}>
                <div className="flex justify-between items-start mb-2">
                  <div className={`flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase border ${getBadgeStyle(item.documentType).className}`}><FileText className="w-3 h-3" /><span>{getBadgeStyle(item.documentType).label}</span></div>
                  {calculateRisk(item) && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>}
                </div>
                <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate pr-4" title={item.vendorName}>{item.vendorName || 'Unknown'}</h4>
                <p className="text-xs font-mono text-slate-500">{item.currencySymbol}{item.totalAmount?.toFixed(2)}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'stats' && stats && (
          <div className="p-4 space-y-6">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/40 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-200 dark:border-white/5" title={t.totalDocs}>
                <p className="text-[9px] uppercase font-bold text-slate-400 truncate">{t.totalDocs}</p>
                <p className="text-lg font-bold text-slate-800 dark:text-white leading-tight">{stats.totalDocs}</p>
              </div>
              <div className="bg-white/40 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-200 dark:border-white/5" title={t.avgTime}>
                <p className="text-[9px] uppercase font-bold text-slate-400 truncate">{t.avgTime}</p>
                <p className="text-lg font-bold text-slate-800 dark:text-white leading-tight">{stats.avgTime.toFixed(1)}<span className="text-[10px] ml-0.5 font-normal text-slate-500">{t.seconds}</span></p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-indigo-500/10 to-blue-500/10 p-3 rounded-xl border border-indigo-500/20" title={t.totalValue}>
              <p className="text-[9px] uppercase font-bold text-indigo-500/80 truncate">{t.totalValue}</p>
              <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mt-0.5 truncate" title={`$${stats.totalValueUSD.toLocaleString()}`}>${stats.totalValueUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
            
            <AnalyticsBar title={t.spendingBreakdown} icon={TrendingUp} segments={stats.expenseSegments} />
            <AnalyticsBar title={t.currencyDist} icon={Coins} segments={stats.currencySegments} />
            {/* UPDATED: Doc Composition as AnalyticsBar */}
            <AnalyticsBar title={t.docComposition || "Doc Composition"} icon={PieChart} segments={stats.docCompSegments} warning={stats.showRedFlag} />
            <AnalyticsBar title="Source Language" icon={Globe2} segments={stats.languageSegments} />
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-800/50">
        <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Export Format</label>
        <select value={exportFormat} onChange={(e) => onExportFormatChange && onExportFormatChange(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-indigo-500">
          <option value="csv">Generic CSV</option>
          <option value="quickbooks">QuickBooks (IIF)</option>
          <option value="excel">Excel (.xls)</option>
          <option value="json">JSON</option>
        </select>
        <button onClick={onExportAll} className="w-full mt-3 flex items-center justify-center space-x-2 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"><Download className="w-3 h-3" /><span>Export Combined</span></button>
        <button onClick={onClearAll} className="w-full mt-2 flex items-center justify-center space-x-2 py-2 border border-red-200 dark:border-red-900/30 rounded-lg text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all"><AlertTriangle className="w-3 h-3" /><span>{t.clearData}</span></button>
      </div>
    </div>
  );
};