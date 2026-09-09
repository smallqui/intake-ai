export const CURRENCY_RATES = {
  'USD': 1.0,
  'EUR': 0.92, // 1 USD = 0.92 EUR
  'GBP': 0.79, // 1 USD = 0.79 GBP
  'JPY': 152.0,
  'CNY': 7.24,
  'CAD': 1.39,
  'MXN': 20.3,
  'AUD': 1.54,
  'KRW': 1300.0,
  'INR': 84.4
};

export const SYMBOL_MAP = {
  '$': 'USD',
  '€': 'EUR',
  '£': 'GBP',
  '¥': 'JPY',
  '元': 'CNY',
  'C$': 'CAD',
  'Mex$': 'MXN',
  'A$': 'AUD',
  '₩': 'KRW',
  '₹': 'INR'
};

export const CODE_TO_SYMBOL = {
  'USD': '$',
  'EUR': '€',
  'GBP': '£',
  'JPY': '¥',
  'CNY': '¥',
  'CAD': 'C$',
  'MXN': '$',
  'AUD': 'A$',
  'KRW': '₩',
  'INR': '₹'
};

export const getCurrencyCode = (symbol) => {
  // Simple heuristic: if symbol is already a 3-letter code, return it
  if (symbol && symbol.length === 3 && /^[A-Z]+$/.test(symbol)) return symbol;
  return SYMBOL_MAP[symbol] || 'USD'; // Default to USD if unknown
};

export const getExchangeRate = (sourceSymbol, targetCode) => {
  const sourceCode = getCurrencyCode(sourceSymbol);

  if (sourceCode === targetCode) return { rate: 1, sourceCode };

  const sourceRate = CURRENCY_RATES[sourceCode] || 1;
  const targetRate = CURRENCY_RATES[targetCode] || 1;

  // Amount(Target) = Amount(Source) * (TargetRate / SourceRate)
  // Because rates are defined as "Units per 1 USD"
  // Example: USD(1) -> EUR(0.92). Rate = 0.92/1 = 0.92.
  const rate = targetRate / sourceRate;

  console.log(`[Currency Exchange] ${sourceCode} (${sourceRate}) -> ${targetCode} (${targetRate}) | Multiplier: ${rate}`);

  return { rate, sourceCode };
};
