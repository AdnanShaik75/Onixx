"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Upload, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Product } from "@/lib/data";

interface ProductFormProps {
  product?: Product | null;
  onSave: (product: Product) => void;
  onClose: () => void;
}

const emptyProduct: Product = {
  id: "",
  name: "",
  category: "AUTOMATIC",
  collection: "signature",
  price: 0,
  rating: 5,
  reviewCount: 0,
  image: "",
  images: [],
  description: "",
  features: [],
  specs: [],
  strapMaterial: "",
  caseMaterial: "",
  movement: "",
  waterResistance: "",
  caseSize: "",
  stock: 0,
};

const categories = ["AUTOMATIC", "QUARTZ", "DIVER", "MANUAL WIND"];
const collections = ["signature", "heritage", "skeleton"];
const badges = ["", "BESTSELLER", "SALE", "NEW", "LIMITED"];

export function ProductForm({ product, onSave, onClose }: ProductFormProps) {
  const [form, setForm] = useState<Product>(() => product ?? emptyProduct);
  const [featuresText, setFeaturesText] = useState(() =>
    product ? product.features.join("\n") : ""
  );
  const [specsText, setSpecsText] = useState(() =>
    product ? product.specs.map((s) => `${s.label}: ${s.value}`).join("\n") : ""
  );
  const [imagesText, setImagesText] = useState(() =>
    product ? product.images.join("\n") : ""
  );
  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const features = featuresText
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);

    const specs = specsText
      .split("\n")
      .map((s) => {
        const [label, ...rest] = s.split(":");
        return { label: label?.trim() || "", value: rest.join(":").trim() };
      })
      .filter((s) => s.label && s.value);

    const images = imagesText
      .split("\n")
      .map((img) => img.trim())
      .filter(Boolean);

    const id = form.id || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    onSave({
      ...form,
      id,
      features,
      specs,
      images: images.length > 0 ? images : [form.image],
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
      rating: Number(form.rating),
      reviewCount: Number(form.reviewCount),
      stock: Number(form.stock),
    });
  };

  const update = (field: keyof Product, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[60]"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 right-0 h-full w-full max-w-2xl bg-background border-l border-border z-[61] overflow-y-auto"
      >
        <form onSubmit={handleSubmit} className="p-4 lg:p-8">
          <div className="flex items-center justify-between mb-8">
            <h2
              className="text-xl font-semibold"
              style={{ fontFamily: "var(--font-heading), serif" }}
            >
              {product ? "Edit Product" : "Add Product"}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center text-muted hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gold">Basic Information</h3>
              <div>
                <label className="text-xs text-muted">Product Name</label>
                <Input
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Royal Chronograph"
                  required
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => update("category", e.target.value)}
                    className="w-full mt-1 h-10 px-3 bg-transparent border border-border rounded-[2px] text-sm focus:outline-none focus:border-gold/50"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted">Collection</label>
                  <select
                    value={form.collection}
                    onChange={(e) => update("collection", e.target.value)}
                    className="w-full mt-1 h-10 px-3 bg-transparent border border-border rounded-[2px] text-sm focus:outline-none focus:border-gold/50"
                  >
                    {collections.map((c) => (
                      <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-muted">Badge</label>
                <select
                  value={form.badge || ""}
                  onChange={(e) => update("badge", e.target.value || undefined)}
                  className="w-full mt-1 h-10 px-3 bg-transparent border border-border rounded-[2px] text-sm focus:outline-none focus:border-gold/50"
                >
                  {badges.map((b) => (
                    <option key={b} value={b}>{b || "None"}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm text-muted cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isBestSeller || false}
                    onChange={(e) => update("isBestSeller", e.target.checked)}
                    className="accent-gold"
                  />
                  Best Seller
                </label>
                <label className="flex items-center gap-2 text-sm text-muted cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isNewArrival || false}
                    onChange={(e) => update("isNewArrival", e.target.checked)}
                    className="accent-gold"
                  />
                  New Arrival
                </label>
                <label className="flex items-center gap-2 text-sm text-muted cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isLimitedEdition || false}
                    onChange={(e) => update("isLimitedEdition", e.target.checked)}
                    className="accent-gold"
                  />
                  Limited Edition
                </label>
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gold">Pricing & Ratings</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted">Price (₹)</label>
                  <Input
                    type="number"
                    value={form.price || ""}
                    onChange={(e) => update("price", e.target.value)}
                    placeholder="1074850"
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted">Original Price (₹, optional)</label>
                  <Input
                    type="number"
                    value={form.originalPrice || ""}
                    onChange={(e) => update("originalPrice", e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="1299999"
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted">Rating (0–5)</label>
                  <Input
                    type="number"
                    step="0.5"
                    min="0"
                    max="5"
                    value={form.rating}
                    onChange={(e) => update("rating", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted">Review Count</label>
                  <Input
                    type="number"
                    value={form.reviewCount}
                    onChange={(e) => update("reviewCount", e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted">Stock Quantity</label>
                <Input
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(e) => update("stock", Number(e.target.value))}
                  placeholder="0"
                  className="mt-1"
                />
                <p className="text-[10px] text-muted mt-1">
                  Set to 0 for out of stock. Low stock alert at 5 or fewer.
                </p>
              </div>
            </div>

            {/* Images */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gold">Images</h3>

              {/* Main Image */}
              <div>
                <label className="text-xs text-muted">Main Image</label>
                <div className="mt-1 space-y-2">
                  {form.image && (
                    <div className="relative w-full aspect-video bg-background border border-border rounded-[2px] overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={form.image}
                        alt="Main image preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 px-2 py-1 bg-background/80 backdrop-blur-sm text-[10px] text-muted rounded-[2px]">
                        {form.image.startsWith("data:") ? "Uploaded" : "URL"}
                      </div>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <label className="flex items-center justify-center gap-2 flex-1 h-10 border border-dashed border-border rounded-[2px] text-sm text-muted hover:text-gold hover:border-gold/30 transition-colors cursor-pointer">
                      <Upload className="w-4 h-4" />
                      Upload
                      <input
                        ref={mainImageInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          if (file.size > 2 * 1024 * 1024) {
                            alert("File too large. Max 2MB.");
                            return;
                          }
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            update("image", ev.target?.result as string);
                          };
                          reader.readAsDataURL(file);
                        }}
                      />
                    </label>
                    <Input
                      value={form.image.startsWith("data:") ? "" : form.image}
                      onChange={(e) => update("image", e.target.value)}
                      placeholder="Or paste image URL..."
                      className="flex-[2]"
                    />
                  </div>
                  <p className="text-[10px] text-muted">Max 2MB. Paste a URL or upload a file.</p>
                </div>
              </div>

              {/* Gallery Images */}
              <div>
                <label className="text-xs text-muted">Gallery Images (one per line, or upload multiple)</label>
                <div className="mt-1 space-y-2">
                  <label className="flex items-center justify-center gap-2 w-full h-10 border border-dashed border-border rounded-[2px] text-sm text-muted hover:text-gold hover:border-gold/30 transition-colors cursor-pointer">
                    <ImageIcon className="w-4 h-4" />
                    Upload Gallery Images
                    <input
                      ref={galleryInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        const valid = files.filter((f) => f.size <= 2 * 1024 * 1024);
                        if (valid.length < files.length) alert("Some files exceeded 2MB and were skipped.");
                        if (valid.length === 0) return;
                        const readers = valid.map(
                          (file) =>
                            new Promise<string>((resolve) => {
                              const reader = new FileReader();
                              reader.onload = (ev) => resolve(ev.target?.result as string);
                              reader.readAsDataURL(file);
                            })
                        );
                        Promise.all(readers).then((results) => {
                          const existing = imagesText.trim() ? imagesText.trim().split("\n") : [];
                          setImagesText([...existing, ...results].join("\n"));
                        });
                      }}
                    />
                  </label>
                  <textarea
                    value={imagesText}
                    onChange={(e) => setImagesText(e.target.value)}
                    rows={3}
                    placeholder="Or paste URLs one per line..."
                    className="w-full px-3 py-2 bg-transparent border border-border rounded-[2px] text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-gold/50 resize-none font-mono"
                  />
                  {imagesText.trim() && (
                    <div className="flex gap-2 flex-wrap">
                      {imagesText.trim().split("\n").filter(Boolean).map((src, i) => (
                        <div key={i} className="relative w-16 h-16 bg-background border border-border rounded-[2px] overflow-hidden group">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={src} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => {
                              const lines = imagesText.trim().split("\n").filter(Boolean);
                              lines.splice(i, 1);
                              setImagesText(lines.join("\n"));
                            }}
                            className="absolute inset-0 flex items-center justify-center bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity text-red-500"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Description & Features */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gold">Description & Features</h3>
              <div>
                <label className="text-xs text-muted">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  rows={3}
                  required
                  className="w-full mt-1 px-3 py-2 bg-transparent border border-border rounded-[2px] text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-gold/50 resize-none"
                />
              </div>
              <div>
                <label className="text-xs text-muted">Features (one per line)</label>
                <textarea
                  value={featuresText}
                  onChange={(e) => setFeaturesText(e.target.value)}
                  rows={3}
                  placeholder="In-house automatic caliber
Column-wheel chronograph"
                  className="w-full mt-1 px-3 py-2 bg-transparent border border-border rounded-[2px] text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-gold/50 resize-none"
                />
              </div>
              <div>
                <label className="text-xs text-muted">Specifications (one per line, format: Label: Value)</label>
                <textarea
                  value={specsText}
                  onChange={(e) => setSpecsText(e.target.value)}
                  rows={4}
                  placeholder="Movement: Automatic Caliber ONX-R01
Case: 41mm 18K Rose Gold
Dial: Guilloche Grand Feu Enamel"
                  className="w-full mt-1 px-3 py-2 bg-transparent border border-border rounded-[2px] text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-gold/50 resize-none font-mono"
                />
              </div>
            </div>

            {/* Physical Specs */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gold">Physical Specifications</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted">Case Material</label>
                  <Input
                    value={form.caseMaterial || ""}
                    onChange={(e) => update("caseMaterial", e.target.value)}
                    placeholder="18K Rose Gold"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted">Case Size</label>
                  <Input
                    value={form.caseSize || ""}
                    onChange={(e) => update("caseSize", e.target.value)}
                    placeholder="41mm"
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted">Movement</label>
                  <Input
                    value={form.movement || ""}
                    onChange={(e) => update("movement", e.target.value)}
                    placeholder="Automatic"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted">Water Resistance</label>
                  <Input
                    value={form.waterResistance || ""}
                    onChange={(e) => update("waterResistance", e.target.value)}
                    placeholder="100m"
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted">Strap Material</label>
                <Input
                  value={form.strapMaterial || ""}
                  onChange={(e) => update("strapMaterial", e.target.value)}
                  placeholder="Alligator Leather"
                  className="mt-1"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4 border-t border-border">
              <Button type="submit" variant="primary" className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                {product ? "UPDATE PRODUCT" : "ADD PRODUCT"}
              </Button>
              <Button type="button" variant="secondary" onClick={onClose}>
                CANCEL
              </Button>
            </div>
          </div>
        </form>
      </motion.div>
    </AnimatePresence>
  );
}
