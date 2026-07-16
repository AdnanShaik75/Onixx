import type { Metadata } from "next";
import { NewArrivalsContent } from "@/components/sections/new-arrivals-content";

export const metadata: Metadata = {
  title: "New Arrivals | ONIXX",
  description:
    "Discover the latest additions to the ONIXX collection. Fresh designs and innovative styles.",
  openGraph: {
    title: "New Arrivals | ONIXX",
    description:
      "Discover the latest additions to the ONIXX collection.",
  },
};

export default function NewArrivalsPage() {
  return <NewArrivalsContent />;
}
