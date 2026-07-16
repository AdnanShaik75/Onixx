import { notFound } from "next/navigation";
import type { Metadata } from "next";
import CollectionDetailContent from "./collection-detail-content";
import { COLLECTIONS } from "@/lib/data";

export function generateStaticParams() {
  return COLLECTIONS.map((c) => ({ id: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const { getCollection } = await import("@/lib/data");
  const collection = getCollection(id);
  if (!collection) return { title: "Collection Not Found" };
  return {
    title: `${collection.title} Collection | ONIXX`,
    description: collection.description,
  };
}

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { getCollection } = await import("@/lib/data");
  const collection = getCollection(id);
  if (!collection) notFound();

  return <CollectionDetailContent collectionId={id} />;
}
