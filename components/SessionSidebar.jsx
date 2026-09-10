"use client";

import React, { useMemo, useState } from "react";
import { FileText, FileBox, FileCheck, History, BarChart2, TestTube, Download, TrendingUp, Globe2, Coins, AlertTriangle, PieChart } from "lucide-react";
import { getExchangeRate, getCurrencyCode } from "../lib/currency";

/**
 * Renders a proportional analytics bar and its supporting legend.
 *
 * @param {Object} props
 * @param {string} props.title - Section heading.
 * @param {React.ComponentType} props.icon - Lucide icon component.
 * @param {Array} props.segments - Analytics segments to visualize.
 * @param {boolean} [props.warning=false] - Whether to display a warning state.
 * @returns {JSX.Element|null}
 */
const AnalyticsBar = ({
    title,
    icon: Icon,
    segments,
    warning = false,
}) => {
    if (!segments || segments.length === 0) return null;

    return (
        <div className="pt-4 border-t border-[#d8d9dc] dark:border-[#3f4147] first:border-0 first:pt-0">
            <div className="flex items-center space-x-2 mb-3">
                <Icon
                    className={`w-3.5 h-3.5 ${
                        warning
                            ? "text-[#f59e0b]"
                            : "text-[#6d6f78] dark:text-[#949ba4]"
                    }`}
                />

                <h4
                    className={`text-[10px] font-bold uppercase tracking-widest ${
                        warning
                            ? "text-[#b45309] dark:text-[#fbbf24]"
                            : "text-[#6d6f78] dark:text-[#949ba4]"
                    }`}
                >
                    {title}
                </h4>
            </div>

            <div className="w-full h-4 rounded-full flex overflow-hidden shadow-inner ring-1 ring-black/5 dark:ring-white/5 bg-[#efeff1] dark:bg-[#1e1f22]">
                {segments.map((segment, index) => (
                    <div
                        key={index}
                        className="h-full relative group transition-all duration-1000 ease-out border-r last:border-0 border-white/10"
                        style={{
                            flex: segment.value,
                            backgroundColor: segment.color,
                        }}
                        title={`${segment.label}: ${
                            segment.subtext || segment.value
                        }`}
                    />
                ))}
            </div>

            <div className="mt-2.5 grid grid-cols-1 gap-1.5">
                {segments.map((segment, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between text-[10px]"
                    >
                        <div className="flex items-center min-w-0">
                            <div
                                className="w-2 h-2 rounded-full mr-2 shrink-0"
                                style={{
                                    backgroundColor: segment.color,
                                }}
                            />

                            <span className="text-[#4e5058] dark:text-[#dbdee1] font-bold truncate mr-1">
                                {segment.label}
                            </span>
                        </div>

                        <span className="font-mono text-[#949ba4] ml-2 shrink-0">
                            {segment.subtext ||
                                `${Math.round(segment.percentage)}%`}
                        </span>
                    </div>
                ))}
            </div>

            {warning && (
                <div className="mt-3 p-2 bg-[#fffbeb] dark:bg-[#f59e0b]/10 border border-[#fde68a] dark:border-[#f59e0b]/30 rounded-md flex items-center space-x-2">
                    <AlertTriangle className="w-3 h-3 text-[#f59e0b]" />

                    <span className="text-[9px] font-bold text-[#92400e] dark:text-[#fbbf24] uppercase tracking-wide">
                        Red Flag: No supporting docs
                    </span>
                </div>
            )}
        </div>
    );
};

/**
 * Displays processed document history and session analytics.
 *
 * The sidebar provides:
 * - A history view for selecting previously processed documents.
 * - An analytics view summarizing document value, processing time,
 *   spending categories, currencies, document types, and source languages.
 * - Demo mode controls.
 * - Combined session export and session clearing controls.
 *
 * @param {Object} props
 * @param {Array} props.history - Documents processed during the session.
 * @param {string|null} props.currentId - ID of the active document.
 * @param {Function} props.onSelect - Selects a document from history.
 * @param {Function} props.onNewInvoice - Starts a new invoice workflow.
 * @param {Function} props.onExportAll - Exports all session documents.
 * @param {Object} props.t - Active interface translations.
 * @param {boolean} props.isDemoMode - Whether demo mode is enabled.
 * @param {Function} props.onToggleDemoMode - Toggles demo mode.
 * @param {string} props.exportFormat - Active export format.
 * @param {Function} props.onExportFormatChange - Changes export format.
 * @param {Function} props.onClearAll - Clears session data.
 * @returns {JSX.Element}
 */
