"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { useProductStore } from "@/store/products";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/utils";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const { products } = useProductStore();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClose = useCallback(() => {
    setQuery("");
    onClose();
  }, [onClose]);

  const results = query.length > 1
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.collection.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/90 backdrop-blur-md z-[80]"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 left-0 right-0 z-[85] p-4 lg:p-6"
          >
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder="Search watches, collections..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-12 pr-12 h-[60px] text-base bg-background border-border"
                />
                <button
                  onClick={handleClose}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {results.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 bg-card border border-border rounded-[2px] max-h-[400px] overflow-y-auto"
                >
                  {results.map((product) => (
                    <Link
                      key={product.id}
                      href={`/watches/${product.id}`}
                      onClick={handleClose}
                      className="flex items-center gap-4 p-4 hover:bg-section transition-colors duration-200 border-b border-border last:border-0"
                    >
                      <div className="w-14 h-14 bg-background rounded-[2px] overflow-hidden border border-border flex-shrink-0">
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={56}
                          height={56}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] tracking-[1.5px] uppercase text-gold">
                          {product.category}
                        </p>
                        <h4 className="text-sm font-medium text-foreground truncate">
                          {product.name}
                        </h4>
                      </div>
                      <p className="text-sm text-muted">
                        {formatPrice(product.price)}
                      </p>
                    </Link>
                  ))}
                </motion.div>
              )}

              {query.length > 1 && results.length === 0 && (
                <div className="mt-4 text-center py-12">
                  <p className="text-sm text-muted">
                    No results found for &ldquo;{query}&rdquo;
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
