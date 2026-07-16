import type { Metadata } from "next";
import { WatchesContent } from "@/components/sections/watches-content";

export const metadata: Metadata = {
  title: "All Watches | ONIXX Luxury Timepieces",
  description:
    "Browse our complete collection of luxury watches. Automatic, quartz, diver, and manual wind timepieces.",
  openGraph: {
    title: "All Watches | ONIXX Luxury Timepieces",
    description:
      "Browse our complete collection of luxury watches. Automatic, quartz, diver, and manual wind timepieces.",
  },
};

export default function WatchesPage() {
  return <WatchesContent />;
}
