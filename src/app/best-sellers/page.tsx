import type { Metadata } from "next";
import { BestSellersContent } from "@/components/sections/best-sellers-content";

export const metadata: Metadata = {
  title: "Best Sellers | ONIXX Luxury Watches",
  description:
    "Our most coveted timepieces chosen by connoisseurs who recognize exceptional craftsmanship at first glance.",
  openGraph: {
    title: "Best Sellers | ONIXX Luxury Watches",
    description:
      "Our most coveted timepieces chosen by connoisseurs.",
  },
};

export default function BestSellersPage() {
  return <BestSellersContent />;
}
