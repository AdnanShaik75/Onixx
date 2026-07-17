"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { DollarSign, ShoppingBag, Users, TrendingUp, AlertTriangle, Package, BarChart3 } from "lucide-react";
import { useOrderStore } from "@/store/orders";
import { useProductStore } from "@/store/products";
import { useNotificationStore } from "@/store/notifications";
import { computeAnalytics, formatCurrency, formatNumber, formatPercent } from "@/lib/analytics";

import { BackButton } from "@/components/shared/back-button";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const STATUS_BAR_COLORS: Record<string, string> = {
  Draft: "bg-gray-500",
  "Pending Payment": "bg-yellow-500",
  Confirmed: "bg-blue-500",
  Packed: "bg-indigo-500",
  Shipped: "bg-cyan-500",
  Delivered: "bg-green-500",
  Cancelled: "bg-red-500",
  Returned: "bg-orange-400",
  Refunded: "bg-purple-500",
};

export default function AnalyticsPage() {
  const { orders } = useOrderStore();
  const { products } = useProductStore();
  const { notifications } = useNotificationStore();

  const analytics = useMemo(
    () =>
      computeAnalytics(
        orders,
        products.map((p) => ({ id: p.id, name: p.name, stock: p.stock })),
        notifications
      ),
    [orders, products, notifications]
  );

  const maxRevenue = useMemo(
    () => Math.max(...analytics.revenueByMonth.map((m) => m.revenue), 1),
    [analytics.revenueByMonth]
  );

  const maxOrderCount = useMemo(
    () => Math.max(...Object.values(analytics.ordersByStatus), 1),
    [analytics.ordersByStatus]
  );

  const summaryCards = [
    {
      label: "Total Revenue",
      value: formatCurrency(analytics.totalRevenue),
      growth: analytics.revenueGrowth,
      icon: DollarSign,
    },
    {
      label: "Total Orders",
      value: formatNumber(analytics.totalOrders),
      growth: analytics.orderGrowth,
      icon: ShoppingBag,
    },
    {
      label: "Total Customers",
      value: formatNumber(analytics.totalCustomers),
      growth: null,
      icon: Users,
    },
    {
      label: "Avg Order Value",
      value: formatCurrency(analytics.averageOrderValue),
      growth: null,
      icon: TrendingUp,
    },
  ];

  const formatMonth = (month: string) => {
    const [year, m] = month.split("-");
    const date = new Date(Number(year), Number(m) - 1);
    return date.toLocaleString("en-IN", { month: "short" });
  };

  const lowStockSeverity = (stock: number) => {
    if (stock === 0) return { color: "text-red-500", bg: "bg-red-500/10", label: "Out of Stock" };
    if (stock === 1) return { color: "text-red-400", bg: "bg-red-500/10", label: "Critical" };
    return { color: "text-yellow-500", bg: "bg-yellow-500/10", label: "Low" };
  };

  return (
    <div className="min-h-screen bg-background p-4 lg:p-8">
      <BackButton />

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1
            className="text-2xl lg:text-3xl font-semibold"
            style={{ fontFamily: "var(--font-heading), serif" }}
          >
            Analytics
          </h1>
          <p className="text-sm text-muted mt-1">Store performance overview</p>
        </div>
        <Link href="/admin">
          <Button variant="secondary" className="text-xs">
            <BarChart3 className="w-3 h-3 mr-1" />
            Admin Dashboard
          </Button>
        </Link>
      </div>

      <div className="space-y-6 lg:space-y-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {summaryCards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-4 lg:p-6 bg-card border border-border rounded-[2px] hover:border-gold/20 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <card.icon className="w-4 h-4 lg:w-5 lg:h-5 text-gold" />
                {card.growth !== null && (
                  <span className="text-[10px] lg:text-xs text-green-500 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> {formatPercent(card.growth)}
                  </span>
                )}
              </div>
              <p className="text-lg lg:text-2xl font-semibold mb-1">{card.value}</p>
              <p className="text-[10px] lg:text-xs text-muted uppercase tracking-wide">{card.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue by Month */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-4 lg:p-6 bg-card border border-border rounded-[2px]"
          >
            <h3
              className="text-sm font-semibold mb-6"
              style={{ fontFamily: "var(--font-heading), serif" }}
            >
              Revenue by Month
            </h3>
            {analytics.revenueByMonth.length === 0 ? (
              <p className="text-sm text-muted text-center py-8">No revenue data</p>
            ) : (
              <div className="flex items-end gap-2 h-48">
                {analytics.revenueByMonth.map((m, i) => (
                  <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[9px] text-muted whitespace-nowrap">
                      {formatCurrency(m.revenue)}
                    </span>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(m.revenue / maxRevenue) * 100}%` }}
                      transition={{ delay: 0.5 + i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      className="w-full bg-gold rounded-t-[2px] hover:bg-gold-hover transition-colors cursor-pointer"
                      title={`${formatMonth(m.month)}: ${formatCurrency(m.revenue)}`}
                    />
                    <span className="text-[10px] text-muted">{formatMonth(m.month)}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Orders by Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-4 lg:p-6 bg-card border border-border rounded-[2px]"
          >
            <h3
              className="text-sm font-semibold mb-6"
              style={{ fontFamily: "var(--font-heading), serif" }}
            >
              Orders by Status
            </h3>
            {Object.keys(analytics.ordersByStatus).length === 0 ? (
              <p className="text-sm text-muted text-center py-8">No order data</p>
            ) : (
              <div className="space-y-4">
                {Object.entries(analytics.ordersByStatus)
                  .sort((a, b) => b[1] - a[1])
                  .map(([status, count]) => (
                    <div key={status}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-muted">{status}</span>
                        <span className="text-xs text-foreground font-medium">{count}</span>
                      </div>
                      <div className="h-2 bg-background rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(count / maxOrderCount) * 100}%` }}
                          transition={{ delay: 0.6, duration: 0.8 }}
                          className={`h-full rounded-full ${STATUS_BAR_COLORS[status] ?? "bg-gold"}`}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Products */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="p-4 lg:p-6 bg-card border border-border rounded-[2px]"
          >
            <h3
              className="text-sm font-semibold mb-4"
              style={{ fontFamily: "var(--font-heading), serif" }}
            >
              Top Products by Revenue
            </h3>
            {analytics.topProducts.length === 0 ? (
              <p className="text-sm text-muted text-center py-8">No product data</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left pb-2 text-[10px] tracking-[1px] uppercase text-muted font-medium">
                        Product
                      </th>
                      <th className="text-right pb-2 text-[10px] tracking-[1px] uppercase text-muted font-medium">
                        Units
                      </th>
                      <th className="text-right pb-2 text-[10px] tracking-[1px] uppercase text-muted font-medium">
                        Revenue
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.topProducts.map((p, i) => (
                      <tr key={p.productId} className="border-b border-border/50 last:border-0">
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-gold font-mono w-4">{i + 1}.</span>
                            <span className="text-sm font-medium truncate">{p.name}</span>
                          </div>
                        </td>
                        <td className="py-3 text-right text-sm text-muted">{p.units}</td>
                        <td className="py-3 text-right text-sm text-gold font-medium">
                          {formatCurrency(p.revenue)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>

          {/* Low Stock Alerts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="p-4 lg:p-6 bg-card border border-border rounded-[2px]"
          >
            <h3
              className="text-sm font-semibold mb-4 flex items-center gap-2"
              style={{ fontFamily: "var(--font-heading), serif" }}
            >
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
              Low Stock Alerts
            </h3>
            {analytics.lowStockProducts.length === 0 ? (
              <p className="text-sm text-muted text-center py-8">All products well stocked</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left pb-2 text-[10px] tracking-[1px] uppercase text-muted font-medium">
                        Product
                      </th>
                      <th className="text-right pb-2 text-[10px] tracking-[1px] uppercase text-muted font-medium">
                        Stock
                      </th>
                      <th className="text-right pb-2 text-[10px] tracking-[1px] uppercase text-muted font-medium">
                        Severity
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.lowStockProducts.map((p) => {
                      const severity = lowStockSeverity(p.stock);
                      return (
                        <tr key={p.productId} className="border-b border-border/50 last:border-0">
                          <td className="py-3">
                            <span className="text-sm font-medium truncate block">{p.name}</span>
                          </td>
                          <td className="py-3 text-right text-sm font-medium">{p.stock}</td>
                          <td className="py-3 text-right">
                            <span
                              className={`text-[10px] px-2 py-1 rounded-[2px] font-medium ${severity.color} ${severity.bg}`}
                            >
                              {severity.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="p-4 lg:p-6 bg-card border border-border rounded-[2px]"
        >
          <h3
            className="text-sm font-semibold mb-4"
            style={{ fontFamily: "var(--font-heading), serif" }}
          >
            Recent Activity
          </h3>
          {analytics.recentActivity.length === 0 ? (
            <p className="text-sm text-muted text-center py-4">No recent activity</p>
          ) : (
            <div className="space-y-3">
              {analytics.recentActivity.map((n) => {
                const priorityColor =
                  n.priority === "high"
                    ? "text-red-500"
                    : n.priority === "medium"
                    ? "text-yellow-500"
                    : "text-muted";
                return (
                  <div
                    key={n.id}
                    className="flex items-start gap-3 p-3 bg-background rounded-[2px] hover:bg-section/50 transition-colors"
                  >
                    <Package className={`w-4 h-4 mt-0.5 flex-shrink-0 ${priorityColor}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{n.title}</p>
                      <p className="text-xs text-muted truncate">{n.message}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-[2px] ${priorityColor}`}>
                        {n.priority}
                      </span>
                      <p className="text-[10px] text-muted mt-1">
                        {new Date(n.createdAt).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
