"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  Home,
  TrendingUp,
  DollarSign,
  Eye,
  ChevronRight,
  Plus,
  Pencil,
  Trash2,
  RotateCcw,
  Search,
  Menu,
  X,
  Lock,
  AlertTriangle,
  AlertCircle,
  PackageX,
  Boxes,
  Bell,
  Download,
  RefreshCw,
  Truck,
  CheckCircle2,
  BarChart3,
  Zap,
  Shield,
  Globe,
  Upload,
  ImageIcon,
} from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useProductStore } from "@/store/products";
import { useOrderStore, type OrderStatus } from "@/store/orders";
import { useActivityStore } from "@/store/activity";
import { useSiteConfig, DEFAULT_HERO_IMAGE } from "@/store/site-config";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductForm } from "@/components/admin/product-form";
import type { Product } from "@/lib/data";

const ADMIN_PASSWORD = "Onixx@2005";
const LOW_STOCK_THRESHOLD = 5;

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
  { icon: Package, label: "Products", id: "products" },
  { icon: Boxes, label: "Inventory", id: "inventory" },
  { icon: ShoppingCart, label: "Orders", id: "orders" },
  { icon: Users, label: "Customers", id: "customers" },
  { icon: Settings, label: "Settings", id: "settings" },
];

function OrderStatusBadge({ status }: { status: string }) {
  return (
    <span className={`text-xs px-2 py-1 rounded-[2px] ${
      status === "Delivered" ? "bg-green-500/10 text-green-500"
      : status === "Shipped" ? "bg-blue-500/10 text-blue-500"
      : status === "Cancelled" ? "bg-red-500/10 text-red-500"
      : "bg-yellow-500/10 text-yellow-500"
    }`}>{status}</span>
  );
}

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, x: 50 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-6 right-6 z-[100] px-5 py-3 bg-foreground text-background text-sm font-medium rounded-[2px] shadow-lg flex items-center gap-2"
    >
      <CheckCircle2 className="w-4 h-4 text-green-400" />
      {message}
    </motion.div>
  );
}

function ActivityIcon({ type }: { type: string }) {
  switch (type) {
    case "order": return <ShoppingCart className="w-3.5 h-3.5 text-blue-500" />;
    case "stock": return <AlertTriangle className="w-3.5 h-3.5 text-yellow-500" />;
    case "product": return <Package className="w-3.5 h-3.5 text-green-500" />;
    default: return <RefreshCw className="w-3.5 h-3.5 text-muted" />;
  }
}

function timeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function CustomerAvatar({ name }: { name: string }) {
  const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2);
  return (
    <div className="w-9 h-9 rounded-full bg-gold/10 text-gold flex items-center justify-center text-xs font-semibold flex-shrink-0">
      {initials}
    </div>
  );
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const { items } = useCartStore();
  const { products, addProduct, updateProduct, deleteProduct, resetProducts } = useProductStore();
  const { orders, updateStatus, resetOrders } = useOrderStore();
  const { entries: activityEntries, addEntry } = useActivityStore();
  const { heroImage, heroImageType, setHeroImage, resetHeroImage } = useSiteConfig();
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("ALL");
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [customerSearch, setCustomerSearch] = useState("");
  const [customerSort, setCustomerSort] = useState<"spent" | "orders" | "name">("spent");
  const [stockFilter, setStockFilter] = useState<"all" | "in" | "low" | "out">("all");

  const showToast = useCallback((msg: string) => setToast(msg), []);

  const inventoryStats = useMemo(() => {
    const total = products.length;
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
    const inStock = products.filter((p) => p.stock > LOW_STOCK_THRESHOLD).length;
    const lowStock = products.filter((p) => p.stock > 0 && p.stock <= LOW_STOCK_THRESHOLD).length;
    const outOfStock = products.filter((p) => p.stock === 0).length;
    return { total, totalStock, inStock, lowStock, outOfStock };
  }, [products]);

  const lowStockProducts = useMemo(
    () => products.filter((p) => p.stock > 0 && p.stock <= LOW_STOCK_THRESHOLD),
    [products]
  );

  const outOfStockProducts = useMemo(
    () => products.filter((p) => p.stock === 0),
    [products]
  );

  const categoryBreakdown = useMemo(() => {
    const cats: Record<string, { count: number; revenue: number }> = {};
    products.forEach((p) => {
      if (!cats[p.category]) cats[p.category] = { count: 0, revenue: 0 };
      cats[p.category].count++;
      cats[p.category].revenue += p.price;
    });
    return Object.entries(cats).sort((a, b) => b[1].revenue - a[1].revenue);
  }, [products]);

  const monthlyRevenue = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
    const base = [3200000, 4100000, 3800000, 5200000, 4900000, 6100000];
    const current = orders.reduce((sum, o) => sum + o.amount, 0);
    return [...base, current].map((v, i) => ({ month: months[i], value: v }));
  }, [orders]);

  const maxMonthlyRevenue = useMemo(() => Math.max(...monthlyRevenue.map(m => m.value)), [monthlyRevenue]);

  const orderStats = useMemo(() => {
    const total = orders.length;
    const processing = orders.filter(o => o.status === "Processing").length;
    const shipped = orders.filter(o => o.status === "Shipped").length;
    const delivered = orders.filter(o => o.status === "Delivered").length;
    const cancelled = orders.filter(o => o.status === "Cancelled").length;
    const totalRevenue = orders.reduce((s, o) => s + o.amount, 0);
    return { total, processing, shipped, delivered, cancelled, totalRevenue };
  }, [orders]);

  const customers = useMemo(() => {
    const map: Record<string, { name: string; email: string; orders: number; totalSpent: number; lastOrder: string }> = {};
    orders.forEach((o) => {
      if (!map[o.customer]) {
        map[o.customer] = { name: o.customer, email: o.email, orders: 0, totalSpent: 0, lastOrder: o.date };
      }
      map[o.customer].orders++;
      map[o.customer].totalSpent += o.amount;
      if (o.date > map[o.customer].lastOrder) map[o.customer].lastOrder = o.date;
    });
    return Object.values(map);
  }, [orders]);

  const filteredCustomers = useMemo(() => {
    let list = [...customers];
    if (customerSearch) {
      const q = customerSearch.toLowerCase();
      list = list.filter(c => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q));
    }
    if (customerSort === "spent") list.sort((a, b) => b.totalSpent - a.totalSpent);
    else if (customerSort === "orders") list.sort((a, b) => b.orders - a.orders);
    else list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [customers, customerSearch, customerSort]);

  const filteredOrders = useMemo(() => {
    let list = [...orders];
    if (orderSearch) {
      const q = orderSearch.toLowerCase();
      list = list.filter(o => o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q) || o.product.toLowerCase().includes(q));
    }
    if (orderStatusFilter !== "ALL") {
      list = list.filter(o => o.status === orderStatusFilter);
    }
    return list;
  }, [orders, orderSearch, orderStatusFilter]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === "ALL" || p.category === filterCategory;
      let matchesStock = true;
      if (stockFilter === "in") matchesStock = p.stock > LOW_STOCK_THRESHOLD;
      else if (stockFilter === "low") matchesStock = p.stock > 0 && p.stock <= LOW_STOCK_THRESHOLD;
      else if (stockFilter === "out") matchesStock = p.stock === 0;
      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, searchQuery, filterCategory, stockFilter]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full border border-gold/30 flex items-center justify-center mx-auto mb-6">
              <Lock className="w-7 h-7 text-gold" />
            </div>
            <h1
              className="text-2xl font-semibold mb-2"
              style={{ fontFamily: "var(--font-heading), serif" }}
            >
              ONIXX Admin
            </h1>
            <p className="text-sm text-muted">Enter your password to access the dashboard</p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  setPasswordError(false);
                }}
                className={passwordError ? "border-red-500 focus:border-red-500" : ""}
              />
              {passwordError && (
                <p className="text-xs text-red-500 mt-1">Incorrect password. Please try again.</p>
              )}
            </div>
            <Button type="submit" variant="primary" className="w-full">
              ACCESS DASHBOARD
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-xs text-muted hover:text-gold transition-colors">
              Back to Store
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const totalRevenue = products.reduce((sum, p) => sum + p.price * p.stock, 0);

  const handleSave = (product: Product) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, product);
      addEntry({ action: "Product Updated", detail: `${product.name} was modified`, type: "product" });
      showToast(`${product.name} updated successfully`);
    } else {
      addProduct(product);
      addEntry({ action: "Product Added", detail: `${product.name} added to catalogue`, type: "product" });
      showToast(`${product.name} added to catalogue`);
    }
    setFormOpen(false);
    setEditingProduct(null);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormOpen(true);
  };

  const handleDelete = (id: string) => {
    const product = products.find(p => p.id === id);
    deleteProduct(id);
    setDeleteConfirm(null);
    addEntry({ action: "Product Deleted", detail: `${product?.name ?? id} removed from catalogue`, type: "product" });
    showToast(`${product?.name ?? "Product"} deleted`);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setFormOpen(true);
  };

  const handleNav = (id: string) => {
    setActiveTab(id);
    setSidebarOpen(false);
  };

  const handleStatusUpdate = (orderId: string, newStatus: OrderStatus) => {
    updateStatus(orderId, newStatus);
    const order = orders.find(o => o.id === orderId);
    addEntry({ action: `Order ${newStatus}`, detail: `${orderId} ${newStatus.toLowerCase()} for ${order?.customer}`, type: "order" });
    showToast(`${orderId} marked as ${newStatus}`);
  };

  const exportOrders = () => {
    const csv = ["Order ID,Customer,Product,Amount,Status,Date",
      ...filteredOrders.map(o => `${o.id},${o.customer},${o.product},${o.amount},${o.status},${o.date}`)
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "onixx-orders.csv"; a.click();
    URL.revokeObjectURL(url);
    showToast("Orders exported to CSV");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-section border-r border-border flex-col">
        <div className="h-[90px] px-6 border-b border-border flex items-center">
          <h1
            className="text-xl font-semibold tracking-[3px] text-foreground"
            style={{ fontFamily: "var(--font-heading), serif" }}
          >
            ONIXX <span className="text-gold text-xs tracking-wide">ADMIN</span>
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-[2px] text-sm transition-all duration-200 ${
                activeTab === item.id
                  ? "bg-gold/10 text-gold"
                  : "text-muted hover:text-foreground hover:bg-card"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
              {item.id === "inventory" && (inventoryStats.lowStock + inventoryStats.outOfStock) > 0 && (
                <span className="ml-auto text-[10px] px-1.5 py-0.5 bg-red-500/10 text-red-500 rounded-full">{inventoryStats.lowStock + inventoryStats.outOfStock}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-[2px] text-sm text-muted hover:text-gold transition-colors"
          >
            <Home className="w-4 h-4" />
            Back to Store
          </Link>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[55] lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-0 left-0 bottom-0 w-64 bg-section border-r border-border z-[56] flex flex-col lg:hidden"
            >
              <div className="h-16 px-6 border-b border-border flex items-center justify-between">
                <h1
                  className="text-lg font-semibold tracking-[3px] text-foreground"
                  style={{ fontFamily: "var(--font-heading), serif" }}
                >
                  ONIXX <span className="text-gold text-xs tracking-wide">ADMIN</span>
                </h1>
                <button onClick={() => setSidebarOpen(false)} className="text-muted hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNav(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-[2px] text-sm transition-all duration-200 ${
                      activeTab === item.id
                        ? "bg-gold/10 text-gold"
                        : "text-muted hover:text-foreground hover:bg-card"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </button>
                ))}
              </nav>

              <div className="p-4 border-t border-border">
                <Link
                  href="/"
                  className="flex items-center gap-3 px-4 py-3 rounded-[2px] text-sm text-muted hover:text-gold transition-colors"
                >
                  <Home className="w-4 h-4" />
                  Back to Store
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto min-w-0">
        {/* Top Bar */}
        <div className="h-16 lg:h-[90px] border-b border-border px-4 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-muted hover:text-foreground transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2
              className="text-lg font-semibold capitalize"
              style={{ fontFamily: "var(--font-heading), serif" }}
            >
              {activeTab}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            {activeTab === "orders" && (
              <Button variant="secondary" className="text-xs hidden sm:flex" onClick={exportOrders}>
                <Download className="w-3 h-3 mr-1" /> Export
              </Button>
            )}
            <button className="relative text-muted hover:text-foreground transition-colors">
              <Bell className="w-5 h-5" />
              {(lowStockProducts.length + outOfStockProducts.length) > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center">
                  {lowStockProducts.length + outOfStockProducts.length}
                </span>
              )}
            </button>
            <p className="text-xs text-muted hidden sm:block">
              {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
        </div>

        <div className="p-4 lg:p-8">
          {/* Dashboard */}
          {activeTab === "dashboard" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 lg:space-y-8"
            >
              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
                {[
                  { icon: DollarSign, label: "Revenue", value: formatPrice(totalRevenue), change: "+12.5%" },
                  { icon: ShoppingCart, label: "Orders", value: orderStats.total.toString(), change: "+8.2%" },
                  { icon: Package, label: "Products", value: products.length.toString(), change: `+${products.filter(p => p.isNewArrival).length}` },
                  { icon: Eye, label: "Customers", value: customers.length.toString(), change: "+15.3%" },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-4 lg:p-6 bg-card border border-border rounded-[2px] hover:border-gold/20 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3 lg:mb-4">
                      <stat.icon className="w-4 h-4 lg:w-5 lg:h-5 text-gold" />
                      <span className="text-[10px] lg:text-xs text-green-500 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> {stat.change}
                      </span>
                    </div>
                    <p className="text-lg lg:text-2xl font-semibold mb-1">{stat.value}</p>
                    <p className="text-[10px] lg:text-xs text-muted">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Revenue Chart + Category Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Chart */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="lg:col-span-2 p-4 lg:p-6 bg-card border border-border rounded-[2px]"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--font-heading), serif" }}>
                      Revenue Overview
                    </h3>
                    <span className="text-[10px] text-muted uppercase tracking-wide">Last 7 Months</span>
                  </div>
                  <div className="flex items-end gap-2 h-40">
                    {monthlyRevenue.map((m, i) => (
                      <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-[9px] text-muted">{formatPrice(m.value).replace("₹", "")}</span>
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${(m.value / maxMonthlyRevenue) * 100}%` }}
                          transition={{ delay: 0.5 + i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                          className={`w-full rounded-t-[2px] ${i === monthlyRevenue.length - 1 ? "bg-gold" : "bg-gold/20 hover:bg-gold/30"} transition-colors cursor-pointer`}
                          title={`${m.month}: ${formatPrice(m.value)}`}
                        />
                        <span className="text-[10px] text-muted">{m.month}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Category Breakdown */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="p-4 lg:p-6 bg-card border border-border rounded-[2px]"
                >
                  <h3 className="text-sm font-semibold mb-4" style={{ fontFamily: "var(--font-heading), serif" }}>
                    Categories
                  </h3>
                  <div className="space-y-4">
                    {categoryBreakdown.map(([cat, data]) => {
                      const maxCount = Math.max(...categoryBreakdown.map(([, d]) => d.count));
                      return (
                        <div key={cat}>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs text-muted uppercase tracking-wide">{cat}</span>
                            <span className="text-xs text-foreground font-medium">{data.count}</span>
                          </div>
                          <div className="h-1.5 bg-background rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(data.count / maxCount) * 100}%` }}
                              transition={{ delay: 0.6, duration: 0.8 }}
                              className="h-full bg-gold/60 rounded-full"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              </div>

              {/* Quick Actions + Activity Feed */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="p-4 lg:p-6 bg-card border border-border rounded-[2px]"
                >
                  <h3 className="text-sm font-semibold mb-4" style={{ fontFamily: "var(--font-heading), serif" }}>
                    Quick Actions
                  </h3>
                  <div className="space-y-2">
                    <button onClick={handleAdd} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[2px] text-sm text-muted hover:text-gold hover:bg-gold/5 transition-all">
                      <Plus className="w-4 h-4" /> Add New Product
                    </button>
                    <button onClick={() => handleNav("orders")} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[2px] text-sm text-muted hover:text-gold hover:bg-gold/5 transition-all">
                      <ShoppingCart className="w-4 h-4" /> View Orders
                    </button>
                    <button onClick={() => handleNav("inventory")} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[2px] text-sm text-muted hover:text-gold hover:bg-gold/5 transition-all">
                      <Boxes className="w-4 h-4" /> Check Inventory
                    </button>
                    <button onClick={exportOrders} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[2px] text-sm text-muted hover:text-gold hover:bg-gold/5 transition-all">
                      <Download className="w-4 h-4" /> Export Orders
                    </button>
                    <button onClick={() => handleNav("settings")} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[2px] text-sm text-muted hover:text-gold hover:bg-gold/5 transition-all">
                      <Settings className="w-4 h-4" /> Store Settings
                    </button>
                  </div>
                </motion.div>

                {/* Activity Feed */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="lg:col-span-2 p-4 lg:p-6 bg-card border border-border rounded-[2px]"
                >
                  <h3 className="text-sm font-semibold mb-4" style={{ fontFamily: "var(--font-heading), serif" }}>
                    Recent Activity
                  </h3>
                  <div className="space-y-3">
                    {activityEntries.slice(0, 7).map((entry) => (
                      <div key={entry.id} className="flex items-start gap-3 group">
                        <div className="mt-0.5 p-1.5 bg-background rounded-full border border-border">
                          <ActivityIcon type={entry.type} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{entry.action}</p>
                          <p className="text-xs text-muted truncate">{entry.detail}</p>
                        </div>
                        <span className="text-[10px] text-muted flex-shrink-0 mt-0.5">{timeAgo(entry.timestamp)}</span>
                      </div>
                    ))}
                    {activityEntries.length === 0 && (
                      <p className="text-xs text-muted text-center py-4">No recent activity</p>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Low Stock & Out of Stock Alerts */}
              {(lowStockProducts.length > 0 || outOfStockProducts.length > 0) && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {outOfStockProducts.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-red-500/5 border border-red-500/20 rounded-[2px]"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <PackageX className="w-4 h-4 text-red-500" />
                        <h4 className="text-sm font-medium text-red-500">Out of Stock ({outOfStockProducts.length})</h4>
                      </div>
                      <div className="space-y-2">
                        {outOfStockProducts.map((p) => (
                          <div key={p.id} className="flex items-center justify-between text-xs">
                            <span className="text-muted">{p.name}</span>
                            <Button variant="secondary" className="h-6 text-[10px] px-2" onClick={() => { setEditingProduct(p); setFormOpen(true); }}>
                              Restock
                            </Button>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {lowStockProducts.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-[2px]"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <AlertCircle className="w-4 h-4 text-yellow-500" />
                        <h4 className="text-sm font-medium text-yellow-500">Low Stock Alert ({lowStockProducts.length})</h4>
                      </div>
                      <div className="space-y-2">
                        {lowStockProducts.map((p) => (
                          <div key={p.id} className="flex items-center justify-between text-xs">
                            <span className="text-muted">{p.name}</span>
                            <span className="text-yellow-500 font-medium">{p.stock} left</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {/* Recent Orders */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base lg:text-lg font-semibold" style={{ fontFamily: "var(--font-heading), serif" }}>
                    Recent Orders
                  </h3>
                  <button onClick={() => handleNav("orders")} className="text-xs text-gold hover:text-gold-hover flex items-center gap-1">
                    View All <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="hidden md:block bg-card border border-border rounded-[2px] overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left px-6 py-3 text-xs tracking-[1px] uppercase text-muted font-medium">Order ID</th>
                        <th className="text-left px-6 py-3 text-xs tracking-[1px] uppercase text-muted font-medium">Customer</th>
                        <th className="text-left px-6 py-3 text-xs tracking-[1px] uppercase text-muted font-medium">Product</th>
                        <th className="text-left px-6 py-3 text-xs tracking-[1px] uppercase text-muted font-medium">Amount</th>
                        <th className="text-left px-6 py-3 text-xs tracking-[1px] uppercase text-muted font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map((order) => (
                        <tr key={order.id} className="border-b border-border/50 last:border-0 hover:bg-section/50 transition-colors">
                          <td className="px-6 py-4 text-sm text-gold font-mono">{order.id}</td>
                          <td className="px-6 py-4 text-sm">{order.customer}</td>
                          <td className="px-6 py-4 text-sm text-muted">{order.product}</td>
                          <td className="px-6 py-4 text-sm">{formatPrice(order.amount)}</td>
                          <td className="px-6 py-4"><OrderStatusBadge status={order.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="md:hidden space-y-3">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="p-4 bg-card border border-border rounded-[2px]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gold font-mono">{order.id}</span>
                        <OrderStatusBadge status={order.status} />
                      </div>
                      <p className="text-sm font-medium mb-1">{order.customer}</p>
                      <p className="text-xs text-muted mb-2">{order.product}</p>
                      <p className="text-sm font-medium">{formatPrice(order.amount)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Products */}
              <div>
                <h3 className="text-base lg:text-lg font-semibold mb-4" style={{ fontFamily: "var(--font-heading), serif" }}>
                  Top Products by Stock Value
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
                  {[...products].sort((a, b) => (b.price * b.stock) - (a.price * a.stock)).slice(0, 6).map((product) => (
                    <div key={product.id} className="p-3 lg:p-4 bg-card border border-border rounded-[2px] flex items-center gap-3 lg:gap-4 hover:border-gold/20 transition-colors">
                      <div className="w-10 h-10 lg:w-12 lg:h-12 bg-background rounded-[2px] overflow-hidden border border-border flex-shrink-0 relative">
                        <Image src={product.image} alt={product.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{product.name}</p>
                        <p className="text-xs text-gold">{formatPrice(product.price)}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs text-muted">Stock</p>
                        <p className={`text-sm font-medium ${product.stock === 0 ? "text-red-500" : product.stock <= LOW_STOCK_THRESHOLD ? "text-yellow-500" : "text-green-500"}`}>
                          {product.stock}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Products - Full Catalogue Management */}
          {activeTab === "products" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 lg:space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 h-10 bg-transparent border border-border rounded-[2px] text-sm focus:outline-none focus:border-gold/50"
                    />
                  </div>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="h-10 px-3 bg-transparent border border-border rounded-[2px] text-xs tracking-wide uppercase text-muted focus:outline-none focus:border-gold/50"
                  >
                    <option value="ALL">All</option>
                    <option value="AUTOMATIC">Automatic</option>
                    <option value="QUARTZ">Quartz</option>
                    <option value="DIVER">Diver</option>
                    <option value="MANUAL WIND">Manual Wind</option>
                  </select>
                  <select
                    value={stockFilter}
                    onChange={(e) => setStockFilter(e.target.value as typeof stockFilter)}
                    className="h-10 px-3 bg-transparent border border-border rounded-[2px] text-xs tracking-wide text-muted focus:outline-none focus:border-gold/50"
                  >
                    <option value="all">All Stock</option>
                    <option value="in">In Stock</option>
                    <option value="low">Low Stock</option>
                    <option value="out">Out of Stock</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="secondary" onClick={resetProducts} className="text-xs">
                    <RotateCcw className="w-3 h-3 mr-1" /> Reset
                  </Button>
                  <Button variant="primary" onClick={handleAdd}>
                    <Plus className="w-4 h-4 mr-1" /> ADD
                  </Button>
                </div>
              </div>

              <p className="text-xs text-muted">{filteredProducts.length} products</p>

              <div className="hidden md:block bg-card border border-border rounded-[2px] overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left px-6 py-3 text-xs tracking-[1px] uppercase text-muted font-medium">Product</th>
                      <th className="text-left px-6 py-3 text-xs tracking-[1px] uppercase text-muted font-medium">Category</th>
                      <th className="text-left px-6 py-3 text-xs tracking-[1px] uppercase text-muted font-medium">Collection</th>
                      <th className="text-left px-6 py-3 text-xs tracking-[1px] uppercase text-muted font-medium">Price</th>
                      <th className="text-left px-6 py-3 text-xs tracking-[1px] uppercase text-muted font-medium">Stock</th>
                      <th className="text-left px-6 py-3 text-xs tracking-[1px] uppercase text-muted font-medium">Value</th>
                      <th className="text-left px-6 py-3 text-xs tracking-[1px] uppercase text-muted font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="border-b border-border/50 last:border-0 hover:bg-section/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-background rounded-[2px] overflow-hidden border border-border relative">
                              <Image src={product.image} alt={product.name} fill className="object-cover" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{product.name}</p>
                              {product.badge && <span className="text-[10px] text-gold">{product.badge}</span>}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs text-muted">{product.category}</td>
                        <td className="px-6 py-4 text-xs text-muted capitalize">{product.collection}</td>
                        <td className="px-6 py-4 text-sm">{formatPrice(product.price)}</td>
                        <td className="px-6 py-4">
                          <span className={`text-xs px-2 py-1 rounded-[2px] ${
                            product.stock === 0
                              ? "bg-red-500/10 text-red-500"
                              : product.stock <= LOW_STOCK_THRESHOLD
                              ? "bg-yellow-500/10 text-yellow-500"
                              : "bg-green-500/10 text-green-500"
                          }`}>
                            {product.stock === 0 ? "Out of Stock" : product.stock <= LOW_STOCK_THRESHOLD ? `Low: ${product.stock}` : product.stock}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted">{formatPrice(product.price * product.stock)}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button onClick={() => handleEdit(product)} className="p-1.5 text-muted hover:text-gold transition-colors" title="Edit">
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => setDeleteConfirm(product.id)} className="p-1.5 text-muted hover:text-red-500 transition-colors" title="Delete">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredProducts.length === 0 && (
                      <tr><td colSpan={7} className="px-6 py-12 text-center text-sm text-muted">No products found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="md:hidden space-y-3">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="p-4 bg-card border border-border rounded-[2px]">
                    <div className="flex items-start gap-3">
                      <div className="w-14 h-14 bg-background rounded-[2px] overflow-hidden border border-border flex-shrink-0 relative">
                        <Image src={product.image} alt={product.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-medium">{product.name}</p>
                            {product.badge && <span className="text-[10px] text-gold">{product.badge}</span>}
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button onClick={() => handleEdit(product)} className="p-1.5 text-muted hover:text-gold transition-colors">
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => setDeleteConfirm(product.id)} className="p-1.5 text-muted hover:text-red-500 transition-colors">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-[10px] text-muted uppercase">{product.category}</span>
                          <span className="text-[10px] text-muted capitalize">{product.collection}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-[2px] ml-auto ${
                            product.stock === 0
                              ? "bg-red-500/10 text-red-500"
                              : product.stock <= LOW_STOCK_THRESHOLD
                              ? "bg-yellow-500/10 text-yellow-500"
                              : "bg-green-500/10 text-green-500"
                          }`}>
                            {product.stock === 0 ? "Out of Stock" : `${product.stock} in stock`}
                          </span>
                        </div>
                        <p className="text-sm font-medium mt-1">{formatPrice(product.price)}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredProducts.length === 0 && (
                  <div className="py-12 text-center text-sm text-muted">No products found</div>
                )}
              </div>
            </motion.div>
          )}

          {/* Inventory */}
          {activeTab === "inventory" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                <div className="p-4 lg:p-6 bg-card border border-border rounded-[2px]">
                  <p className="text-[10px] lg:text-xs text-muted uppercase tracking-wide mb-2">Total Items</p>
                  <p className="text-2xl lg:text-3xl font-semibold">{inventoryStats.totalStock}</p>
                </div>
                <div className="p-4 lg:p-6 bg-card border border-green-500/20 rounded-[2px]">
                  <p className="text-[10px] lg:text-xs text-muted uppercase tracking-wide mb-2">In Stock</p>
                  <p className="text-2xl lg:text-3xl font-semibold text-green-500">{inventoryStats.inStock}</p>
                  <p className="text-[10px] text-muted mt-1">products</p>
                </div>
                <div className="p-4 lg:p-6 bg-card border border-yellow-500/20 rounded-[2px]">
                  <p className="text-[10px] lg:text-xs text-muted uppercase tracking-wide mb-2">Low Stock</p>
                  <p className="text-2xl lg:text-3xl font-semibold text-yellow-500">{inventoryStats.lowStock}</p>
                  <p className="text-[10px] text-muted mt-1">&le; {LOW_STOCK_THRESHOLD} units</p>
                </div>
                <div className="p-4 lg:p-6 bg-card border border-red-500/20 rounded-[2px]">
                  <p className="text-[10px] lg:text-xs text-muted uppercase tracking-wide mb-2">Out of Stock</p>
                  <p className="text-2xl lg:text-3xl font-semibold text-red-500">{inventoryStats.outOfStock}</p>
                  <p className="text-[10px] text-muted mt-1">products</p>
                </div>
              </div>

              {outOfStockProducts.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-red-500/5 border border-red-500/20 rounded-[2px] flex items-start gap-3">
                  <PackageX className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-500 mb-1">Out of Stock Alert</p>
                    <p className="text-xs text-muted">
                      {outOfStockProducts.length} {outOfStockProducts.length === 1 ? "product is" : "products are"} currently out of stock:{" "}
                      <span className="text-foreground">{outOfStockProducts.map((p) => p.name).join(", ")}</span>
                    </p>
                  </div>
                </motion.div>
              )}

              {lowStockProducts.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-[2px] flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-500 mb-1">Low Stock Warning</p>
                    <p className="text-xs text-muted">
                      {lowStockProducts.length} {lowStockProducts.length === 1 ? "product has" : "products have"} low stock:{" "}
                      {lowStockProducts.map((p) => (
                        <span key={p.id}>
                          <span className="text-foreground">{p.name}</span> ({p.stock} left)
                        </span>
                      )).reduce((prev, curr) => <>{prev}, {curr}</>, <></>)}
                    </p>
                  </div>
                </motion.div>
              )}

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base lg:text-lg font-semibold" style={{ fontFamily: "var(--font-heading), serif" }}>
                    All Products
                  </h3>
                </div>

                <div className="hidden md:block bg-card border border-border rounded-[2px] overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left px-6 py-3 text-xs tracking-[1px] uppercase text-muted font-medium">Product</th>
                        <th className="text-left px-6 py-3 text-xs tracking-[1px] uppercase text-muted font-medium">Category</th>
                        <th className="text-left px-6 py-3 text-xs tracking-[1px] uppercase text-muted font-medium">Price</th>
                        <th className="text-left px-6 py-3 text-xs tracking-[1px] uppercase text-muted font-medium">Stock</th>
                        <th className="text-left px-6 py-3 text-xs tracking-[1px] uppercase text-muted font-medium">Status</th>
                        <th className="text-left px-6 py-3 text-xs tracking-[1px] uppercase text-muted font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...products].sort((a, b) => a.stock - b.stock).map((product) => (
                        <tr key={product.id} className={`border-b border-border/50 last:border-0 hover:bg-section/50 transition-colors ${
                          product.stock === 0 ? "bg-red-500/5" : product.stock <= LOW_STOCK_THRESHOLD ? "bg-yellow-500/5" : ""
                        }`}>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-background rounded-[2px] overflow-hidden border border-border flex-shrink-0 relative">
                                <Image src={product.image} alt={product.name} fill className="object-cover" />
                              </div>
                              <p className="text-sm font-medium">{product.name}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-xs text-muted">{product.category}</td>
                          <td className="px-6 py-4 text-sm">{formatPrice(product.price)}</td>
                          <td className="px-6 py-4 text-sm font-medium">{product.stock}</td>
                          <td className="px-6 py-4">
                            <span className={`text-xs px-2 py-1 rounded-[2px] ${
                              product.stock === 0
                                ? "bg-red-500/10 text-red-500"
                                : product.stock <= LOW_STOCK_THRESHOLD
                                ? "bg-yellow-500/10 text-yellow-500"
                                : "bg-green-500/10 text-green-500"
                            }`}>
                              {product.stock === 0 ? "Out of Stock" : product.stock <= LOW_STOCK_THRESHOLD ? "Low Stock" : "In Stock"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <Button variant="secondary" className="h-7 text-[10px] px-2" onClick={() => { setEditingProduct(product); setFormOpen(true); }}>
                              <Pencil className="w-3 h-3 mr-1" /> Edit
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="md:hidden space-y-3">
                  {[...products].sort((a, b) => a.stock - b.stock).map((product) => (
                    <div key={product.id} className={`p-4 bg-card border rounded-[2px] ${
                      product.stock === 0 ? "border-red-500/20" : product.stock <= LOW_STOCK_THRESHOLD ? "border-yellow-500/20" : "border-border"
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-background rounded-[2px] overflow-hidden border border-border flex-shrink-0 relative">
                          <Image src={product.image} alt={product.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{product.name}</p>
                          <p className="text-xs text-muted">{product.category}</p>
                        </div>
                        <Button variant="secondary" className="h-7 text-[10px] px-2 flex-shrink-0" onClick={() => { setEditingProduct(product); setFormOpen(true); }}>
                          Edit
                        </Button>
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                        <span className="text-sm">{formatPrice(product.price)}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted">Stock: {product.stock}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-[2px] ${
                            product.stock === 0
                              ? "bg-red-500/10 text-red-500"
                              : product.stock <= LOW_STOCK_THRESHOLD
                              ? "bg-yellow-500/10 text-yellow-500"
                              : "bg-green-500/10 text-green-500"
                          }`}>
                            {product.stock === 0 ? "Out" : product.stock <= LOW_STOCK_THRESHOLD ? "Low" : "OK"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Orders - Interactive */}
          {activeTab === "orders" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {/* Order Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                {[
                  { label: "Total", value: orderStats.total, color: "text-foreground" },
                  { label: "Processing", value: orderStats.processing, color: "text-yellow-500" },
                  { label: "Shipped", value: orderStats.shipped, color: "text-blue-500" },
                  { label: "Delivered", value: orderStats.delivered, color: "text-green-500" },
                  { label: "Cancelled", value: orderStats.cancelled, color: "text-red-500" },
                ].map((stat) => (
                  <div key={stat.label} className="p-3 lg:p-4 bg-card border border-border rounded-[2px] text-center">
                    <p className={`text-xl lg:text-2xl font-semibold ${stat.color}`}>{stat.value}</p>
                    <p className="text-[10px] text-muted uppercase tracking-wide mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="relative flex-1 max-w-sm w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input
                    type="text"
                    placeholder="Search orders..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="w-full pl-10 pr-4 h-10 bg-transparent border border-border rounded-[2px] text-sm focus:outline-none focus:border-gold/50"
                  />
                </div>
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="h-10 px-3 bg-transparent border border-border rounded-[2px] text-xs tracking-wide text-muted focus:outline-none focus:border-gold/50"
                >
                  <option value="ALL">All Status</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                <span className="text-xs text-muted">{filteredOrders.length} orders</span>
              </div>

              {/* Orders Table */}
              <div className="hidden md:block bg-card border border-border rounded-[2px] overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left px-6 py-3 text-xs tracking-[1px] uppercase text-muted font-medium">Order ID</th>
                      <th className="text-left px-6 py-3 text-xs tracking-[1px] uppercase text-muted font-medium">Customer</th>
                      <th className="text-left px-6 py-3 text-xs tracking-[1px] uppercase text-muted font-medium">Product</th>
                      <th className="text-left px-6 py-3 text-xs tracking-[1px] uppercase text-muted font-medium">Amount</th>
                      <th className="text-left px-6 py-3 text-xs tracking-[1px] uppercase text-muted font-medium">Status</th>
                      <th className="text-left px-6 py-3 text-xs tracking-[1px] uppercase text-muted font-medium">Date</th>
                      <th className="text-left px-6 py-3 text-xs tracking-[1px] uppercase text-muted font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="border-b border-border/50 last:border-0 hover:bg-section/50 transition-colors">
                        <td className="px-6 py-4 text-sm text-gold font-mono cursor-pointer" onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}>
                          {order.id}
                        </td>
                        <td className="px-6 py-4 text-sm">{order.customer}</td>
                        <td className="px-6 py-4 text-sm text-muted">{order.product}</td>
                        <td className="px-6 py-4 text-sm">{formatPrice(order.amount)}</td>
                        <td className="px-6 py-4"><OrderStatusBadge status={order.status} /></td>
                        <td className="px-6 py-4 text-xs text-muted">{order.date}</td>
                        <td className="px-6 py-4">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusUpdate(order.id, e.target.value as OrderStatus)}
                            className="h-7 px-2 bg-transparent border border-border rounded-[2px] text-xs text-muted focus:outline-none focus:border-gold/50 cursor-pointer"
                          >
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                    {filteredOrders.length === 0 && (
                      <tr><td colSpan={7} className="px-6 py-12 text-center text-sm text-muted">No orders found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Order Cards */}
              <div className="md:hidden space-y-3">
                {filteredOrders.map((order) => (
                  <div key={order.id} className="p-4 bg-card border border-border rounded-[2px]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gold font-mono">{order.id}</span>
                      <OrderStatusBadge status={order.status} />
                    </div>
                    <p className="text-sm font-medium mb-1">{order.customer}</p>
                    <p className="text-xs text-muted mb-2">{order.product}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{formatPrice(order.amount)}</p>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order.id, e.target.value as OrderStatus)}
                        className="h-7 px-2 bg-transparent border border-border rounded-[2px] text-[10px] text-muted focus:outline-none focus:border-gold/50"
                      >
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Detail Modal */}
              <AnimatePresence>
                {selectedOrder && (() => {
                  const order = orders.find(o => o.id === selectedOrder);
                  if (!order) return null;
                  return (
                    <>
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[60]" onClick={() => setSelectedOrder(null)} />
                      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-md bg-card border border-border rounded-[2px] p-6 lg:p-8 z-[61]">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-lg font-semibold" style={{ fontFamily: "var(--font-heading), serif" }}>{order.id}</h3>
                          <button onClick={() => setSelectedOrder(null)} className="text-muted hover:text-foreground"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <CustomerAvatar name={order.customer} />
                            <div>
                              <p className="text-sm font-medium">{order.customer}</p>
                              <p className="text-xs text-muted">{order.email}</p>
                            </div>
                          </div>
                          <div className="p-3 bg-background rounded-[2px] space-y-2">
                            <div className="flex justify-between text-xs">
                              <span className="text-muted">Product</span>
                              <span className="text-foreground">{order.product}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-muted">Amount</span>
                              <span className="text-foreground">{formatPrice(order.amount)}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-muted">Status</span>
                              <OrderStatusBadge status={order.status} />
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-muted">Date</span>
                              <span className="text-foreground">{order.date}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-muted">Address</span>
                              <span className="text-foreground text-right">{order.address}</span>
                            </div>
                          </div>
                          <div>
                            <label className="text-xs text-muted mb-1 block">Update Status</label>
                            <select
                              value={order.status}
                              onChange={(e) => { handleStatusUpdate(order.id, e.target.value as OrderStatus); setSelectedOrder(null); }}
                              className="w-full h-9 px-3 bg-transparent border border-border rounded-[2px] text-sm focus:outline-none focus:border-gold/50"
                            >
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </div>
                        </div>
                      </motion.div>
                    </>
                  );
                })()}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Customers - Enhanced */}
          {activeTab === "customers" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {/* Customer Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-4 bg-card border border-border rounded-[2px]">
                  <p className="text-xs text-muted uppercase tracking-wide mb-1">Total Customers</p>
                  <p className="text-2xl font-semibold">{customers.length}</p>
                </div>
                <div className="p-4 bg-card border border-border rounded-[2px]">
                  <p className="text-xs text-muted uppercase tracking-wide mb-1">Avg. Order Value</p>
                  <p className="text-2xl font-semibold text-gold">{customers.length > 0 ? formatPrice(Math.round(orderStats.totalRevenue / customers.length)) : "₹0"}</p>
                </div>
                <div className="p-4 bg-card border border-border rounded-[2px]">
                  <p className="text-xs text-muted uppercase tracking-wide mb-1">Top Customer</p>
                  <p className="text-lg font-semibold truncate">{customers.length > 0 ? [...customers].sort((a, b) => b.totalSpent - a.totalSpent)[0].name : "N/A"}</p>
                </div>
                <div className="p-4 bg-card border border-border rounded-[2px]">
                  <p className="text-xs text-muted uppercase tracking-wide mb-1">Repeat Buyers</p>
                  <p className="text-2xl font-semibold">{customers.filter(c => c.orders > 1).length}</p>
                </div>
              </div>

              {/* Search & Sort */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="relative flex-1 max-w-sm w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input
                    type="text"
                    placeholder="Search customers..."
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    className="w-full pl-10 pr-4 h-10 bg-transparent border border-border rounded-[2px] text-sm focus:outline-none focus:border-gold/50"
                  />
                </div>
                <select
                  value={customerSort}
                  onChange={(e) => setCustomerSort(e.target.value as typeof customerSort)}
                  className="h-10 px-3 bg-transparent border border-border rounded-[2px] text-xs tracking-wide text-muted focus:outline-none focus:border-gold/50"
                >
                  <option value="spent">Sort by Total Spent</option>
                  <option value="orders">Sort by Orders</option>
                  <option value="name">Sort by Name</option>
                </select>
                <span className="text-xs text-muted">{filteredCustomers.length} customers</span>
              </div>

              {/* Desktop Table */}
              <div className="hidden md:block bg-card border border-border rounded-[2px] overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left px-6 py-3 text-xs tracking-[1px] uppercase text-muted font-medium">Customer</th>
                      <th className="text-left px-6 py-3 text-xs tracking-[1px] uppercase text-muted font-medium">Email</th>
                      <th className="text-left px-6 py-3 text-xs tracking-[1px] uppercase text-muted font-medium">Orders</th>
                      <th className="text-left px-6 py-3 text-xs tracking-[1px] uppercase text-muted font-medium">Total Spent</th>
                      <th className="text-left px-6 py-3 text-xs tracking-[1px] uppercase text-muted font-medium">Last Order</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.map((customer) => (
                      <tr key={customer.email} className="border-b border-border/50 last:border-0 hover:bg-section/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <CustomerAvatar name={customer.name} />
                            <span className="text-sm font-medium">{customer.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted">{customer.email}</td>
                        <td className="px-6 py-4 text-sm">{customer.orders}</td>
                        <td className="px-6 py-4 text-sm font-medium">{formatPrice(customer.totalSpent)}</td>
                        <td className="px-6 py-4 text-xs text-muted">{customer.lastOrder}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-3">
                {filteredCustomers.map((customer) => (
                  <div key={customer.email} className="p-4 bg-card border border-border rounded-[2px]">
                    <div className="flex items-center gap-3 mb-3">
                      <CustomerAvatar name={customer.name} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{customer.name}</p>
                        <p className="text-xs text-muted">{customer.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted">{customer.orders} orders</span>
                      <p className="text-sm font-medium text-gold">{formatPrice(customer.totalSpent)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Settings - Enhanced */}
          {activeTab === "settings" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl space-y-4 lg:space-y-6">
              {/* Store Information */}
              <div className="p-4 lg:p-6 bg-card border border-border rounded-[2px]">
                <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-gold" /> Store Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-muted">Store Name</label>
                    <input type="text" defaultValue="ONIXX" className="w-full mt-1 px-3 py-2 bg-transparent border border-border rounded-[2px] text-sm focus:outline-none focus:border-gold/50" />
                  </div>
                  <div>
                    <label className="text-xs text-muted">Contact Email</label>
                    <input type="email" defaultValue="concierge@onixx.com" className="w-full mt-1 px-3 py-2 bg-transparent border border-border rounded-[2px] text-sm focus:outline-none focus:border-gold/50" />
                  </div>
                  <div>
                    <label className="text-xs text-muted">Phone</label>
                    <input type="tel" defaultValue="+91 98765 43210" className="w-full mt-1 px-3 py-2 bg-transparent border border-border rounded-[2px] text-sm focus:outline-none focus:border-gold/50" />
                  </div>
                  <div>
                    <label className="text-xs text-muted">Currency</label>
                    <input type="text" defaultValue="INR (₹)" disabled className="w-full mt-1 px-3 py-2 bg-transparent border border-border rounded-[2px] text-sm text-muted" />
                  </div>
                </div>
              </div>

              {/* Homepage Hero Image */}
              <div className="p-4 lg:p-6 bg-card border border-border rounded-[2px]">
                <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-gold" /> Homepage Hero Image
                </h3>
                <p className="text-xs text-muted mb-4">
                  Upload an image or paste a URL. Recommended size: 1920×1080px. Max file size: 2MB.
                </p>

                {/* Current Preview */}
                <div className="relative w-full aspect-video mb-4 bg-background border border-border rounded-[2px] overflow-hidden">
                  <Image
                    src={heroImage}
                    alt="Hero preview"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute top-2 right-2 px-2 py-1 bg-background/80 backdrop-blur-sm text-[10px] text-muted rounded-[2px]">
                    {heroImageType === "upload" ? "Uploaded" : heroImage === DEFAULT_HERO_IMAGE ? "Default" : "URL"}
                  </div>
                </div>

                {/* Upload Button */}
                <div className="space-y-3">
                  <label className="flex items-center justify-center gap-2 w-full h-10 border border-dashed border-border rounded-[2px] text-sm text-muted hover:text-gold hover:border-gold/30 transition-colors cursor-pointer">
                    <Upload className="w-4 h-4" />
                    Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        if (file.size > 2 * 1024 * 1024) {
                          showToast("File too large. Max 2MB.");
                          return;
                        }
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          const result = ev.target?.result as string;
                          setHeroImage(result, "upload");
                          showToast("Hero image updated");
                          addEntry({ action: "Hero Image", detail: "Homepage hero image updated via upload", type: "system" });
                        };
                        reader.readAsDataURL(file);
                      }}
                    />
                  </label>

                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-[10px] text-muted uppercase">or</span>
                    <div className="flex-1 h-px bg-border" />
                  </div>

                  {/* URL Input */}
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="Paste image URL..."
                      defaultValue={heroImageType === "url" ? heroImage : ""}
                      className="flex-1 px-3 py-2 bg-transparent border border-border rounded-[2px] text-sm focus:outline-none focus:border-gold/50"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          const val = (e.target as HTMLInputElement).value.trim();
                          if (val) {
                            setHeroImage(val, "url");
                            showToast("Hero image updated");
                            addEntry({ action: "Hero Image", detail: "Homepage hero image updated via URL", type: "system" });
                          }
                        }
                      }}
                    />
                    <Button
                      variant="secondary"
                      className="text-xs"
                      onClick={() => {
                        const input = document.querySelector('input[type="url"]') as HTMLInputElement;
                        const val = input?.value.trim();
                        if (val) {
                          setHeroImage(val, "url");
                          showToast("Hero image updated");
                          addEntry({ action: "Hero Image", detail: "Homepage hero image updated via URL", type: "system" });
                        }
                      }}
                    >
                      Set
                    </Button>
                  </div>

                  {/* Reset */}
                  {heroImage !== DEFAULT_HERO_IMAGE && (
                    <button
                      onClick={() => { resetHeroImage(); showToast("Hero image reset to default"); }}
                      className="text-xs text-muted hover:text-red-500 transition-colors"
                    >
                      Reset to default image
                    </button>
                  )}
                </div>
              </div>

              {/* Catalogue Stats */}
              <div className="p-4 lg:p-6 bg-card border border-border rounded-[2px]">
                <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-gold" /> Catalogue Stats
                </h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-xl lg:text-2xl font-semibold text-gold">{products.length}</p>
                    <p className="text-[10px] lg:text-xs text-muted">Total</p>
                  </div>
                  <div>
                    <p className="text-xl lg:text-2xl font-semibold text-gold">{products.filter(p => p.isBestSeller).length}</p>
                    <p className="text-[10px] lg:text-xs text-muted">Best Sellers</p>
                  </div>
                  <div>
                    <p className="text-xl lg:text-2xl font-semibold text-gold">{products.filter(p => p.isLimitedEdition).length}</p>
                    <p className="text-[10px] lg:text-xs text-muted">Limited</p>
                  </div>
                  <div>
                    <p className="text-xl lg:text-2xl font-semibold text-gold">{products.filter(p => p.isNewArrival).length}</p>
                    <p className="text-[10px] lg:text-xs text-muted">New Arrivals</p>
                  </div>
                </div>
              </div>

              {/* Notification Preferences */}
              <div className="p-4 lg:p-6 bg-card border border-border rounded-[2px]">
                <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
                  <Bell className="w-4 h-4 text-gold" /> Notification Preferences
                </h3>
                <div className="space-y-3">
                  {[
                    { label: "Low Stock Alerts", desc: "Notify when products drop below threshold", defaultOn: true },
                    { label: "New Order Notifications", desc: "Get alerted for every new order", defaultOn: true },
                    { label: "Order Status Updates", desc: "Track shipping and delivery changes", defaultOn: false },
                    { label: "Weekly Reports", desc: "Receive weekly sales and inventory summaries", defaultOn: true },
                  ].map((pref) => (
                    <ToggleSetting key={pref.label} label={pref.label} description={pref.desc} defaultOn={pref.defaultOn} />
                  ))}
                </div>
              </div>

              {/* Shipping & Tax */}
              <div className="p-4 lg:p-6 bg-card border border-border rounded-[2px]">
                <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-gold" /> Shipping & Tax
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-muted">GST Rate (%)</label>
                      <input type="number" defaultValue="18" className="w-full mt-1 px-3 py-2 bg-transparent border border-border rounded-[2px] text-sm focus:outline-none focus:border-gold/50" />
                    </div>
                    <div>
                      <label className="text-xs text-muted">Free Shipping Above (₹)</label>
                      <input type="number" defaultValue="500000" className="w-full mt-1 px-3 py-2 bg-transparent border border-border rounded-[2px] text-sm focus:outline-none focus:border-gold/50" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-muted">Shipping Regions</label>
                    <input type="text" defaultValue="Pan India" disabled className="w-full mt-1 px-3 py-2 bg-transparent border border-border rounded-[2px] text-sm text-muted" />
                  </div>
                </div>
              </div>

              {/* Live Data */}
              <div className="p-4 lg:p-6 bg-card border border-border rounded-[2px]">
                <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-gold" /> Live Data
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-background rounded-[2px]">
                    <p className="text-xs text-muted mb-1">Cart Items</p>
                    <p className="text-lg font-semibold">{items.length}</p>
                  </div>
                  <div className="p-3 bg-background rounded-[2px]">
                    <p className="text-xs text-muted mb-1">Active Orders</p>
                    <p className="text-lg font-semibold">{orderStats.processing + orderStats.shipped}</p>
                  </div>
                  <div className="p-3 bg-background rounded-[2px]">
                    <p className="text-xs text-muted mb-1">Total Revenue</p>
                    <p className="text-lg font-semibold text-gold">{formatPrice(orderStats.totalRevenue)}</p>
                  </div>
                  <div className="p-3 bg-background rounded-[2px]">
                    <p className="text-xs text-muted mb-1">Activity Log</p>
                    <p className="text-lg font-semibold">{activityEntries.length}</p>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="p-4 lg:p-6 bg-card border border-red-500/20 rounded-[2px]">
                <h3 className="text-sm font-medium mb-4 flex items-center gap-2 text-red-500">
                  <Shield className="w-4 h-4" /> Danger Zone
                </h3>
                <p className="text-xs text-muted mb-4">These actions are irreversible. Please be certain before proceeding.</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="secondary" onClick={() => { resetProducts(); showToast("Products reset to defaults"); }} className="text-xs border-red-500/20 hover:bg-red-500/5 hover:text-red-500">
                    <RefreshCw className="w-3 h-3 mr-1" /> Reset Products
                  </Button>
                  <Button variant="secondary" onClick={() => { resetOrders(); showToast("Orders reset to defaults"); }} className="text-xs border-red-500/20 hover:bg-red-500/5 hover:text-red-500">
                    <RefreshCw className="w-3 h-3 mr-1" /> Reset Orders
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Product Form Drawer */}
      <AnimatePresence>
        {formOpen && (
          <ProductForm
            key={editingProduct?.id ?? "new"}
            product={editingProduct}
            onSave={handleSave}
            onClose={() => { setFormOpen(false); setEditingProduct(null); }}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[60]"
              onClick={() => setDeleteConfirm(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-sm bg-card border border-border rounded-[2px] p-6 lg:p-8 z-[61]"
            >
              <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: "var(--font-heading), serif" }}>
                Delete Product?
              </h3>
              <p className="text-sm text-muted mb-6">
                This action cannot be undone. The product will be permanently removed from the catalogue.
              </p>
              <div className="flex gap-3">
                <Button variant="primary" className="flex-1" onClick={() => handleDelete(deleteConfirm)}>
                  DELETE
                </Button>
                <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>
                  CANCEL
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  );
}

function ToggleSetting({ label, description, defaultOn }: { label: string; description: string; defaultOn: boolean }) {
  const [enabled, setEnabled] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
      <div>
        <p className="text-sm">{label}</p>
        <p className="text-[10px] text-muted">{description}</p>
      </div>
      <button
        onClick={() => setEnabled(!enabled)}
        className={`w-10 h-5 rounded-full transition-colors relative ${enabled ? "bg-gold" : "bg-border"}`}
      >
        <div className={`w-4 h-4 bg-background rounded-full absolute top-0.5 transition-transform ${enabled ? "translate-x-5" : "translate-x-0.5"}`} />
      </button>
    </div>
  );
}
