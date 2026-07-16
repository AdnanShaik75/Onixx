import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ONIXX | Luxury Watches & Accessories",
  description:
    "Precision-crafted luxury watches for those who appreciate timeless elegance. Swiss-made timepieces engineered by master horologists.",
  keywords: [
    "luxury watches",
    "Swiss made",
    "premium timepieces",
    "ONIXX",
    "automatic watches",
    "chronograph",
  ],
  openGraph: {
    title: "ONIXX | Luxury Watches & Accessories",
    description:
      "Precision-crafted luxury watches for those who appreciate timeless elegance.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} antialiased`}
    >
      <body className="min-h-screen bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
