"use client";

import React from "react";
import { Hexagon, Sun, Moon, Coins, Plus, PanelLeft, ChevronRight, Home, Loader2, Globe } from "lucide-react";

/**
 * Primary application navigation for Intake AI.
 *
 * Provides product branding, navigation breadcrumbs, currency controls,
 * interface language selection, theme switching, and session access.
 */
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
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <header className="border-b border-[#d8d9dc] dark:border-[#3f4147] bg-[#f7f7f8]/90 dark:bg-[#1e1f22]/95 backdrop-blur-md sticky top-0 z-50 transition-colors duration-300 shrink-0 shadow-sm">
            <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <div className="flex items-center space-x-4 min-w-0">
                    <div
                        onClick={onNavigateHome}
                        className="flex items-center space-x-3 cursor-pointer group shrink-0"
                    >
                        <div className="p-2 bg-[#e5484d] rounded-lg shadow-lg shadow-[#e5484d]/20 ring-1 ring-black/5 dark:ring-white/10 group-hover:bg-[#d13f44] group-hover:scale-105 transition-all duration-300">
                            <Hexagon className="w-5 h-5 text-white" />
                        </div>

                        <div className="hidden md:block">
                            <h1 className="text-lg font-bold tracking-tight text-[#313338] dark:text-[#f2f3f5] leading-none">
                                {t.appTitle}{" "}
                                <span className="text-[#e5484d]">
                                    {t.appSuffix}
                                </span>
                            </h1>
                        </div>
                    </div>

                    <div className="h-6 w-px bg-[#d8d9dc] dark:bg-[#3f4147] mx-2 hidden sm:block" />

                    <nav className="flex items-center text-sm font-medium text-[#6d6f78] dark:text-[#949ba4] overflow-hidden whitespace-nowrap">
                        <button
                            onClick={onNavigateHome}
                            className="flex items-center shrink-0 hover:text-[#e5484d] transition-colors duration-200"
                        >
                            <Home className="w-4 h-4 mr-1.5" />
                            <span className="hidden sm:inline font-medium">
                                {t.home}
                            </span>
                        </button>

                        {currentView !== "home" && (
                            <>
                                <ChevronRight className="w-4 h-4 mx-1.5 text-[#b5bac1] dark:text-[#4e5058] shrink-0" />

                                {currentView === "processing" ? (
                                    <span className="text-[#e5484d] animate-pulse flex items-center font-medium">
                                        <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                                        {t.breadcrumbsProcessing}
                                    </span>
                                ) : (
                                    <button
                                        onClick={scrollToTop}
                                        className="flex items-center group text-[#313338] dark:text-[#dbdee1] font-semibold hover:text-[#e5484d] transition-colors max-w-[200px] md:max-w-[400px]"
                                        title={vendorName}
                                    >
                                        <span className="truncate hover:underline">
                                            {vendorName || "Unknown Vendor"}
                                        </span>

                                        <span className="ml-2 font-mono text-xs text-[#6d6f78] dark:text-[#b5bac1] bg-[#efeff1] dark:bg-[#2b2d31] px-1.5 py-0.5 rounded border border-[#d8d9dc] dark:border-[#3f4147] group-hover:border-[#e5484d]/50 transition-colors shrink-0">
                                            {currencySymbol}
                                            {totalAmount?.toFixed(2)}
                                        </span>
                                    </button>
                                )}
                            </>
                        )}
                    </nav>
                </div>

                <div className="flex items-center space-x-2 md:space-x-3 shrink-0">
                    {currentView === "editor" && (
                        <button
                            onClick={onNewInvoice}
                            className="hidden md:flex items-center space-x-2 px-3 py-1.5 bg-[#e5484d]/10 text-[#d13f44] dark:text-[#f77479] border border-[#e5484d]/30 rounded-lg hover:bg-[#e5484d]/20 hover:border-[#e5484d]/50 transition-all font-semibold text-xs shadow-sm h-9"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            <span>{t.newInvoice}</span>
                        </button>
                    )}

                    <div className="flex items-center space-x-2 border-r border-[#d8d9dc] dark:border-[#3f4147] pr-3 mr-1">
                        <div className="hidden lg:flex items-center space-x-2 bg-white dark:bg-[#2b2d31] rounded-lg border border-[#d8d9dc] dark:border-[#3f4147] px-3 py-1.5 hover:bg-[#efeff1] dark:hover:bg-[#313338] transition-colors shadow-sm group h-10">
                            <Coins className="w-4 h-4 text-[#6d6f78] dark:text-[#b5bac1] group-hover:text-[#e5484d] transition-colors shrink-0" />

                            <div className="flex flex-col justify-center">
                                <label
                                    htmlFor="currency-select"
                                    className="text-[9px] text-[#6d6f78] dark:text-[#949ba4] font-bold uppercase leading-none mb-0.5"
                                >
                                    {t.targetCurrency}
                                </label>

                                <select
                                    id="currency-select"
                                    value={targetCurrency}
                                    onChange={onCurrencyChange}
                                    className="bg-transparent text-xs font-bold text-[#313338] dark:text-[#f2f3f5] focus:outline-none cursor-pointer pr-1 min-w-[60px]"
                                >
                                    <option
                                        className="bg-white text-[#313338] dark:bg-[#2b2d31] dark:text-[#f2f3f5]"
                                        value="Original"
                                    >
                                        {t.original}
                                    </option>

                                    <option
                                        className="bg-white text-[#313338] dark:bg-[#2b2d31] dark:text-[#f2f3f5]"
                                        value="USD"
                                    >
                                        USD ($)
                                    </option>

                                    <option
                                        className="bg-white text-[#313338] dark:bg-[#2b2d31] dark:text-[#f2f3f5]"
                                        value="EUR"
                                    >
                                        EUR (€)
                                    </option>

                                    <option
                                        className="bg-white text-[#313338] dark:bg-[#2b2d31] dark:text-[#f2f3f5]"
                                        value="GBP"
                                    >
                                        GBP (£)
                                    </option>

                                    <option
                                        className="bg-white text-[#313338] dark:bg-[#2b2d31] dark:text-[#f2f3f5]"
                                        value="JPY"
                                    >
                                        JPY (¥)
                                    </option>

                                    <option
                                        className="bg-white text-[#313338] dark:bg-[#2b2d31] dark:text-[#f2f3f5]"
                                        value="CNY"
                                    >
                                        CNY (¥)
                                    </option>

                                    <option
                                        className="bg-white text-[#313338] dark:bg-[#2b2d31] dark:text-[#f2f3f5]"
                                        value="CAD"
                                    >
                                        CAD (C$)
                                    </option>

                                    <option
                                        className="bg-white text-[#313338] dark:bg-[#2b2d31] dark:text-[#f2f3f5]"
                                        value="MXN"
                                    >
                                        MXN ($)
                                    </option>

                                    <option
                                        className="bg-white text-[#313338] dark:bg-[#2b2d31] dark:text-[#f2f3f5]"
                                        value="AUD"
                                    >
                                        AUD (A$)
                                    </option>

                                    <option
                                        className="bg-white text-[#313338] dark:bg-[#2b2d31] dark:text-[#f2f3f5]"
                                        value="KRW"
                                    >
                                        KRW (₩)
                                    </option>

                                    <option
                                        className="bg-white text-[#313338] dark:bg-[#2b2d31] dark:text-[#f2f3f5]"
                                        value="INR"
                                    >
                                        INR (₹)
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <div
                            className="hidden md:flex items-center justify-center bg-white dark:bg-[#2b2d31] rounded-lg border border-[#d8d9dc] dark:border-[#3f4147] hover:bg-[#efeff1] dark:hover:bg-[#313338] hover:border-[#e5484d]/40 transition-colors shadow-sm group h-10 w-10 relative"
                            title={t.interfaceLanguage || "Interface Language"}
                        >
                            <Globe className="w-4 h-4 text-[#6d6f78] dark:text-[#b5bac1] group-hover:text-[#e5484d] transition-colors" />

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

                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg bg-white dark:bg-[#2b2d31] border border-[#d8d9dc] dark:border-[#3f4147] text-[#4e5058] dark:text-[#dbdee1] hover:bg-[#efeff1] dark:hover:bg-[#313338] hover:border-[#e5484d]/40 hover:text-[#e5484d] transition-all shadow-sm focus:outline-none group h-10 w-10 flex items-center justify-center"
                            title={t.toggleTheme}
                        >
                            {isDarkMode ? (
                                <Sun className="w-4 h-4" />
                            ) : (
                                <Moon className="w-4 h-4" />
                            )}
                        </button>
                    </div>

                    <button
                        onClick={onToggleHistory}
                        className="p-2 lg:hidden rounded-lg bg-[#e5484d]/10 border border-[#e5484d]/30 text-[#d13f44] dark:text-[#f77479] hover:bg-[#e5484d]/20 transition-all shadow-sm focus:outline-none h-10 w-10 flex items-center justify-center"
                        title={t.sessionMenu}
                    >
                        <PanelLeft className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </header>
    );
};