/**
 * Bundled example documents used to demonstrate Intake AI without requiring
 * live API extraction.
 *
 * Each example mirrors the structure returned by the extraction pipeline so
 * the rest of the application can handle demo data and real extracted data
 * through the same interface.
 *
 * @type {Record<string, {
 *   id: string,
 *   documentType: string,
 *   vendorName: string,
 *   invoiceDate: string,
 *   totalAmount: number,
 *   currencySymbol: string,
 *   lineItems: Array<{
 *     sku: string,
 *     description: string,
 *     glCategory: string,
 *     quantity: number,
 *     unitPrice: number,
 *     totalAmount: number
 *   }>,
 *   language: string,
 *   confidenceScore: string,
 *   validationFlags: {
 *     hasZeroPrices: boolean,
 *     lowItemCount: boolean,
 *     missingMetadata: boolean
 *   },
 *   processingTimeMs: number
 * }>}
 */
export const EXAMPLES = {
    /**
     * Standard USD invoice example representing a restaurant purchase.
     */
    receipt: {
        id: "ex-1",
        documentType: "INVOICE",
        vendorName: "Tech Bistro & Cafe",
        invoiceDate: new Date()
            .toISOString()
            .split("T")[0],
        totalAmount: 42.5,
        currencySymbol: "$",

        lineItems: [
            {
                sku: "BEV-001",
                description: "Latte Macchiato",
                glCategory: "Meals & Entertainment",
                quantity: 2,
                unitPrice: 4.5,
                totalAmount: 9.0,
            },
            {
                sku: "FOD-023",
                description: "Avocado Toast",
                glCategory: "Meals & Entertainment",
                quantity: 2,
                unitPrice: 12.0,
                totalAmount: 24.0,
            },
            {
                sku: "SVC-001",
                description: "Service Charge (10%)",
                glCategory: "Service Fees",
                quantity: 1,
                unitPrice: 3.3,
                totalAmount: 3.3,
            },
            {
                sku: "TAX-001",
                description: "Sales Tax",
                glCategory: "Tax",
                quantity: 1,
                unitPrice: 6.2,
                totalAmount: 6.2,
            },
        ],

        language: "English",
        confidenceScore: "High",

        validationFlags: {
            hasZeroPrices: false,
            lowItemCount: false,
            missingMetadata: false,
        },

        processingTimeMs: 2400,
    },

    /**
     * Multilingual Japanese packing slip example.
     *
     * Demonstrates non-Latin text, foreign currency handling, and translated
     * line-item descriptions.
     */
    multilang: {
        id: "ex-2",
        documentType: "PACKING SLIP",
        vendorName:
            "Kyoto Electronics / 京都エレクトロニクス",
        invoiceDate: "2023-11-15",
        totalAmount: 154000,
        currencySymbol: "¥",

        lineItems: [
            {
                sku: "KE-204",
                description:
                    "High-Speed Servo Motor / 高速サーボモータ",
                glCategory: "Raw Materials",
                quantity: 5,
                unitPrice: 25000,
                totalAmount: 125000,
            },
            {
                sku: "KE-992",
                description:
                    "Control Unit / 制御ユニット",
                glCategory: "Raw Materials",
                quantity: 1,
                unitPrice: 20000,
                totalAmount: 20000,
            },
            {
                sku: "SHP-01",
                description:
                    "Shipping & Handling / 送料と手数料",
                glCategory: "Freight",
                quantity: 1,
                unitPrice: 9000,
                totalAmount: 9000,
            },
        ],

        language: "Japanese",
        confidenceScore: "High",

        validationFlags: {
            hasZeroPrices: false,
            lowItemCount: false,
            missingMetadata: false,
        },

        processingTimeMs: 4100,
    },

    /**
     * Euro-denominated hotel invoice example.
     *
     * Demonstrates travel-related GL categories and currency conversion
     * against a non-USD source document.
     */
    multicurrency: {
        id: "ex-3",
        documentType: "INVOICE",
        vendorName: "Grand Hotel Berlin",
        invoiceDate: "2024-02-10",
        totalAmount: 450.0,
        currencySymbol: "€",

        lineItems: [
            {
                sku: "RM-304",
                description: "Executive Suite - 2 Nights",
                glCategory: "Travel & Lodging",
                quantity: 2,
                unitPrice: 180.0,
                totalAmount: 360.0,
            },
            {
                sku: "BRK-001",
                description: "Continental Breakfast",
                glCategory: "Meals & Entertainment",
                quantity: 2,
                unitPrice: 25.0,
                totalAmount: 50.0,
            },
            {
                sku: "SPA-002",
                description: "Wellness Access",
                glCategory: "Employee Wellness",
                quantity: 2,
                unitPrice: 20.0,
                totalAmount: 40.0,
            },
        ],

        language: "English",
        confidenceScore: "High",

        validationFlags: {
            hasZeroPrices: false,
            lowItemCount: false,
            missingMetadata: false,
        },

        processingTimeMs: 3200,
    },
};