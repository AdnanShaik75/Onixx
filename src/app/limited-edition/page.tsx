import type { Metadata } from "next";
import { LimitedEditionContent } from "@/components/sections/limited-edition-content";

export const metadata: Metadata = {
  title: "Limited Edition | ONIXX Luxury Watches",
  description:
    "Extraordinary timepieces produced in extremely limited quantities. Once sold, they are gone forever.",
  openGraph: {
    title: "Limited Edition | ONIXX Luxury Watches",
    description:
      "Extraordinary timepieces produced in extremely limited quantities.",
  },
};

export default function LimitedEditionPage() {
  return <LimitedEditionContent />;
}
