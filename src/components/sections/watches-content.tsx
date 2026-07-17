"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useProductStore } from "@/store/products";
import { ProductCard } from "@/components/shared/product-card";
import { BackButton } from "@/components/shared/back-button";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  searchProducts,
  debouncedSearch,
  getUniqueCategories,
  getUniqueCollections,

  DEFAULT_FILTERS,
} from "@/lib/search";
import type { SearchFilters, SortOption, BadgeType } from "@/lib/types";
import { cn, formatPrice } from "@/lib/utils";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "popularity", label: "Popularity" },
  { value: "rating", label: "Top Rated" },
  { value: "name_asc", label: "Name: A-Z" },
  { value: "name_desc", label: "Name: Z-A" },
];

const BADGE_OPTIONS: BadgeType[] = ["BESTSELLER", "SALE", "NEW", "LIMITED"];

const PRICE_RANGES = [
  { label: "Under ₹3,00,000", min: 0, max: 300000 },
  { label: "₹3,00,000 – ₹6,00,000", min: 300000, max: 600000 },
  { label: "₹6,00,000 – ₹10,00,000", min: 600000, max: 1000000 },
  { label: "₹10,00,000 – ₹20,00,000", min: 1000000, max: 2000000 },
  { label: "Above ₹20,00,000", min: 2000000, max: Infinity },
];

function buildFiltersFromParams(params: URLSearchParams): SearchFilters {
  const categories = params.get("categories")?.split(",").filter(Boolean) ?? [];
  const collections = params.get("collections")?.split(",").filter(Boolean) ?? [];
  const badge = params.get("badge") as BadgeType | null;
  const minPrice = params.get("minPrice");
  const maxPrice = params.get("maxPrice");

  return {
    query: params.get("q") ?? "",
    categories,
    collections,
    priceRange:
      minPrice || maxPrice
        ? {
            min: minPrice ? Number(minPrice) : 0,
            max: maxPrice ? Number(maxPrice) : Infinity,
          }
        : null,
    inStock: params.get("inStock") === "true" ? true : null,
    badge: badge && BADGE_OPTIONS.includes(badge) ? badge : null,
    sort: (params.get("sort") as SortOption) || DEFAULT_FILTERS.sort,
    page: Math.max(1, Number(params.get("page")) || 1),
    perPage: DEFAULT_FILTERS.perPage,
  };
}

function buildParamsFromFilters(filters: SearchFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.query) params.set("q", filters.query);
  if (filters.categories.length > 0) params.set("categories", filters.categories.join(","));
  if (filters.collections.length > 0) params.set("collections", filters.collections.join(","));
  if (filters.badge) params.set("badge", filters.badge);
  if (filters.priceRange) {
    params.set("minPrice", String(filters.priceRange.min));
    params.set("maxPrice", String(filters.priceRange.max));
  }
  if (filters.inStock) params.set("inStock", "true");
  if (filters.sort !== DEFAULT_FILTERS.sort) params.set("sort", filters.sort);
  if (filters.page > 1) params.set("page", String(filters.page));
  return params;
}

