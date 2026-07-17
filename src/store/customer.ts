import { create } from "zustand";
import { persist } from "zustand/middleware";
import { subscribeToPath, saveToPath, isConfigured } from "@/lib/firebase";
import type { CustomerProfile, Address } from "@/lib/types";

function generateId(): string {
  return `addr_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

interface CustomerState {
  profile: CustomerProfile | null;
  setProfile: (profile: CustomerProfile) => void;
  clearProfile: () => void;
  addAddress: (address: Omit<Address, "id">) => Address;
  updateAddress: (id: string, updates: Partial<Address>) => void;
  removeAddress: (id: string) => void;
  setDefaultShipping: (id: string) => void;
  setDefaultBilling: (id: string) => void;
  getDefaultShipping: () => Address | undefined;
  getDefaultBilling: () => Address | undefined;
  _syncFromFirebase: (profile: CustomerProfile | null) => void;
}

let firebaseUnsubscribed = false;

export const useCustomerStore = create<CustomerState>()(
  persist(
    (set, get) => ({
      profile: null,

      setProfile: (profile) => {
        set({ profile });
        saveToPath(`customers/${profile.uid}`, profile);
      },

      clearProfile: () => {
        set({ profile: null });
      },

      addAddress: (addressData) => {
        const id = generateId();
        const address: Address = { ...addressData, id };
        const profile = get().profile;
        if (!profile) return address;

        const isFirst = profile.addresses.length === 0;
        const updated = {
          ...profile,
          addresses: [...profile.addresses, { ...address, isDefaultShipping: isFirst, isDefaultBilling: isFirst }],
          updatedAt: new Date().toISOString(),
        };
        set({ profile: updated });
        saveToPath(`customers/${profile.uid}`, updated);
        return address;
      },

      updateAddress: (id, updates) => {
        const profile = get().profile;
        if (!profile) return;

        const updated = {
          ...profile,
          addresses: profile.addresses.map((a) => (a.id === id ? { ...a, ...updates } : a)),
          updatedAt: new Date().toISOString(),
        };
        set({ profile: updated });
        saveToPath(`customers/${profile.uid}`, updated);
      },

      removeAddress: (id) => {
        const profile = get().profile;
        if (!profile) return;

        const remaining = profile.addresses.filter((a) => a.id !== id);
        const needsReassign = remaining.length > 0 && !remaining.some((a) => a.isDefaultShipping);
        const needsReassignBilling = remaining.length > 0 && !remaining.some((a) => a.isDefaultBilling);

        if (needsReassign && remaining.length > 0) remaining[0].isDefaultShipping = true;
        if (needsReassignBilling && remaining.length > 0) remaining[0].isDefaultBilling = true;

        const updated = { ...profile, addresses: remaining, updatedAt: new Date().toISOString() };
        set({ profile: updated });
        saveToPath(`customers/${profile.uid}`, updated);
      },

      setDefaultShipping: (id) => {
        const profile = get().profile;
        if (!profile) return;

        const updated = {
          ...profile,
          addresses: profile.addresses.map((a) => ({ ...a, isDefaultShipping: a.id === id })),
          updatedAt: new Date().toISOString(),
        };
        set({ profile: updated });
        saveToPath(`customers/${profile.uid}`, updated);
      },

      setDefaultBilling: (id) => {
        const profile = get().profile;
        if (!profile) return;

        const updated = {
          ...profile,
          addresses: profile.addresses.map((a) => ({ ...a, isDefaultBilling: a.id === id })),
          updatedAt: new Date().toISOString(),
        };
        set({ profile: updated });
        saveToPath(`customers/${profile.uid}`, updated);
      },

      getDefaultShipping: () => get().profile?.addresses.find((a) => a.isDefaultShipping),

      getDefaultBilling: () => get().profile?.addresses.find((a) => a.isDefaultBilling),

      _syncFromFirebase: (profile) => {
        if (profile && profile.uid) {
          set({ profile });
        }
      },
    }),
    {
      name: "onixx-customer",
      onRehydrateStorage: () => {
        if (isConfigured && !firebaseUnsubscribed) {
          firebaseUnsubscribed = true;
          const unsub = subscribeToPath<CustomerProfile | null>("customers/current", (data) => {
            if (data) {
              useCustomerStore.getState()._syncFromFirebase(data);
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
