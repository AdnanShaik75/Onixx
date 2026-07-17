"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Store,
  Truck,
  Percent,
  Mail,
  ToggleLeft,
  Image,
  Plus,
  Trash2,
  GripVertical,
  Save,
  Pencil,
} from "lucide-react";
import { useSettings } from "@/store/settings";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { BackButton } from "@/components/shared/back-button";
import type { HeroBanner } from "@/lib/types";

type TabId = "store" | "shipping" | "tax" | "email" | "features" | "banners";

const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "store", label: "Store Information", icon: Store },
  { id: "shipping", label: "Shipping", icon: Truck },
  { id: "tax", label: "Tax", icon: Percent },
  { id: "email", label: "Email", icon: Mail },
  { id: "features", label: "Feature Toggles", icon: ToggleLeft },
  { id: "banners", label: "Homepage Banners", icon: Image },
];

function Toggle({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onChange}
      disabled={disabled}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
        checked ? "bg-gold" : "bg-border"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <div
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-background rounded-full transition-transform duration-200 ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

function BannerForm({
  banner,
  onSave,
  onCancel,
}: {
  banner: HeroBanner;
  onSave: (b: HeroBanner) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(banner.title);
  const [subtitle, setSubtitle] = useState(banner.subtitle);
  const [imageUrl, setImageUrl] = useState(banner.imageUrl);
  const [linkUrl, setLinkUrl] = useState(banner.linkUrl);
  const [active, setActive] = useState(banner.active);

  return (
    <div className="space-y-3">
      <Input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Input
        placeholder="Subtitle"
        value={subtitle}
        onChange={(e) => setSubtitle(e.target.value)}
      />
      <Input
        placeholder="Image URL"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />
      <Input
        placeholder="Link URL"
        value={linkUrl}
        onChange={(e) => setLinkUrl(e.target.value)}
      />
      <div className="flex items-center gap-3">
        <Toggle checked={active} onChange={() => setActive(!active)} />
        <span className="text-xs text-muted">Active</span>
      </div>
      <div className="flex gap-2">
        <Button
          variant="primary"
          size="sm"
          onClick={() =>
            onSave({
              ...banner,
              title,
              subtitle,
              imageUrl,
              linkUrl,
              active,
            })
          }
        >
          <Save className="w-3 h-3 mr-1" />
          Save Banner
        </Button>
        <Button variant="secondary" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

export default function AdminSettingsPage() {
  const { settings, updateSettings, setHeroBanner, removeHeroBanner, toggleBanner, reorderBanners } = useSettings();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<TabId>("store");
  const [editingBanner, setEditingBanner] = useState<HeroBanner | null>(null);

  const handleSave = useCallback(
    (section: string, updates: Partial<typeof settings>) => {
      updateSettings(updates);
      toast(`${section} settings saved`);
    },
    [updateSettings, toast]
  );

  const handleAddBanner = useCallback(() => {
    const newBanner: HeroBanner = {
      id: `banner-${Date.now()}`,
      title: "",
      subtitle: "",
      imageUrl: "",
      linkUrl: "",
      active: false,
      order: settings.heroBanners.length,
    };
    setEditingBanner(newBanner);
  }, [settings.heroBanners.length]);

  const handleSaveBanner = useCallback(
    (banner: HeroBanner) => {
      setHeroBanner(banner);
      setEditingBanner(null);
      toast("Banner saved");
    },
    [setHeroBanner, toast]
  );

  const handleRemoveBanner = useCallback(
    (id: string) => {
      removeHeroBanner(id);
      toast("Banner removed");
    },
    [removeHeroBanner, toast]
  );

  const handleMoveBanner = useCallback(
    (index: number, direction: "up" | "down") => {
      const ids = settings.heroBanners.map((b) => b.id);
      const newIndex = direction === "up" ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= ids.length) return;
      [ids[index], ids[newIndex]] = [ids[newIndex], ids[index]];
      reorderBanners(ids);
    },
    [settings.heroBanners, reorderBanners]
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 lg:px-8 py-8">
        <BackButton />

        <h1
          className="text-2xl font-semibold mb-8"
          style={{ fontFamily: "var(--font-heading), serif" }}
        >
          Store Settings
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible lg:w-56 flex-shrink-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-[2px] text-sm whitespace-nowrap transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-gold/10 text-gold"
                    : "text-muted hover:text-foreground hover:bg-card"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="flex-1 min-w-0">
            {activeTab === "store" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-[2px] p-6 space-y-6"
              >
                <h2
                  className="text-sm font-semibold"
                  style={{ fontFamily: "var(--font-heading), serif" }}
                >
                  Store Information
                </h2>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-muted mb-2 uppercase tracking-wide">
                      Store Name
                    </label>
                    <Input
                      value={settings.storeName}
                      onChange={(e) =>
                        updateSettings({ storeName: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted mb-2 uppercase tracking-wide">
                      Email
                    </label>
                    <Input
                      type="email"
                      value={settings.storeEmail}
                      onChange={(e) =>
                        updateSettings({ storeEmail: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted mb-2 uppercase tracking-wide">
                      Phone
                    </label>
                    <Input
                      value={settings.storePhone}
                      onChange={(e) =>
                        updateSettings({ storePhone: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted mb-2 uppercase tracking-wide">
                      Address
                    </label>
                    <Input
                      value={settings.storeAddress}
                      onChange={(e) =>
                        updateSettings({ storeAddress: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted mb-2 uppercase tracking-wide">
                      Currency
                    </label>
                    <select
                      value={settings.currency}
                      onChange={(e) =>
                        updateSettings({ currency: e.target.value })
                      }
                      className="flex h-[54px] w-full border border-border bg-card px-5 py-4 text-sm text-foreground focus:outline-none focus:border-gold/50 transition-colors duration-300 rounded-[2px]"
                    >
                      <option value="₹">₹ INR</option>
                      <option value="$">$ USD</option>
                      <option value="€">€ EUR</option>
                      <option value="£">£ GBP</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() =>
                      handleSave("Store", {
                        storeName: settings.storeName,
                        storeEmail: settings.storeEmail,
                        storePhone: settings.storePhone,
                        storeAddress: settings.storeAddress,
                        currency: settings.currency,
                      })
                    }
                  >
                    <Save className="w-3 h-3 mr-1" />
                    Save
                  </Button>
                </div>
              </motion.div>
            )}

            {activeTab === "shipping" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-[2px] p-6 space-y-6"
              >
                <h2
                  className="text-sm font-semibold"
                  style={{ fontFamily: "var(--font-heading), serif" }}
                >
                  Shipping
                </h2>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-muted mb-2 uppercase tracking-wide">
                      Free Shipping Threshold (₹)
                    </label>
                    <Input
                      type="number"
                      value={settings.freeShippingThreshold}
                      onChange={(e) =>
                        updateSettings({
                          freeShippingThreshold: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted mb-2 uppercase tracking-wide">
                      Default Shipping Cost (₹)
                    </label>
                    <Input
                      type="number"
                      value={settings.defaultShippingCost}
                      onChange={(e) =>
                        updateSettings({
                          defaultShippingCost: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() =>
                      handleSave("Shipping", {
                        freeShippingThreshold:
                          settings.freeShippingThreshold,
                        defaultShippingCost: settings.defaultShippingCost,
                      })
                    }
                  >
                    <Save className="w-3 h-3 mr-1" />
                    Save
                  </Button>
                </div>
              </motion.div>
            )}

            {activeTab === "tax" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-[2px] p-6 space-y-6"
              >
                <h2
                  className="text-sm font-semibold"
                  style={{ fontFamily: "var(--font-heading), serif" }}
                >
                  Tax
                </h2>
                <Separator />
                <div className="max-w-sm">
                  <label className="block text-xs text-muted mb-2 uppercase tracking-wide">
                    Tax Rate (%)
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={settings.taxRate}
                    onChange={(e) =>
                      updateSettings({ taxRate: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="flex justify-end pt-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() =>
                      handleSave("Tax", { taxRate: settings.taxRate })
                    }
                  >
                    <Save className="w-3 h-3 mr-1" />
                    Save
                  </Button>
                </div>
              </motion.div>
            )}

            {activeTab === "email" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-[2px] p-6 space-y-6"
              >
                <h2
                  className="text-sm font-semibold"
                  style={{ fontFamily: "var(--font-heading), serif" }}
                >
                  Email Notifications
                </h2>
                <Separator />
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm">Order Confirmation Emails</p>
                      <p className="text-xs text-muted">
                        Send email when an order is confirmed
                      </p>
                    </div>
                    <Toggle
                      checked={settings.enableOrderConfirmationEmails}
                      onChange={() =>
                        updateSettings({
                          enableOrderConfirmationEmails: !settings.enableOrderConfirmationEmails,
                        })
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm">Shipping Update Emails</p>
                      <p className="text-xs text-muted">
                        Send email on shipping status changes
                      </p>
                    </div>
                    <Toggle
                      checked={settings.enableShippingUpdateEmails}
                      onChange={() =>
                        updateSettings({
                          enableShippingUpdateEmails: !settings.enableShippingUpdateEmails,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() =>
                      handleSave("Email", {
                        enableOrderConfirmationEmails: settings.enableOrderConfirmationEmails,
                        enableShippingUpdateEmails: settings.enableShippingUpdateEmails,
                      })
                    }
                  >
                    <Save className="w-3 h-3 mr-1" />
                    Save
                  </Button>
                </div>
              </motion.div>
            )}

            {activeTab === "features" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-[2px] p-6 space-y-6"
              >
                <h2
                  className="text-sm font-semibold"
                  style={{ fontFamily: "var(--font-heading), serif" }}
                >
                  Feature Toggles
                </h2>
                <Separator />
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm">Enable Reviews</p>
                      <p className="text-xs text-muted">
                        Allow customers to leave product reviews
                      </p>
                    </div>
                    <Toggle
                      checked={settings.enableReviews}
                      onChange={() =>
                        updateSettings({
                          enableReviews: !settings.enableReviews,
                        })
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm">Enable Wishlist</p>
                      <p className="text-xs text-muted">
                        Allow customers to save products to a wishlist
                      </p>
                    </div>
                    <Toggle
                      checked={settings.enableWishlist}
                      onChange={() =>
                        updateSettings({
                          enableWishlist: !settings.enableWishlist,
                        })
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm">Enable Notifications</p>
                      <p className="text-xs text-muted">
                        Show in-app notifications to customers
                      </p>
                    </div>
                    <Toggle
                      checked={settings.enableNotifications}
                      onChange={() =>
                        updateSettings({
                          enableNotifications: !settings.enableNotifications,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() =>
                      handleSave("Features", {
                        enableReviews: settings.enableReviews,
                        enableWishlist: settings.enableWishlist,
                        enableNotifications: settings.enableNotifications,
                      })
                    }
                  >
                    <Save className="w-3 h-3 mr-1" />
                    Save
                  </Button>
                </div>
              </motion.div>
            )}

            {activeTab === "banners" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-[2px] p-6 space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2
                    className="text-sm font-semibold"
                    style={{ fontFamily: "var(--font-heading), serif" }}
                  >
                    Homepage Banners
                  </h2>
                  <Button variant="secondary" size="sm" onClick={handleAddBanner}>
                    <Plus className="w-3 h-3 mr-1" />
                    Add Banner
                  </Button>
                </div>
                <Separator />

                {editingBanner && (
                  <div className="p-4 bg-background border border-gold/20 rounded-[2px]">
                    <BannerForm
                      banner={editingBanner}
                      onSave={handleSaveBanner}
                      onCancel={() => {
                        setEditingBanner(null);
                      }}
                    />
                  </div>
                )}

                <div className="space-y-3">
                  {settings.heroBanners.map((banner, index) => (
                    <div
                      key={banner.id}
                      className="flex items-center gap-3 p-4 bg-background border border-border rounded-[2px] group"
                    >
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => handleMoveBanner(index, "up")}
                          disabled={index === 0}
                          className="text-muted hover:text-gold disabled:opacity-30 transition-colors"
                        >
                          <GripVertical className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleMoveBanner(index, "down")}
                          disabled={
                            index === settings.heroBanners.length - 1
                          }
                          className="text-muted hover:text-gold disabled:opacity-30 transition-colors"
                        >
                          <GripVertical className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="w-16 h-10 bg-section border border-border rounded-[2px] overflow-hidden flex-shrink-0 relative">
                        {banner.imageUrl ? (
                          <img
                            src={banner.imageUrl}
                            alt={banner.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Image className="w-4 h-4 text-muted" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {banner.title || "Untitled Banner"}
                        </p>
                        <p className="text-xs text-muted truncate">
                          {banner.subtitle || "No subtitle"}
                        </p>
                      </div>

                      <Toggle
                        checked={banner.active}
                        onChange={() => toggleBanner(banner.id)}
                      />

                      <button
                        onClick={() => setEditingBanner(banner)}
                        className="p-1.5 text-muted hover:text-gold transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleRemoveBanner(banner.id)}
                        className="p-1.5 text-muted hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  {settings.heroBanners.length === 0 && !editingBanner && (
                    <div className="py-12 text-center text-sm text-muted">
                      No banners yet. Add one to get started.
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


