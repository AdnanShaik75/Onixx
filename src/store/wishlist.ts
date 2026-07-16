import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/lib/data";

interface WishlistState {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  toggleItem: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) =>
        set((state) => {
          if (state.items.some((item) => item.id === product.id)) return state;
          return { items: [...state.items, product] };
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        })),

      toggleItem: (product) =>
        set((state) => {
          if (state.items.some((item) => item.id === product.id)) {
            return {
              items: state.items.filter((item) => item.id !== product.id),
            };
          }
          return { items: [...state.items, product] };
        }),

      isInWishlist: (productId) =>
        get().items.some((item) => item.id === productId),
    }),
    {
      name: "onixx-wishlist",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
