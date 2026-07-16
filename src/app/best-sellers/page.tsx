import type { Metadata } from "next";
import { BestSellersContent } from "@/components/sections/best-sellers-content";

export const metadata: Metadata = {
  title: "Best Sellers | ONIXX",
  description:
    "Our most popular watches, chosen by customers who value quality and style.",
  openGraph: {
    title: "Best Sellers | ONIXX",
    description:
      "Our most popular watches, chosen by customers who value quality and style.",
  },
};

export default function BestSellersPage() {
  return <BestSellersContent />;
}
