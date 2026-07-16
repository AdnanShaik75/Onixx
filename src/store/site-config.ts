import { create } from "zustand";
import { persist } from "zustand/middleware";
import { subscribeToPath, saveToPath, isConfigured } from "@/lib/firebase";

const DEFAULT_HERO_IMAGE =
  "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=1920&h=1080&fit=crop&q=80";

interface SiteConfigState {
  heroImage: string;
  heroImageType: "url" | "upload";
  setHeroImage: (src: string, type: "url" | "upload") => void;
  resetHeroImage: () => void;
  _syncFromFirebase: (data: { heroImage?: string; heroImageType?: "url" | "upload" } | null) => void;
}

let firebaseUnsubscribed = false;

export const useSiteConfig = create<SiteConfigState>()(
  persist(
    (set) => ({
      heroImage: DEFAULT_HERO_IMAGE,
      heroImageType: "url",

      setHeroImage: (src, type) => {
        set({ heroImage: src, heroImageType: type });
        saveToPath("siteConfig", { heroImage: src, heroImageType: type });
      },

      resetHeroImage: () => {
        set({ heroImage: DEFAULT_HERO_IMAGE, heroImageType: "url" });
        saveToPath("siteConfig", { heroImage: DEFAULT_HERO_IMAGE, heroImageType: "url" });
      },

      _syncFromFirebase: (data) => {
        if (data) {
          set({
            heroImage: data.heroImage ?? DEFAULT_HERO_IMAGE,
            heroImageType: data.heroImageType ?? "url",
          });
        }
      },
    }),
    {
      name: "onixx-site-config",
      onRehydrateStorage: () => {
        if (isConfigured && !firebaseUnsubscribed) {
          firebaseUnsubscribed = true;
          const unsub = subscribeToPath<{ heroImage: string; heroImageType: "url" | "upload" }>(
            "siteConfig",
            (data) => {
              if (data) {
                useSiteConfig.getState()._syncFromFirebase(data);
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

export { DEFAULT_HERO_IMAGE };
