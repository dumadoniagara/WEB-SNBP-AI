import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SNBP·AI — Latihan Soal UTBK Cerdas",
    template: "%s | SNBP·AI",
  },
  description:
    "Platform latihan soal UTBK berbasis AI. Drilling TPS & Tes Literasi dengan pembahasan instan, kapan saja, di mana saja.",
  keywords: ["UTBK", "SNBP", "TPS", "Tes Literasi", "latihan soal", "tryout"],
};

export const viewport: Viewport = {
  themeColor: "#4f46e5",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${geistSans.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-white text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
