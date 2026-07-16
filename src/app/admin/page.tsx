"use client";

import { useState, useMemo } from "react";
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
} from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useProductStore } from "@/store/products";
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

const recentOrders = [
  { id: "ORD-001", customer: "Arjun Mehta", product: "Royal Chronograph", amount: 1074850, status: "Delivered" },
  { id: "ORD-002", customer: "Priya Sharma", product: "Midnight Automatic", amount: 726250, status: "Shipped" },
  { id: "ORD-003", customer: "Vikram Singh", product: "Sovereign Tourbillon", amount: 2033500, status: "Processing" },
  { id: "ORD-004", customer: "Neha Kapoor", product: "Heritage Classic", amount: 410850, status: "Delivered" },
  { id: "ORD-005", customer: "Rahul Verma", product: "Apex Diver Pro", amount: 576850, status: "Shipped" },
];

function OrderStatusBadge({ status }: { status: string }) {
  return (
    <span className={`text-xs px-2 py-1 rounded-[2px] ${
      status === "Delivered" ? "bg-green-500/10 text-green-500"
      : status === "Shipped" ? "bg-blue-500/10 text-blue-500"
      : "bg-yellow-500/10 text-yellow-500"
    }`}>{status}</span>
  );
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const { items } = useCartStore();
  const { products, addProduct, updateProduct, deleteProduct, resetProducts } = useProductStore();
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const totalRevenue = products.reduce((sum, p) => sum + p.price, 0);

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "ALL" || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSave = (product: Product) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, product);
    } else {
      addProduct(product);
    }
    setFormOpen(false);
    setEditingProduct(null);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteProduct(id);
    setDeleteConfirm(null);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setFormOpen(true);
  };

  const handleNav = (id: string) => {
    setActiveTab(id);
    setSidebarOpen(false);
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
          <p className="text-xs text-muted hidden sm:block">
            {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        <div className="p-4 lg:p-8">
          {/* Dashboard */}
          {activeTab === "dashboard" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 lg:space-y-8"
            >
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
                {[
                  { icon: DollarSign, label: "Revenue", value: formatPrice(totalRevenue), change: "+12.5%" },
                  { icon: ShoppingCart, label: "Orders", value: "156", change: "+8.2%" },
                  { icon: Package, label: "Products", value: products.length.toString(), change: "+3" },
                  { icon: Eye, label: "Views", value: "24,589", change: "+18.7%" },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-4 lg:p-6 bg-card border border-border rounded-[2px]"
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

              {/* Inventory Overview */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
                {[
                  { icon: Package, label: "Total Stock", value: inventoryStats.totalStock.toString(), color: "text-foreground" },
                  { icon: Package, label: "In Stock", value: inventoryStats.inStock.toString(), color: "text-green-500" },
                  { icon: AlertTriangle, label: "Low Stock", value: inventoryStats.lowStock.toString(), color: inventoryStats.lowStock > 0 ? "text-yellow-500" : "text-foreground" },
                  { icon: PackageX, label: "Out of Stock", value: inventoryStats.outOfStock.toString(), color: inventoryStats.outOfStock > 0 ? "text-red-500" : "text-foreground" },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="p-4 lg:p-6 bg-card border border-border rounded-[2px]"
                  >
                    <div className="flex items-center justify-between mb-3 lg:mb-4">
                      <stat.icon className="w-4 h-4 lg:w-5 lg:h-5 text-gold" />
                    </div>
                    <p className={`text-lg lg:text-2xl font-semibold mb-1 ${stat.color}`}>{stat.value}</p>
                    <p className="text-[10px] lg:text-xs text-muted">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Low Stock & Out of Stock Alerts */}
              {(lowStockProducts.length > 0 || outOfStockProducts.length > 0) && (
                <div className="space-y-4">
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

                {/* Desktop Table */}
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
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="border-b border-border/50 last:border-0">
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

                {/* Mobile Cards */}
                <div className="md:hidden space-y-3">
                  {recentOrders.map((order) => (
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
                  Top Products
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
                  {[...products].sort((a, b) => b.price - a.price).slice(0, 6).map((product) => (
                    <div key={product.id} className="p-3 lg:p-4 bg-card border border-border rounded-[2px] flex items-center gap-3 lg:gap-4">
                      <div className="w-10 h-10 lg:w-12 lg:h-12 bg-background rounded-[2px] overflow-hidden border border-border flex-shrink-0 relative">
                        <Image src={product.image} alt={product.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{product.name}</p>
                        <p className="text-xs text-gold">{formatPrice(product.price)}</p>
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
              {/* Toolbar */}
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

              {/* Desktop Table */}
              <div className="hidden md:block bg-card border border-border rounded-[2px] overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left px-6 py-3 text-xs tracking-[1px] uppercase text-muted font-medium">Product</th>
                      <th className="text-left px-6 py-3 text-xs tracking-[1px] uppercase text-muted font-medium">Category</th>
                      <th className="text-left px-6 py-3 text-xs tracking-[1px] uppercase text-muted font-medium">Collection</th>
                      <th className="text-left px-6 py-3 text-xs tracking-[1px] uppercase text-muted font-medium">Price</th>
                      <th className="text-left px-6 py-3 text-xs tracking-[1px] uppercase text-muted font-medium">Stock</th>
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
                      <tr><td colSpan={6} className="px-6 py-12 text-center text-sm text-muted">No products found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
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
              {/* Inventory Summary Cards */}
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

              {/* Alerts Banner */}
              {outOfStockProducts.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-500/5 border border-red-500/20 rounded-[2px] flex items-start gap-3"
                >
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
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-[2px] flex items-start gap-3"
                >
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

              {/* Full Inventory Table */}
              <div>
                <h3 className="text-base lg:text-lg font-semibold mb-4" style={{ fontFamily: "var(--font-heading), serif" }}>
                  All Products
                </h3>

                {/* Desktop Table */}
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

                {/* Mobile Cards */}
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

          {/* Orders */}
          {activeTab === "orders" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              {/* Desktop Table */}
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
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="border-b border-border/50 last:border-0 hover:bg-section/50 transition-colors">
                        <td className="px-6 py-4 text-sm text-gold font-mono">{order.id}</td>
                        <td className="px-6 py-4 text-sm">{order.customer}</td>
                        <td className="px-6 py-4 text-sm text-muted">{order.product}</td>
                        <td className="px-6 py-4 text-sm">{formatPrice(order.amount)}</td>
                        <td className="px-6 py-4"><OrderStatusBadge status={order.status} /></td>
                        <td className="px-6 py-4 text-xs text-muted">16 Jul 2026</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-3">
                {recentOrders.map((order) => (
                  <div key={order.id} className="p-4 bg-card border border-border rounded-[2px]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gold font-mono">{order.id}</span>
                      <OrderStatusBadge status={order.status} />
                    </div>
                    <p className="text-sm font-medium mb-1">{order.customer}</p>
                    <p className="text-xs text-muted mb-2">{order.product}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{formatPrice(order.amount)}</p>
                      <p className="text-xs text-muted">16 Jul 2026</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Customers */}
          {activeTab === "customers" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              {/* Desktop Table */}
              <div className="hidden md:block bg-card border border-border rounded-[2px] overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left px-6 py-3 text-xs tracking-[1px] uppercase text-muted font-medium">Name</th>
                      <th className="text-left px-6 py-3 text-xs tracking-[1px] uppercase text-muted font-medium">Email</th>
                      <th className="text-left px-6 py-3 text-xs tracking-[1px] uppercase text-muted font-medium">Orders</th>
                      <th className="text-left px-6 py-3 text-xs tracking-[1px] uppercase text-muted font-medium">Total Spent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order, i) => (
                      <tr key={order.id} className="border-b border-border/50 last:border-0 hover:bg-section/50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium">{order.customer}</td>
                        <td className="px-6 py-4 text-sm text-muted">{order.customer.toLowerCase().replace(" ", ".")}@email.com</td>
                        <td className="px-6 py-4 text-sm">{[2, 4, 1, 3, 5][i] || 1}</td>
                        <td className="px-6 py-4 text-sm">{formatPrice(order.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-3">
                {recentOrders.map((order, i) => (
                  <div key={order.id} className="p-4 bg-card border border-border rounded-[2px]">
                    <p className="text-sm font-medium mb-1">{order.customer}</p>
                    <p className="text-xs text-muted mb-2">{order.customer.toLowerCase().replace(" ", ".")}@email.com</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted">{[2, 4, 1, 3, 5][i] || 1} orders</span>
                      <p className="text-sm font-medium">{formatPrice(order.amount)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Settings */}
          {activeTab === "settings" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl space-y-4 lg:space-y-6">
              <div className="p-4 lg:p-6 bg-card border border-border rounded-[2px]">
                <h3 className="text-sm font-medium mb-4">Store Information</h3>
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
                    <label className="text-xs text-muted">Currency</label>
                    <input type="text" defaultValue="INR (₹)" disabled className="w-full mt-1 px-3 py-2 bg-transparent border border-border rounded-[2px] text-sm text-muted" />
                  </div>
                </div>
              </div>
              <div className="p-4 lg:p-6 bg-card border border-border rounded-[2px]">
                <h3 className="text-sm font-medium mb-4">Catalogue Stats</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
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
                </div>
              </div>
              <div className="p-4 lg:p-6 bg-card border border-border rounded-[2px]">
                <h3 className="text-sm font-medium mb-4">Cart Items (Live)</h3>
                <p className="text-sm text-muted">
                  {items.length} {items.length === 1 ? "item" : "items"} currently in shopping carts across all sessions.
                </p>
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
    </div>
  );
}
