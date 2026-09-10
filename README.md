# Intake AI

**AI-powered document intake for extracting, validating, and structuring financial data.**

Intake AI transforms photos and PDFs of receipts, invoices, and other financial documents into structured, editable data that can be reviewed and exported for spreadsheets, accounting workflows, databases, and other systems.

[Live Demo](https://intake.stevenmallqui.com) · [Portfolio](https://stevenmallqui.com)

> Originally built during **HawkHack 2025 at Montclair State University** and later expanded into a more complete document-processing application.

<p align="center">
  <img src="./public/readme/home.png" alt="Intake AI home page" width="900" />
</p>

## Demo

Intake AI takes an unstructured financial document and turns it into structured, reviewable, export-ready data.

<p align="center">
  <img src="./public/readme/demo.gif" alt="Intake AI document processing demo" width="900" />
</p>

## Overview

Manual data entry from receipts and invoices is repetitive, time-consuming, and prone to mistakes. Intake AI was built to explore a faster and more practical workflow.

Users can upload an image or PDF, and Intake AI uses Google's Gemini API to identify and extract information such as:

- Document type
- Vendor
- Invoice date
- Currency
- Total amount
- SKUs
- Item descriptions
- Quantities
- Unit prices
- Line totals
- GL categories

The extracted information is presented in an editable interface so users can review the results before exporting them as **CSV, Excel-compatible XLS, JSON, or QuickBooks-compatible CSV data**.

The goal of the project is not simply to read text from a document, but to turn unstructured financial documents into structured data that can fit into real business workflows.

## Features

- Image and PDF document processing
- AI-powered financial data extraction using Google Gemini
- Structured document and line-item extraction
- Editable results before export
- Automatic GL category suggestions
- Math mismatch detection and recalculation
- Duplicate document detection
- Multi-document batch processing
- CSV export
- Excel-compatible `.xls` export
- JSON export
- QuickBooks-compatible CSV export
- Print / Save as PDF
- Currency conversion previews
- Session history
- Session analytics
- Spending and document breakdowns
- Multi-language interface
- Light and dark themes
- Demo mode for testing without API usage

## How It Works

```text
Image / PDF
    ↓
Next.js API Route
    ↓
Google Gemini
    ↓
Structured Document Data
    ↓
Validation & Review
    ↓
CSV / Excel / QuickBooks / JSON
```

1. The user uploads an image or PDF containing financial information.
2. The document is sent to a server-side Next.js API route.
3. Google's Gemini API analyzes the document and returns structured data using a defined response schema.
4. Intake AI applies additional application logic for validation, duplicate detection, calculations, and formatting.
5. The extracted data is displayed in an editable interface for review.
6. The final data can be exported for use in spreadsheets, accounting workflows, databases, or other systems.

## Screenshots

### Upload

Users can upload receipts, invoices, and other financial documents as images or PDFs. Batch processing is also supported.

<p align="center">
  <img src="./public/readme/upload.png" alt="Intake AI upload interface" width="900" />
</p>

### Extraction & Review

Extracted data is presented in an editable interface so users can verify fields, review line items, and correct information before export.

<p align="center">
  <img src="./public/readme/editor.png" alt="Intake AI extracted document editor" width="900" />
</p>

### History & Analytics

Processed documents remain available during the browser session, with lightweight analytics for totals, categories, currencies, document types, and recent activity.

<p align="center">
  <img src="./public/readme/analytics.png" alt="Intake AI history and analytics interface" width="900" />
</p>

## Tech Stack

- **JavaScript / JSX**
- **Next.js**
- **React**
- **Tailwind CSS**
- **Google Gemini API**
- **Vercel**

The application also uses browser APIs for file handling, clipboard functionality, printing, and client-side export generation.

## AI Integration

Intake AI was my first project where a generative AI model became part of the application's actual data-processing workflow.

Instead of using Gemini as a chatbot, the application sends uploaded financial documents to the Gemini API and requests structured output that the rest of the application can work with.

The AI handles probabilistic document understanding and extraction, while traditional application logic handles tasks such as:

- Data validation
- Duplicate detection
- Mathematical checks
- Recalculation
- Workflow state
- Risk indicators
- Export generation

This project gave me hands-on experience with multimodal AI, structured model responses, API integration, prompt design, and building software around output that may still require human review.

## Project Origin

Intake AI was originally created during **HawkHack 2025 at Montclair State University**.

I wanted to build something centered around data analysis and databases while solving a practical workflow problem. I focused on the repetitive process of manually transferring information from receipts and invoices into spreadsheets and accounting systems.

The hackathon gave me an opportunity to experiment with using AI to bridge the gap between unstructured documents and structured data.

After HawkHack, I continued developing the project by improving the interface, validation workflow, export options, analytics, localization, and overall user experience.

## What I Learned

This was my first project integrating generative AI directly into an application's computational workflow.

Through Intake AI, I gained hands-on experience with:

- Integrating Google's Gemini API
- Working with multimodal AI models
- Processing image and PDF inputs
- Designing structured AI responses
- Working with schema-constrained model output
- Separating AI-generated output from deterministic application logic
- Handling API errors and usage limits
- Building editable interfaces around AI-generated data
- Generating CSV, Excel-compatible, and JSON files
- Managing multi-step processing states in React
- Building responsive interfaces with React and Tailwind CSS
- Designing light and dark UI themes

The project also introduced frontend techniques and application patterns that I plan to reuse in future projects.

## Practical Use Cases

Intake AI explores how document-processing tools can reduce repetitive manual data-entry work in areas such as:

- Accounts payable
- Bookkeeping
- Invoice processing
- Expense management
- Procurement
- Financial reconciliation
- Spreadsheet preparation
- Database entry
- Document digitization
- Internal business tooling

```text
Traditional Workflow

Receipt / Invoice
       ↓
Manual Data Entry
       ↓
Spreadsheet / Accounting System


Intake AI Workflow

Receipt / Invoice
       ↓
Intake AI
       ↓
Review Structured Data
       ↓
CSV / Excel / QuickBooks / JSON
```

## Running Locally

Clone the repository:

```bash
git clone https://github.com/smallqui/intake-ai.git
cd intake-ai
```

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env.local
```

Add your Gemini API key:

```env
GEMINI_API_KEY=your_key_here
```

Start the development server:

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

## Limitations

- AI-generated data may contain errors and should be reviewed before being used in financial systems.
- Currency conversion currently uses static approximate exchange rates rather than a live exchange-rate service.
- Sensitive-data detection uses lightweight pattern matching and should not be treated as a comprehensive security or compliance system.
- Document history is session-based rather than stored in a persistent database.
- QuickBooks export currently generates compatible CSV data rather than a native QuickBooks IIF file.

## Future Improvements

- Persistent document storage
- Database integration
- User accounts
- Live currency exchange rates
- Additional accounting-platform exports
- More advanced document validation
- Improved confidence scoring
- Larger batch-processing workflows
- Expanded analytics
- Additional document types

## Author

**Steven Mallqui**

[Portfolio](https://stevenmallqui.com) · [GitHub](https://github.com/smallqui)
