import { notFound } from "next/navigation";
import { fetchFromPath } from "@/lib/firebase";
import type { Product } from "@/lib/types";
import { ProductPageClient } from "@/components/shared/product-page-client";

export const dynamicParams = true;

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const products = await fetchFromPath<Product[]>("products");
  const product = products?.find((p) => p.slug === slug) ?? null;

  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.name} | CHRONOS`,
    description: product.description,
    openGraph: {
      title: `${product.name} | CHRONOS`,
      description: product.description,
      images: product.image ? [{ url: product.image }] : [],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const products = await fetchFromPath<Product[]>("products");
  const product = products?.find((p) => p.slug === slug) ?? null;

  if (!product) notFound();

  const relatedProducts = (products ?? [])
    .filter((p) => p.collection === product.collection && p.id !== product.id)
    .slice(0, 4);

  return (
    <ProductPageClient product={product} relatedProducts={relatedProducts} />
  );
}
