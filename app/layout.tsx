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
  title: "SynqDB | The Professional Database Management Platform",
  description:
    "Industry-standard database management for modern engineering teams. Scale your data infrastructure with zero friction. Query, visualize, and manage your clusters in one place.",
  applicationName: "SynqDB",
  authors: [{ name: "SynqDB Team" }],
  generator: "Next.js",
  keywords: [
    "database management",
    "SQL client",
    "MySQL",
    "PostgreSQL",
    "MSSQL",
    "database administration",
    "data infrastructure",
    "query editor",
  ],
  referrer: "origin-when-cross-origin",
  creator: "SynqDB",
  publisher: "SynqDB",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "SynqDB | The Professional Database Management Platform",
    description:
      "Industry-standard database management for modern engineering teams. Scale your data infrastructure with zero friction.",
    url: "https://synqdb.com",
    siteName: "SynqDB",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SynqDB Dashboard Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SynqDB | The Professional Database Management Platform",
    description:
      "Scale your data infrastructure with zero friction. The most advanced SQL client for engineering teams.",
    images: ["/og-image.png"],
    creator: "@synqdb",
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
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
    icon: "/favicon.ico",
    shortcut: "/favicon-32x32.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
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
