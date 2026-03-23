import type { Metadata } from "next";
import { Geist, Geist_Mono, DM_Serif_Display } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const dmSerif = DM_Serif_Display({
  variable: "--font-serif",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SynqDB | The Professional Database Management Platform",
  description: "Industry-standard database management for modern engineering teams. Scale your data infrastructure with zero friction.",
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
        className={`${geistSans.variable} ${geistMono.variable} ${dmSerif.variable} antialiased`}
      >
        <Toaster position="top-right" theme="dark" richColors closeButton />
        <ConfirmationModal />
        {children}
      </body>
    </html>
  );
}
