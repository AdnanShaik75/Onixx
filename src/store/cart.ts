import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/lib/data";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, maxQuantity?: number) => boolean;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number, maxQuantity?: number) => boolean;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
  getStockError: (productId: string, maxStock?: number) => string | null;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, maxQuantity = Infinity) => {
        const { items } = get();
        const existing = items.find((item) => item.product.id === product.id);
        const currentQty = existing?.quantity ?? 0;
        const available = Math.min(maxQuantity, product.stock ?? Infinity);

        if (currentQty >= available) return false;

        if (existing) {
          set({
            items: items.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: Math.min(item.quantity + 1, available) }
                : item
            ),
          });
        } else {
          set({ items: [...items, { product, quantity: 1 }] });
        }
        return true;
      },

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        })),

      updateQuantity: (productId, quantity, maxQuantity = Infinity) => {
        if (quantity <= 0) {
          set((state) => ({
            items: state.items.filter((item) => item.product.id !== productId),
          }));
          return true;
        }

        const item = get().items.find((i) => i.product.id === productId);
        if (!item) return false;

        const available = Math.min(maxQuantity, item.product.stock ?? Infinity);
        const clamped = Math.min(quantity, available);

        set((state) => ({
          items: state.items.map((i) =>
            i.product.id === productId ? { ...i, quantity: clamped } : i
          ),
        }));
        return clamped === quantity;
      },

      clearCart: () => set({ items: [] }),

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      openCart: () => set({ isOpen: true }),

      closeCart: () => set({ isOpen: false }),

      totalItems: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),

      totalPrice: () =>
        get().items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        ),

      getStockError: (productId, maxStock) => {
        const item = get().items.find((i) => i.product.id === productId);
        if (!item) return null;
        const stock = maxStock ?? item.product.stock ?? Infinity;
        if (item.quantity > stock) {
          return `Only ${stock} available in stock`;
        }
        return null;
      },
    }),
    {
      name: "onixx-cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
