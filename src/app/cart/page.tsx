"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Minus, Plus, X, ArrowLeft, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BackButton } from "@/components/shared/back-button";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore();

  if (items.length === 0) {
    return (
      <section className="pt-32 lg:pt-40 pb-24 lg:pb-32 px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto">
          <BackButton />
          <div className="text-center py-24">
          <ShoppingBag className="w-16 h-16 text-border mx-auto mb-6" />
          <h1
            className="text-3xl md:text-4xl font-semibold mb-4"
            style={{ fontFamily: "var(--font-heading), serif" }}
          >
            Your Bag is Empty
          </h1>
          <p className="text-sm text-muted mb-8 max-w-md mx-auto">
            Discover our collection of luxury timepieces crafted with precision
            and timeless elegance.
          </p>
          <Link href="/watches">
            <Button variant="primary">SHOP COLLECTION</Button>
          </Link>
        </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-32 lg:pt-40 pb-24 lg:pb-32 px-6 lg:px-12">
      <div className="max-w-[1400px] mx-auto">
        <BackButton />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1
            className="text-4xl md:text-5xl font-semibold mb-2"
            style={{ fontFamily: "var(--font-heading), serif" }}
          >
            Shopping Bag
          </h1>
          <p className="text-sm text-muted">
            {items.length} {items.length === 1 ? "item" : "items"} in your bag
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            {items.map((item, index) => (
              <motion.div
                key={item.product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex gap-4 lg:gap-6 p-4 lg:p-6 bg-card border border-border rounded-[2px]"
              >
                <Link
                  href={`/watches/${item.product.id}`}
                  className="w-24 h-24 lg:w-32 lg:h-32 bg-background rounded-[2px] overflow-hidden border border-border flex-shrink-0"
                >
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                </Link>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] tracking-[1.5px] uppercase text-gold mb-1">
                        {item.product.category}
                      </p>
                      <Link
                        href={`/watches/${item.product.id}`}
                        className="text-base font-medium text-foreground hover:text-gold transition-colors"
                      >
                        {item.product.name}
                      </Link>
                    </div>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="text-muted hover:text-foreground transition-colors flex-shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-6">
                    <div className="flex items-center border border-border rounded-[2px]">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            item.quantity - 1
                          )
                        }
                        className="w-10 h-10 flex items-center justify-center text-muted hover:text-foreground transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-10 h-10 flex items-center justify-center text-sm border-x border-border">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            item.quantity + 1
                          )
                        }
                        className="w-10 h-10 flex items-center justify-center text-muted hover:text-foreground transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-lg font-medium">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-40 p-6 bg-card border border-border rounded-[2px]">
              <h2 className="text-lg font-medium mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Subtotal</span>
                  <span>{formatPrice(totalPrice())}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Shipping</span>
                  <span className="text-gold">Complimentary</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Tax</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              <Separator className="mb-6" />

              <div className="flex justify-between mb-8">
                <span className="text-base font-medium">Total</span>
                <span className="text-xl font-medium">
                  {formatPrice(totalPrice())}
                </span>
              </div>

              <Link href="/checkout">
                <Button variant="primary" className="w-full mb-3">
                  PROCEED TO CHECKOUT
                </Button>
              </Link>
              <Link href="/watches">
                <Button variant="secondary" className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  CONTINUE SHOPPING
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
