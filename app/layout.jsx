import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'] });

export const metadata = {
  title: 'E.S.T.E.R. Beta | v0.9.0',
  description:
    'Extraction System for Transaction Entity Reconciliation — turn receipts and invoices into structured data.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
