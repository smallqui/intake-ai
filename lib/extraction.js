import { Type } from '@google/genai';
import { CURRENCY_RATES, getCurrencyCode } from './currency';
import { translations } from './translations';

export const invoiceSchema = {
  type: Type.OBJECT,
  properties: {
    documentType: {
      type: Type.STRING,
      description: "The type of document. Classify strictly as 'INVOICE', 'PACKING SLIP', or 'BOL'. Default to 'INVOICE'.",
    },
    vendorName: { type: Type.STRING, description: 'The name of the vendor or supplier issuing the invoice.' },
    invoiceDate: { type: Type.STRING, description: 'The date of the invoice in YYYY-MM-DD format.' },
    totalAmount: { type: Type.NUMBER, description: 'The total amount due on the invoice.' },
    currencySymbol: { type: Type.STRING, description: 'The currency symbol used in the invoice (e.g., $, €, £, ¥). Default to $ if unsure.' },
    language: { type: Type.STRING, description: 'The primary language of the document (e.g., English, Spanish, Thai, Vietnamese).' },
    languageConfidence: { type: Type.NUMBER, description: 'Confidence score (0-100) for the detected language.' },
    lineItems: {
      type: Type.ARRAY,
      description: 'List of items purchased.',
      items: {
        type: Type.OBJECT,
        properties: {
          sku: { type: Type.STRING, description: 'Stock Keeping Unit or Product Code.' },
          description: { type: Type.STRING, description: 'Description of the item.' },
          glCategory: { type: Type.STRING, description: 'Inferred General Ledger category based on item description.' },
          quantity: { type: Type.NUMBER, description: 'Quantity purchased.' },
          unitPrice: { type: Type.NUMBER, description: 'Price per individual unit.' },
          totalAmount: { type: Type.NUMBER, description: 'The total cost for this line item (usually quantity * unit price).' },
          glConfidence: { type: Type.NUMBER, description: 'Confidence score (0-100) for the inferred GL category.' },
          glReasoning: { type: Type.STRING, description: 'Short explanation for why this GL category was chosen.' },
        },
        required: ['description', 'quantity', 'unitPrice', 'totalAmount', 'glCategory'],
      },
    },
  },
  required: ['documentType', 'vendorName', 'totalAmount', 'lineItems', 'currencySymbol', 'language'],
};

// Helper to clean garbage from numbers
export const cleanNumber = (val) => {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  const cleaned = String(val).replace(/[^0-9.-]/g, '');
  return parseFloat(cleaned) || 0;
};

// Generate realistic mock data (used in Demo Mode — no Gemini call, no API usage)
export const generateMockInvoice = () => {
  const vendors = ['Acme Supply Co.', 'Global Logistics Ltd.', 'Apex Components', 'Northside Services', 'Quantum Materials'];
  const categories = ['Raw Materials', 'Office Supplies', 'Freight', 'Maintenance', 'Professional Services'];
  const currencies = ['$', '€', '£', '¥'];

  const vendor = vendors[Math.floor(Math.random() * vendors.length)];
  const currency = currencies[Math.floor(Math.random() * currencies.length)];
  const itemCount = Math.floor(Math.random() * 8) + 3;

  const lineItems = [];
  let total = 0;

  for (let i = 0; i < itemCount; i++) {
    const qty = Math.floor(Math.random() * 10) + 1;
    const price = parseFloat((Math.random() * 500 + 10).toFixed(2));
    const lineTotal = parseFloat((qty * price).toFixed(2));
    const cat = categories[Math.floor(Math.random() * categories.length)];

    lineItems.push({
      sku: `SKU-${Math.floor(Math.random() * 10000)}`,
      description: `Sample Item Description ${i + 1} - ${vendor} Part`,
      glCategory: cat,
      quantity: qty,
      unitPrice: price,
      totalAmount: lineTotal,
      glConfidence: Math.floor(Math.random() * 20) + 80,
      glReasoning: `Matched keywords in description with '${cat}'`,
    });
    total += lineTotal;
  }

  return {
    id: crypto.randomUUID(),
    documentType: Math.random() > 0.8 ? 'PACKING SLIP' : 'INVOICE',
    vendorName: vendor,
    invoiceDate: new Date().toISOString().split('T')[0],
    totalAmount: parseFloat(total.toFixed(2)),
    currencySymbol: currency,
    lineItems: lineItems,
    isDemo: true,
    language: 'Original',
    detectedLanguage: 'English',
    languageConfidence: 99,
    confidenceScore: 'High',
    validationFlags: {
      hasZeroPrices: false,
      lowItemCount: false,
      missingMetadata: false,
      unsupportedCurrency: false,
      unsupportedLanguage: false,
    },
  };
};

const detectSensitiveData = (text) => {
  if (!text) return false;
  const patterns = [
    /\b\d{3}-\d{2}-\d{4}\b/, // SSN-like
    /\b(?:\d[ -]*?){13,16}\b/, // Credit card-like
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // Email
  ];
  return patterns.some((p) => p.test(text));
};

// Assess extraction quality and assign confidence score/flags
export const assessExtractionQuality = (data) => {
  const flags = {
    hasZeroPrices: false,
    lowItemCount: false,
    missingMetadata: false,
    unsupportedCurrency: false,
    unsupportedLanguage: false,
  };

  const zeroPriceItems = data.lineItems.filter((i) => i.unitPrice === 0 && i.totalAmount === 0);
  if (zeroPriceItems.length > 0 && data.lineItems.length > 0) {
    flags.hasZeroPrices = true;
  }

  if (data.lineItems.length < 2) {
    flags.lowItemCount = true;
  }

  if (!data.vendorName || data.vendorName.toLowerCase() === 'unknown' || data.totalAmount === 0) {
    flags.missingMetadata = true;
  }

  const code = getCurrencyCode(data.currencySymbol);
  if (!CURRENCY_RATES[code]) {
    flags.unsupportedCurrency = true;
  }

  if (data.language && data.language !== 'Original') {
    const supportedLangs = Object.keys(translations);
    const extendedWhitelist = [...supportedLangs, 'Italian', 'French', 'Dutch', 'Portuguese', 'Swedish', 'Danish'];
    const isSupported = extendedWhitelist.some((lang) => lang.toLowerCase() === data.language?.toLowerCase());
    const confidence = data.languageConfidence || 0;

    if (!isSupported && confidence < 90) {
      flags.unsupportedLanguage = true;
    }
  }

  let score = 'High';
  if (flags.missingMetadata || flags.unsupportedCurrency) {
    score = 'Low';
  } else if (flags.hasZeroPrices || flags.lowItemCount) {
    score = 'Medium';
  }

  const sensitiveTypes = [];
  if (detectSensitiveData(data.vendorName || '')) sensitiveTypes.push('Vendor PII');
  data.lineItems.forEach((item) => {
    if (detectSensitiveData(item.description)) {
      if (!sensitiveTypes.includes('Description PII')) sensitiveTypes.push('Description PII');
    }
  });

  if (sensitiveTypes.length > 0) {
    data.hasSensitiveData = true;
    data.sensitiveDataTypes = sensitiveTypes;
  }

  data.confidenceScore = score;
  data.validationFlags = flags;

  return data;
};
