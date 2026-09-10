import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

import {
    invoiceSchema,
    generateMockInvoice,
    assessExtractionQuality,
} from "../../../lib/extraction";

/**
 * Handles invoice extraction requests.
 *
 * Accepts an uploaded invoice image through multipart form data and uses
 * Google's Gemini API to extract structured invoice information.
 *
 * When Demo Mode is enabled, a mock invoice is returned instead of making
 * an external API request.
 *
 * Extracted invoice data includes:
 * - Vendor information
 * - Invoice date
 * - Total amount
 * - Currency
 * - Line items
 * - Suggested GL categories
 * - Detected document language
 *
 * The extracted data is normalized and passed through an additional
 * quality-assessment step before being returned to the client.
 *
 * @param {Request} req - Incoming HTTP request containing invoice form data.
 * @returns {Promise<NextResponse>} JSON response containing extracted invoice
 * data or an error response.
 */
export async function POST(req){
    try {
        const formData = await req.formData();

        const file = formData.get("file");
        const isDemoMode = formData.get("isDemoMode") === "true";

        // Return generated sample data without calling Gemini.
        if (isDemoMode){
            await new Promise((resolve) => setTimeout(resolve, 1500));

            return NextResponse.json(generateMockInvoice());
        }

        // Ensure an invoice file was provided.
        if (!file){
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 },
            );
        }

        // Runs server-side only, preventing the API key from reaching the browser.
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey){
            return NextResponse.json(
                {
                    error: "Server is missing GEMINI_API_KEY. Set it in your environment, or use Demo Mode.",
                    code: "NO_API_KEY",
                },
                { status: 500 },
            );
        }

        // Convert the uploaded file into Base64 for Gemini's inline data input.
        const arrayBuffer = await file.arrayBuffer();
        const base64Data = Buffer.from(arrayBuffer).toString("base64");

        const ai = new GoogleGenAI({ apiKey });
        const model = "gemini-3.6-flash";
        
        const prompt = `
            Extract invoice data from this image.

            Analyze the layout to identify:
            - Vendor
            - Date
            - Total Amount
            - Currency
            - Line Items

            Infer GL categories for line items.
            Detect the document language.
            Return JSON matching the specified schema.
        `;

        // Send the invoice image and extraction instructions to Gemini.
        const response = await ai.models.generateContent({
            model,
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: base64Data,
                            mimeType: file.type,
                        },
                    },
                    {
                        text: prompt,
                    },
                ],
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: invoiceSchema,
                temperature: 0.1,
            },
        });

        const rawData = JSON.parse(response.text || "{}");

        // Normalize extracted data and provide safe defaults for optional fields.
        const processedData = {
            ...rawData,
            id: crypto.randomUUID(),
            lineItems: rawData.lineItems || [],
            invoiceDate:
                rawData.invoiceDate ||
                new Date().toISOString().split("T")[0],
            currencySymbol: rawData.currencySymbol || "$",
            language: rawData.language || "Original",
            originalLineItems: rawData.lineItems || [],
        };

        // Evaluate extraction quality before returning the final result.
        return NextResponse.json(
            assessExtractionQuality(processedData),
        );
    } 
    catch (error){
        console.error("Extraction error:", error);

        // Surface Gemini/API quota errors separately for client-side handling.
        if (error.message?.includes("429")){
            return NextResponse.json(
                {
                    error: "Quota Exceeded",
                    code: "QUOTA_EXCEEDED",
                },
                { status: 429 },
            );
        }

        return NextResponse.json(
            {
                error: error.message || "Extraction failed",
                code: "GENERIC",
            },
            { status: 500 },
        );
    }
};