export function WatchesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { products: storeProducts } = useProductStore();

  const [filters, setFilters] = useState<SearchFilters>(() =>
    buildFiltersFromParams(searchParams)
  );
  const [searchInput, setSearchInput] = useState(filters.query);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    category: true,
    collection: true,
    price: true,
    availability: true,
    badge: true,
  });

  const inputRef = useRef<HTMLInputElement>(null);

  const categories = useMemo(() => getUniqueCategories(storeProducts), [storeProducts]);
  const collections = useMemo(() => getUniqueCollections(storeProducts), [storeProducts]);

  const result = useMemo(
    () => searchProducts(storeProducts, filters),
    [storeProducts, filters]
  );

  const updateFilters = useCallback((updates: Partial<SearchFilters>) => {
    setFilters((prev) => {
      const next = { ...prev, ...updates, page: updates.page ?? 1 };
      return next;
    });
  }, []);

  const syncToURL = useCallback(
    (f: SearchFilters) => {
      const params = buildParamsFromFilters(f);
      const qs = params.toString();
      router.replace(`/watches${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [router]
  );

  useEffect(() => {
    syncToURL(filters);
  }, [filters, syncToURL]);

  const debouncedUpdateQuery = useMemo(
    () =>
      debouncedSearch((value: unknown) => {
        updateFilters({ query: String(value) });
      }, 350),
    [updateFilters]
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchInput(value);
      debouncedUpdateQuery(value);
    },
    [debouncedUpdateQuery]
  );

  const clearSearch = useCallback(() => {
    setSearchInput("");
    updateFilters({ query: "" });
    inputRef.current?.focus();
  }, [updateFilters]);

  const toggleCategory = useCallback(
    (cat: string) => {
      setFilters((prev) => {
        const next = prev.categories.includes(cat)
          ? prev.categories.filter((c) => c !== cat)
          : [...prev.categories, cat];
        return { ...prev, categories: next, page: 1 };
      });
    },
    []
  );

  const toggleCollection = useCallback(
    (col: string) => {
      setFilters((prev) => {
        const next = prev.collections.includes(col)
          ? prev.collections.filter((c) => c !== col)
          : [...prev.collections, col];
        return { ...prev, collections: next, page: 1 };
      });
    },
    []
  );

  const toggleSection = useCallback((key: string) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const setPage = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const activeTags = useMemo(() => {
    const tags: { key: string; label: string; onRemove: () => void }[] = [];
    if (filters.query) {
      tags.push({
        key: "query",
        label: `"${filters.query}"`,
        onRemove: () => {
          setSearchInput("");
          updateFilters({ query: "" });
        },
      });
    }
    filters.categories.forEach((cat) => {
      tags.push({
        key: `cat-${cat}`,
        label: cat,
        onRemove: () => toggleCategory(cat),
      });
    });
    filters.collections.forEach((col) => {
      tags.push({
        key: `col-${col}`,
        label: col.charAt(0).toUpperCase() + col.slice(1),
        onRemove: () => toggleCollection(col),
      });
    });
    if (filters.priceRange) {
      const { min, max } = filters.priceRange;
      const range = PRICE_RANGES.find((r) => r.min === min && r.max === max);
      tags.push({
        key: "price",
        label: range?.label ?? `${formatPrice(min)} – ${max === Infinity ? "∞" : formatPrice(max)}`,
        onRemove: () => updateFilters({ priceRange: null }),
      });
    }
    if (filters.inStock) {
      tags.push({
        key: "inStock",
        label: "In Stock Only",
        onRemove: () => updateFilters({ inStock: null }),
      });
    }
    if (filters.badge) {
      tags.push({
        key: "badge",
        label: filters.badge,
        onRemove: () => updateFilters({ badge: null }),
      });
    }
    return tags;
  }, [filters, updateFilters, toggleCategory, toggleCollection]);

  const clearAllFilters = useCallback(() => {
    setFilters({ ...DEFAULT_FILTERS });
    setSearchInput("");
  }, []);

  const hasActiveFilters = activeTags.length > 0;

  const totalPages = result.totalPages;
  const currentPage = result.page;
  const pageNumbers = useMemo(() => {
    const pages: number[] = [];
    const delta = 2;
    const start = Math.max(1, currentPage - delta);
    const end = Math.min(totalPages, currentPage + delta);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }, [currentPage, totalPages]);

  const toggleStockFilter = useCallback(() => {
    setFilters((prev) => ({
      ...prev,
      inStock: prev.inStock === true ? null : true,
      page: 1,
    }));
  }, []);


  const renderFilterSidebar = (className?: string) => (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center gap-2">
        <SlidersHorizontal className="w-4 h-4 text-muted" />
        <span className="text-xs tracking-[2px] uppercase text-muted font-medium">Filters</span>
      </div>

      <div>
        <button
          onClick={() => toggleSection("category")}
          className="flex items-center justify-between w-full text-xs tracking-[1.5px] uppercase text-muted font-medium mb-3"
        >
          Category
          {expandedSections.category ? (
            <ChevronUp className="w-3 h-3" />
          ) : (
            <ChevronDown className="w-3 h-3" />
          )}
        </button>
        <AnimatePresence>
          {expandedSections.category && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="space-y-2">
                {categories.map((cat) => (
                  <label
                    key={cat}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <span
                      className={cn(
                        "w-4 h-4 rounded-[2px] border flex items-center justify-center transition-all duration-200",
                        filters.categories.includes(cat)
                          ? "border-gold bg-gold/10"
                          : "border-border group-hover:border-gold/30"
                      )}
                    >
                      {filters.categories.includes(cat) && (
                        <span className="w-2 h-2 rounded-[1px] bg-gold" />
                      )}
                    </span>
                    <span className="text-sm text-muted group-hover:text-foreground transition-colors">
                      {cat}
                    </span>
                  </label>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Separator className="bg-border" />

      <div>
        <button
          onClick={() => toggleSection("collection")}
          className="flex items-center justify-between w-full text-xs tracking-[1.5px] uppercase text-muted font-medium mb-3"
        >
          Collection
          {expandedSections.collection ? (
            <ChevronUp className="w-3 h-3" />
          ) : (
            <ChevronDown className="w-3 h-3" />
          )}
        </button>
        <AnimatePresence>
          {expandedSections.collection && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="space-y-2">
                {collections.map((col) => (
                  <label
                    key={col}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <span
                      className={cn(
                        "w-4 h-4 rounded-[2px] border flex items-center justify-center transition-all duration-200",
                        filters.collections.includes(col)
                          ? "border-gold bg-gold/10"
                          : "border-border group-hover:border-gold/30"
                      )}
                    >
                      {filters.collections.includes(col) && (
                        <span className="w-2 h-2 rounded-[1px] bg-gold" />
                      )}
                    </span>
                    <span className="text-sm text-muted group-hover:text-foreground transition-colors capitalize">
                      {col}
                    </span>
                  </label>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Separator className="bg-border" />

      <div>
        <button
          onClick={() => toggleSection("price")}
          className="flex items-center justify-between w-full text-xs tracking-[1.5px] uppercase text-muted font-medium mb-3"
        >
          Price Range
          {expandedSections.price ? (
            <ChevronUp className="w-3 h-3" />
          ) : (
            <ChevronDown className="w-3 h-3" />
          )}
        </button>
        <AnimatePresence>
          {expandedSections.price && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="space-y-2">
                {PRICE_RANGES.map((range) => (
                  <label
                    key={range.label}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <span
                      className={cn(
                        "w-4 h-4 rounded-full border flex items-center justify-center transition-all duration-200",
                        filters.priceRange &&
                          filters.priceRange.min === range.min &&
                          filters.priceRange.max === range.max
                          ? "border-gold bg-gold/10"
                          : "border-border group-hover:border-gold/30"
                      )}
                    >
                      {filters.priceRange &&
                        filters.priceRange.min === range.min &&
                        filters.priceRange.max === range.max && (
                          <span className="w-2 h-2 rounded-full bg-gold" />
                        )}
                    </span>
                    <span className="text-sm text-muted group-hover:text-foreground transition-colors">
                      {range.label}
                    </span>
                  </label>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Separator className="bg-border" />

      <div>
        <button
          onClick={() => toggleSection("availability")}
          className="flex items-center justify-between w-full text-xs tracking-[1.5px] uppercase text-muted font-medium mb-3"
        >
          Availability
          {expandedSections.availability ? (
            <ChevronUp className="w-3 h-3" />
          ) : (
            <ChevronDown className="w-3 h-3" />
          )}
        </button>
        <AnimatePresence>
          {expandedSections.availability && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <label
                className="flex items-center gap-3 cursor-pointer group"
                onClick={toggleStockFilter}
              >
                <span
                  className={cn(
                    "w-8 h-[18px] rounded-full flex items-center transition-all duration-300 px-0.5",
                    filters.inStock ? "bg-gold justify-end" : "bg-border justify-start"
                  )}
                >
                  <span className="w-3.5 h-3.5 rounded-full bg-white shadow-sm" />
                </span>
                <span className="text-sm text-muted group-hover:text-foreground transition-colors">
                  In Stock Only
                </span>
              </label>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Separator className="bg-border" />

      <div>
        <button
          onClick={() => toggleSection("badge")}
          className="flex items-center justify-between w-full text-xs tracking-[1.5px] uppercase text-muted font-medium mb-3"
        >
          Badge
          {expandedSections.badge ? (
            <ChevronUp className="w-3 h-3" />
          ) : (
            <ChevronDown className="w-3 h-3" />
          )}
        </button>
        <AnimatePresence>
          {expandedSections.badge && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-2">
                {BADGE_OPTIONS.map((b) => (
                  <button
                    key={b}
                    onClick={() =>
                      updateFilters({ badge: filters.badge === b ? null : b })
                    }
                    className={cn(
                      "px-3 py-1.5 text-[10px] tracking-[1.5px] uppercase rounded-[2px] border transition-all duration-200",
                      filters.badge === b
                        ? "border-gold bg-gold/10 text-gold"
                        : "border-border text-muted hover:border-gold/30 hover:text-foreground"
                    )}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  return (
    <section className="pt-32 lg:pt-40 pb-24 lg:pb-32 px-6 lg:px-12">
      <div className="max-w-[1400px] mx-auto">
        <BackButton />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-[11px] tracking-[3px] uppercase text-gold font-medium mb-4">
            THE COLLECTION
          </p>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-4"
            style={{ fontFamily: "var(--font-heading), serif" }}
          >
            All Watches
          </h1>
          <p className="text-sm text-muted max-w-md mx-auto">
            Discover our complete range of premium watches, curated with
            quality and style.
          </p>
        </motion.div>

        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <Input
            ref={inputRef}
            value={searchInput}
            onChange={handleSearchChange}
            placeholder="Search watches by name, category, or collection..."
            className="pl-11 pr-10"
          />
          {searchInput && (
            <button
              onClick={clearSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="hidden lg:block w-[260px] shrink-0">
            <div className="sticky top-32 bg-card border border-border rounded-[2px] p-6">
              {renderFilterSidebar()}
            </div>
          </aside>

          <div className="fixed inset-0 z-50 lg:hidden pointer-events-none">
            <AnimatePresence>
              {mobileFiltersOpen && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 pointer-events-auto"
                    onClick={() => setMobileFiltersOpen(false)}
                  />
                  <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "-100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="fixed inset-y-0 left-0 w-[320px] max-w-[85vw] bg-background border-r border-border overflow-y-auto pointer-events-auto"
                  >
                    <div className="flex items-center justify-between p-6 border-b border-border">
                      <span className="text-xs tracking-[2px] uppercase text-muted font-medium">
                        Filters
                      </span>
                      <button
                        onClick={() => setMobileFiltersOpen(false)}
                        className="text-muted hover:text-foreground transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="p-6">
                      {renderFilterSidebar()}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 text-xs tracking-[1.5px] uppercase border border-border rounded-[2px] text-muted hover:border-gold/30 hover:text-foreground transition-all"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {hasActiveFilters && (
                  <span className="w-5 h-5 flex items-center justify-center rounded-full bg-gold text-background text-[10px] font-semibold">
                    {activeTags.length}
                  </span>
                )}
              </button>

              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-muted" />
                <select
                  value={filters.sort}
                  onChange={(e) =>
                    updateFilters({ sort: e.target.value as SortOption })
                  }
                  className="bg-transparent text-xs tracking-[1px] uppercase text-muted focus:outline-none cursor-pointer"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                {activeTags.map((tag) => (
                  <span
                    key={tag.key}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] tracking-[1px] uppercase rounded-[2px] border border-gold/30 bg-gold/5 text-gold"
                  >
                    {tag.label}
                    <button
                      onClick={tag.onRemove}
                      className="hover:text-foreground transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <button
                  onClick={clearAllFilters}
                  className="text-[10px] tracking-[1px] uppercase text-muted hover:text-foreground transition-colors ml-1"
                >
                  Clear All
                </button>
              </div>
            )}

            <p className="text-xs text-muted mb-6">
              Showing {result.products.length} of {result.total}{" "}
              {result.total === 1 ? "product" : "products"}
            </p>

            {result.products.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-24"
              >
                <Search className="w-12 h-12 text-border mx-auto mb-6" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No watches found
                </h3>
                <p className="text-sm text-muted mb-8 max-w-sm mx-auto">
                  Try adjusting your search or filters to find what you&apos;re
                  looking for.
                </p>
                <Button variant="secondary" size="sm" onClick={clearAllFilters}>
                  Clear All Filters
                </Button>
              </motion.div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {result.products.map((product, index) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      index={index}
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12">
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => setPage(currentPage - 1)}
                      disabled={currentPage <= 1}
                      className="!h-10 !w-10"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    {pageNumbers[0] > 1 && (
                      <>
                        <button
                          onClick={() => setPage(1)}
                          className="w-10 h-10 flex items-center justify-center text-xs tracking-wide border border-border rounded-[2px] text-muted hover:border-gold/30 hover:text-foreground transition-all"
                        >
                          1
                        </button>
                        {pageNumbers[0] > 2 && (
                          <span className="w-10 h-10 flex items-center justify-center text-xs text-muted">
                            ...
                          </span>
                        )}
                      </>
                    )}
                    {pageNumbers.map((num) => (
                      <button
                        key={num}
                        onClick={() => setPage(num)}
                        className={cn(
                          "w-10 h-10 flex items-center justify-center text-xs tracking-wide rounded-[2px] border transition-all duration-200",
                          num === currentPage
                            ? "border-gold bg-gold/10 text-gold"
                            : "border-border text-muted hover:border-gold/30 hover:text-foreground"
                        )}
                      >
                        {num}
                      </button>
                    ))}
                    {pageNumbers[pageNumbers.length - 1] < totalPages && (
                      <>
                        {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                          <span className="w-10 h-10 flex items-center justify-center text-xs text-muted">
                            ...
                          </span>
                        )}
                        <button
                          onClick={() => setPage(totalPages)}
                          className="w-10 h-10 flex items-center justify-center text-xs tracking-wide border border-border rounded-[2px] text-muted hover:border-gold/30 hover:text-foreground transition-all"
                        >
                          {totalPages}
                        </button>
                      </>
                    )}
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => setPage(currentPage + 1)}
                      disabled={currentPage >= totalPages}
                      className="!h-10 !w-10"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
