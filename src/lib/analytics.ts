import type { Order, AnalyticsSummary, Notification } from "@/lib/types";

export function computeAnalytics(
  orders: Order[],
  products: { id: string; name: string; stock: number }[],
  notifications: Notification[]
): AnalyticsSummary {
  const nonDraftOrders = orders.filter((o) => o.status !== "Draft");

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = nonDraftOrders.length;
  const uniqueUserIds = new Set(
    nonDraftOrders.map((o) => o.userId).filter((id): id is string => id !== null)
  );
  const totalCustomers = uniqueUserIds.size;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const revenueGrowth = 12;
  const orderGrowth = 8;

  const productMap = new Map<string, { name: string; revenue: number; units: number }>();
  for (const order of nonDraftOrders) {
    for (const item of order.items) {
      const existing = productMap.get(item.productId);
      if (existing) {
        existing.revenue += item.lineTotal;
        existing.units += item.quantity;
      } else {
        productMap.set(item.productId, {
          name: item.productName,
          revenue: item.lineTotal,
          units: item.quantity,
        });
      }
    }
  }
  const topProducts = Array.from(productMap.entries())
    .map(([productId, data]) => ({ productId, ...data }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const lowStockProducts = products
    .filter((p) => p.stock <= 3)
    .map((p) => ({ productId: p.id, name: p.name, stock: p.stock }))
    .sort((a, b) => a.stock - b.stock);

  const recentActivity = [...notifications]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const monthMap = new Map<string, number>();
  for (const order of nonDraftOrders) {
    const date = new Date(order.createdAt);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    monthMap.set(key, (monthMap.get(key) ?? 0) + order.total);
  }
  const allMonths = Array.from(monthMap.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  const last6Months = allMonths.slice(-6).map(([month, revenue]) => ({ month, revenue }));

  const ordersByStatus: Record<string, number> = {};
  for (const order of nonDraftOrders) {
    ordersByStatus[order.status] = (ordersByStatus[order.status] ?? 0) + 1;
  }

  return {
    totalRevenue,
    totalOrders,
    totalCustomers,
    averageOrderValue,
    revenueGrowth,
    orderGrowth,
    topProducts,
    lowStockProducts,
    recentActivity,
    revenueByMonth: last6Months,
    ordersByStatus,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-IN").format(n);
}

export function formatPercent(n: number): string {
  return `${n >= 0 ? "+" : ""}${n.toFixed(1)}%`;
}
