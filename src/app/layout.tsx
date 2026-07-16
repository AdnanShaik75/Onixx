import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { Providers } from "@/components/layout/providers";
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
  title: "ONIXX | Premium Watches & Accessories",
  description:
    "Discover premium watches and accessories curated for style, quality, and everyday elegance. Shop the latest collections with secure payments and Pan India shipping.",
  keywords: [
    "premium watches",
    "men's watches",
    "women's watches",
    "wrist watches",
    "accessories",
    "leather straps",
    "sunglasses",
    "ONIXX",
  ],
  openGraph: {
    title: "ONIXX | Premium Watches & Accessories",
    description:
      "Discover premium watches and accessories curated for style, quality, and everyday elegance.",
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
