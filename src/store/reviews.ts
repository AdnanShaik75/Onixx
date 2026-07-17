import { create } from "zustand";
import { persist } from "zustand/middleware";
import { subscribeToPath, saveToPath, isConfigured } from "@/lib/firebase";
import type { Review, ReviewStatus, ReviewVote, ReviewSummary } from "@/lib/types";

const INITIAL_REVIEWS: Review[] = [
  {
    id: "rev-001",
    productId: "royal-chronograph",
    userId: "user-001",
    userName: "Arjun Mehta",
    rating: 5,
    title: "Absolutely stunning timepiece",
    body: "The Royal Chronograph exceeded all my expectations. The craftsmanship is impeccable and it looks even better in person.",
    status: "approved",
    verifiedPurchase: true,
    votes: [
      { userId: "user-002", helpful: true, timestamp: "2026-07-12T08:00:00Z" },
      { userId: "user-003", helpful: true, timestamp: "2026-07-12T10:00:00Z" },
    ],
    helpfulCount: 2,
    unhelpfulCount: 0,
    createdAt: "2026-07-11T12:00:00Z",
    updatedAt: "2026-07-11T12:00:00Z",
  },
  {
    id: "rev-002",
    productId: "heritage-classic",
    userId: "user-004",
    userName: "Neha Kapoor",
    rating: 4,
    title: "Beautiful design, minor clasp issue",
    body: "Love the vintage aesthetic. The dial is gorgeous. Only minor issue is the clasp feels slightly loose, but overall a great watch.",
    status: "approved",
    verifiedPurchase: true,
    votes: [
      { userId: "user-005", helpful: true, timestamp: "2026-07-10T14:00:00Z" },
    ],
    helpfulCount: 1,
    unhelpfulCount: 0,
    createdAt: "2026-07-10T11:00:00Z",
    updatedAt: "2026-07-10T11:00:00Z",
  },
  {
    id: "rev-003",
    productId: "midnight-automatic",
    userId: "user-006",
    userName: "Rahul Verma",
    rating: 5,
    title: "Perfect daily wearer",
    body: "Sleek, comfortable, and keeps excellent time. The midnight blue dial is mesmerizing. Worth every rupee.",
    status: "approved",
    verifiedPurchase: true,
    votes: [],
    helpfulCount: 0,
    unhelpfulCount: 0,
    createdAt: "2026-07-14T09:30:00Z",
    updatedAt: "2026-07-14T09:30:00Z",
  },
  {
    id: "rev-004",
    productId: "sovereign-tourbillon",
    userId: "user-007",
    userName: "Vikram Singh",
    rating: 3,
    title: "Impressive but overpriced",
    body: "The tourbillon movement is fascinating to watch, but at this price point I expected better strap quality. The sapphire crystal is beautiful though.",
    status: "approved",
    verifiedPurchase: false,
    votes: [
      { userId: "user-001", helpful: true, timestamp: "2026-07-15T16:00:00Z" },
      { userId: "user-008", helpful: false, timestamp: "2026-07-15T18:00:00Z" },
    ],
    helpfulCount: 1,
    unhelpfulCount: 1,
    createdAt: "2026-07-15T14:00:00Z",
    updatedAt: "2026-07-15T14:00:00Z",
  },
  {
    id: "rev-005",
    productId: "apex-diver",
    userId: "user-009",
    userName: "Ananya Reddy",
    rating: 4,
    title: "Solid diver with great lume",
    body: "Tested it on a diving trip. The bezel is smooth, water resistance holds up, and the lume is fantastic. Slightly heavy for everyday wear.",
    status: "approved",
    verifiedPurchase: true,
    votes: [
      { userId: "user-010", helpful: true, timestamp: "2026-07-16T07:00:00Z" },
    ],
    helpfulCount: 1,
    unhelpfulCount: 0,
    createdAt: "2026-07-16T05:00:00Z",
    updatedAt: "2026-07-16T05:00:00Z",
  },
  {
    id: "rev-006",
    productId: "titan-sport",
    userId: "user-011",
    userName: "Dev Malhotra",
    rating: 3,
    title: "Good sports watch, average finishing",
    body: "Decent for the price. The chronograph works well and it is comfortable during workouts. However, the finishing does not match the premium feel of other models.",
    status: "pending",
    verifiedPurchase: false,
    votes: [],
    helpfulCount: 0,
    unhelpfulCount: 0,
    createdAt: "2026-07-17T10:00:00Z",
    updatedAt: "2026-07-17T10:00:00Z",
  },
];

