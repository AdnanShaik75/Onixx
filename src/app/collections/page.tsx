import type { Metadata } from "next";
import CollectionsContent from "./collections-content";

export const metadata: Metadata = {
  title: "Collections | ONIXX",
  description:
    "Explore our curated collections of luxury timepieces, each telling a unique story of craftsmanship and elegance.",
};

export default function CollectionsPage() {
  return <CollectionsContent />;
}
