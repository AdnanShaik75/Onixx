import { ref, get, set } from "firebase/database";
import { db, isConfigured } from "@/lib/firebase";
import { ALL_PRODUCTS } from "@/lib/data";

const SEED_DATA = {
  products: [...ALL_PRODUCTS],
  orders: [
    { id: "ORD-001", customer: "Arjun Mehta", email: "arjun.mehta@email.com", product: "Royal Chronograph", productId: "royal-chronograph", amount: 1074850, status: "Delivered", date: "2026-07-10", address: "42 Marine Drive, Mumbai" },
    { id: "ORD-002", customer: "Priya Sharma", email: "priya.sharma@email.com", product: "Midnight Automatic", productId: "midnight-automatic", amount: 726250, status: "Shipped", date: "2026-07-12", address: "15 MG Road, Bangalore" },
    { id: "ORD-003", customer: "Vikram Singh", email: "vikram.singh@email.com", product: "Sovereign Tourbillon", productId: "sovereign-tourbillon", amount: 2033500, status: "Processing", date: "2026-07-14", address: "8 Civil Lines, Jaipur" },
    { id: "ORD-004", customer: "Neha Kapoor", email: "neha.kapoor@email.com", product: "Heritage Classic", productId: "heritage-classic", amount: 410850, status: "Delivered", date: "2026-07-08", address: "22 Connaught Place, Delhi" },
    { id: "ORD-005", customer: "Rahul Verma", email: "rahul.verma@email.com", product: "Apex Diver Pro", productId: "apex-diver", amount: 576850, status: "Shipped", date: "2026-07-13", address: "7 Jubilee Hills, Hyderabad" },
    { id: "ORD-006", customer: "Ananya Reddy", email: "ananya.reddy@email.com", product: "Titan Sport", productId: "titan-sport", amount: 597600, status: "Processing", date: "2026-07-15", address: "31 Koramangala, Bangalore" },
    { id: "ORD-007", customer: "Dev Malhotra", email: "dev.malhotra@email.com", product: "Chronos Aviator", productId: "chronos-aviator", amount: 817550, status: "Delivered", date: "2026-07-06", address: "56 Park Street, Kolkata" },
    { id: "ORD-008", customer: "Meera Joshi", email: "meera.joshi@email.com", product: "Meridian World Timer", productId: "meridian-world", amount: 954500, status: "Shipped", date: "2026-07-11", address: "12 FC Road, Pune" },
  ],
  activity: [
    { id: "a1", action: "Order Shipped", detail: "ORD-002 shipped to Priya Sharma", timestamp: "2026-07-16T09:30:00", type: "order" },
    { id: "a2", action: "Stock Alert", detail: "Nocturne Skeleton dropped to 1 unit", timestamp: "2026-07-16T08:15:00", type: "stock" },
    { id: "a3", action: "Product Updated", detail: "Royal Chronograph price refreshed", timestamp: "2026-07-15T16:42:00", type: "product" },
  ],
  siteConfig: {
    heroImage: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=1920&h=1080&fit=crop&q=80",
    heroImageType: "url",
  },
};

let seeded = false;

export async function seedFirebaseIfEmpty(): Promise<void> {
  if (!isConfigured || !db || seeded) return;
  seeded = true;

  try {
    const snapshot = await get(ref(db, "products"));
    if (!snapshot.exists()) {
      await set(ref(db), SEED_DATA);
    }
  } catch {
    // Silently fail — localStorage fallback will handle it
  }
}