interface ReviewState {
  reviews: Review[];
  userId: string | null;
  addReview: (
    review: Omit<Review, "id" | "createdAt" | "updatedAt" | "votes" | "helpfulCount" | "unhelpfulCount" | "status">
  ) => void;
  updateReviewStatus: (id: string, status: ReviewStatus, adminResponse?: string) => void;
  vote: (reviewId: string, userId: string, helpful: boolean) => void;
  getReviewsForProduct: (productId: string) => Review[];
  getReviewSummary: (productId: string) => ReviewSummary;
  deleteReview: (id: string) => void;
  _syncFromFirebase: (reviews: Review[] | null) => void;
}

let firebaseUnsubscribed = false;

export const useReviewStore = create<ReviewState>()(
  persist(
    (set, get) => ({
      reviews: [...INITIAL_REVIEWS],
      userId: null,

      addReview: (review) => {
        const now = new Date().toISOString();
        const newReview: Review = {
          ...review,
          id: `rev-${Date.now()}`,
          status: "pending",
          votes: [],
          helpfulCount: 0,
          unhelpfulCount: 0,
          createdAt: now,
          updatedAt: now,
        };
        const updated = [...get().reviews, newReview];
        set({ reviews: updated });
        saveToPath("reviews", updated);
      },

      updateReviewStatus: (id, status, adminResponse) => {
        const updated = get().reviews.map((r) => {
          if (r.id !== id) return r;
          return {
            ...r,
            status,
            adminResponse: adminResponse ?? r.adminResponse,
            updatedAt: new Date().toISOString(),
          };
        });
        set({ reviews: updated });
        saveToPath("reviews", updated);
      },

      vote: (reviewId, userId, helpful) => {
        const updated = get().reviews.map((r) => {
          if (r.id !== reviewId) return r;
          const existing = r.votes.find((v) => v.userId === userId);
          if (existing) return r;
          const vote: ReviewVote = {
            userId,
            helpful,
            timestamp: new Date().toISOString(),
          };
          return {
            ...r,
            votes: [...r.votes, vote],
            helpfulCount: r.helpfulCount + (helpful ? 1 : 0),
            unhelpfulCount: r.unhelpfulCount + (helpful ? 0 : 1),
            updatedAt: new Date().toISOString(),
          };
        });
        set({ reviews: updated });
        saveToPath("reviews", updated);
      },

      getReviewsForProduct: (productId) =>
        get().reviews.filter((r) => r.productId === productId && r.status === "approved"),

      getReviewSummary: (productId) => {
        const approved = get().reviews.filter(
          (r) => r.productId === productId && r.status === "approved"
        );
        const totalReviews = approved.length;
        const averageRating =
          totalReviews > 0
            ? approved.reduce((sum, r) => sum + r.rating, 0) / totalReviews
            : 0;
        const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        let verifiedCount = 0;
        for (const r of approved) {
          distribution[r.rating] = (distribution[r.rating] ?? 0) + 1;
          if (r.verifiedPurchase) verifiedCount++;
        }
        return { productId, totalReviews, averageRating, distribution, verifiedCount };
      },

      deleteReview: (id) => {
        const updated = get().reviews.filter((r) => r.id !== id);
        set({ reviews: updated });
        saveToPath("reviews", updated);
      },

      _syncFromFirebase: (reviews) => {
        if (Array.isArray(reviews) && reviews.every((r) => r && r.id)) {
          set({ reviews });
        }
      },
    }),
    {
      name: "onixx-reviews",
      onRehydrateStorage: () => {
        if (isConfigured && !firebaseUnsubscribed) {
          firebaseUnsubscribed = true;
          const unsub = subscribeToPath<Review[]>("reviews", (data) => {
            if (data) {
              useReviewStore.getState()._syncFromFirebase(data);
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

export type { Review, ReviewStatus, ReviewVote, ReviewSummary };
