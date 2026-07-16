import type { Metadata } from "next";
import { LimitedEditionContent } from "@/components/sections/limited-edition-content";

export const metadata: Metadata = {
  title: "Limited Edition | ONIXX",
  description:
    "Special edition watches produced in limited quantities. Once sold, they are gone.",
  openGraph: {
    title: "Limited Edition | ONIXX",
    description:
      "Special edition watches produced in limited quantities.",
  },
};

export default function LimitedEditionPage() {
  return <LimitedEditionContent />;
}
