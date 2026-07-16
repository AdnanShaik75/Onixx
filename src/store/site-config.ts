import { create } from "zustand";
import { persist } from "zustand/middleware";

const DEFAULT_HERO_IMAGE =
  "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=1920&h=1080&fit=crop&q=80";

interface SiteConfigState {
  heroImage: string;
  heroImageType: "url" | "upload";
  setHeroImage: (src: string, type: "url" | "upload") => void;
  resetHeroImage: () => void;
}

export const useSiteConfig = create<SiteConfigState>()(
  persist(
    (set) => ({
      heroImage: DEFAULT_HERO_IMAGE,
      heroImageType: "url",

      setHeroImage: (src, type) =>
        set({ heroImage: src, heroImageType: type }),

      resetHeroImage: () =>
        set({ heroImage: DEFAULT_HERO_IMAGE, heroImageType: "url" }),
    }),
    {
      name: "onixx-site-config",
    }
  )
);

export { DEFAULT_HERO_IMAGE };
