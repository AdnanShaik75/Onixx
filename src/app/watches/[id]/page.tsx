import { notFound } from "next/navigation";
import { getProduct, ALL_PRODUCTS } from "@/lib/data";
import { ProductInfo } from "@/components/shared/product-info";

export function generateStaticParams() {
  return ALL_PRODUCTS.map((product) => ({ id: product.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) return { title: "Product Not Found" };
  return {
    title: `${product.name} | ONIXX`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) notFound();

  return (
    <section className="pt-32 lg:pt-40 pb-24 lg:pb-32 px-6 lg:px-12">
      <div className="max-w-[1400px] mx-auto">
        <ProductInfo product={product} />
      </div>
    </section>
  );
}
