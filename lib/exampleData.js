export const EXAMPLES = {
  'receipt': {
    id: 'ex-1',
    documentType: 'INVOICE',
    vendorName: 'Tech Bistro & Cafe',
    invoiceDate: new Date().toISOString().split('T')[0], // Today
    totalAmount: 42.50,
    currencySymbol: '$',
    lineItems: [
        { sku: 'BEV-001', description: 'Latte Macchiato', glCategory: 'Meals & Entertainment', quantity: 2, unitPrice: 4.50, totalAmount: 9.00 },
        { sku: 'FOD-023', description: 'Avocado Toast', glCategory: 'Meals & Entertainment', quantity: 2, unitPrice: 12.00, totalAmount: 24.00 },
        { sku: 'SVC-001', description: 'Service Charge (10%)', glCategory: 'Service Fees', quantity: 1, unitPrice: 3.30, totalAmount: 3.30 },
        { sku: 'TAX-001', description: 'Sales Tax', glCategory: 'Tax', quantity: 1, unitPrice: 6.20, totalAmount: 6.20 }
    ],
    language: 'English',
    confidenceScore: 'High',
    validationFlags: { hasZeroPrices: false, lowItemCount: false, missingMetadata: false },
    processingTimeMs: 2400
  },
  'multilang': {
    id: 'ex-2',
    documentType: 'PACKING SLIP',
    vendorName: 'Kyoto Electronics / 京都エレクトロニクス',
    invoiceDate: '2023-11-15',
    totalAmount: 154000,
    currencySymbol: '¥',
    lineItems: [
        { sku: 'KE-204', description: 'High-Speed Servo Motor / 高速サーボモータ', glCategory: 'Raw Materials', quantity: 5, unitPrice: 25000, totalAmount: 125000 },
        { sku: 'KE-992', description: 'Control Unit / 制御ユニット', glCategory: 'Raw Materials', quantity: 1, unitPrice: 20000, totalAmount: 20000 },
        { sku: 'SHP-01', description: 'Shipping & Handling / 送料と手数料', glCategory: 'Freight', quantity: 1, unitPrice: 9000, totalAmount: 9000 }
    ],
    language: 'Japanese',
    confidenceScore: 'High',
    validationFlags: { hasZeroPrices: false, lowItemCount: false, missingMetadata: false },
    processingTimeMs: 4100
  },
  'multicurrency': {
    id: 'ex-3',
    documentType: 'INVOICE',
    vendorName: 'Grand Hotel Berlin',
    invoiceDate: '2024-02-10',
    totalAmount: 450.00,
    currencySymbol: '€',
    lineItems: [
        { sku: 'RM-304', description: 'Executive Suite - 2 Nights', glCategory: 'Travel & Lodging', quantity: 2, unitPrice: 180.00, totalAmount: 360.00 },
        { sku: 'BRK-001', description: 'Continental Breakfast', glCategory: 'Meals & Entertainment', quantity: 2, unitPrice: 25.00, totalAmount: 50.00 },
        { sku: 'SPA-002', description: 'Wellness Access', glCategory: 'Employee Wellness', quantity: 2, unitPrice: 20.00, totalAmount: 40.00 }
    ],
    language: 'English',
    confidenceScore: 'High',
    validationFlags: { hasZeroPrices: false, lowItemCount: false, missingMetadata: false },
    processingTimeMs: 3200
  }
};
