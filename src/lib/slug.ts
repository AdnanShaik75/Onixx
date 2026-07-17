import type { Product } from "@/lib/types";

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function isSlugUnique(slug: string, products: Product[], excludeId?: string): boolean {
  return !products.some((p) => p.slug === slug && p.id !== excludeId);
}

export function ensureUniqueSlug(slug: string, products: Product[], excludeId?: string): string {
  if (isSlugUnique(slug, products, excludeId)) return slug;
  let counter = 2;
  while (!isSlugUnique(`${slug}-${counter}`, products, excludeId)) {
    counter++;
  }
  return `${slug}-${counter}`;
}
