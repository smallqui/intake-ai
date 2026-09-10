"use client";

import React, { useEffect, useRef } from "react";
import { Plus, Trash2, Calendar, Building, Tag, AlertTriangle, FileCheck, FileBox, FileText, History, ShieldAlert, CheckCircle, AlertCircle, Calculator, Languages, TrendingUp } from "lucide-react";
import { getExchangeRate, CODE_TO_SYMBOL } from "../lib/currency";

/**
 * Textarea that automatically expands to fit its content.
 */
const AutoResizeTextarea = ({
    value,
    onChange,
    className,
    placeholder,
    isRisk,
    tabIndex,
    title,
}) => {
    const textareaRef = useRef(null);

    useEffect(() => {
        if (textareaRef.current){
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [value]);

    return (
        <textarea
            ref={textareaRef}
            value={value}
            onChange={onChange}
            rows={1}
            placeholder={placeholder}
            className={`${className} ${isRisk ? "pr-20" : ""}`}
            title={title || value}
            tabIndex={tabIndex}
        />
    );
};

/**
 * Displays contextual information when a status badge is hovered or focused.
 */
const BadgeTooltip = ({ children, content }) => {
    return (
        <div
            className="relative group/tooltip w-fit focus:outline-none"
            tabIndex={0}
        >
            {children}

            <div
                role="tooltip"
                className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-64 -translate-x-1/2 translate-y-1 rounded-lg border border-[#3f4147] bg-[#111214] px-3 py-2.5 text-left text-[11px] font-medium normal-case tracking-normal leading-relaxed text-[#f2f3f5] shadow-2xl opacity-0 transition-all duration-150 group-hover/tooltip:translate-y-0 group-hover/tooltip:opacity-100 group-focus/tooltip:translate-y-0 group-focus/tooltip:opacity-100"
            >
                {content}

                <div className="absolute left-1/2 top-full -translate-x-1/2 border-[6px] border-transparent border-t-[#111214]" />
            </div>
        </div>
    );
};

/**
 * Editable review interface for extracted financial document data.
 *
 * Supports document metadata editing, line-item review, validation warnings,
 * deterministic recalculation, risk indicators, and optional currency
 * conversion previews.
 */
export const InvoiceEditor = ({
    data,
    onChange,
    t,
    targetCurrency = "Original",
}) => {
    const handleHeaderChange = (field, value) => {
        onChange({ ...data, [field]: value });
    };

    const handleLineItemChange = (index, field, value) => {
        const newItems = [...data.lineItems];

        newItems[index] = {
            ...newItems[index],
            [field]: value,
        };

        onChange({
            ...data,
            lineItems: newItems,
        });
    };

    const removeLineItem = (index) => {
        onChange({
            ...data,
            lineItems: data.lineItems.filter(
                (_, itemIndex) => itemIndex !== index,
            ),
        });
    };

    const addLineItem = () => {
        onChange({
            ...data,
            lineItems: [
                ...data.lineItems,
                {
                    sku: "",
                    description: "",
                    glCategory: "",
                    quantity: 1,
                    unitPrice: 0,
                    totalAmount: 0,
                },
            ],
        });
    };

    const recalculateRow = (index) => {
        const newItems = [...data.lineItems];

        newItems[index] = {
            ...newItems[index],
            totalAmount: parseFloat(
                (
                    newItems[index].quantity *
                    newItems[index].unitPrice
                ).toFixed(2),
            ),
        };

        onChange({
            ...data,
            lineItems: newItems,
        });
    };

    const recalculateTotals = () => {
        const newItems = data.lineItems.map((item) => ({
            ...item,
            totalAmount: parseFloat(
                (
                    item.quantity * item.unitPrice
                ).toFixed(2),
            ),
        }));

        onChange({
            ...data,
            lineItems: newItems,
        });
    };

    /**
     * Returns visual metadata for the extracted document type.
     */
    const getBadgeStyle = (type = "") => {
        const normalizedType = type.toUpperCase();

        if (normalizedType.includes("INVOICE")){
            return {
                className:
                    "bg-[#10b981]/10 text-[#047857] dark:text-[#6ee7b7] border-[#10b981]/25",
                icon: FileText,
            };
        }

        if (normalizedType.includes("PACKING")){
            return {
                className:
                    "bg-[#f97316]/10 text-[#c2410c] dark:text-[#fb923c] border-[#f97316]/25",
                icon: FileBox,
            };
        }

        if (normalizedType.includes("BOL")){
            return {
                className:
                    "bg-[#e5484d]/10 text-[#d13f44] dark:text-[#f77479] border-[#e5484d]/25",
                icon: FileCheck,
            };
        }

        return {
            className:
                "bg-[#6d6f78]/10 text-[#4e5058] dark:text-[#b5bac1] border-[#6d6f78]/25",
            icon: FileText,
        };
    };

    /**
     * Determines whether a document date is more than two years old.
     */
    const isStaleDate = (dateString) => {
        if (!dateString) return false;

        const date = new Date(dateString);
        const twoYearsAgo = new Date();

        twoYearsAgo.setFullYear(
            twoYearsAgo.getFullYear() - 2,
        );

        return (
            !isNaN(date.getTime()) &&
            date < twoYearsAgo
        );
    };

    /**
     * Applies a lightweight expense-risk heuristic to line items.
     */
    const isHighRiskItem = (category, price) => {
        const normalizedCategory = (
            category || ""
        ).toLowerCase();

        return (
            (normalizedCategory.includes("meal") ||
                normalizedCategory.includes("office")) &&
            price > 100
        );
    };

    const currencySymbol =
        data.currencySymbol || "$";

    const showConversion =
        targetCurrency !== "Original";

    const { rate, sourceCode } =
        getExchangeRate(
            currencySymbol,
            targetCurrency,
        );

    const isActuallyDifferent =
        showConversion &&
        (rate !== 1 ||
            sourceCode !== targetCurrency);

    let displayTotalAmount =
        data.totalAmount;

    let displayCurrencySymbol =
        data.currencySymbol;

    let isReadOnlyHeader = false;

    if (isActuallyDifferent){
        displayTotalAmount = parseFloat(
            (
                data.totalAmount * rate
            ).toFixed(2),
        );

        displayCurrencySymbol =
            CODE_TO_SYMBOL[targetCurrency] ||
            targetCurrency;

        isReadOnlyHeader = true;
    }

    const badgeStyle =
        getBadgeStyle(data.documentType);

    const BadgeIcon =
        badgeStyle.icon;

    const isHighConfidence =
        data.confidenceScore === "High";

    const hasMathMismatch =
        data.lineItems.some(
            (item) =>
                Math.abs(
                    item.quantity *
                        item.unitPrice -
                        (item.totalAmount || 0),
                ) > 0.01,
        );

    const timeSaved = Math.ceil(
        data.lineItems.length * 0.5 + 1,
    );

    const moneySaved = (
        timeSaved * 0.8
    ).toFixed(2);

    return (
        <div className="space-y-6 animate-in fade-in duration-700 slide-in-from-bottom-8">
            <div className="bg-white/70 dark:bg-[#2b2d31] backdrop-blur-sm p-4 rounded-xl border border-[#d8d9dc] dark:border-[#3f4147] shadow-sm transition-colors duration-300">
                <div className="flex flex-col gap-4 mb-4 border-b border-[#d8d9dc] dark:border-[#3f4147] pb-4">
                    <div className="flex flex-wrap gap-2 items-center">
                        <BadgeTooltip content="The type of document Intake detected.">
                            <div
                                className={`px-3 py-1.5 rounded-lg border flex items-center space-x-2 w-fit ${badgeStyle.className}`}
                            >
                                <BadgeIcon className="w-4 h-4" />

                                <span className="text-xs font-bold tracking-widest uppercase">
                                    {t.documentType}:{" "}
                                    {data.documentType ||
                                        "UNKNOWN"}
                                </span>
                            </div>
                        </BadgeTooltip>

                        <BadgeTooltip
                            content={
                                isHighConfidence
                                    ? "The extracted data looks accurate."
                                    : "Some fields may need a quick review."
                            }
                        >
                            <div
                                className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border flex items-center space-x-1.5 ${
                                    isHighConfidence
                                        ? "bg-[#10b981]/10 text-[#047857] dark:text-[#6ee7b7] border-[#10b981]/25"
                                        : "bg-[#f59e0b]/10 text-[#b45309] dark:text-[#fbbf24] border-[#f59e0b]/30"
                                }`}
                            >
                                {isHighConfidence ? (
                                    <CheckCircle className="w-3 h-3" />
                                ) : (
                                    <AlertTriangle className="w-3 h-3" />
                                )}

                                <span>
                                    {isHighConfidence
                                        ? t.confidenceHigh
                                        : t.confidenceReview}
                                </span>
                            </div>
                        </BadgeTooltip>

                        <BadgeTooltip content="Estimated time and money saved compared to manual data entry.">
                            <div className="px-3 py-1.5 rounded-lg border flex items-center space-x-2 bg-[#e5484d]/10 border-[#e5484d]/25 text-[#d13f44] dark:text-[#f77479] shadow-sm">
                                <TrendingUp className="w-4 h-4" />

                                <span className="text-xs font-bold tracking-widest uppercase">
                                    ⏱️ {timeSaved}m / 💰 $
                                    {moneySaved} Saved
                                </span>
                            </div>
                        </BadgeTooltip>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {data.validationFlags
                            ?.unsupportedCurrency && (
                            <div
                                className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border border-[#e5484d]/30 bg-[#e5484d]/10 text-[#d13f44] dark:text-[#f77479] flex items-center space-x-1.5"
                                title="Exchange rates not available for this currency"
                            >
                                <AlertCircle className="w-3 h-3" />
                                <span>
                                    UNKNOWN CURRENCY
                                </span>
                            </div>
                        )}

                        {data.validationFlags
                            ?.unsupportedLanguage && (
                            <div
                                className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border border-[#f59e0b]/30 bg-[#f59e0b]/10 text-[#b45309] dark:text-[#fbbf24] flex items-center space-x-1.5"
                                title="UI translation not supported"
                            >
                                <Languages className="w-3 h-3" />
                                <span>
                                    UNSUPPORTED LANG
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                        <div className="flex justify-between items-center">
                            <label className="flex items-center text-[9px] font-bold text-[#6d6f78] dark:text-[#949ba4] uppercase tracking-widest">
                                <Building className="w-3 h-3 mr-1.5 opacity-70" />
                                {t.vendorName}
                            </label>
                        </div>

                        <input
                            type="text"
                            value={data.vendorName}
                            onChange={(event) =>
                                handleHeaderChange(
                                    "vendorName",
                                    event.target.value,
                                )
                            }
                            title={data.vendorName}
                            className="w-full bg-[#f7f7f8] dark:bg-[#1e1f22] border border-[#d8d9dc] dark:border-[#3f4147] rounded-lg px-2 py-1.5 text-xs text-[#313338] dark:text-[#f2f3f5] font-bold focus:outline-none focus:border-[#e5484d] focus:ring-1 focus:ring-[#e5484d]/20 transition-all placeholder:text-[#949ba4]"
                        />
                    </div>

                    <div className="space-y-1">
                        <div className="flex justify-between items-center">
                            <label className="flex items-center text-[9px] font-bold text-[#6d6f78] dark:text-[#949ba4] uppercase tracking-widest">
                                <Calendar className="w-3 h-3 mr-1.5 opacity-70" />
                                {t.invoiceDate}
                            </label>

                            {isStaleDate(
                                data.invoiceDate,
                            ) && (
                                <div
                                    className="flex items-center space-x-1 bg-[#f59e0b]/10 px-1.5 py-0.5 rounded text-[8px] font-bold text-[#b45309] dark:text-[#fbbf24]"
                                    title={
                                        t.staleDataWarning
                                    }
                                >
                                    <History className="w-2.5 h-2.5" />
                                    <span>
                                        {t.staleTag}
                                    </span>
                                </div>
                            )}
                        </div>

                        <input
                            type="date"
                            value={data.invoiceDate}
                            onChange={(event) =>
                                handleHeaderChange(
                                    "invoiceDate",
                                    event.target.value,
                                )
                            }
                            title={data.invoiceDate}
                            className="w-full bg-[#f7f7f8] dark:bg-[#1e1f22] border border-[#d8d9dc] dark:border-[#3f4147] rounded-lg px-2 py-1.5 text-xs text-[#313338] dark:text-[#f2f3f5] font-medium focus:outline-none focus:border-[#e5484d] focus:ring-1 focus:ring-[#e5484d]/20 transition-all"
                        />
                    </div>

                    <div className="space-y-1">
                        <div className="flex justify-between items-center">
                            <label className="flex items-center text-[9px] font-bold text-[#6d6f78] dark:text-[#949ba4] uppercase tracking-widest">
                                <Tag className="w-3 h-3 mr-1.5 opacity-70" />
                                {t.currency}
                            </label>
                        </div>

                        <input
                            type="text"
                            value={
                                displayCurrencySymbol
                            }
                            onChange={(event) =>
                                !isReadOnlyHeader &&
                                handleHeaderChange(
                                    "currencySymbol",
                                    event.target.value,
                                )
                            }
                            title={
                                displayCurrencySymbol
                            }
                            className={`w-full bg-[#f7f7f8] dark:bg-[#1e1f22] border rounded-lg px-2 py-1.5 text-xs text-[#313338] dark:text-[#f2f3f5] font-medium focus:outline-none transition-all ${
                                isReadOnlyHeader
                                    ? "border-transparent cursor-default"
                                    : "border-[#d8d9dc] dark:border-[#3f4147] focus:border-[#e5484d] focus:ring-1 focus:ring-[#e5484d]/20"
                            }`}
                            maxLength={3}
                            readOnly={
                                isReadOnlyHeader
                            }
                        />
                    </div>

                    <div className="space-y-1">
                        <div className="flex justify-between items-center">
                            <label className="flex items-center text-[9px] font-bold text-[#6d6f78] dark:text-[#949ba4] uppercase tracking-widest">
                                <span className="mr-1.5 opacity-70 font-bold">
                                    {
                                        displayCurrencySymbol
                                    }
                                </span>
                                {t.totalAmount}
                            </label>
                        </div>

                        <input
                            type="number"
                            step="0.01"
                            value={
                                displayTotalAmount
                            }
                            onChange={(event) =>
                                !isReadOnlyHeader &&
                                handleHeaderChange(
                                    "totalAmount",
                                    parseFloat(
                                        event.target
                                            .value,
                                    ) || 0,
                                )
                            }
                            title={displayTotalAmount.toString()}
                            className={`w-full bg-[#f7f7f8] dark:bg-[#1e1f22] border rounded-lg px-2 py-1.5 text-xs text-[#313338] dark:text-[#f2f3f5] font-bold focus:outline-none transition-all ${
                                isReadOnlyHeader
                                    ? "border-transparent cursor-default"
                                    : "border-[#d8d9dc] dark:border-[#3f4147] focus:border-[#e5484d] focus:ring-1 focus:ring-[#e5484d]/20"
                            }`}
                            readOnly={
                                isReadOnlyHeader
                            }
                        />
                    </div>
                </div>

                {data.language &&
                    data.language !==
                        "Original" && (
                        <div className="mt-2 text-[9px] text-[#949ba4] font-mono flex items-center">
                            <Languages className="w-3 h-3 mr-1.5 opacity-50" />

                            DETECTED LANGUAGE:{" "}

                            <span className="text-[#e5484d] ml-1 font-bold uppercase">
                                {data.language}
                            </span>
                        </div>
                    )}
            </div>

            <div className="md:hidden space-y-4">
                {data.lineItems.map(
                    (item, index) => {
                        const calculatedTotal =
                            item.quantity *
                            item.unitPrice;

                        const extractedTotal =
                            item.totalAmount || 0;

                        const hasVariance =
                            Math.abs(
                                calculatedTotal -
                                    extractedTotal,
                            ) > 0.01;

                        const isRisk =
                            isHighRiskItem(
                                item.glCategory,
                                item.unitPrice,
                            );

                        return (
                            <div
                                key={index}
                                className={`backdrop-blur-md p-4 rounded-xl border shadow-sm space-y-3 ${
                                    hasVariance
                                        ? "bg-[#e5484d]/5 border-[#e5484d]/25"
                                        : isRisk
                                          ? "bg-[#f97316]/5 border-[#f97316]/25"
                                          : "bg-white/70 dark:bg-[#2b2d31] border-[#d8d9dc] dark:border-[#3f4147]"
                                }`}
                            >
                                <div>
                                    <label className="text-[9px] font-bold text-[#6d6f78] dark:text-[#949ba4] uppercase tracking-widest block mb-1">
                                        {
                                            t.description
                                        }
                                    </label>

                                    <AutoResizeTextarea
                                        value={
                                            item.description
                                        }
                                        onChange={(
                                            event,
                                        ) =>
                                            handleLineItemChange(
                                                index,
                                                "description",
                                                event
                                                    .target
                                                    .value,
                                            )
                                        }
                                        className="w-full bg-transparent border-b border-dashed border-[#d8d9dc] dark:border-[#4e5058] text-sm font-medium text-[#313338] dark:text-[#dbdee1] focus:outline-none focus:border-[#e5484d] pb-1"
                                        isRisk={
                                            isRisk
                                        }
                                        title={
                                            item.description
                                        }
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-[9px] font-bold text-[#6d6f78] dark:text-[#949ba4] uppercase tracking-widest">
                                            {t.sku}
                                        </label>

                                        <input
                                            value={
                                                item.sku
                                            }
                                            onChange={(
                                                event,
                                            ) =>
                                                handleLineItemChange(
                                                    index,
                                                    "sku",
                                                    event
                                                        .target
                                                        .value,
                                                )
                                            }
                                            title={
                                                item.sku
                                            }
                                            className="w-full bg-transparent text-xs font-mono text-[#4e5058] dark:text-[#b5bac1] border-b border-transparent focus:border-[#e5484d] focus:outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[9px] font-bold text-[#6d6f78] dark:text-[#949ba4] uppercase tracking-widest">
                                            {
                                                t.glCategory
                                            }
                                        </label>

                                        <input
                                            value={
                                                item.glCategory
                                            }
                                            onChange={(
                                                event,
                                            ) =>
                                                handleLineItemChange(
                                                    index,
                                                    "glCategory",
                                                    event
                                                        .target
                                                        .value,
                                                )
                                            }
                                            title={
                                                item.glCategory
                                            }
                                            className="w-full bg-transparent text-xs font-bold text-[#d13f44] dark:text-[#f77479] border-b border-transparent focus:border-[#e5484d] focus:outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[9px] font-bold text-[#6d6f78] dark:text-[#949ba4] uppercase tracking-widest">
                                            {t.qty}
                                        </label>

                                        <input
                                            type="number"
                                            value={
                                                item.quantity
                                            }
                                            onChange={(
                                                event,
                                            ) =>
                                                handleLineItemChange(
                                                    index,
                                                    "quantity",
                                                    parseFloat(
                                                        event
                                                            .target
                                                            .value,
                                                    ) ||
                                                        0,
                                                )
                                            }
                                            title={item.quantity.toString()}
                                            className="w-full bg-transparent text-xs font-bold text-[#313338] dark:text-[#dbdee1] border-b border-transparent focus:border-[#e5484d] focus:outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[9px] font-bold text-[#6d6f78] dark:text-[#949ba4] uppercase tracking-widest">
                                            {
                                                t.unitPrice
                                            }
                                        </label>

                                        <input
                                            type="number"
                                            value={
                                                item.unitPrice
                                            }
                                            onChange={(
                                                event,
                                            ) =>
                                                handleLineItemChange(
                                                    index,
                                                    "unitPrice",
                                                    parseFloat(
                                                        event
                                                            .target
                                                            .value,
                                                    ) ||
                                                        0,
                                                )
                                            }
                                            title={item.unitPrice.toString()}
                                            className={`w-full bg-transparent text-xs font-bold border-b border-transparent focus:border-[#e5484d] focus:outline-none text-right ${
                                                isRisk
                                                    ? "text-[#e5484d]"
                                                    : "text-[#313338] dark:text-[#dbdee1]"
                                            }`}
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-between items-end border-t border-[#d8d9dc] dark:border-[#3f4147] pt-3">
                                    <button
                                        onClick={() =>
                                            removeLineItem(
                                                index,
                                            )
                                        }
                                        className="text-[#e5484d] p-2 bg-[#e5484d]/10 hover:bg-[#e5484d]/20 rounded-lg transition-colors"
                                        title="Remove line item"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>

                                    <div className="text-right">
                                        <label className="text-[9px] font-bold text-[#6d6f78] dark:text-[#949ba4] uppercase tracking-widest block">
                                            {
                                                t.lineTotal
                                            }
                                        </label>

                                        <span
                                            className={`text-lg font-bold ${
                                                hasVariance
                                                    ? "text-[#e5484d]"
                                                    : "text-[#313338] dark:text-[#f2f3f5]"
                                            }`}
                                        >
                                            {
                                                currencySymbol
                                            }
                                            {item.totalAmount?.toFixed(
                                                2,
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    },
                )}

                <button
                    onClick={addLineItem}
                    className="w-full py-3 flex items-center justify-center text-xs font-bold uppercase tracking-widest text-[#6d6f78] dark:text-[#949ba4] hover:text-[#e5484d] hover:bg-[#e5484d]/5 rounded-xl transition-all border border-dashed border-[#d8d9dc] dark:border-[#4e5058] hover:border-[#e5484d]/40"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    {t.addLineItem}
                </button>
            </div>

            <div className="hidden md:block bg-white/60 dark:bg-[#2b2d31] backdrop-blur-md rounded-2xl border border-[#d8d9dc] dark:border-[#3f4147] shadow-2xl transition-colors duration-300 overflow-hidden">
                <div className="p-3 border-b border-[#d8d9dc] dark:border-[#3f4147] flex justify-between items-center bg-[#f7f7f8]/70 dark:bg-[#313338]">
                    <div className="flex items-center space-x-4">
                        <h3 className="font-semibold text-[#313338] dark:text-[#dbdee1] tracking-wide text-xs uppercase">
                            {t.lineItems}
                        </h3>

                        <span className="text-[10px] text-[#6d6f78] dark:text-[#949ba4] font-mono bg-[#efeff1] dark:bg-[#1e1f22] px-2 py-0.5 rounded-full">
                            {
                                data.lineItems
                                    .length
                            }{" "}
                            {t.itemsDetected}
                        </span>
                    </div>

                    {hasMathMismatch && (
                        <button
                            onClick={
                                recalculateTotals
                            }
                            className="flex items-center space-x-1 px-2 py-1 bg-[#e5484d]/10 text-[#d13f44] dark:text-[#f77479] rounded text-[10px] font-bold uppercase tracking-wide hover:bg-[#e5484d]/20 transition-colors border border-[#e5484d]/30"
                        >
                            <Calculator className="w-3 h-3" />
                            <span>{t.fixAll}</span>
                        </button>
                    )}
                </div>

                <div className="w-full overflow-x-auto">
                    <table className="w-full text-left border-collapse table-fixed min-w-[800px]">
                        <thead>
                            <tr className="bg-[#efeff1]/70 dark:bg-[#1e1f22]/70 border-b border-[#d8d9dc] dark:border-[#3f4147] text-[#6d6f78] dark:text-[#949ba4] text-[10px] uppercase tracking-widest">
                                <th
                                    className="p-2 font-bold w-[12%] whitespace-nowrap"
                                    title={t.sku}
                                >
                                    {t.sku}
                                </th>

                                <th
                                    className={`p-2 font-bold ${
                                        isActuallyDifferent
                                            ? "w-[28%]"
                                            : "w-[32%]"
                                    }`}
                                    title={
                                        t.description
                                    }
                                >
                                    {
                                        t.description
                                    }
                                </th>

                                <th
                                    className={`p-2 font-bold ${
                                        isActuallyDifferent
                                            ? "w-[18%]"
                                            : "w-[20%]"
                                    }`}
                                    title={
                                        t.glCategory
                                    }
                                >
                                    {t.glCategory}
                                </th>

                                <th
                                    className="p-2 font-bold w-[7%] text-center whitespace-nowrap"
                                    title={t.qty}
                                >
                                    {t.qty}
                                </th>

                                <th
                                    className="p-2 font-bold w-[12%] text-right whitespace-nowrap"
                                    title={
                                        t.unitPrice
                                    }
                                >
                                    {t.unitPrice}
                                </th>

                                <th
                                    className="p-2 font-bold w-[12%] text-right whitespace-nowrap"
                                    title={
                                        t.lineTotal
                                    }
                                >
                                    {t.lineTotal}
                                </th>

                                {isActuallyDifferent && (
                                    <th
                                        className="p-2 font-bold w-[12%] text-right bg-[#10b981]/5 text-[#047857] dark:text-[#6ee7b7] border-l border-[#10b981]/20 whitespace-nowrap"
                                        title={
                                            t.convertedTotal
                                        }
                                    >
                                        {
                                            t.convertedTotal
                                        }
                                    </th>
                                )}

                                <th className="p-2 w-[4%] text-center" />
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-[#d8d9dc] dark:divide-[#3f4147]">
                            {data.lineItems.map(
                                (item, index) => {
                                    const calculatedTotal =
                                        item.quantity *
                                        item.unitPrice;

                                    const extractedTotal =
                                        item.totalAmount ||
                                        0;

                                    const hasVariance =
                                        Math.abs(
                                            calculatedTotal -
                                                extractedTotal,
                                        ) > 0.01;

                                    const isRisk =
                                        isHighRiskItem(
                                            item.glCategory,
                                            item.unitPrice,
                                        );

                                    const convertedValue =
                                        isActuallyDifferent
                                            ? extractedTotal *
                                              rate
                                            : 0;

                                    return (
                                        <tr
                                            key={
                                                index
                                            }
                                            className={`transition-all duration-200 group ${
                                                hasVariance
                                                    ? "bg-[#e5484d]/5"
                                                    : isRisk
                                                      ? "bg-[#f97316]/5"
                                                      : "hover:bg-[#efeff1]/60 dark:hover:bg-[#313338]"
                                            }`}
                                        >
                                            <td className="p-2 align-top">
                                                <AutoResizeTextarea
                                                    value={
                                                        item.sku ||
                                                        ""
                                                    }
                                                    onChange={(
                                                        event,
                                                    ) =>
                                                        handleLineItemChange(
                                                            index,
                                                            "sku",
                                                            event
                                                                .target
                                                                .value,
                                                        )
                                                    }
                                                    className="w-full bg-transparent border border-transparent hover:border-[#b5bac1] dark:hover:border-[#4e5058] focus:border-[#e5484d]/60 rounded px-1.5 py-1 text-[#4e5058] dark:text-[#b5bac1] text-xs focus:outline-none focus:bg-white dark:focus:bg-[#1e1f22] font-mono resize-none overflow-hidden min-h-[28px]"
                                                    placeholder={
                                                        t.sku
                                                    }
                                                    title={
                                                        item.sku
                                                    }
                                                />
                                            </td>

                                            <td className="p-2 align-top relative">
                                                <AutoResizeTextarea
                                                    value={
                                                        item.description
                                                    }
                                                    onChange={(
                                                        event,
                                                    ) =>
                                                        handleLineItemChange(
                                                            index,
                                                            "description",
                                                            event
                                                                .target
                                                                .value,
                                                        )
                                                    }
                                                    className="w-full bg-transparent border border-transparent hover:border-[#b5bac1] dark:hover:border-[#4e5058] focus:border-[#e5484d]/60 rounded px-1.5 py-1 text-[#313338] dark:text-[#dbdee1] text-xs focus:outline-none focus:bg-white dark:focus:bg-[#1e1f22] resize-none overflow-hidden min-h-[28px] whitespace-normal break-words leading-relaxed"
                                                    isRisk={
                                                        isRisk
                                                    }
                                                    title={
                                                        item.description
                                                    }
                                                />

                                                {isRisk && (
                                                    <div className="absolute top-1 right-1 pointer-events-none z-10">
                                                        <span className="flex items-center space-x-1 text-[8px] font-bold text-[#e5484d] bg-[#e5484d]/10 border border-[#e5484d]/25 px-1 py-0.5 rounded uppercase tracking-wider shadow-sm">
                                                            <ShieldAlert className="w-3 h-3" />
                                                        </span>
                                                    </div>
                                                )}
                                            </td>

                                            <td className="p-2 align-top">
                                                <div className="relative">
                                                    <AutoResizeTextarea
                                                        value={
                                                            item.glCategory ||
                                                            ""
                                                        }
                                                        onChange={(
                                                            event,
                                                        ) =>
                                                            handleLineItemChange(
                                                                index,
                                                                "glCategory",
                                                                event
                                                                    .target
                                                                    .value,
                                                            )
                                                        }
                                                        className={`w-full border rounded-xl px-2 py-1.5 text-[10px] font-bold text-left focus:outline-none transition-all shadow-sm resize-none overflow-hidden min-h-[26px] whitespace-normal break-words leading-tight ${
                                                            isRisk
                                                                ? "bg-[#e5484d]/10 text-[#d13f44] dark:text-[#f77479] border-[#e5484d]/30 focus:border-[#e5484d]/60"
                                                                : "bg-[#6d6f78]/10 text-[#4e5058] dark:text-[#b5bac1] border-transparent hover:border-[#6d6f78]/30 focus:border-[#e5484d]/50 focus:bg-[#e5484d]/5"
                                                        }`}
                                                        placeholder="Uncategorized"
                                                        title={
                                                            item.glCategory
                                                        }
                                                    />
                                                </div>
                                            </td>

                                            <td className="p-2 align-top">
                                                <input
                                                    type="number"
                                                    value={
                                                        item.quantity
                                                    }
                                                    onChange={(
                                                        event,
                                                    ) =>
                                                        handleLineItemChange(
                                                            index,
                                                            "quantity",
                                                            parseFloat(
                                                                event
                                                                    .target
                                                                    .value,
                                                            ) ||
                                                                0,
                                                        )
                                                    }
                                                    title={item.quantity.toString()}
                                                    className="w-full bg-transparent border border-transparent hover:border-[#b5bac1] dark:hover:border-[#4e5058] focus:border-[#e5484d]/60 rounded px-1 py-1 text-[#313338] dark:text-[#dbdee1] text-xs text-center focus:outline-none focus:bg-white dark:focus:bg-[#1e1f22] font-medium"
                                                />
                                            </td>

                                            <td className="p-2 text-right align-top">
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={
                                                        item.unitPrice
                                                    }
                                                    onChange={(
                                                        event,
                                                    ) =>
                                                        handleLineItemChange(
                                                            index,
                                                            "unitPrice",
                                                            parseFloat(
                                                                event
                                                                    .target
                                                                    .value,
                                                            ) ||
                                                                0,
                                                        )
                                                    }
                                                    title={item.unitPrice.toString()}
                                                    className={`w-full bg-transparent border border-transparent hover:border-[#b5bac1] dark:hover:border-[#4e5058] focus:border-[#e5484d]/60 rounded px-1 py-1 text-xs text-right focus:outline-none focus:bg-white dark:focus:bg-[#1e1f22] font-medium ${
                                                        isRisk
                                                            ? "text-[#e5484d] font-bold"
                                                            : "text-[#313338] dark:text-[#dbdee1]"
                                                    }`}
                                                />
                                            </td>

                                            <td className="p-2 text-right pr-2 relative align-top">
                                                <div className="flex items-center justify-end space-x-1">
                                                    {hasVariance && (
                                                        <div className="group/tooltip relative">
                                                            <AlertTriangle className="w-3.5 h-3.5 text-[#f59e0b] cursor-help" />

                                                            <div className="absolute bottom-full right-0 mb-2 w-48 bg-[#2b2d31] dark:bg-[#111214]/95 backdrop-blur-md text-xs text-white p-3 rounded-lg border border-[#3f4147] shadow-xl opacity-0 group-hover/tooltip:opacity-100 transition-all pointer-events-auto z-10 transform translate-y-2 group-hover/tooltip:translate-y-0 duration-200">
                                                                <span className="block font-bold text-[#fbbf24] mb-1 uppercase tracking-wide text-[10px]">
                                                                    {
                                                                        t.mathMismatch
                                                                    }
                                                                </span>

                                                                <div className="flex justify-between items-center mt-2">
                                                                    <span className="font-mono text-[#f77479]">
                                                                        {
                                                                            currencySymbol
                                                                        }
                                                                        {calculatedTotal.toFixed(
                                                                            2,
                                                                        )}
                                                                    </span>

                                                                    <button
                                                                        onClick={() =>
                                                                            recalculateRow(
                                                                                index,
                                                                            )
                                                                        }
                                                                        className="px-2 py-0.5 bg-[#e5484d] text-white rounded text-[9px] hover:bg-[#d13f44] font-bold transition-colors"
                                                                    >
                                                                        {
                                                                            t.recalculate
                                                                        }
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="flex items-center w-full justify-end">
                                                        <span className="text-[#6d6f78] dark:text-[#949ba4] mr-0.5 text-[10px] font-medium">
                                                            {
                                                                currencySymbol
                                                            }
                                                        </span>

                                                        <input
                                                            type="number"
                                                            step="0.01"
                                                            value={
                                                                item.totalAmount
                                                            }
                                                            onChange={(
                                                                event,
                                                            ) =>
                                                                handleLineItemChange(
                                                                    index,
                                                                    "totalAmount",
                                                                    parseFloat(
                                                                        event
                                                                            .target
                                                                            .value,
                                                                    ) ||
                                                                        0,
                                                                )
                                                            }
                                                            title={item.totalAmount?.toString()}
                                                            className={`w-full min-w-0 bg-transparent border border-transparent hover:border-[#b5bac1] dark:hover:border-[#4e5058] focus:border-[#e5484d]/60 rounded px-1 py-1 text-xs text-right focus:outline-none focus:bg-white dark:focus:bg-[#1e1f22] font-bold ${
                                                                hasVariance
                                                                    ? "text-[#e5484d]"
                                                                    : "text-[#313338] dark:text-[#dbdee1]"
                                                            }`}
                                                        />
                                                    </div>
                                                </div>
                                            </td>

                                            {isActuallyDifferent && (
                                                <td className="p-2 text-right pr-2 bg-[#10b981]/5 border-l border-[#10b981]/20 align-top">
                                                    <div
                                                        className="font-mono text-xs font-bold text-[#047857] dark:text-[#6ee7b7] py-1"
                                                        title="Converted Value"
                                                    >
                                                        {convertedValue.toFixed(
                                                            2,
                                                        )}
                                                    </div>
                                                </td>
                                            )}

                                            <td className="p-2 text-center align-top">
                                                <button
                                                    onClick={() =>
                                                        removeLineItem(
                                                            index,
                                                        )
                                                    }
                                                    className="p-1.5 mt-0.5 text-[#949ba4] dark:text-[#6d6f78] hover:text-[#e5484d] hover:bg-[#e5484d]/10 rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 transform scale-90 hover:scale-100"
                                                    tabIndex={
                                                        -1
                                                    }
                                                    title="Remove line item"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                },
                            )}

                            {data.lineItems
                                .length === 0 && (
                                <tr>
                                    <td
                                        colSpan={
                                            isActuallyDifferent
                                                ? 8
                                                : 7
                                        }
                                        className="p-8 text-center text-[#6d6f78] dark:text-[#949ba4] italic text-xs"
                                    >
                                        {
                                            t.noLineItems
                                        }
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="p-3 border-t border-[#d8d9dc] dark:border-[#3f4147] bg-[#f7f7f8]/60 dark:bg-[#1e1f22]/40">
                    <button
                        onClick={addLineItem}
                        className="w-full py-2.5 flex items-center justify-center text-xs font-bold uppercase tracking-widest text-[#6d6f78] dark:text-[#949ba4] hover:text-[#e5484d] hover:bg-[#e5484d]/5 rounded-lg transition-all border border-dashed border-[#d8d9dc] dark:border-[#4e5058] hover:border-[#e5484d]/40"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        {t.addLineItem}
                    </button>
                </div>
            </div>
        </div>
    );
};