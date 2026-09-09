'use client';

import React, { useState } from 'react';
import { Hexagon, Sun, Moon, Coins, Plus, PanelLeft, ChevronRight, Home, Loader2, Globe } from 'lucide-react';

export const Navbar = ({
  t,
  isDarkMode,
  toggleTheme,
  currentView,
  vendorName,
  totalAmount,
  currencySymbol,
  onNavigateHome,
  onNewInvoice,
  onToggleHistory,
  targetCurrency,
  onCurrencyChange,
  interfaceLanguage,
  onInterfaceLanguageChange,
}) => {
  const [showDecoder, setShowDecoder] = useState(false);
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="border-b border-slate-200 dark:border-white/5 bg-white/70 dark:bg-slate-900/40 backdrop-blur-md sticky top-0 z-50 transition-colors duration-500 shrink-0 shadow-sm">
      <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Logo & Breadcrumbs */}
        <div className="flex items-center space-x-4 min-w-0">
          <div 
            onClick={onNavigateHome}
            onMouseEnter={() => setShowDecoder(true)}
            onMouseLeave={() => setShowDecoder(false)}
            className="flex items-center space-x-3 cursor-pointer group shrink-0 relative"
          >
            <div className="p-2 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-lg shadow-lg shadow-indigo-500/20 ring-1 ring-black/5 dark:ring-white/10 group-hover:scale-105 transition-transform duration-300">
              <Hexagon className="w-5 h-5 text-white" />
            </div>
            <div className="hidden md:block">
              <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white leading-none">
                    {t.appTitle} <span className="text-indigo-600 dark:text-indigo-400">{t.sanitizer}</span>
                  </h1>
                  <span className="px-1.5 py-0.5 rounded-full bg-indigo-500/10 text-[10px] font-mono font-bold text-indigo-500 dark:text-indigo-400 border border-indigo-500/20">
                    v0.9 PUBLIC BETA
                  </span>
              </div>
            </div>

            {/* Acronym Decoder Tooltip */}
            <div className={`absolute top-full left-0 mt-4 w-64 bg-slate-900 dark:bg-slate-950 border border-cyan-500/30 rounded-xl p-4 shadow-2xl z-[100] transition-all duration-300 transform origin-top-left ${showDecoder ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}>
               <div className="absolute -top-1.5 left-5 w-3 h-3 bg-slate-900 border-t border-l border-cyan-500/30 rotate-45"></div>
               <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-3 border-b border-cyan-500/20 pb-2">System Architecture</h3>
               <div className="space-y-2 font-mono text-[10px] text-slate-300">
                  <div className="flex"><span className="text-indigo-400 font-bold w-4">E</span><span>xtraction</span></div>
                  <div className="flex"><span className="text-indigo-400 font-bold w-4">S</span><span>ystem (for)</span></div>
                  <div className="flex"><span className="text-indigo-400 font-bold w-4">T</span><span>ransactional</span></div>
                  <div className="flex"><span className="text-indigo-400 font-bold w-4">E</span><span>ntity</span></div>
                  <div className="flex"><span className="text-indigo-400 font-bold w-4">R</span><span>econciliation</span></div>
               </div>
               <div className="mt-3 pt-2 border-t border-slate-800 text-[9px] text-slate-500">
                  AI-Powered Financial Analysis Kernel v0.9
               </div>
            </div>
          </div>

          {/* Breadcrumbs Divider */}
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2 hidden sm:block"></div>

          {/* Breadcrumbs */}
          <nav className="flex items-center text-sm font-medium text-slate-500 dark:text-slate-400 overflow-hidden whitespace-nowrap">
            <button 
              onClick={onNavigateHome} 
              className="flex items-center shrink-0 hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline transition-all duration-200"
            >
              <Home className="w-4 h-4 mr-1.5" />
              <span className="hidden sm:inline font-medium">{t.home}</span>
            </button>
            
            {currentView !== 'home' && (
              <>
                <ChevronRight className="w-4 h-4 mx-1.5 text-slate-300 dark:text-slate-600 shrink-0" />
                {currentView === 'processing' ? (
                  <span className="text-indigo-600 dark:text-indigo-400 animate-pulse flex items-center font-medium">
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    {t.breadcrumbsProcessing}
                  </span>
                ) : (
                  <button 
                    onClick={scrollToTop}
                    className="flex items-center group text-slate-900 dark:text-slate-200 font-semibold hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors max-w-[200px] md:max-w-[400px]"
                    title={vendorName}
                  >
                    <span className="truncate hover:underline">
                        {vendorName || 'Unknown Vendor'}
                    </span>
                    <span className="ml-2 font-mono text-xs opacity-70 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 group-hover:border-indigo-200 dark:group-hover:border-indigo-500/30 transition-colors shrink-0">
                        {currencySymbol}{totalAmount?.toFixed(2)}
                    </span>
                  </button>
                )}
              </>
            )}
          </nav>
        </div>

        {/* Right: Actions & Settings */}
        <div className="flex items-center space-x-2 md:space-x-3 shrink-0">
          
          {/* New Invoice Button (Visible only when in Editor) */}
          {currentView === 'editor' && (
             <button 
                onClick={onNewInvoice}
                className="hidden md:flex items-center space-x-2 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-all font-semibold text-xs shadow-sm hover:shadow h-9"
             >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.newInvoice}</span>
             </button>
          )}

          {/* SESSION CONTROLS GROUP */}
          <div className="flex items-center space-x-2 border-r border-slate-200 dark:border-slate-700 pr-3 mr-1">
            {/* Currency Dropdown */}
            <div className="hidden lg:flex items-center space-x-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm group h-10">
                <Coins className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors shrink-0" />
                <div className="flex flex-col justify-center">
                  <label htmlFor="currency-select" className="text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase leading-none mb-0.5">
                    {t.targetCurrency}
                  </label>
                  <select 
                    id="currency-select"
                    value={targetCurrency}
                    onChange={onCurrencyChange}
                    className="bg-transparent text-xs font-bold text-black dark:text-white focus:outline-none cursor-pointer pr-1 min-w-[60px]"
                  >
                    <option className="bg-white text-black dark:bg-slate-800 dark:text-white" value="Original">{t.original}</option>
                    <option className="bg-white text-black dark:bg-slate-800 dark:text-white" value="USD">USD ($)</option>
                    <option className="bg-white text-black dark:bg-slate-800 dark:text-white" value="EUR">EUR (€)</option>
                    <option className="bg-white text-black dark:bg-slate-800 dark:text-white" value="GBP">GBP (£)</option>
                    <option className="bg-white text-black dark:bg-slate-800 dark:text-white" value="JPY">JPY (¥)</option>
                    <option className="bg-white text-black dark:bg-slate-800 dark:text-white" value="CNY">CNY (¥)</option>
                    <option className="bg-white text-black dark:bg-slate-800 dark:text-white" value="CAD">CAD (C$)</option>
                    <option className="bg-white text-black dark:bg-slate-800 dark:text-white" value="MXN">MXN ($)</option>
                    <option className="bg-white text-black dark:bg-slate-800 dark:text-white" value="AUD">AUD (A$)</option>
                    <option className="bg-white text-black dark:bg-slate-800 dark:text-white" value="KRW">KRW (₩)</option>
                    <option className="bg-white text-black dark:bg-slate-800 dark:text-white" value="INR">INR (₹)</option>
                  </select>
                </div>
            </div>

          </div>

          {/* APP SETTINGS GROUP */}
          <div className="flex items-center space-x-2">
             {/* INTERFACE LANGUAGE Dropdown */}
             {/* FIXED: Added relative positioning to parent so absolute select doesn't overflow */}
             <div className="hidden md:flex items-center space-x-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-300 dark:border-slate-600 px-2 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm group h-10 w-10 justify-center relative" title={t.interfaceLanguage || "Interface Language"}>
                <Globe className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors" />
                <select 
                  value={interfaceLanguage}
                  onChange={onInterfaceLanguageChange}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Español</option>
                  <option value="French">Français</option>
                  <option value="German">Deutsch</option>
                  <option value="Chinese">中文</option>
                  <option value="Japanese">日本語</option>
                  <option value="Portuguese">Português</option>
                  <option value="Hindi">हिन्दी</option>
                  <option value="Arabic">العربية</option>
                  <option value="Korean">한국어</option>
                  <option value="Italian">Italiano</option>
                </select>
             </div>

             {/* Theme Toggle */}
             <button 
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm focus:outline-none group h-10 w-10 flex items-center justify-center"
                title={t.toggleTheme}
             >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 group-hover:text-black" />}
             </button>
          </div>
          
          {/* History Toggle (Mobile/Tablet) */}
          <button
            onClick={onToggleHistory}
            className="p-2 lg:hidden rounded-lg bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-all shadow-sm focus:outline-none h-10 w-10 flex items-center justify-center"
            title={t.sessionMenu}
          >
            <PanelLeft className="w-4 h-4" />
          </button>

          {/* System Status Indicator */}
          <div className="hidden xl:flex flex-col items-end justify-center pl-2 border-l border-slate-200 dark:border-slate-700 h-8 ml-1">
             <div className="flex items-center space-x-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[9px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest opacity-80">System Online</span>
             </div>
          </div>

        </div>
      </div>
    </header>
  );
};