"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ThumbsUp, ThumbsDown, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useReviewStore } from "@/store/reviews";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

interface ReviewSectionProps {
  productId: string;
}

const DEMO_USER_ID = "demo-user";

function StarRating({
  rating,
  size = "sm",
  interactive = false,
  onRate,
}: {
  rating: number;
  size?: "sm" | "md";
  interactive?: boolean;
  onRate?: (rating: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  const iconSize = size === "sm" ? "w-4 h-4" : "w-5 h-5";

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        const starValue = i + 1;
        const filled = interactive ? starValue <= (hovered || rating) : starValue <= rating;
        const halfFilled = !interactive && !filled && starValue - 0.5 <= rating;

        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            className={cn(
              "transition-colors duration-200",
              interactive && "cursor-pointer hover:scale-110",
              !interactive && "cursor-default"
            )}
            onMouseEnter={() => interactive && setHovered(starValue)}
            onMouseLeave={() => interactive && setHovered(0)}
            onClick={() => interactive && onRate?.(starValue)}
          >
            <Star
              className={cn(
                iconSize,
                filled
                  ? "text-gold fill-gold"
                  : halfFilled
                  ? "text-gold fill-gold/50"
                  : interactive && hovered >= starValue
                  ? "text-gold fill-gold/30"
                  : "text-border"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}

function ReviewSummarySection({
  averageRating,
  totalReviews,
  distribution,
  verifiedCount,
}: {
  averageRating: number;
  totalReviews: number;
  distribution: Record<number, number>;
  verifiedCount: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="bg-card border border-border rounded-[2px] p-6 md:p-8"
    >
      <div className="flex flex-col md:flex-row gap-8 md:gap-12">
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <p className="text-5xl font-semibold text-foreground mb-2">
            {averageRating.toFixed(1)}
          </p>
          <StarRating rating={averageRating} size="md" />
          <p className="text-sm text-muted mt-2">
            {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
          </p>
          {verifiedCount > 0 && (
            <div className="flex items-center gap-1.5 mt-2">
              <CheckCircle className="w-3.5 h-3.5 text-gold" />
              <span className="text-xs text-muted">
                {verifiedCount} verified {verifiedCount === 1 ? "purchase" : "purchases"}
              </span>
            </div>
          )}
        </div>

        <div className="flex-1 space-y-2.5">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = distribution[star] ?? 0;
            const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-3">
                <span className="text-xs text-muted w-4 text-right">{star}</span>
                <Star className="w-3 h-3 text-gold fill-gold flex-shrink-0" />
                <div className="flex-1 h-2 bg-border/50 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: (5 - star) * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full bg-gold rounded-full"
                  />
                </div>
                <span className="text-xs text-muted w-6 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

function ReviewCard({
  review,
  index,
}: {
  review: {
    id: string;
    userId: string;
    userName: string;
    rating: number;
    title: string;
    body: string;
    verifiedPurchase: boolean;
    helpfulCount: number;
    unhelpfulCount: number;
    votes: { userId: string; helpful: boolean }[];
    createdAt: string;
  };
  index: number;
}) {
  const { vote } = useReviewStore();
  const toast = useToast();
  const [hasVoted, setHasVoted] = useState<"helpful" | "unhelpful" | null>(
    review.votes.some((v) => v.userId === DEMO_USER_ID && v.helpful)
      ? "helpful"
      : review.votes.some((v) => v.userId === DEMO_USER_ID && !v.helpful)
      ? "unhelpful"
      : null
  );

  const handleVote = (helpful: boolean) => {
    if (hasVoted) return;
    vote(review.id, DEMO_USER_ID, helpful);
    setHasVoted(helpful ? "helpful" : "unhelpful");
    toast(helpful ? "Marked as helpful" : "Marked as not helpful");
  };

  const date = new Date(review.createdAt);
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="border border-border rounded-[2px] p-5 md:p-6"
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <p className="text-sm font-medium text-foreground">{review.userName}</p>
            {review.verifiedPurchase && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gold/10 text-gold text-[10px] tracking-wider uppercase rounded-[2px]">
                <CheckCircle className="w-3 h-3" />
                Verified
              </span>
            )}
          </div>
          <StarRating rating={review.rating} />
        </div>
        <span className="text-xs text-muted flex-shrink-0">{formattedDate}</span>
      </div>

      <h4 className="text-sm font-medium text-foreground mb-2">{review.title}</h4>
      <p className="text-sm text-muted leading-relaxed mb-4">{review.body}</p>

      <div className="flex items-center gap-4">
        <span className="text-[11px] text-muted mr-auto">
          {review.helpfulCount + review.unhelpfulCount > 0
            ? `${review.helpfulCount + review.unhelpfulCount} ${
                review.helpfulCount + review.unhelpfulCount === 1 ? "vote" : "votes"
              }`
            : "No votes yet"}
        </span>
        <button
          onClick={() => handleVote(true)}
          disabled={!!hasVoted}
          className={cn(
            "flex items-center gap-1.5 text-xs transition-colors duration-200",
            hasVoted === "helpful"
              ? "text-gold"
              : "text-muted hover:text-gold",
            hasVoted && hasVoted !== "helpful" && "opacity-40 cursor-not-allowed"
          )}
        >
          <ThumbsUp className="w-3.5 h-3.5" />
          {review.helpfulCount}
        </button>
        <button
          onClick={() => handleVote(false)}
          disabled={!!hasVoted}
          className={cn(
            "flex items-center gap-1.5 text-xs transition-colors duration-200",
            hasVoted === "unhelpful"
              ? "text-gold"
              : "text-muted hover:text-gold",
            hasVoted && hasVoted !== "unhelpful" && "opacity-40 cursor-not-allowed"
          )}
        >
          <ThumbsDown className="w-3.5 h-3.5" />
          {review.unhelpfulCount}
        </button>
      </div>
    </motion.div>
  );
}

function WriteReviewForm({ productId }: { productId: string }) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { addReview } = useReviewStore();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || !title.trim() || !body.trim()) return;

    setSubmitting(true);

    addReview({
      productId,
      userId: DEMO_USER_ID,
      userName: "Demo User",
      rating,
      title: title.trim(),
      body: body.trim(),
      verifiedPurchase: false,
    });

    toast("Review submitted! It will appear after approval.");

    setRating(0);
    setTitle("");
    setBody("");
    setSubmitting(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="bg-card border border-border rounded-[2px] p-6 md:p-8"
    >
      <h3
        className="text-lg font-semibold text-foreground mb-6"
        style={{ fontFamily: "var(--font-heading), serif" }}
      >
        Write a Review
      </h3>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs text-muted uppercase tracking-wider mb-2">
            Your Rating
          </label>
          <StarRating rating={rating} size="md" interactive onRate={setRating} />
        </div>

        <div>
          <label className="block text-xs text-muted uppercase tracking-wider mb-2">
            Review Title
          </label>
          <Input
            type="text"
            placeholder="Summarize your experience"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
          />
        </div>

        <div>
          <label className="block text-xs text-muted uppercase tracking-wider mb-2">
            Your Review
          </label>
          <textarea
            placeholder="Tell others about your experience with this product..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={4}
            maxLength={1000}
            className={cn(
              "flex w-full border border-border bg-card px-5 py-4 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-gold/50 transition-colors duration-300 rounded-[2px] resize-none"
            )}
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          disabled={rating === 0 || !title.trim() || !body.trim() || submitting}
          className="w-full sm:w-auto"
        >
          {submitting ? "SUBMITTING..." : "SUBMIT REVIEW"}
        </Button>
      </form>
    </motion.div>
  );
}

export function ReviewSection({ productId }: ReviewSectionProps) {
  const { getReviewsForProduct, getReviewSummary } = useReviewStore();

  const summary = useMemo(
    () => getReviewSummary(productId),
    [productId, getReviewSummary]
  );

  const reviews = useMemo(
    () =>
      getReviewsForProduct(productId).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [productId, getReviewsForProduct]
  );

  return (
    <section className="space-y-8">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-[11px] tracking-[3px] uppercase text-gold font-medium mb-2">
          Customer Reviews
        </p>
        <h2
          className="text-2xl md:text-3xl font-semibold text-foreground"
          style={{ fontFamily: "var(--font-heading), serif" }}
        >
          What Our Clients Say
        </h2>
      </motion.div>

      <Separator variant="gold" />

      {summary.totalReviews > 0 && (
        <ReviewSummarySection
          averageRating={summary.averageRating}
          totalReviews={summary.totalReviews}
          distribution={summary.distribution}
          verifiedCount={summary.verifiedCount}
        />
      )}

      <WriteReviewForm productId={productId} />

      <Separator />

      {reviews.length > 0 ? (
        <div className="space-y-4">
          <AnimatePresence>
            {reviews.map((review, i) => (
              <ReviewCard key={review.id} review={review} index={i} />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center py-12"
        >
          <p className="text-sm text-muted">
            No reviews yet. Be the first to share your experience.
          </p>
        </motion.div>
      )}
    </section>
  );
}
