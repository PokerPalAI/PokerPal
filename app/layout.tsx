import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "PokerPal. For Poker Athletes.",
    template: "%s | PokerPal"
  },
  description: "PokerPal. For Poker Athletes. Where preparation, mindset, and performance matter as much as the cards.",
  keywords: ["poker", "poker training", "poker athletes", "poker community", "poker strategy", "poker mindset", "poker performance", "poker coaching", "poker mental game"],
  authors: [{ name: "PokerPal" }],
  creator: "PokerPal",
  publisher: "PokerPal",
  applicationName: "PokerPal",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  colorScheme: "light",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#3F88C5" },
    { media: "(prefers-color-scheme: dark)", color: "#3F88C5" }
  ],
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://pokerpal.live',
    siteName: 'PokerPal',
    title: 'PokerPal. For Poker Athletes.',
    description: 'PokerPal. For Poker Athletes. Where preparation, mindset, and performance matter as much as the cards.',
    images: [
      {
        url: '/hero-logo-text.svg',
        width: 1200,
        height: 630,
        alt: 'PokerPal - Train Like An Athlete',
        type: 'image/svg+xml',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PokerPal. For Poker Athletes.',
    description: 'PokerPal. For Poker Athletes. Where preparation, mindset, and performance matter as much as the cards.',
    images: ['/hero-logo-text.svg'],
    creator: '@pokerpal',
    site: '@pokerpal',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/16.svg', sizes: '16x16', type: 'image/svg+xml' },
      { url: '/32.svg', sizes: '32x32', type: 'image/svg+xml' },
      { url: '/64.svg', sizes: '64x64', type: 'image/svg+xml' },
      { url: '/128.svg', sizes: '128x128', type: 'image/svg+xml' },
      { url: '/512.svg', sizes: '512x512', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/128.svg', sizes: '180x180' },
      { url: '/512.svg', sizes: '512x512' },
    ],
    shortcut: '/favicon.ico',
  },
  manifest: '/manifest.json',
  alternates: {
    canonical: 'https://pokerpal.live',
  },
  category: 'sports',
  classification: 'Poker Training Platform',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
