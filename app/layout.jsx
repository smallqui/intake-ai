import { Inter } from "next/font/google";
import "./globals.css";

/**
 * Configures the Inter font used throughout the application.
 *
 * Next.js automatically optimizes and serves the selected font weights,
 * preventing the need to load the font from an external stylesheet.
 */
const inter = Inter({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
});

/**
 * Default metadata applied across the application.
 *
 * Used by Next.js to populate page metadata such as the browser title
 * and search engine description.
 */
export const metadata = {
    title: "Intake",
    description: "AI-powered document intake for extracting, validating, and structuring invoice and financial data.",
};

/**
 * Root layout shared by every page in the application.
 *
 * Provides the base HTML structure and applies the optimized Inter font
 * globally to all rendered child content.
 *
 * @param {Object} props - Root layout properties.
 * @param {React.ReactNode} props.children - Page or nested layout content.
 * @returns {JSX.Element} The application's root HTML structure.
 */
export default function RootLayout({ children }){
    return (
        <html lang="en">
            <body className={inter.className}>{children}</body>
        </html>
    );
};