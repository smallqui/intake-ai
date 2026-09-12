import { Type } from "@google/genai";

import {
    CURRENCY_RATES,
    getCurrencyCode,
} from "./currency";

import { translations } from "./translations";

/**
 * Structured response schema used by Gemini when extracting invoice data.
 *
 * The schema constrains the model to return predictable document metadata,
 * line items, language information, and GL categorization details.
 */
export const invoiceSchema = {
    type: Type.OBJECT,

    properties: {
        documentType: {
            type: Type.STRING,
            description:
                "The type of document. Classify strictly as 'INVOICE', 'PACKING SLIP', or 'BOL'. Default to 'INVOICE'.",
        },

        vendorName: {
            type: Type.STRING,
            description:
                "The name of the vendor or supplier issuing the invoice.",
        },

        invoiceDate: {
            type: Type.STRING,
            description:
                "The date of the invoice in YYYY-MM-DD format.",
        },

        totalAmount: {
            type: Type.NUMBER,
            description:
                "The total amount due on the invoice.",
        },

        currencySymbol: {
            type: Type.STRING,
            description:
                "The currency symbol used in the invoice (e.g., $, €, £, ¥). Default to $ if unsure.",
        },

        language: {
            type: Type.STRING,
            description:
                "The primary language of the document (e.g., English, Spanish, Thai, Vietnamese).",
        },

        languageConfidence: {
            type: Type.NUMBER,
            description:
                "Confidence score (0-100) for the detected language.",
        },

        lineItems: {
            type: Type.ARRAY,
            description:
                "List of items purchased.",

            items: {
                type: Type.OBJECT,

                properties: {
                    sku: {
                        type: Type.STRING,
                        description:
                            "Stock Keeping Unit or Product Code.",
                    },

                    description: {
                        type: Type.STRING,
                        description:
                            "Description of the item.",
                    },

                    glCategory: {
                        type: Type.STRING,
                        description:
                            "Inferred General Ledger category based on item description.",
                    },

                    quantity: {
                        type: Type.NUMBER,
                        description:
                            "Quantity purchased.",
                    },

                    unitPrice: {
                        type: Type.NUMBER,
                        description:
                            "Price per individual unit.",
                    },

                    totalAmount: {
                        type: Type.NUMBER,
                        description:
                            "The total cost for this line item (usually quantity * unit price).",
                    },

                    glConfidence: {
                        type: Type.NUMBER,
                        description:
                            "Confidence score (0-100) for the inferred GL category.",
                    },

                    glReasoning: {
                        type: Type.STRING,
                        description:
                            "Short explanation for why this GL category was chosen.",
                    },
                },

                required: [
                    "description",
                    "quantity",
                    "unitPrice",
                    "totalAmount",
                    "glCategory",
                ],
            },
        },
    },

    required: [
        "documentType",
        "vendorName",
        "totalAmount",
        "lineItems",
        "currencySymbol",
        "language",
    ],
};

/**
 * Converts a loosely formatted numeric value into a JavaScript number.
 *
 * Currency symbols, commas, and other non-numeric characters are removed
 * before parsing. Invalid or empty values fall back to zero.
 *
 * @param {string|number|null|undefined} value - Value to normalize.
 * @returns {number} Parsed numeric value.
 */
export const cleanNumber = (value) => {
    if (typeof value === "number"){
        return value;
    }

    if (!value){
        return 0;
    }

    const cleaned = String(value).replace(
        /[^0-9.-]/g,
        "",
    );

    return parseFloat(cleaned) || 0;
};

/**
 * Generates realistic sample invoice data for Demo Mode.
 *
 * Demo data follows the same general structure as a live Gemini extraction,
 * allowing the application workflow to be demonstrated without using the
 * external API.
 *
 * @returns {Object} Generated sample invoice.
 */
export const generateMockInvoice = () => {
    const vendors = [
        "Acme Supply Co.",
        "Global Logistics Ltd.",
        "Apex Components",
        "Northside Services",
        "Quantum Materials",
    ];

    const categories = [
        "Raw Materials",
        "Office Supplies",
        "Freight",
        "Maintenance",
        "Professional Services",
    ];

    const currencies = [
        "$",
        "€",
        "£",
        "¥",
    ];

    const vendor =
        vendors[
            Math.floor(
                Math.random() *
                    vendors.length,
            )
        ];

    const currency =
        currencies[
            Math.floor(
                Math.random() *
                    currencies.length,
            )
        ];

    const itemCount =
        Math.floor(Math.random() * 8) +
        3;

    const lineItems = [];

    let total = 0;

    for (
        let i = 0;
        i < itemCount;
        i++
    ){
        const quantity =
            Math.floor(
                Math.random() * 10,
            ) + 1;

        const unitPrice = parseFloat(
            (
                Math.random() * 500 +
                10
            ).toFixed(2),
        );

        const lineTotal = parseFloat(
            (
                quantity *
                unitPrice
            ).toFixed(2),
        );

        const category =
            categories[
                Math.floor(
                    Math.random() *
                        categories.length,
                )
            ];

        lineItems.push({
            sku: `SKU-${Math.floor(
                Math.random() * 10000,
            )}`,
            description:
                `Sample Item Description ${i + 1} - ${vendor} Part`,
            glCategory: category,
            quantity,
            unitPrice,
            totalAmount: lineTotal,
            glConfidence:
                Math.floor(
                    Math.random() * 20,
                ) + 80,
            glReasoning:
                `Matched keywords in description with '${category}'`,
        });

        total += lineTotal;
    }

    return {
        id: crypto.randomUUID(),
        documentType:
            Math.random() > 0.8
                ? "PACKING SLIP"
                : "INVOICE",
        vendorName: vendor,
        invoiceDate: new Date()
            .toISOString()
            .split("T")[0],
        totalAmount: parseFloat(
            total.toFixed(2),
        ),
        currencySymbol: currency,
        lineItems,
        isDemo: true,
        language: "Original",
        detectedLanguage: "English",
        languageConfidence: 99,
        confidenceScore: "High",

        validationFlags: {
            hasZeroPrices: false,
            lowItemCount: false,
            missingMetadata: false,
            unsupportedCurrency: false,
            unsupportedLanguage: false,
        },
    };
};

