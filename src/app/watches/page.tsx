import type { Metadata } from "next";
import { WatchesContent } from "@/components/sections/watches-content";

export const metadata: Metadata = {
  title: "All Watches | ONIXX",
  description:
    "Browse our complete collection of watches. Automatic, quartz, and more.",
  openGraph: {
    title: "All Watches | ONIXX",
    description:
      "Browse our complete collection of watches. Automatic, quartz, and more.",
  },
};

export default function WatchesPage() {
  return <WatchesContent />;
}
