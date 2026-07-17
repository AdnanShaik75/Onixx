import { create } from "zustand";
import { persist } from "zustand/middleware";
import { subscribeToPath, saveToPath, isConfigured } from "@/lib/firebase";
import type { StoreSettings, HeroBanner } from "@/lib/types";

const DEFAULT_SETTINGS: StoreSettings = {
  storeName: "ONIXX",
  storeEmail: "support@onixx.com",
  storePhone: "+91 98765 43210",
  storeAddress: "Mumbai, Maharashtra, India",
  currency: "₹",
  freeShippingThreshold: 500000,
  defaultShippingCost: 999,
  taxRate: 0,
  enableReviews: true,
  enableWishlist: true,
  enableNotifications: true,
  enableOrderConfirmationEmails: true,
  enableShippingUpdateEmails: true,
  heroBanners: [],
  featuredProductIds: [
    "royal-chronograph",
    "midnight-automatic",
    "chronos-aviator",
    "titan-sport",
  ],
};

interface SettingsState {
  settings: StoreSettings;
  updateSettings: (updates: Partial<StoreSettings>) => void;
  setHeroBanner: (banner: HeroBanner) => void;
  removeHeroBanner: (id: string) => void;
  toggleBanner: (id: string) => void;
  reorderBanners: (ids: string[]) => void;
  setFeaturedProducts: (ids: string[]) => void;
  resetSettings: () => void;
  _syncFromFirebase: (data: Partial<StoreSettings>) => void;
}

let firebaseUnsubscribed = false;

export const useSettings = create<SettingsState>()(
  persist(
    (set, get) => ({
      settings: { ...DEFAULT_SETTINGS },

      updateSettings: (updates) => {
        set((state) => ({
          settings: { ...state.settings, ...updates },
        }));
        saveToPath("settings", updates);
      },

      setHeroBanner: (banner) => {
        set((state) => {
          const banners = [...state.settings.heroBanners];
          const idx = banners.findIndex((b) => b.id === banner.id);
          if (idx >= 0) {
            banners[idx] = banner;
          } else {
            banners.push(banner);
          }
          return { settings: { ...state.settings, heroBanners: banners } };
        });
        saveToPath("settings", { heroBanners: get().settings.heroBanners });
      },

      removeHeroBanner: (id) => {
        set((state) => ({
          settings: {
            ...state.settings,
            heroBanners: state.settings.heroBanners.filter((b) => b.id !== id),
          },
        }));
        saveToPath("settings", { heroBanners: get().settings.heroBanners });
      },

      toggleBanner: (id) => {
        set((state) => ({
          settings: {
            ...state.settings,
            heroBanners: state.settings.heroBanners.map((b) =>
              b.id === id ? { ...b, active: !b.active } : b
            ),
          },
        }));
        saveToPath("settings", { heroBanners: get().settings.heroBanners });
      },

      reorderBanners: (ids) => {
        set((state) => {
          const bannerMap = new Map(
            state.settings.heroBanners.map((b) => [b.id, b])
          );
          const reordered = ids
            .map((id, i) => {
              const banner = bannerMap.get(id);
              return banner ? { ...banner, order: i } : null;
            })
            .filter(Boolean) as HeroBanner[];
          return { settings: { ...state.settings, heroBanners: reordered } };
        });
        saveToPath("settings", { heroBanners: get().settings.heroBanners });
      },

      setFeaturedProducts: (ids) => {
        set((state) => ({
          settings: { ...state.settings, featuredProductIds: ids },
        }));
        saveToPath("settings", { featuredProductIds: ids });
      },

      resetSettings: () => {
        set({ settings: { ...DEFAULT_SETTINGS } });
        saveToPath("settings", DEFAULT_SETTINGS);
      },

      _syncFromFirebase: (data) => {
        if (data && typeof data === "object") {
          set((state) => ({
            settings: { ...state.settings, ...data },
          }));
        }
      },
    }),
    {
      name: "onixx-settings",
      onRehydrateStorage: () => {
        if (isConfigured && !firebaseUnsubscribed) {
          firebaseUnsubscribed = true;
          const unsub = subscribeToPath<Partial<StoreSettings>>(
            "settings",
            (data) => {
              if (data) {
                useSettings.getState()._syncFromFirebase(data);
              }
            }
          );
          if (typeof window !== "undefined") {
            window.addEventListener("beforeunload", unsub);
          }
        }
      },
    }
  )
);
