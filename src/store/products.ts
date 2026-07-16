import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/lib/data";
import { ALL_PRODUCTS } from "@/lib/data";

interface ProductState {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  resetProducts: () => void;
}

export const useProductStore = create<ProductState>()(
  persist(
    (set) => ({
      products: [...ALL_PRODUCTS],

      addProduct: (product) =>
        set((state) => ({
          products: [...state.products, product],
        })),

      updateProduct: (id, updates) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        })),

      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),

      resetProducts: () => set({ products: [...ALL_PRODUCTS] }),
    }),
    {
      name: "onixx-products",
    }
  )
);