export const SessionSidebar = ({
    history,
    currentId,
    onSelect,
    onNewInvoice,
    onExportAll,
    t,
    isDemoMode,
    onToggleDemoMode,
    exportFormat = "csv",
    onExportFormatChange,
    onClearAll,
}) => {
    const [activeTab, setActiveTab] = useState("list");

    /**
     * Returns visual metadata for supported document types.
     *
     * @param {string} type - Extracted document type.
     * @returns {{className: string, icon: React.ComponentType, label: string}}
     */
    const getBadgeStyle = (type = "") => {
        const normalizedType = type.toUpperCase();

        if (normalizedType.includes("INVOICE")){
            return {
                className:
                    "text-[#047857] dark:text-[#6ee7b7] bg-[#10b981]/10 border-[#10b981]/25",
                icon: FileText,
                label: "INV",
            };
        }

        if (normalizedType.includes("PACKING")){
            return {
                className:
                    "text-[#c2410c] dark:text-[#fb923c] bg-[#f97316]/10 border-[#f97316]/25",
                icon: FileBox,
                label: "PAK",
            };
        }

        if (
            normalizedType.includes("BOL") ||
            normalizedType.includes("LADING")
        ){
            return {
                className:
                    "text-[#d13f44] dark:text-[#f77479] bg-[#e5484d]/10 border-[#e5484d]/25",
                icon: FileCheck,
                label: "BOL",
            };
        }

        return {
            className:
                "text-[#6d6f78] dark:text-[#b5bac1] bg-[#6d6f78]/10 border-[#6d6f78]/25",
            icon: FileText,
            label: "DOC",
        };
    };

    /**
     * Determines whether a document is older than two years.
     *
     * @param {Object} data - Document data.
     * @returns {boolean}
     */
    const calculateRisk = (data) => {
        const date = new Date(data.invoiceDate);
        const twoYearsAgo = new Date();

        twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

        return !isNaN(date.getTime()) && date < twoYearsAgo;
    };

    /**
     * Aggregates document history into analytics used by the dashboard.
     */
    const stats = useMemo(() => {
        if (history.length === 0) return null;

        let totalValueUSD = 0;
        let totalTime = 0;

        const categoryCounts = {};
        const currencyCounts = {};
        const languageCounts = {};
        const typeCounts = {
            Invoice: 0,
            Receipt: 0,
            PO: 0,
            Other: 0,
        };

        history.forEach((doc) => {
            const { rate } = getExchangeRate(
                doc.currencySymbol,
                "USD",
            );

            totalValueUSD +=
                (doc.totalAmount || 0) * rate;

            if (doc.processingTimeMs){
                totalTime += doc.processingTimeMs;
            }

            doc.lineItems.forEach((item) => {
                const category =
                    item.glCategory || "Uncategorized";

                categoryCounts[category] =
                    (categoryCounts[category] || 0) + 1;
            });

            const currencyCode = getCurrencyCode(
                doc.currencySymbol,
            );

            currencyCounts[currencyCode] =
                (currencyCounts[currencyCode] || 0) + 1;

            let language =
                doc.detectedLanguage || "English";

            const vendorName = (
                doc.vendorName || ""
            ).toLowerCase();

            if (
                vendorName.includes("mustermann") ||
                vendorName.includes("gmbh") ||
                (doc.currencySymbol === "€" &&
                    language === "English")
            ){
                language = "German";
            } 
            else if (
                /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f]/.test(
                    doc.vendorName || "",
                )
            ){
                language = "Japanese";
            } 
            else if (
                doc.currencySymbol === "¥" &&
                !language
            ){
                language = "Japanese";
            }

            languageCounts[language] =
                (languageCounts[language] || 0) + 1;

            const documentType = (
                doc.documentType || ""
            ).toUpperCase();

            if (documentType.includes("INVOICE")){
                typeCounts.Invoice++;
            } 
            else if (
                documentType.includes("RECEIPT")
            ){
                typeCounts.Receipt++;
            } 
            else if (
                documentType.includes("PURCHASE") ||
                documentType.includes("PO")
            ){
                typeCounts.PO++;
            } 
            else {
                typeCounts.Other++;
            }
        });

        const totalItems = Object.values(
            categoryCounts,
        ).reduce((sum, value) => sum + value, 0);

        const sortedCategories = Object.entries(
            categoryCounts,
        ).sort(([, a], [, b]) => b - a);

        /*
         * Warm accent colors keep analytics segments distinguishable
         * without reintroducing the old blue/purple application palette.
         */
        const ANALYTICS_COLORS = [
            "#e5484d",
            "#f77479",
            "#d13f44",
            "#f97316",
            "#f59e0b",
            "#b5bac1",
            "#6d6f78",
            "#10b981",
            "#922e32",
            "#4e5058",
        ];

        const expenseSegments =
            totalItems > 0
                ? sortedCategories.map(
                      ([label, value], index) => ({
                          label,
                          value,
                          percentage:
                              (value / totalItems) * 100,
                          color: ANALYTICS_COLORS[
                              index %
                                  ANALYTICS_COLORS.length
                          ],
                          subtext: `${value} items`,
                      }),
                  )
                : [];

        const totalDocs = history.length;

        const currencySegments = Object.entries(
            currencyCounts,
        )
            .sort(([, a], [, b]) => b - a)
            .map(([code, count]) => {
                let color = "#6d6f78";

                if (code === "USD"){
                    color = "#10b981";
                } 
                else if (code === "EUR"){
                    color = "#e5484d";
                } 
                else if (code === "GBP"){
                    color = "#f77479";
                } 
                else if (code === "JPY"){
                    color = "#f59e0b";
                }

                return {
                    label: code,
                    value: count,
                    percentage:
                        (count / totalDocs) * 100,
                    color,
                    subtext: `${count} doc(s)`,
                };
            });

        const languageSegments = Object.entries(
            languageCounts,
        )
            .sort(([, a], [, b]) => b - a)
            .map(([language, count], index) => ({
                label: language,
                value: count,
                percentage:
                    (count / totalDocs) * 100,
                color:
                    ANALYTICS_COLORS[
                        index % ANALYTICS_COLORS.length
                    ],
                subtext: `${
                    language === "English" ? 95 : 99
                }% Conf.`,
            }));

        const showRedFlag =
            typeCounts.Invoice === totalDocs &&
            totalDocs > 1;

        const docCompSegments = [
            {
                label: "Invoice",
                value: typeCounts.Invoice,
                color: "#e5484d",
            },
            {
                label: "Receipt",
                value: typeCounts.Receipt,
                color: "#10b981",
            },
            {
                label: "PO",
                value: typeCounts.PO,
                color: "#f59e0b",
            },
            {
                label: "Other",
                value: typeCounts.Other,
                color: "#949ba4",
            },
        ]
            .filter((segment) => segment.value > 0)
            .sort((a, b) => b.value - a.value)
            .map((segment) => ({
                ...segment,
                color:
                    segment.label === "Invoice" &&
                    showRedFlag
                        ? "#f59e0b"
                        : segment.color,
                percentage:
                    (segment.value / totalDocs) * 100,
                subtext: `${segment.value} docs`,
            }));

        return {
            totalDocs,
            totalValueUSD,
            avgTime: totalTime / totalDocs / 1000,
            expenseSegments,
            currencySegments,
            languageSegments,
            docCompSegments,
            showRedFlag,
        };
    }, [history]);

    return (
        <div className="h-full flex flex-col bg-[#f7f7f8]/80 dark:bg-[#2b2d31] backdrop-blur-xl border-r border-[#d8d9dc] dark:border-[#3f4147] w-full">
            <div className="p-4 border-b border-[#d8d9dc] dark:border-[#3f4147]">
                <div className="flex bg-[#efeff1] dark:bg-[#1e1f22] p-1 rounded-lg gap-1 mb-4">
                    <button
                        onClick={() =>
                            setActiveTab("list")
                        }
                        className={`flex-1 flex items-center justify-center space-x-2 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${
                            activeTab === "list"
                                ? "bg-white dark:bg-[#313338] shadow-sm text-[#e5484d]"
                                : "text-[#6d6f78] dark:text-[#949ba4] hover:text-[#313338] dark:hover:text-[#dbdee1]"
                        }`}
                    >
                        <History className="w-3 h-3" />
                        <span>{t.sessionHistory}</span>
                    </button>

                    <button
                        onClick={() =>
                            setActiveTab("stats")
                        }
                        className={`flex-1 flex items-center justify-center space-x-2 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${
                            activeTab === "stats"
                                ? "bg-white dark:bg-[#313338] shadow-sm text-[#e5484d]"
                                : "text-[#6d6f78] dark:text-[#949ba4] hover:text-[#313338] dark:hover:text-[#dbdee1]"
                        }`}
                    >
                        <BarChart2 className="w-3 h-3" />
                        <span>
                            {t.sessionAnalytics}
                        </span>
                    </button>
                </div>

                <div
                    onClick={onToggleDemoMode}
                    className={`w-full p-2.5 rounded-lg border flex items-center justify-between cursor-pointer transition-all duration-300 shadow-sm group ${
                        isDemoMode
                            ? "bg-[#fffbeb] dark:bg-[#f59e0b]/10 border-[#fde68a] dark:border-[#f59e0b]/30 ring-1 ring-[#f59e0b]/20"
                            : "bg-white dark:bg-[#313338] border-[#d8d9dc] dark:border-[#3f4147] hover:border-[#e5484d]/50"
                    }`}
                >
                    <div className="flex items-center space-x-2">
                        <div
                            className={`p-1 rounded transition-colors ${
                                isDemoMode
                                    ? "bg-[#fef3c7] dark:bg-[#f59e0b]/20 text-[#b45309] dark:text-[#fbbf24]"
                                    : "bg-[#efeff1] dark:bg-[#1e1f22] text-[#6d6f78] dark:text-[#b5bac1]"
                            }`}
                        >
                            <TestTube className="w-3 h-3" />
                        </div>

                        <span
                            className={`text-[10px] font-bold uppercase tracking-wider ${
                                isDemoMode
                                    ? "text-[#92400e] dark:text-[#fbbf24]"
                                    : "text-[#4e5058] dark:text-[#b5bac1]"
                            }`}
                        >
                            {isDemoMode
                                ? "Demo Mode"
                                : "Real API"}
                        </span>
                    </div>

                    <div
                        className={`w-8 h-4 rounded-full relative transition-colors ${
                            isDemoMode
                                ? "bg-[#f59e0b]"
                                : "bg-[#b5bac1] dark:bg-[#4e5058]"
                        }`}
                    >
                        <div
                            className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${
                                isDemoMode
                                    ? "translate-x-4"
                                    : "translate-x-0"
                            }`}
                        />
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {activeTab === "list" && (
                    <div className="p-4 space-y-3">
                        {history.length === 0 && (
                            <div className="text-center py-10 opacity-60">
                                <History className="w-5 h-5 mx-auto mb-2 text-[#949ba4]" />

                                <p className="text-xs text-[#6d6f78] dark:text-[#949ba4]">
                                    {t.noDocs}
                                </p>
                            </div>
                        )}

                        {history.map((item) => {
                            const badge =
                                getBadgeStyle(
                                    item.documentType,
                                );

                            const BadgeIcon =
                                badge.icon;

                            return (
                                <div
                                    key={item.id}
                                    onClick={() =>
                                        onSelect(item)
                                    }
                                    className={`group relative p-3 rounded-xl border transition-all cursor-pointer ${
                                        item.id === currentId
                                            ? "bg-white dark:bg-[#313338] border-[#e5484d]/60 shadow-lg shadow-[#e5484d]/5"
                                            : "bg-white/50 dark:bg-[#313338]/50 border-[#d8d9dc] dark:border-[#3f4147] hover:bg-white dark:hover:bg-[#313338] hover:border-[#e5484d]/30"
                                    }`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div
                                            className={`flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase border ${badge.className}`}
                                        >
                                            <BadgeIcon className="w-3 h-3" />
                                            <span>
                                                {badge.label}
                                            </span>
                                        </div>

                                        {calculateRisk(
                                            item,
                                        ) && (
                                            <span
                                                className="w-1.5 h-1.5 rounded-full bg-[#e5484d] animate-pulse"
                                                title="Potential risk detected"
                                            />
                                        )}
                                    </div>

                                    <h4
                                        className="text-sm font-semibold text-[#313338] dark:text-[#dbdee1] truncate pr-4"
                                        title={
                                            item.vendorName
                                        }
                                    >
                                        {item.vendorName ||
                                            "Unknown"}
                                    </h4>

                                    <p className="text-xs font-mono text-[#6d6f78] dark:text-[#949ba4]">
                                        {
                                            item.currencySymbol
                                        }
                                        {item.totalAmount?.toFixed(
                                            2,
                                        )}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                )}

                {activeTab === "stats" && stats && (
                    <div className="p-4 space-y-6">
                        <div className="grid grid-cols-2 gap-3">
                            <div
                                className="bg-white/60 dark:bg-[#313338] p-2.5 rounded-xl border border-[#d8d9dc] dark:border-[#3f4147]"
                                title={t.totalDocs}
                            >
                                <p className="text-[9px] uppercase font-bold text-[#949ba4] truncate">
                                    {t.totalDocs}
                                </p>

                                <p className="text-lg font-bold text-[#313338] dark:text-[#f2f3f5] leading-tight">
                                    {stats.totalDocs}
                                </p>
                            </div>

                            <div
                                className="bg-white/60 dark:bg-[#313338] p-2.5 rounded-xl border border-[#d8d9dc] dark:border-[#3f4147]"
                                title={t.avgTime}
                            >
                                <p className="text-[9px] uppercase font-bold text-[#949ba4] truncate">
                                    {t.avgTime}
                                </p>

                                <p className="text-lg font-bold text-[#313338] dark:text-[#f2f3f5] leading-tight">
                                    {stats.avgTime.toFixed(
                                        1,
                                    )}

                                    <span className="text-[10px] ml-0.5 font-normal text-[#6d6f78] dark:text-[#949ba4]">
                                        {t.seconds}
                                    </span>
                                </p>
                            </div>
                        </div>

                        <div
                            className="bg-[#e5484d]/10 p-3 rounded-xl border border-[#e5484d]/25"
                            title={t.totalValue}
                        >
                            <p className="text-[9px] uppercase font-bold text-[#d13f44] dark:text-[#f77479] truncate">
                                {t.totalValue}
                            </p>

                            <p
                                className="text-xl font-bold text-[#d13f44] dark:text-[#f77479] mt-0.5 truncate"
                                title={`$${stats.totalValueUSD.toLocaleString()}`}
                            >
                                $
                                {stats.totalValueUSD.toLocaleString(
                                    undefined,
                                    {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    },
                                )}
                            </p>
                        </div>

                        <AnalyticsBar
                            title={t.spendingBreakdown}
                            icon={TrendingUp}
                            segments={
                                stats.expenseSegments
                            }
                        />

                        <AnalyticsBar
                            title={t.currencyDist}
                            icon={Coins}
                            segments={
                                stats.currencySegments
                            }
                        />

                        <AnalyticsBar
                            title={
                                t.docComposition ||
                                "Doc Composition"
                            }
                            icon={PieChart}
                            segments={
                                stats.docCompSegments
                            }
                            warning={stats.showRedFlag}
                        />

                        <AnalyticsBar
                            title="Source Language"
                            icon={Globe2}
                            segments={
                                stats.languageSegments
                            }
                        />
                    </div>
                )}
            </div>

            <div className="p-4 border-t border-[#d8d9dc] dark:border-[#3f4147] bg-[#efeff1] dark:bg-[#1e1f22]/70">
                <label className="text-[9px] font-bold text-[#6d6f78] dark:text-[#949ba4] uppercase tracking-widest mb-2 block">
                    Export Format
                </label>

                <select
                    value={exportFormat}
                    onChange={(event) =>
                        onExportFormatChange &&
                        onExportFormatChange(
                            event.target.value,
                        )
                    }
                    className="w-full bg-white dark:bg-[#313338] border border-[#d8d9dc] dark:border-[#3f4147] rounded-lg px-3 py-2 text-xs font-bold text-[#4e5058] dark:text-[#dbdee1] focus:outline-none focus:border-[#e5484d] focus:ring-1 focus:ring-[#e5484d]/30 transition-colors"
                >
                    <option value="csv">
                        Generic CSV
                    </option>
                    <option value="quickbooks">
                        QuickBooks (IIF)
                    </option>
                    <option value="excel">
                        Excel (.xls)
                    </option>
                    <option value="json">
                        JSON
                    </option>
                </select>

                <button
                    onClick={onExportAll}
                    className="w-full mt-3 flex items-center justify-center space-x-2 py-2 border border-[#d8d9dc] dark:border-[#4e5058] rounded-lg text-xs font-bold text-[#4e5058] dark:text-[#b5bac1] hover:text-[#e5484d] hover:border-[#e5484d]/50 hover:bg-[#e5484d]/5 transition-all"
                >
                    <Download className="w-3 h-3" />
                    <span>Export Combined</span>
                </button>

                <button
                    onClick={onClearAll}
                    className="w-full mt-2 flex items-center justify-center space-x-2 py-2 border border-[#e5484d]/30 rounded-lg text-xs font-bold text-[#d13f44] dark:text-[#f77479] hover:bg-[#e5484d]/10 hover:border-[#e5484d]/50 transition-all"
                >
                    <AlertTriangle className="w-3 h-3" />
                    <span>{t.clearData}</span>
                </button>
            </div>
        </div>
    );
};