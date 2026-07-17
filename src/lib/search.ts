import type { Product } from "@/lib/data";
import type { SearchFilters, SearchResult, SortOption } from "@/lib/types";

export const DEFAULT_FILTERS: SearchFilters = {
  query: "",
  categories: [],
  collections: [],
  priceRange: null,
  inStock: null,
  badge: null,
  sort: "newest",
  page: 1,
  perPage: 12,
};

export function searchProducts(products: Product[], filters: SearchFilters): SearchResult {
  let filtered = [...products];

  if (filters.query.trim()) {
    const q = filters.query.toLowerCase().trim();
    filtered = filtered.filter(
      (p) =>
        p.id.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.collection.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  if (filters.categories.length > 0) {
    filtered = filtered.filter((p) =>
      filters.categories.includes(p.category)
    );
  }

  if (filters.collections.length > 0) {
    filtered = filtered.filter((p) =>
      filters.collections.includes(p.collection)
    );
  }

  if (filters.priceRange) {
    filtered = filtered.filter(
      (p) => p.price >= filters.priceRange!.min && p.price <= filters.priceRange!.max
    );
  }

  if (filters.inStock !== null) {
    filtered = filtered.filter((p) =>
      filters.inStock ? p.stock > 0 : p.stock === 0
    );
  }

  if (filters.badge !== null) {
    filtered = filtered.filter((p) => p.badge === filters.badge);
  }

  filtered = sortProducts(filtered, filters.sort);

  const total = filtered.length;
  const page = Math.max(1, filters.page);
  const perPage = Math.max(1, filters.perPage);
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage;
  const paged = filtered.slice(start, start + perPage);

  const suggestions = filters.query.trim()
    ? generateSuggestions(products, filters.query, 5)
    : [];

  return {
    products: paged,
    total,
    page,
    perPage,
    totalPages,
    suggestions,
  };
}

export function getSuggestions(products: Product[], query: string, limit = 5): string[] {
  return generateSuggestions(products, query, limit);
}

export function getUniqueCategories(products: Product[]): string[] {
  const set = new Set(products.map((p) => p.category));
  return Array.from(set).sort();
}

export function getUniqueCollections(products: Product[]): string[] {
  const set = new Set(products.map((p) => p.collection));
  return Array.from(set).sort();
}

export function getPriceRange(products: Product[]): { min: number; max: number } {
  if (products.length === 0) return { min: 0, max: 0 };
  const prices = products.map((p) => p.price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

export function debouncedSearch<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay = 300
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

function sortProducts(products: Product[], sort: SortOption): Product[] {
  const sorted = [...products];
  switch (sort) {
    case "newest":
      return sorted;
    case "price_asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price_desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "popularity":
      return sorted.sort((a, b) => b.reviewCount - a.reviewCount);
    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating);
    case "name_asc":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "name_desc":
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    default:
      return sorted;
  }
}

function generateSuggestions(products: Product[], query: string, limit: number): string[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase().trim();
  const suggestions = new Set<string>();

  for (const p of products) {
    if (p.name.toLowerCase().includes(q)) suggestions.add(p.name);
    if (p.category.toLowerCase().includes(q)) suggestions.add(p.category);
    if (p.collection.toLowerCase().includes(q)) suggestions.add(p.collection);
    if (suggestions.size >= limit) break;
  }

  return Array.from(suggestions).slice(0, limit);
}
