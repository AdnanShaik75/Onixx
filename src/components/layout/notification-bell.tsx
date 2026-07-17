"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Package,
  User,
  Heart,
  AlertTriangle,
  ShoppingBag,
  Star,
  Settings,
  CheckCheck,
} from "lucide-react";
import { useNotificationStore } from "@/store/notifications";
import type { NotificationType } from "@/lib/types";
import { cn } from "@/lib/utils";

const TYPE_ICON: Record<NotificationType, typeof Bell> = {
  order_update: Package,
  account: User,
  wishlist: Heart,
  low_stock: AlertTriangle,
  new_order: ShoppingBag,
  review: Star,
  system: Settings,
};

const TYPE_COLOR: Record<NotificationType, string> = {
  order_update: "text-blue-400",
  account: "text-emerald-400",
  wishlist: "text-pink-400",
  low_stock: "text-amber-400",
  new_order: "text-cyan-400",
  review: "text-purple-400",
  system: "text-muted",
};

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const seconds = Math.floor((now - then) / 1000);

  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLButtonElement>(null);

  const notifications = useNotificationStore((s) => s.notifications);
  const markAsRead = useNotificationStore((s) => s.markAsRead);
  const markAllAsRead = useNotificationStore((s) => s.markAllAsRead);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const sorted = [...notifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        bellRef.current &&
        !bellRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    },
    []
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, handleClickOutside]);

  return (
    <div className="relative">
      <button
        ref={bellRef}
        onClick={() => setIsOpen((prev) => !prev)}
        className="hidden lg:flex items-center justify-center w-10 h-10 text-muted hover:text-gold transition-colors duration-300 relative"
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-full mt-2 w-[380px] bg-card border border-border rounded-[2px] shadow-lg z-50"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <span className="text-xs tracking-[2px] uppercase font-medium text-foreground">
                Notifications
              </span>
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllAsRead()}
                  className="flex items-center gap-1.5 text-[10px] tracking-[1px] uppercase text-muted hover:text-gold transition-colors duration-300"
                >
                  <CheckCheck className="w-3 h-3" />
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-[420px] overflow-y-auto">
              {sorted.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted">
                  <Bell className="w-8 h-8 mb-3 opacity-30" />
                  <span className="text-xs tracking-[1px] uppercase">
                    No notifications yet
                  </span>
                </div>
              ) : (
                sorted.map((n) => {
                  const Icon = TYPE_ICON[n.type];
                  const iconColor = TYPE_COLOR[n.type];
                  return (
                    <button
                      key={n.id}
                      onClick={() => {
                        if (!n.read) markAsRead(n.id);
                        setIsOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-start gap-3 px-5 py-3.5 text-left transition-colors duration-200 hover:bg-accent/50 border-b border-border last:border-b-0",
                        !n.read && "bg-accent/30"
                      )}
                    >
                      <div className="relative flex-shrink-0 mt-0.5">
                        <Icon className={cn("w-4 h-4", iconColor)} />
                        {!n.read && (
                          <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span
                          className={cn(
                            "text-xs leading-tight block",
                            !n.read ? "font-semibold text-foreground" : "text-muted"
                          )}
                        >
                          {n.title}
                        </span>
                        <span className="text-[11px] text-muted leading-snug block mt-0.5 line-clamp-2">
                          {n.message}
                        </span>
                        <span className="text-[10px] text-muted/60 mt-1 block">
                          {timeAgo(n.createdAt)}
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {sorted.length > 0 && (
              <div className="border-t border-border px-5 py-3">
                <Link
                  href="/account"
                  onClick={() => setIsOpen(false)}
                  className="block text-center text-[10px] tracking-[2px] uppercase text-muted hover:text-gold transition-colors duration-300"
                >
                  View all
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
