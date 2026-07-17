"use client";

import { use } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Package, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useOrderStore } from "@/store/orders";
import { formatPrice } from "@/lib/utils";
import { ORDER_STATUS_COLORS, ORDER_STATUS_FLOW } from "@/lib/types";

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { orders } = useOrderStore();
  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <section className="pt-32 lg:pt-40 pb-24 lg:pb-32 px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto text-center py-24">
          <Package className="w-12 h-12 text-muted mx-auto mb-4" />
          <h1 className="text-3xl font-semibold mb-4" style={{ fontFamily: "var(--font-heading), serif" }}>
            Order Not Found
          </h1>
          <p className="text-sm text-muted mb-8">This order doesn&apos;t exist or you don&apos;t have access.</p>
          <Link href="/orders"><Button variant="primary">VIEW ALL ORDERS</Button></Link>
        </div>
      </section>
    );
  }

  const nextStatuses = ORDER_STATUS_FLOW[order.status] ?? [];

  return (
    <section className="pt-32 lg:pt-40 pb-24 lg:pb-32 px-6 lg:px-12">
      <div className="max-w-[1400px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <Link href="/orders" className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to orders
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-semibold" style={{ fontFamily: "var(--font-heading), serif" }}>
                {order.orderNumber}
              </h1>
              <p className="text-sm text-muted mt-2">
                Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
            <span className={`text-sm px-3 py-1.5 rounded-full font-medium ${ORDER_STATUS_COLORS[order.status]}`}>
              {order.status}
            </span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 bg-card border border-border rounded-[2px]">
              <h2 className="text-lg font-medium mb-4">Items</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.productId} className="flex gap-4">
                    <div className="w-16 h-16 bg-surface rounded-[2px] overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.productName}</p>
                      <p className="text-xs text-muted">SKU: {item.sku}</p>
                      <p className="text-xs text-muted">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-medium">{formatPrice(item.lineTotal)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-card border border-border rounded-[2px]">
              <h2 className="text-lg font-medium mb-4">Timeline</h2>
              <div className="space-y-4">
                {[...order.timeline].reverse().map((entry, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${i === 0 ? "bg-gold" : "bg-border"}`} />
                      {i < order.timeline.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
                    </div>
                    <div className="pb-4">
                      <p className="text-sm font-medium">{entry.action}</p>
                      <p className="text-xs text-muted">
                        {new Date(entry.timestamp).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </p>
                      <p className="text-xs text-muted">by {entry.actor}</p>
                      {entry.note && <p className="text-xs text-muted mt-1">{entry.note}</p>}
                    </div>
                  </div>
                ))}
              </div>
              {nextStatuses.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs text-muted mb-2">Next possible: {nextStatuses.join(", ")}</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 bg-card border border-border rounded-[2px]">
              <h2 className="text-lg font-medium mb-4">Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-muted">Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-muted">Shipping</span><span>{order.shipping === 0 ? "Free" : formatPrice(order.shipping)}</span></div>
                {order.discount > 0 && <div className="flex justify-between"><span className="text-muted">Discount</span><span className="text-green-500">-{formatPrice(order.discount)}</span></div>}
                {order.tax > 0 && <div className="flex justify-between"><span className="text-muted">Tax</span><span>{formatPrice(order.tax)}</span></div>}
                <Separator className="my-3" />
                <div className="flex justify-between font-medium"><span>Total</span><span className="text-lg">{formatPrice(order.total)}</span></div>
              </div>
            </div>

            <div className="p-6 bg-card border border-border rounded-[2px]">
              <h2 className="text-lg font-medium mb-4">Shipping</h2>
              <div className="text-sm text-muted space-y-1">
                <p className="font-medium text-foreground">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                <p>{order.shippingAddress.line1}</p>
                {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>

            <div className="p-6 bg-card border border-border rounded-[2px]">
              <h2 className="text-lg font-medium mb-4">Payment</h2>
              <div className="text-sm text-muted space-y-1">
                <p>Method: <span className="text-foreground capitalize">{order.paymentMethod}</span></p>
                {order.paymentId && <p>ID: <span className="text-foreground font-mono text-xs">{order.paymentId}</span></p>}
                <p>Provider: <span className="text-foreground">{order.shippingProvider}</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
