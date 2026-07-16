import type { Metadata } from "next";
import CollectionsContent from "./collections-content";

export const metadata: Metadata = {
  title: "Collections | ONIXX",
  description:
    "Explore our curated collections of watches and accessories, each with a unique style.",
};

export default function CollectionsPage() {
  return <CollectionsContent />;
}
