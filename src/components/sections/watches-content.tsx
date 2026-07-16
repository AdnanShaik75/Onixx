"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { SlidersHorizontal, Grid3X3, LayoutGrid } from "lucide-react";
import { useProductStore } from "@/store/products";
import { ProductCard } from "@/components/shared/product-card";
import { Separator } from "@/components/ui/separator";

type SortOption = "featured" | "price-asc" | "price-desc" | "newest" | "rating";

export function WatchesContent() {
  const { products: storeProducts } = useProductStore();
  const [sort, setSort] = useState<SortOption>("featured");
  const [gridCols, setGridCols] = useState<2 | 3 | 4>(4);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const categories = useMemo(() => {
    const cats = Array.from(new Set(storeProducts.map((p) => p.category)));
    return ["ALL", ...cats.sort()];
  }, [storeProducts]);

  const filteredProducts = useMemo(() => {
    const products =
      selectedCategory === "ALL"
        ? [...storeProducts]
        : storeProducts.filter((p) => p.category === selectedCategory);

    switch (sort) {
      case "price-asc":
        products.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        products.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        products.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        products.sort(
          (a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0)
        );
        break;
      default:
        products.sort(
          (a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0)
        );
    }

    return products;
  }, [sort, selectedCategory, storeProducts]);

  const gridClass =
    gridCols === 2
      ? "grid-cols-1 sm:grid-cols-2"
      : gridCols === 3
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";

  return (
    <section className="pt-32 lg:pt-40 pb-24 lg:pb-32 px-6 lg:px-12">
      <div className="max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
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
            Discover our complete range of luxury timepieces, each crafted with
            unwavering precision and timeless design.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-[11px] tracking-[1.5px] uppercase rounded-[2px] border transition-all duration-300 ${
                  selectedCategory === cat
                    ? "border-gold bg-gold/10 text-gold"
                    : "border-border text-muted hover:border-gold/30 hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-muted" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="bg-transparent text-xs tracking-[1px] uppercase text-muted focus:outline-none cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

            <Separator variant="gold" className="w-px h-4" />

            <div className="flex items-center gap-1">
              <button
                onClick={() => setGridCols(4)}
                className={`p-1 transition-colors ${
                  gridCols === 4 ? "text-gold" : "text-muted hover:text-foreground"
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setGridCols(3)}
                className={`p-1 transition-colors ${
                  gridCols === 3 ? "text-gold" : "text-muted hover:text-foreground"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted mb-6">
          {filteredProducts.length} {filteredProducts.length === 1 ? "watch" : "watches"}
        </p>

        <div className={`grid ${gridClass} gap-8`}>
          {filteredProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
