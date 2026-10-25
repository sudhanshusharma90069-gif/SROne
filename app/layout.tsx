import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SROne — AI-Curated Deals from 35+ Top Stores',
  description: 'SROne — AI-powered deals across shopping, groceries, food delivery, hotels, flights and more. Amazon, Flipkart, Myntra, Swiggy, MakeMyTrip and 30+ stores in one place. Founded by Suddhanshu & Rakhi Kumari.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'SROne',
  },
  icons: {
    icon: '/icon.svg',
    apple: '/icon-192.png',
  },
  other: {
    'impact-site-verification': '4b586f91-8fe7-4b0a-80f5-dd8cd66bd43f',
  },
};

export const viewport: Viewport = {
  themeColor: '#0f0f1e',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
