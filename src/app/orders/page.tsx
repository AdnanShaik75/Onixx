"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Package, ChevronRight } from "lucide-react";
import { BackButton } from "@/components/shared/back-button";
import { useOrderStore } from "@/store/orders";
import { useCustomerStore } from "@/store/customer";
import { formatPrice } from "@/lib/utils";
import { ORDER_STATUS_COLORS } from "@/lib/types";

export default function OrdersPage() {
  const { orders } = useOrderStore();
  const { profile } = useCustomerStore();

  const userOrders = profile
    ? orders.filter((o) => o.userId === profile.uid || o.shippingAddress?.email === profile.email)
    : [];

  return (
    <section className="pt-32 lg:pt-40 pb-24 lg:pb-32 px-6 lg:px-12">
      <div className="max-w-[1400px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <BackButton />
          <h1 className="text-4xl md:text-5xl font-semibold" style={{ fontFamily: "var(--font-heading), serif" }}>
            My Orders
          </h1>
        </motion.div>

        {!profile ? (
          <div className="max-w-2xl text-center py-24">
            <Package className="w-12 h-12 text-muted mx-auto mb-4" />
            <p className="text-sm text-muted mb-4">Sign in to view your orders.</p>
            <Link href="/admin/login" className="text-sm text-gold hover:underline">Sign in</Link>
          </div>
        ) : userOrders.length === 0 ? (
          <div className="max-w-2xl text-center py-24">
            <Package className="w-12 h-12 text-muted mx-auto mb-4" />
            <p className="text-sm text-muted mb-4">No orders yet.</p>
            <Link href="/watches" className="text-sm text-gold hover:underline">Browse watches</Link>
          </div>
        ) : (
          <div className="max-w-3xl space-y-4">
            {userOrders
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((order, i) => (
                <motion.div key={order.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Link
                    href={`/orders/${order.id}`}
                    className="block p-5 bg-card border border-border rounded-[2px] hover:border-gold/30 transition-colors group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm font-medium">{order.orderNumber}</p>
                        <p className="text-xs text-muted">
                          {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${ORDER_STATUS_COLORS[order.status]}`}>
                          {order.status}
                        </span>
                        <ChevronRight className="w-4 h-4 text-muted group-hover:text-gold transition-colors" />
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {order.items.slice(0, 3).map((item) => (
                        <div key={item.productId} className="w-12 h-12 bg-surface rounded-[2px] overflow-hidden flex-shrink-0">
                          <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <span className="text-xs text-muted">+{order.items.length - 3} more</span>
                      )}
                      <div className="flex-1" />
                      <span className="text-sm font-medium">{formatPrice(order.total)}</span>
                    </div>
                  </Link>
                </motion.div>
              ))}
          </div>
        )}
      </div>
    </section>
  );
}