/**
 * Checks text for simple patterns resembling sensitive personal data.
 *
 * Currently detects:
 * - SSN-like values
 * - Credit-card-like numeric sequences
 * - Email addresses
 *
 * This is a lightweight heuristic intended to surface possible sensitive data
 * for user review rather than provide formal PII classification.
 *
 * @param {string} text - Text to inspect.
 * @returns {boolean} Whether a sensitive-data pattern was detected.
 */
const detectSensitiveData = (text) => {
    if (!text){
        return false;
    }

    const patterns = [
        /\b\d{3}-\d{2}-\d{4}\b/,
        /\b(?:\d[ -]*?){13,16}\b/,
        /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/,
    ];

    return patterns.some(
        (pattern) =>
            pattern.test(text),
    );
};

/**
 * Evaluates extracted invoice data and attaches quality-assessment metadata.
 *
 * Validation checks include:
 * - Missing vendor or total information
 * - Zero-value line items
 * - Unusually small line-item counts
 * - Unsupported currencies
 * - Low-confidence unsupported languages
 * - Possible sensitive data
 *
 * A High, Medium, or Low confidence score is assigned based on the detected
 * validation conditions.
 *
 * @param {Object} data - Extracted invoice data.
 * @returns {Object} The invoice data with confidence, validation, and
 * sensitive-data metadata attached.
 */
export const assessExtractionQuality = (
    data,
) => {
    const flags = {
        hasZeroPrices: false,
        lowItemCount: false,
        missingMetadata: false,
        unsupportedCurrency: false,
        unsupportedLanguage: false,
    };

    const zeroPriceItems =
        data.lineItems.filter(
            (item) =>
                item.unitPrice === 0 &&
                item.totalAmount === 0,
        );

    if (
        zeroPriceItems.length > 0 &&
        data.lineItems.length > 0
    ){
        flags.hasZeroPrices = true;
    }

    if (data.lineItems.length < 2){
        flags.lowItemCount = true;
    }

    if (
        !data.vendorName ||
        data.vendorName.toLowerCase() ===
            "unknown" ||
        data.totalAmount === 0
    ){
        flags.missingMetadata = true;
    }

    const currencyCode =
        getCurrencyCode(
            data.currencySymbol,
        );

    if (
        !CURRENCY_RATES[
            currencyCode
        ]
    ){
        flags.unsupportedCurrency =
            true;
    }

    if (
        data.language &&
        data.language !== "Original"
    ){
        const supportedLanguages =
            Object.keys(translations);

        const extendedWhitelist = [
            ...supportedLanguages,
            "Italian",
            "French",
            "Dutch",
            "Portuguese",
            "Swedish",
            "Danish",
        ];

        const isSupported =
            extendedWhitelist.some(
                (language) =>
                    language.toLowerCase() ===
                    data.language?.toLowerCase(),
            );

        const confidence =
            data.languageConfidence ||
            0;

        if (
            !isSupported &&
            confidence < 90
        ){
            flags.unsupportedLanguage =
                true;
        }
    }

    let score = "High";

    if (
        flags.missingMetadata ||
        flags.unsupportedCurrency
    ){
        score = "Low";
    } 
    else if (
        flags.hasZeroPrices ||
        flags.lowItemCount
    ){
        score = "Medium";
    }

    const sensitiveTypes = [];

    if (
        detectSensitiveData(
            data.vendorName || "",
        )
    ){
        sensitiveTypes.push(
            "Vendor PII",
        );
    }

    data.lineItems.forEach(
        (item) => {
            if (
                detectSensitiveData(
                    item.description,
                )
            ){
                if (
                    !sensitiveTypes.includes(
                        "Description PII",
                    )
                ){
                    sensitiveTypes.push(
                        "Description PII",
                    );
                }
            }
        },
    );

    if (sensitiveTypes.length > 0){
        data.hasSensitiveData = true;
        data.sensitiveDataTypes =
            sensitiveTypes;
    }

    data.confidenceScore = score;
    data.validationFlags = flags;

    return data;
};