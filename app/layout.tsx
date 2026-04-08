/**
 * Root layout: loads the three project fonts, sets metadataBase, and wraps
 * every page with the shared HTML shell. Deliberately minimal — per-route
 * metadata and UI shells are added by nested layouts.
 */
import type { Metadata } from "next";
import { Young_Serif, Alegreya, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SITE_CONFIG } from "@/config/site";

// Primary display/body font — mapped to --font-sans
const fontSans = Young_Serif({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400"],
});

// Serif accent font — mapped to --font-serif
const fontSerif = Alegreya({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

// Monospace font — mapped to --font-mono
const fontMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.URL),
  formatDetection: {
    address: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
