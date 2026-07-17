"use client";

import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse bg-muted/20 rounded-[2px]", className)} {...props} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="group">
      <div className="relative aspect-square bg-card rounded-[2px] overflow-hidden border border-border">
        <Skeleton className="absolute inset-0 rounded-none" />
        <div className="absolute top-4 left-4 z-10">
          <Skeleton className="w-16 h-5" />
        </div>
      </div>

      <div className="mt-5 space-y-2">
        <Skeleton className="w-20 h-2" />
        <Skeleton className="w-full h-4" />
        <div className="flex items-center gap-2">
          <Skeleton className="w-16 h-4" />
          <Skeleton className="w-12 h-4" />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="w-3 h-3 rounded-full" />
            ))}
          </div>
          <Skeleton className="w-8 h-3" />
          <Skeleton className="w-4 h-4 ml-auto rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function OrderCardSkeleton() {
  return (
    <div className="border border-border rounded-[2px] p-5 md:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="w-20 h-5" />
        <Skeleton className="w-16 h-3" />
      </div>
      <div className="space-y-2">
        <Skeleton className="w-full h-3" />
        <Skeleton className="w-3/4 h-3" />
      </div>
      <div className="flex items-center justify-between pt-2">
        <Skeleton className="w-24 h-4" />
        <Skeleton className="w-12 h-4" />
      </div>
    </div>
  );
}

export function ReviewCardSkeleton() {
  return (
    <div className="border border-border rounded-[2px] p-5 md:p-6">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="space-y-2">
          <Skeleton className="w-24 h-3" />
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="w-3.5 h-3.5 rounded-full" />
            ))}
          </div>
        </div>
        <Skeleton className="w-20 h-3 flex-shrink-0" />
      </div>
      <Skeleton className="w-2/3 h-4 mb-2" />
      <div className="space-y-1.5 mb-4">
        <Skeleton className="w-full h-3" />
        <Skeleton className="w-full h-3" />
        <Skeleton className="w-1/2 h-3" />
      </div>
      <div className="flex items-center gap-4">
        <Skeleton className="w-16 h-3" />
        <Skeleton className="w-8 h-3" />
        <Skeleton className="w-8 h-3" />
      </div>
    </div>
  );
}

export function DashboardCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-[2px] p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="w-20 h-3" />
        <Skeleton className="w-5 h-5 rounded-full" />
      </div>
      <Skeleton className="w-24 h-8" />
      <Skeleton className="w-32 h-3" />
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="border border-border rounded-[2px] overflow-hidden">
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center gap-4">
          {Array.from({ length: cols }).map((_, i) => (
            <Skeleton key={i} className="h-4 flex-1" />
          ))}
        </div>
      </div>
      <div className="divide-y divide-border">
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <div key={rowIdx} className="p-4">
            <div className="flex items-center gap-4">
              {Array.from({ length: cols }).map((_, colIdx) => (
                <Skeleton
                  key={colIdx}
                  className={cn("h-3 flex-1", colIdx === 0 && "w-1/4 flex-none")}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="min-h-screen">
      <div className="bg-background border-b border-border">
        <div className="max-w-[1400px] mx-auto h-16 lg:h-[90px] flex items-center justify-between px-6 lg:px-12">
          <Skeleton className="w-32 h-7" />
          <div className="hidden lg:flex items-center gap-8">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="w-16 h-3" />
            ))}
          </div>
          <div className="flex items-center gap-1">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="w-10 h-10 rounded-full" />
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12 space-y-8">
        <div className="space-y-3">
          <Skeleton className="w-24 h-2" />
          <Skeleton className="w-72 h-8" />
        </div>
        <Skeleton className="w-full h-px" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
