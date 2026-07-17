"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { User, MapPin, Package, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/shared/back-button";
import { useCustomerStore } from "@/store/customer";

const links = [
  { href: "/account/addresses", label: "Manage Addresses", icon: MapPin, description: "Add, edit, or remove saved addresses" },
  { href: "/orders", label: "Order History", icon: Package, description: "View all your past orders and track shipments" },
];

export default function AccountPage() {
  const { profile } = useCustomerStore();

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
            My Account
          </h1>
        </motion.div>

        <div className="max-w-2xl space-y-6">
          {profile && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-card border border-border rounded-[2px]"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
                  <User className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <p className="font-medium">{profile.displayName || profile.email}</p>
                  <p className="text-sm text-muted">{profile.email}</p>
                  {profile.phone && <p className="text-sm text-muted">{profile.phone}</p>}
                </div>
              </div>
            </motion.div>
          )}

          {!profile && (
            <div className="p-6 bg-card border border-border rounded-[2px] text-center">
              <User className="w-10 h-10 text-muted mx-auto mb-4" />
              <p className="text-sm text-muted mb-4">Sign in to manage your profile and addresses.</p>
              <Link href="/admin/login">
                <Button variant="primary">SIGN IN</Button>
              </Link>
            </div>
          )}

          <div className="space-y-3">
            {links.map((link, i) => {
              const Icon = link.icon;
              return (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={link.href}
                    className="flex items-center gap-4 p-5 bg-card border border-border rounded-[2px] hover:border-gold/30 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded bg-surface flex items-center justify-center">
                      <Icon className="w-5 h-5 text-muted group-hover:text-gold transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{link.label}</p>
                      <p className="text-xs text-muted">{link.description}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted group-hover:text-gold transition-colors" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
