import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { invoiceSchema, generateMockInvoice, assessExtractionQuality } from '../../../lib/extraction';

// Runs on the server only — GEMINI_API_KEY never reaches the browser.
export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const isDemoMode = formData.get('isDemoMode') === 'true';

    if (isDemoMode) {
      await new Promise((r) => setTimeout(r, 1500));
      return NextResponse.json(generateMockInvoice());
    }

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Server is missing GEMINI_API_KEY. Set it in your environment, or use Demo Mode.', code: 'NO_API_KEY' },
        { status: 500 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString('base64');

    const ai = new GoogleGenAI({ apiKey });
    const model = 'gemini-2.5-flash';

    const prompt = `Extract invoice data from this image. 
    Analyze the layout to identify Vendor, Date, Total Amount, Currency, and Line Items.
    Infer GL Categories for items.
    Detect the document language.
    Return JSON matching the specified schema.`;

    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [{ inlineData: { data: base64Data, mimeType: file.type } }, { text: prompt }],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: invoiceSchema,
        temperature: 0.1,
      },
    });

    const rawData = JSON.parse(response.text || '{}');
    const processedData = {
      ...rawData,
      id: crypto.randomUUID(),
      lineItems: rawData.lineItems || [],
      invoiceDate: rawData.invoiceDate || new Date().toISOString().split('T')[0],
      currencySymbol: rawData.currencySymbol || '$',
      language: rawData.language || 'Original',
      originalLineItems: rawData.lineItems || [],
    };

    return NextResponse.json(assessExtractionQuality(processedData));
  } catch (error) {
    console.error('Extraction error:', error);
    if (error.message?.includes('429')) {
      return NextResponse.json({ error: 'Quota Exceeded', code: 'QUOTA_EXCEEDED' }, { status: 429 });
    }
    return NextResponse.json({ error: error.message || 'Extraction failed', code: 'GENERIC' }, { status: 500 });
  }
}
