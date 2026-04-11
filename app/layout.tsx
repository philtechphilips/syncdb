import type { Metadata, Viewport } from "next";
import { Inter, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#021016",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://synqdb.com"),

  title: {
    default: "SynqDB — Manage PostgreSQL, MySQL, MSSQL & SQLite in One Place",
    template: "%s | SynqDB",
  },
  description:
    "SynqDB is a free, unified database management platform for engineering teams. Connect PostgreSQL, MySQL, MSSQL, and SQLite — query, visualize, and manage everything from a single dashboard.",

  applicationName: "SynqDB",
  authors: [{ name: "SynqDB Team", url: "https://synqdb.com" }],
  generator: "Next.js",
  keywords: [
    "database management tool",
    "SQL client",
    "PostgreSQL client",
    "MySQL client",
    "MSSQL client",
    "SQLite browser",
    "multi-database manager",
    "database GUI",
    "query editor",
    "ER diagram tool",
    "database admin tool",
    "free database tool",
    "database dashboard",
    "data infrastructure",
    "SynqDB",
  ],
  referrer: "origin-when-cross-origin",
  creator: "SynqDB",
  publisher: "SynqDB",
  category: "technology",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://synqdb.com",
  },

  openGraph: {
    title: "SynqDB — One Dashboard for Every Database",
    description:
      "Connect PostgreSQL, MySQL, MSSQL, and SQLite in a single dashboard. Free to get started. Built for engineering teams who need speed, clarity, and control.",
    url: "https://synqdb.com",
    siteName: "SynqDB",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SynqDB — Unified Database Management Dashboard",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "SynqDB — One Dashboard for Every Database",
    description:
      "Connect PostgreSQL, MySQL, MSSQL, and SQLite in a single dashboard. Free to get started. Built for engineering teams.",
    images: ["/og-image.png"],
    creator: "@synqdb",
    site: "@synqdb",
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

import { Toaster } from "sonner";
import ConfirmationModal from "@/components/ui/ConfirmationModal";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${geistMono.variable} ${instrumentSerif.variable} antialiased`}
      >
        <Toaster position="top-right" theme="dark" richColors closeButton />
        <ConfirmationModal />
        {children}
      </body>
    </html>
  );
}
