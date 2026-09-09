'use client';

import React, { useRef, useEffect } from 'react';
import { Plus, Trash2, Calendar, Building, Tag, AlertTriangle, FileCheck, FileBox, FileText, History, ShieldAlert, CheckCircle, AlertCircle, Calculator, Languages, TrendingUp } from 'lucide-react';
import { getExchangeRate, CODE_TO_SYMBOL } from '../lib/currency';

const AutoResizeTextarea = ({ value, onChange, className, placeholder, isRisk, tabIndex, title }) => {
  const textareaRef = useRef(null);
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);
  return <textarea ref={textareaRef} value={value} onChange={onChange} rows={1} placeholder={placeholder} className={`${className} ${isRisk ? 'pr-20' : ''}`} title={title || value} tabIndex={tabIndex} />;
};

export const InvoiceEditor = ({ data, onChange, t, targetCurrency = 'Original' }) => {
  const handleHeaderChange = (field, value) => onChange({ ...data, [field]: value });
  const handleLineItemChange = (index, field, value) => {
    const newItems = [...data.lineItems];
    newItems[index] = { ...newItems[index], [field]: value };
    onChange({ ...data, lineItems: newItems });
  };
  const removeLineItem = (index) => onChange({ ...data, lineItems: data.lineItems.filter((_, i) => i !== index) });
  const addLineItem = () => onChange({ ...data, lineItems: [...data.lineItems, { sku: '', description: '', glCategory: '', quantity: 1, unitPrice: 0, totalAmount: 0 }] });
  const recalculateRow = (index) => {
    const newItems = [...data.lineItems];
    newItems[index] = { ...newItems[index], totalAmount: parseFloat((newItems[index].quantity * newItems[index].unitPrice).toFixed(2)) };
    onChange({ ...data, lineItems: newItems });
  };
  const recalculateTotals = () => {
     const newItems = data.lineItems.map(item => ({ ...item, totalAmount: parseFloat((item.quantity * item.unitPrice).toFixed(2)) }));
     onChange({ ...data, lineItems: newItems });
  };

  const getBadgeStyle = (type = '') => {
    const tStr = type.toUpperCase();
    if (tStr.includes('INVOICE')) return { className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_-3px_rgba(16,185,129,0.2)]', icon: FileText };
    if (tStr.includes('PACKING')) return { className: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20 shadow-[0_0_15px_-3px_rgba(249,115,22,0.2)]', icon: FileBox };
    if (tStr.includes('BOL')) return { className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 shadow-[0_0_15px_-3px_rgba(59,130,246,0.2)]', icon: FileCheck };
    return { className: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20', icon: FileText };
  };

  const isStaleDate = (dateStr) => {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
    return !isNaN(date.getTime()) && date < twoYearsAgo;
  };
  const isHighRiskItem = (category, price) => {
    const cat = (category || '').toLowerCase();
    return (cat.includes('meal') || cat.includes('office')) && price > 100;
  };

  const currencySymbol = data.currencySymbol || '$';
  const showConversion = targetCurrency !== 'Original';
  const { rate, sourceCode } = getExchangeRate(currencySymbol, targetCurrency);
  const isActuallyDifferent = showConversion && (rate !== 1 || sourceCode !== targetCurrency);
  let displayTotalAmount = data.totalAmount;
  let displayCurrencySymbol = data.currencySymbol;
  let isReadOnlyHeader = false;
  if (isActuallyDifferent) {
    displayTotalAmount = parseFloat((data.totalAmount * rate).toFixed(2));
    displayCurrencySymbol = CODE_TO_SYMBOL[targetCurrency] || targetCurrency;
    isReadOnlyHeader = true;
  }

  const badgeStyle = getBadgeStyle(data.documentType);
  const BadgeIcon = badgeStyle.icon;
  const isHighConfidence = data.confidenceScore === 'High';
  const hasMathMismatch = data.lineItems.some(i => Math.abs((i.quantity * i.unitPrice) - (i.totalAmount || 0)) > 0.01);

  // ROI Calculation Logic
  const timeSaved = Math.ceil(data.lineItems.length * 0.5 + 1);
  const moneySaved = (timeSaved * 0.8).toFixed(2);

  return (
    <div className="space-y-6 animate-in fade-in duration-700 slide-in-from-bottom-8">
      <div className="bg-white/60 dark:bg-slate-800/40 backdrop-blur-sm p-4 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm transition-colors duration-500">
        {/* HEADER BADGES */}
        <div className="flex flex-col gap-4 mb-4 border-b border-slate-200 dark:border-white/5 pb-4">
            <div className="flex flex-wrap gap-2 items-center">
                <div className={`px-3 py-1.5 rounded-lg border flex items-center space-x-2 w-fit ${badgeStyle.className}`}>
                    <BadgeIcon className="w-4 h-4" />
                    <span className="text-xs font-bold tracking-widest uppercase">{t.documentType}: {data.documentType || 'UNKNOWN'}</span>
                </div>
                <div className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border flex items-center space-x-1.5 ${isHighConfidence ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30' : 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30'}`} title={isHighConfidence ? "High confidence" : "Review recommended"}>
                  {isHighConfidence ? <CheckCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                  <span>{isHighConfidence ? t.confidenceHigh : t.confidenceReview}</span>
                </div>
                {/* ROI BADGE (MANUAL FIX) */}
                <div className="px-3 py-1.5 rounded-lg border flex items-center space-x-2 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border-indigo-500/20 text-indigo-600 dark:text-indigo-300 shadow-sm" title="Estimated savings vs. manual data entry ($48/hr)">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-xs font-bold tracking-widest uppercase">
                    ⏱️ {timeSaved}m / 💰 ${moneySaved} Saved
                  </span>
                </div>
            </div>
            <div className="flex flex-wrap gap-2">
                {data.validationFlags?.unsupportedCurrency && (
                  <div className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 flex items-center space-x-1.5" title="Exchange rates not available for this currency">
                    <AlertCircle className="w-3 h-3" />
                    <span>UNKNOWN CURRENCY</span>
                  </div>
                )}
                {data.validationFlags?.unsupportedLanguage && (
                  <div className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center space-x-1.5" title="UI translation not supported">
                    <Languages className="w-3 h-3" />
                    <span>UNSUPPORTED LANG</span>
                  </div>
                )}
            </div>
        </div>

        {/* Input Fields Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <div className="flex justify-between items-center"><label className="flex items-center text-[9px] font-bold text-slate-500 uppercase tracking-widest"><Building className="w-3 h-3 mr-1.5 opacity-70" />{t.vendorName}</label></div>
            <input type="text" value={data.vendorName} onChange={(e) => handleHeaderChange('vendorName', e.target.value)} title={data.vendorName} className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-800 dark:text-slate-100 font-bold focus:outline-none focus:border-indigo-500 transition-all placeholder-slate-400" />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="flex items-center text-[9px] font-bold text-slate-500 uppercase tracking-widest"><Calendar className="w-3 h-3 mr-1.5 opacity-70" />{t.invoiceDate}</label>
              {isStaleDate(data.invoiceDate) && <div className="flex items-center space-x-1 bg-amber-500/10 px-1.5 py-0.5 rounded text-[8px] font-bold text-amber-600 dark:text-amber-500" title={t.staleDataWarning}><History className="w-2.5 h-2.5" /><span>{t.staleTag}</span></div>}
            </div>
            <input type="date" value={data.invoiceDate} onChange={(e) => handleHeaderChange('invoiceDate', e.target.value)} title={data.invoiceDate} className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-800 dark:text-slate-100 font-medium focus:outline-none focus:border-indigo-500 transition-all" />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between items-center"><label className="flex items-center text-[9px] font-bold text-slate-500 uppercase tracking-widest"><Tag className="w-3 h-3 mr-1.5 opacity-70" />{t.currency}</label></div>
            <input type="text" value={displayCurrencySymbol} onChange={(e) => !isReadOnlyHeader && handleHeaderChange('currencySymbol', e.target.value)} title={displayCurrencySymbol} className={`w-full bg-slate-50 dark:bg-slate-900/50 border rounded-lg px-2 py-1.5 text-xs text-slate-800 dark:text-slate-100 font-medium focus:outline-none transition-all ${isReadOnlyHeader ? 'border-transparent cursor-default' : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500'}`} maxLength={3} readOnly={isReadOnlyHeader} />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between items-center"><label className="flex items-center text-[9px] font-bold text-slate-500 uppercase tracking-widest"><span className="mr-1.5 opacity-70 font-bold">{displayCurrencySymbol}</span>{t.totalAmount}</label></div>
            <input type="number" step="0.01" value={displayTotalAmount} onChange={(e) => !isReadOnlyHeader && handleHeaderChange('totalAmount', parseFloat(e.target.value) || 0)} title={displayTotalAmount.toString()} className={`w-full bg-slate-50 dark:bg-slate-900/50 border rounded-lg px-2 py-1.5 text-xs text-slate-800 dark:text-slate-100 font-bold focus:outline-none transition-all ${isReadOnlyHeader ? 'border-transparent cursor-default' : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500'}`} readOnly={isReadOnlyHeader} />
          </div>
        </div>
         {data.language && data.language !== 'Original' && (
            <div className="mt-2 text-[9px] text-slate-400 font-mono flex items-center">
                <Languages className="w-3 h-3 mr-1.5 opacity-50" />
                DETECTED LANGUAGE: <span className="text-indigo-500 ml-1 font-bold uppercase">{data.language}</span>
            </div>
        )}
      </div>

      {/* MOBILE CARD VIEW */}
      <div className="md:hidden space-y-4">
        {data.lineItems.map((item, index) => {
            const calculatedTotal = item.quantity * item.unitPrice;
            const extractedTotal = item.totalAmount || 0;
            const hasVariance = Math.abs(calculatedTotal - extractedTotal) > 0.01;
            const isRisk = isHighRiskItem(item.glCategory, item.unitPrice);
            return (
            <div key={index} className="bg-white/60 dark:bg-slate-800/40 backdrop-blur-md p-4 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm space-y-3">
                {/* Description */}
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">{t.description}</label>
                  <AutoResizeTextarea value={item.description} onChange={(e) => handleLineItemChange(index, 'description', e.target.value)} className="w-full bg-transparent border-b border-dashed border-slate-300 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 pb-1" isRisk={isRisk} title={item.description} />
                </div>
                {/* Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{t.sku}</label><input value={item.sku} onChange={(e) => handleLineItemChange(index, 'sku', e.target.value)} title={item.sku} className="w-full bg-transparent text-xs font-mono text-slate-600 dark:text-slate-400 border-b border-transparent focus:border-indigo-500 focus:outline-none" /></div>
                  <div><label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{t.glCategory}</label><input value={item.glCategory} onChange={(e) => handleLineItemChange(index, 'glCategory', e.target.value)} title={item.glCategory} className="w-full bg-transparent text-xs font-bold text-blue-600 dark:text-blue-400 border-b border-transparent focus:border-indigo-500 focus:outline-none" /></div>
                  <div><label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{t.qty}</label><input type="number" value={item.quantity} onChange={(e) => handleLineItemChange(index, 'quantity', parseFloat(e.target.value) || 0)} title={item.quantity.toString()} className="w-full bg-transparent text-xs font-bold text-slate-800 dark:text-slate-200 border-b border-transparent focus:border-indigo-500 focus:outline-none" /></div>
                  <div><label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{t.unitPrice}</label><input type="number" value={item.unitPrice} onChange={(e) => handleLineItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)} title={item.unitPrice.toString()} className="w-full bg-transparent text-xs font-bold text-slate-800 dark:text-slate-200 border-b border-transparent focus:border-indigo-500 focus:outline-none text-right" /></div>
                </div>
                {/* Footer */}
                <div className="flex justify-between items-end border-t border-slate-200 dark:border-white/5 pt-3">
                  <button onClick={() => removeLineItem(index)} className="text-red-500 p-2 bg-red-50 dark:bg-red-500/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  <div className="text-right">
                    <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">{t.lineTotal}</label>
                    <span className={`text-lg font-bold ${hasVariance ? 'text-red-600' : 'text-slate-800 dark:text-white'}`}>{currencySymbol}{item.totalAmount?.toFixed(2)}</span>
                  </div>
                </div>
            </div>
            );
        })}
         <button onClick={addLineItem} className="w-full py-3 flex items-center justify-center text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-xl transition-all border border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500/30">
            <Plus className="w-4 h-4 mr-2" /> {t.addLineItem}
          </button>
      </div>

      {/* DESKTOP TABLE VIEW */}
      <div className="hidden md:block bg-white/40 dark:bg-slate-800/30 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-2xl transition-colors duration-500 overflow-hidden">
        <div className="p-3 border-b border-slate-200 dark:border-slate-700/50 flex justify-between items-center bg-white/40 dark:bg-white/5">
           <div className="flex items-center space-x-4"><h3 className="font-semibold text-slate-800 dark:text-slate-200 tracking-wide text-xs uppercase">{t.lineItems}</h3><span className="text-[10px] text-slate-500 font-mono bg-slate-100 dark:bg-slate-700/50 px-2 py-0.5 rounded-full">{data.lineItems.length} {t.itemsDetected}</span></div>
           {hasMathMismatch && (<button onClick={recalculateTotals} className="flex items-center space-x-1 px-2 py-1 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 rounded text-[10px] font-bold uppercase tracking-wide hover:bg-indigo-200 dark:hover:bg-indigo-500/30 transition-colors border border-indigo-200 dark:border-indigo-500/30 animate-pulse"><Calculator className="w-3 h-3" /><span>{t.fixAll}</span></button>)}
        </div>
        <div className="w-full overflow-x-auto">
           <table className="w-full text-left border-collapse table-fixed min-w-[800px]">
            <thead>
              <tr className="bg-slate-100/50 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-700/50 text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest">
                <th className="p-2 font-bold w-[12%] whitespace-nowrap" title={t.sku}>{t.sku}</th>
                <th className={`p-2 font-bold ${isActuallyDifferent ? 'w-[28%]' : 'w-[32%]'}`} title={t.description}>{t.description}</th>
                <th className={`p-2 font-bold ${isActuallyDifferent ? 'w-[18%]' : 'w-[20%]'}`} title={t.glCategory}>{t.glCategory}</th>
                <th className="p-2 font-bold w-[7%] text-center whitespace-nowrap" title={t.qty}>{t.qty}</th>
                <th className="p-2 font-bold w-[12%] text-right whitespace-nowrap" title={t.unitPrice}>{t.unitPrice}</th>
                <th className="p-2 font-bold w-[12%] text-right whitespace-nowrap" title={t.lineTotal}>{t.lineTotal}</th>
                {isActuallyDifferent && <th className="p-2 font-bold w-[12%] text-right bg-emerald-50/50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-400 border-l border-emerald-100 dark:border-emerald-500/20 whitespace-nowrap" title={t.convertedTotal}>{t.convertedTotal}</th>}
                <th className="p-2 w-[4%] text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/50">
              {data.lineItems.map((item, index) => {
                const calculatedTotal = item.quantity * item.unitPrice;
                const extractedTotal = item.totalAmount || 0;
                const hasVariance = Math.abs(calculatedTotal - extractedTotal) > 0.01;
                const isRisk = isHighRiskItem(item.glCategory, item.unitPrice);
                const convertedValue = isActuallyDifferent ? extractedTotal * rate : 0;
                return (
                  <tr key={index} className={`transition-all duration-200 group ${hasVariance ? 'bg-red-50 dark:bg-red-500/5' : isRisk ? 'bg-orange-50 dark:bg-orange-500/5' : 'hover:bg-white/40 dark:hover:bg-white/5'}`}>
                    <td className="p-2 align-top"><AutoResizeTextarea value={item.sku || ''} onChange={(e) => handleLineItemChange(index, 'sku', e.target.value)} className="w-full bg-transparent border border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-indigo-500/50 rounded px-1.5 py-1 text-slate-700 dark:text-slate-300 text-xs focus:outline-none focus:bg-white/50 dark:focus:bg-slate-900/50 font-mono resize-none overflow-hidden min-h-[28px]" placeholder={t.sku} title={item.sku} /></td>
                    <td className="p-2 align-top relative"><AutoResizeTextarea value={item.description} onChange={(e) => handleLineItemChange(index, 'description', e.target.value)} className="w-full bg-transparent border border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-indigo-500/50 rounded px-1.5 py-1 text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:bg-white/50 dark:focus:bg-slate-900/50 resize-none overflow-hidden min-h-[28px] whitespace-normal break-words leading-relaxed" isRisk={isRisk} title={item.description} />{isRisk && <div className="absolute top-1 right-1 pointer-events-none z-10"><span className="flex items-center space-x-1 text-[8px] font-bold text-red-500 dark:text-red-400 bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 px-1 py-0.5 rounded uppercase tracking-wider shadow-sm"><ShieldAlert className="w-3 h-3" /></span></div>}</td>
                    <td className="p-2 align-top"><div className="relative"><AutoResizeTextarea value={item.glCategory || ''} onChange={(e) => handleLineItemChange(index, 'glCategory', e.target.value)} className={`w-full border border-transparent hover:border-opacity-50 focus:border-opacity-80 rounded-xl px-2 py-1.5 text-[10px] font-bold text-left focus:outline-none focus:bg-opacity-100 transition-all shadow-sm resize-none overflow-hidden min-h-[26px] whitespace-normal break-words leading-tight ${isRisk ? 'bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/30' : 'bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-300 hover:border-blue-400 dark:hover:border-blue-500/30'}`} placeholder="Uncategorized" title={item.glCategory} /></div></td>
                    <td className="p-2 align-top"><input type="number" value={item.quantity} onChange={(e) => handleLineItemChange(index, 'quantity', parseFloat(e.target.value) || 0)} title={item.quantity.toString()} className="w-full bg-transparent border border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-indigo-500/50 rounded px-1 py-1 text-slate-800 dark:text-slate-200 text-xs text-center focus:outline-none focus:bg-white/50 dark:focus:bg-slate-900/50 font-medium" /></td>
                    <td className="p-2 text-right align-top"><input type="number" step="0.01" value={item.unitPrice} onChange={(e) => handleLineItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)} title={item.unitPrice.toString()} className={`w-full bg-transparent border border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-indigo-500/50 rounded px-1 py-1 text-xs text-right focus:outline-none focus:bg-white/50 dark:focus:bg-slate-900/50 font-medium ${isRisk ? 'text-red-500 dark:text-red-300 font-bold' : 'text-slate-800 dark:text-slate-200'}`} /></td>
                    <td className="p-2 text-right pr-2 relative align-top"><div className="flex items-center justify-end space-x-1">{hasVariance && <div className="group/tooltip relative"><AlertTriangle className="w-3.5 h-3.5 text-amber-500 cursor-help" /><div className="absolute bottom-full right-0 mb-2 w-48 bg-slate-800 dark:bg-slate-900/95 backdrop-blur-md text-xs text-white dark:text-slate-200 p-3 rounded-lg border border-slate-700 shadow-xl opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-auto z-10 transform translate-y-2 group-hover/tooltip:translate-y-0 duration-200"><span className="block font-bold text-amber-500 mb-1 uppercase tracking-wide text-[10px]">{t.mathMismatch}</span><div className="flex justify-between items-center mt-2"><span className="font-mono text-indigo-300">{currencySymbol}{calculatedTotal.toFixed(2)}</span><button onClick={() => recalculateRow(index)} className="px-2 py-0.5 bg-indigo-500 text-white rounded text-[9px] hover:bg-indigo-600 font-bold">{t.recalculate}</button></div></div></div>}<div className="flex items-center w-full justify-end"><span className="text-slate-500 mr-0.5 text-[10px] font-medium">{currencySymbol}</span><input type="number" step="0.01" value={item.totalAmount} onChange={(e) => handleLineItemChange(index, 'totalAmount', parseFloat(e.target.value) || 0)} title={item.totalAmount?.toString()} className={`w-full min-w-0 bg-transparent border border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-indigo-500/50 rounded px-1 py-1 text-xs text-right focus:outline-none focus:bg-white/50 dark:focus:bg-slate-900/50 font-bold ${hasVariance ? 'text-red-600 dark:text-red-400' : 'text-slate-800 dark:text-slate-200'}`} /></div></div></td>
                    {isActuallyDifferent && <td className="p-2 text-right pr-2 bg-emerald-50/50 dark:bg-emerald-900/10 border-l border-emerald-100 dark:border-emerald-500/20 align-top"><div className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400 py-1" title="Converted Value">{convertedValue.toFixed(2)}</div></td>}
                    <td className="p-2 text-center align-top"><button onClick={() => removeLineItem(index)} className="p-1.5 mt-0.5 text-slate-400 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-400/10 rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 transform scale-90 hover:scale-100" tabIndex={-1}><Trash2 className="w-3.5 h-3.5" /></button></td>
                  </tr>
                );
              })}
              {data.lineItems.length === 0 && <tr><td colSpan={isActuallyDifferent ? 8 : 7} className="p-8 text-center text-slate-500 italic text-xs">{t.noLineItems}</td></tr>}
            </tbody>
          </table>
        </div>
        {/* Add Item Button */}
         <div className="p-3 border-t border-slate-200 dark:border-slate-700/50 bg-slate-50/50 dark:bg-white/[0.02]">
          <button onClick={addLineItem} className="w-full py-2.5 flex items-center justify-center text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg transition-all border border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500/30">
            <Plus className="w-4 h-4 mr-2" /> {t.addLineItem}
          </button>
        </div>
      </div>
    </div>
  );
};