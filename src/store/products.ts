import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/lib/data";
import { ALL_PRODUCTS } from "@/lib/data";
import { subscribeToPath, saveToPath, isConfigured } from "@/lib/firebase";

interface ProductState {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  _syncFromFirebase: (products: Product[] | null) => void;
}

let firebaseUnsubscribed = false;

export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      products: [...ALL_PRODUCTS],

      addProduct: (product) => {
        const updated = [...get().products, product];
        set({ products: updated });
        saveToPath("products", updated);
      },

      updateProduct: (id, updates) => {
        const updated = get().products.map((p) =>
          p.id === id ? { ...p, ...updates } : p
        );
        set({ products: updated });
        saveToPath("products", updated);
      },

      deleteProduct: (id) => {
        const updated = get().products.filter((p) => p.id !== id);
        set({ products: updated });
        saveToPath("products", updated);
      },

      _syncFromFirebase: (products) => {
        if (Array.isArray(products) && products.every((p) => p && p.id && p.name && typeof p.price === "number")) {
          set({ products });
        }
      },
    }),
    {
      name: "onixx-products",
      onRehydrateStorage: () => {
        if (isConfigured && !firebaseUnsubscribed) {
          firebaseUnsubscribed = true;
          const unsub = subscribeToPath<Product[]>("products", (data) => {
            if (data) {
              useProductStore.getState()._syncFromFirebase(data);
            }
          });
          if (typeof window !== "undefined") {
            window.addEventListener("beforeunload", unsub);
          }
        }
      },
    }
  )
);
