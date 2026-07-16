"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice } =
    useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[60]"
            onClick={closeCart}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-background border-l border-border z-[70] flex flex-col"
          >
            <div className="flex items-center justify-between h-16 lg:h-[90px] px-4 lg:px-6 border-b border-border">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-gold" />
                <h2 className="text-sm tracking-[2px] uppercase font-medium">
                  Shopping Bag ({items.length})
                </h2>
              </div>
              <button
                onClick={closeCart}
                className="flex items-center justify-center w-10 h-10 text-muted hover:text-foreground transition-colors duration-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-4 lg:py-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-12 h-12 text-border mb-4" />
                  <p className="text-sm text-muted mb-2">
                    Your shopping bag is empty
                  </p>
                  <p className="text-xs text-muted/60">
                    Discover our collection of premium watches and
                    accessories
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex gap-4 group"
                    >
                      <div className="w-20 h-20 bg-card rounded-[2px] overflow-hidden border border-border flex-shrink-0">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-[10px] tracking-[1.5px] uppercase text-gold">
                              {item.product.category}
                            </p>
                            <h4 className="text-sm font-medium text-foreground truncate">
                              {item.product.name}
                            </h4>
                          </div>
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="text-muted hover:text-foreground transition-colors duration-300 flex-shrink-0"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center border border-border rounded-[2px]">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity - 1
                                )
                              }
                              className="w-8 h-8 flex items-center justify-center text-muted hover:text-foreground transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 h-8 flex items-center justify-center text-xs border-x border-border">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity + 1
                                )
                              }
                              className="w-8 h-8 flex items-center justify-center text-muted hover:text-foreground transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <p className="text-sm font-medium">
                            {formatPrice(item.product.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-border px-4 lg:px-6 py-4 lg:py-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted">Subtotal</span>
                  <span className="text-lg font-medium">
                    {formatPrice(totalPrice())}
                  </span>
                </div>
                <p className="text-[10px] text-muted">
                  Shipping & taxes calculated at checkout
                </p>
                <Link href="/checkout" onClick={closeCart}>
                  <Button variant="primary" className="w-full">
                    CHECKOUT
                  </Button>
                </Link>
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="block text-center"
                >
                  <Button variant="secondary" className="w-full">
                    VIEW BAG
                  </Button>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
