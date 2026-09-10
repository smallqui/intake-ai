/**
 * Approximate currency rates expressed as units of each currency per 1 USD.
 *
 * These values are static and intended for lightweight/demo conversions rather
 * than real-time financial calculations.
 *
 * @type {Record<string, number>}
 */
export const CURRENCY_RATES = {
    USD: 1.0,
    EUR: 0.92,
    GBP: 0.79,
    JPY: 152.0,
    CNY: 7.24,
    CAD: 1.39,
    MXN: 20.3,
    AUD: 1.54,
    KRW: 1300.0,
    INR: 84.4,
};

/**
 * Maps commonly used currency symbols to ISO-style currency codes.
 *
 * @type {Record<string, string>}
 */
export const SYMBOL_MAP = {
    $: "USD",
    "€": "EUR",
    "£": "GBP",
    "¥": "JPY",
    元: "CNY",
    C$: "CAD",
    Mex$: "MXN",
    A$: "AUD",
    "₩": "KRW",
    "₹": "INR",
};

/**
 * Maps supported currency codes to their preferred display symbols.
 *
 * @type {Record<string, string>}
 */
export const CODE_TO_SYMBOL = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    CNY: "¥",
    CAD: "C$",
    MXN: "$",
    AUD: "A$",
    KRW: "₩",
    INR: "₹",
};

/**
 * Resolves a currency symbol or existing three-letter code to a currency code.
 *
 * Unknown values fall back to USD.
 *
 * @param {string} symbol - Currency symbol or three-letter currency code.
 * @returns {string} Resolved currency code.
 */
export const getCurrencyCode = (symbol) => {
    const isCurrencyCode =
        symbol &&
        symbol.length === 3 &&
        /^[A-Z]+$/.test(symbol);

    if (isCurrencyCode){
        return symbol;
    }

    return SYMBOL_MAP[symbol] || "USD";
};

/**
 * Calculates a conversion multiplier between two supported currencies.
 *
 * Rates are stored as currency units per 1 USD, so conversion is performed
 * by dividing the target rate by the source rate.
 *
 * Example:
 * USD -> EUR = 0.92 / 1.00 = 0.92
 *
 * @param {string} sourceSymbol - Source currency symbol or currency code.
 * @param {string} targetCode - Target three-letter currency code.
 * @returns {{rate: number, sourceCode: string}} Conversion multiplier and resolved source code.
 */
export const getExchangeRate = (
    sourceSymbol,
    targetCode,
) => {
    const sourceCode =
        getCurrencyCode(sourceSymbol);

    if (sourceCode === targetCode){
        return {
            rate: 1,
            sourceCode,
        };
    }

    const sourceRate =
        CURRENCY_RATES[sourceCode] || 1;

    const targetRate =
        CURRENCY_RATES[targetCode] || 1;

    const rate =
        targetRate / sourceRate;

    console.log(
        `[Currency Exchange] ${sourceCode} (${sourceRate}) -> ${targetCode} (${targetRate}) | Multiplier: ${rate}`,
    );

    return {
        rate,
        sourceCode,
    };
};