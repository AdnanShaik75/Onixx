"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  User,
  MapPin,
  Package,
  Heart,
  Star,
  ChevronRight,
  ShoppingBag,
  CreditCard,
  Pencil,
  CheckCircle2,
  AlertCircle,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/shared/back-button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCustomerStore } from "@/store/customer";
import { useOrderStore } from "@/store/orders";
import { useWishlistStore } from "@/store/wishlist";
import { useReviewStore } from "@/store/reviews";
import { formatPrice, cn } from "@/lib/utils";
import { ORDER_STATUS_COLORS } from "@/lib/types";
import type { OrderStatus } from "@/lib/types";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function AccountPage() {
  const { profile, setProfile } = useCustomerStore();
  const { orders } = useOrderStore();
  const { items: wishlistItems } = useWishlistStore();
  const { reviews } = useReviewStore();

  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [settingsSaved, setSettingsSaved] = useState(false);

  if (!profile) {
    return (
      <section className="pt-32 lg:pt-40 pb-24 lg:pb-32 px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto">
          <BackButton />
          <div className="max-w-md mx-auto p-8 bg-card border border-border rounded-[2px] text-center">
            <User className="w-12 h-12 text-muted mx-auto mb-4" />
            <h2
              className="text-xl font-semibold mb-2"
              style={{ fontFamily: "var(--font-heading), serif" }}
            >
              Sign In Required
            </h2>
            <p className="text-sm text-muted mb-6">
              Sign in to access your dashboard, track orders, and manage your
              profile.
            </p>
            <Link href="/admin/login">
              <Button variant="primary">SIGN IN</Button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const userOrders = orders
    .filter((o) => o.userId === profile.uid || !o.userId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  const recentOrders = userOrders.slice(0, 5);
  const totalSpent = userOrders.reduce((sum, o) => sum + o.total, 0);
  const userReviews = reviews.filter((r) => r.userId === profile.uid);


  const needsProfileCompletion = !profile.displayName || !profile.phone;

  const handleSaveSettings = () => {
    setProfile({
      ...profile,
      displayName: displayName || profile.displayName,
      phone: phone || profile.phone,
      updatedAt: new Date().toISOString(),
    });
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2000);
  };

  const initSettings = () => {
    setDisplayName(profile.displayName);
    setPhone(profile.phone);
  };

  return (
    <section className="pt-32 lg:pt-40 pb-24 lg:pb-32 px-6 lg:px-12">
      <div className="max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <BackButton />
          <h1
            className="text-4xl md:text-5xl font-semibold mb-2"
            style={{ fontFamily: "var(--font-heading), serif" }}
          >
            My Dashboard
          </h1>
          <p className="text-muted text-sm mt-2">
            Welcome back, {profile.displayName || profile.email}
          </p>
        </motion.div>

        {needsProfileCompletion && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-5 bg-gold/5 border border-gold/20 rounded-[2px] flex items-start gap-4"
          >
            <AlertCircle className="w-5 h-5 text-gold mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium mb-1">Complete Your Profile</p>
              <p className="text-xs text-muted">
                {!profile.displayName && !profile.phone
                  ? "Add your display name and phone number to complete your profile."
                  : !profile.displayName
                    ? "Add your display name to personalize your account."
                    : "Add your phone number to complete your profile."}
              </p>
            </div>
            <a href="#settings">
              <Button variant="secondary" size="sm">
                COMPLETE
              </Button>
            </a>
          </motion.div>
        )}

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10"
        >
          {[
            {
              label: "Total Orders",
              value: userOrders.length,
              icon: Package,
              color: "text-blue-400",
            },
            {
              label: "Total Spent",
              value: formatPrice(totalSpent),
              icon: CreditCard,
              color: "text-green-400",
            },
            {
              label: "Wishlist",
              value: wishlistItems.length,
              icon: Heart,
              color: "text-pink-400",
            },
            {
              label: "Reviews",
              value: userReviews.length,
              icon: Star,
              color: "text-gold",
            },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              className="p-5 bg-card border border-border rounded-[2px]"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded bg-surface flex items-center justify-center">
                  <stat.icon className={cn("w-4 h-4", stat.color)} />
                </div>
                <span className="text-xs text-muted uppercase tracking-[1px]">
                  {stat.label}
                </span>
              </div>
              <p className="text-2xl font-semibold">{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2
                  className="text-lg font-semibold"
                  style={{ fontFamily: "var(--font-heading), serif" }}
                >
                  Recent Orders
                </h2>
                <Link
                  href="/orders"
                  className="text-xs text-muted hover:text-gold transition-colors uppercase tracking-[1px] flex items-center gap-1"
                >
                  View All
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>

              {recentOrders.length === 0 ? (
                <div className="p-6 bg-card border border-border rounded-[2px] text-center">
                  <ShoppingBag className="w-8 h-8 text-muted mx-auto mb-3" />
                  <p className="text-sm text-muted">No orders yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentOrders.map((order, i) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 + i * 0.06 }}
                    >
                      <Link
                        href={`/orders/${order.id}`}
                        className="flex items-center gap-4 p-4 bg-card border border-border rounded-[2px] hover:border-gold/30 transition-colors group"
                      >
                        <div className="w-10 h-10 rounded bg-surface flex items-center justify-center shrink-0">
                          <Package className="w-5 h-5 text-muted group-hover:text-gold transition-colors" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium">
                              {order.orderNumber}
                            </span>
                            <span
                              className={cn(
                                "text-[10px] px-2 py-0.5 rounded-[2px] uppercase tracking-wide font-medium",
                                ORDER_STATUS_COLORS[order.status as OrderStatus]
                              )}
                            >
                              {order.status}
                            </span>
                          </div>
                          <p className="text-xs text-muted">
                            {new Date(order.createdAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )}{" "}
                            · {order.items.length} item
                            {order.items.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-medium">
                            {formatPrice(order.total)}
                          </p>
                          <ChevronRight className="w-4 h-4 text-muted group-hover:text-gold transition-colors ml-auto" />
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2
                  className="text-lg font-semibold"
                  style={{ fontFamily: "var(--font-heading), serif" }}
                >
                  Wishlist
                </h2>
                <Link
                  href="/wishlist"
                  className="text-xs text-muted hover:text-gold transition-colors uppercase tracking-[1px] flex items-center gap-1"
                >
                  View All
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>

              {wishlistItems.length === 0 ? (
                <div className="p-6 bg-card border border-border rounded-[2px] text-center">
                  <Heart className="w-8 h-8 text-muted mx-auto mb-3" />
                  <p className="text-sm text-muted">
                    Your wishlist is empty.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {wishlistItems.slice(0, 4).map((item, i) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.55 + i * 0.06 }}
                    >
                      <Link
                        href={`/products/${item.id}`}
                        className="block bg-card border border-border rounded-[2px] overflow-hidden hover:border-gold/30 transition-colors group"
                      >
                        <div className="aspect-square bg-surface relative">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 50vw, 25vw"
                          />
                        </div>
                        <div className="p-3">
                          <p className="text-xs font-medium truncate mb-1 group-hover:text-gold transition-colors">
                            {item.name}
                          </p>
                          <p className="text-xs text-gold font-medium">
                            {formatPrice(item.price)}
                          </p>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              id="settings"
            >
              <h2
                className="text-lg font-semibold mb-4"
                style={{ fontFamily: "var(--font-heading), serif" }}
              >
                Account Settings
              </h2>
              <div className="p-6 bg-card border border-border rounded-[2px] space-y-5">
                <div>
                  <label className="text-xs text-muted uppercase tracking-[1px] block mb-2">
                    Display Name
                  </label>
                  <Input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    onFocus={() => {
                      if (!displayName) initSettings();
                    }}
                    placeholder="Your display name"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted uppercase tracking-[1px] block mb-2">
                    Email
                  </label>
                  <Input
                    value={profile.email}
                    readOnly
                    disabled
                    className="opacity-60 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted uppercase tracking-[1px] block mb-2">
                    Phone
                  </label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onFocus={() => {
                      if (!phone) initSettings();
                    }}
                    placeholder="+91 9876543210"
                  />
                </div>
                <Separator />
                <div className="flex items-center gap-3">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSaveSettings}
                  >
                    {settingsSaved ? "SAVED" : "SAVE CHANGES"}
                  </Button>
                  {settingsSaved && (
                    <span className="text-xs text-green-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Updated
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2
                className="text-lg font-semibold mb-4"
                style={{ fontFamily: "var(--font-heading), serif" }}
              >
                Saved Addresses
              </h2>

              {profile.addresses.length === 0 ? (
                <div className="p-6 bg-card border border-border rounded-[2px] text-center">
                  <MapPin className="w-8 h-8 text-muted mx-auto mb-3" />
                  <p className="text-sm text-muted mb-3">
                    No saved addresses.
                  </p>
                  <Link href="/account/addresses">
                    <Button variant="secondary" size="sm">
                      ADD ADDRESS
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {profile.addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="p-4 bg-card border border-border rounded-[2px]"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-sm font-medium">{addr.label}</p>
                        <div className="flex gap-1">
                          {addr.isDefaultShipping && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-[2px] bg-blue-500/10 text-blue-400 uppercase tracking-wide">
                              Ship
                            </span>
                          )}
                          {addr.isDefaultBilling && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-[2px] bg-green-500/10 text-green-400 uppercase tracking-wide">
                              Bill
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-muted leading-relaxed">
                        {addr.firstName} {addr.lastName}
                        <br />
                        {addr.line1}
                        {addr.line2 && <>, {addr.line2}</>}
                        <br />
                        {addr.city}, {addr.state} {addr.zip}
                      </p>
                      <div className="flex gap-3 mt-3">
                        <Link
                          href="/account/addresses"
                          className="text-xs text-muted hover:text-gold transition-colors flex items-center gap-1"
                        >
                          <Pencil className="w-3 h-3" /> Edit
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h2
                className="text-lg font-semibold mb-4"
                style={{ fontFamily: "var(--font-heading), serif" }}
              >
                Quick Actions
              </h2>
              <div className="space-y-2">
                {[
                  {
                    href: "#settings",
                    label: "Edit Profile",
                    icon: Settings,
                  },
                  {
                    href: "/account/addresses",
                    label: "Manage Addresses",
                    icon: MapPin,
                  },
                  {
                    href: "/orders",
                    label: "View All Orders",
                    icon: Package,
                  },
                  {
                    href: "/wishlist",
                    label: "View Wishlist",
                    icon: Heart,
                  },
                ].map((action, i) => (
                  <motion.div
                    key={action.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 + i * 0.05 }}
                  >
                    <Link
                      href={action.href}
                      className="flex items-center gap-3 p-4 bg-card border border-border rounded-[2px] hover:border-gold/30 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded bg-surface flex items-center justify-center">
                        <action.icon className="w-4 h-4 text-muted group-hover:text-gold transition-colors" />
                      </div>
                      <span className="text-sm font-medium flex-1">
                        {action.label}
                      </span>
                      <ChevronRight className="w-4 h-4 text-muted group-hover:text-gold transition-colors" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.65 }}
            >
              <div className="p-5 bg-card border border-border rounded-[2px]">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {profile.displayName || "New User"}
                    </p>
                    <p className="text-xs text-muted">{profile.email}</p>
                  </div>
                </div>
                <Separator className="my-3" />
                <div className="space-y-1.5">
                  <p className="text-[11px] text-muted">
                    Member since{" "}
                    {new Date(profile.createdAt).toLocaleDateString("en-IN", {
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  {profile.phone && (
                    <p className="text-[11px] text-muted">
                      Phone: {profile.phone}
                    </p>
                  )}
                  <p className="text-[11px] text-muted">
                    {profile.addresses.length} saved address
                    {profile.addresses.length !== 1 ? "es" : ""}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
