import type { Metadata } from "next";
import { Young_Serif, Alegreya, JetBrains_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { SITE_CONFIG } from "@/config/site";

const fontSans = Young_Serif({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400"],
});

const fontSerif = Alegreya({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

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
        <GoogleAnalytics gaId="G-CBPBRCTFZV" />
      </body>
    </html>
  );
}
