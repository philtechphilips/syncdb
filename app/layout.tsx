import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { themeScript } from "@/lib/theme-script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f6f7" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0b" },
  ],
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
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

import { ThemedToaster } from "@/components/ui/ThemedToaster";
import ConfirmationModal from "@/components/ui/ConfirmationModal";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // data-theme is set before paint by themeScript, so React must accept the DOM value.
    <html
      lang="en"
      data-theme="light"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <ThemedToaster />
        <ConfirmationModal />
        {children}
      </body>
    </html>
  );
}
