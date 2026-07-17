import { notFound } from "next/navigation";
import { getProduct, ALL_PRODUCTS, type Product } from "@/lib/data";
import { ProductInfo } from "@/components/shared/product-info";
import { ReviewSection } from "@/components/shared/review-section";
import { fetchProductFromFirebase } from "@/lib/firebase";

export const dynamicParams = true;

export function generateStaticParams() {
  return ALL_PRODUCTS.map((product) => ({ id: product.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProduct(id) ?? (await fetchProductFromFirebase(id)) as Product | null;
  if (!product) return { title: "Product Not Found" };
  return {
    title: `${product.name} | ONIXX`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProduct(id) ?? (await fetchProductFromFirebase(id)) as Product | null;
  if (!product) notFound();

  return (
    <section className="pt-32 lg:pt-40 pb-24 lg:pb-32 px-6 lg:px-12">
      <div className="max-w-[1400px] mx-auto">
        <ProductInfo product={product} />
        <ReviewSection productId={product.id} />
      </div>
    </section>
  );
}
