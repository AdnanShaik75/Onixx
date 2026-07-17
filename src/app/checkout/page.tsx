"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Truck,
  Shield,
  CheckCircle,
  ChevronLeft,
  MapPin,
  CreditCard,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { BackButton } from "@/components/shared/back-button";
import { useCartStore } from "@/store/cart";
import { useOrderStore } from "@/store/orders";
import { useActivityStore } from "@/store/activity";
import { useCustomerStore } from "@/store/customer";
import { useInventoryStore } from "@/store/inventory";
import { getPaymentProvider } from "@/lib/payment";
import { getShippingProvider } from "@/lib/shipping";
import { calculatePricing } from "@/lib/pricing";
import { generateOrderNumber } from "@/lib/order-number";
import { orderConfirmationHtml } from "@/lib/email";
import { formatPrice } from "@/lib/utils";
import type { OrderAddress, OrderItem } from "@/lib/types";

type Step = "cart" | "address" | "payment" | "confirmation";

const STEPS: { key: Step; label: string; icon: typeof ShoppingBag }[] = [
  { key: "cart", label: "Cart", icon: ShoppingBag },
  { key: "address", label: "Address", icon: MapPin },
  { key: "payment", label: "Payment", icon: CreditCard },
  { key: "confirmation", label: "Done", icon: CheckCircle },
];

interface AddressForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

const emptyAddress: AddressForm = {
  firstName: "", lastName: "", email: "", phone: "",
  line1: "", line2: "", city: "", state: "", zip: "", country: "",
};

export default function CheckoutPage() {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  const { addOrder } = useOrderStore();
  const { addEntry } = useActivityStore();
  const { profile, addAddress } = useCustomerStore();
  const { reserveStock, confirmReservation, releaseReservation } = useInventoryStore();

  const [step, setStep] = useState<Step>("cart");
  const [address, setAddress] = useState<AddressForm>(() => {
    const def = profile?.addresses?.find((a) => a.isDefaultShipping);
    if (def && profile) {
      return {
        firstName: def.firstName, lastName: def.lastName,
        email: profile.email, phone: def.phone,
        line1: def.line1, line2: def.line2 ?? "",
        city: def.city, state: def.state, zip: def.zip, country: def.country,
      };
    }
    return emptyAddress;
  });
  const [sameAsBilling] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    () => profile?.addresses?.find((a) => a.isDefaultShipping)?.id ?? null
  );
  const [reservationIds, setReservationIds] = useState<string[]>([]);

  const shippingCalc = getShippingProvider().calculate(
    items.reduce((s, i) => s + i.product.price * i.quantity, 0),
  );

  const pricing = calculatePricing({
    items: items.map((i) => ({ unitPrice: i.product.price, quantity: i.quantity })),
    shippingCost: shippingCalc.cost,
  });

  const orderItems: OrderItem[] = items.map((i) => ({
    productId: i.product.id,
    productName: i.product.name,
    sku: i.product.id.toUpperCase().replace(/-/g, ""),
    variant: "Default",
    image: i.product.image,
    unitPrice: i.product.price,
    quantity: i.quantity,
    lineTotal: i.product.price * i.quantity,
  }));

  useEffect(() => {
    return () => {
      reservationIds.forEach((id) => releaseReservation(id));
    };
  }, [reservationIds, releaseReservation]);

  if (items.length === 0 && step !== "confirmation") {
    return (
      <section className="pt-32 lg:pt-40 pb-24 lg:pb-32 px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto text-center py-24">
          <h1 className="text-3xl md:text-4xl font-semibold mb-4" style={{ fontFamily: "var(--font-heading), serif" }}>
            Nothing to Checkout
          </h1>
          <p className="text-sm text-muted mb-8">Add some watches to your bag first.</p>
          <Link href="/watches"><Button variant="primary">SHOP COLLECTION</Button></Link>
        </div>
      </section>
    );
  }

  const validateAddress = (): boolean => {
    const e: Record<string, string> = {};
    if (!address.firstName.trim()) e.firstName = "Required";
    if (!address.lastName.trim()) e.lastName = "Required";
    if (!address.email.trim()) e.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address.email)) e.email = "Invalid email";
    if (!address.phone.trim()) e.phone = "Required";
    if (!address.line1.trim()) e.line1 = "Required";
    if (!address.city.trim()) e.city = "Required";
    if (!address.state.trim()) e.state = "Required";
    if (!address.zip.trim()) e.zip = "Required";
    if (!address.country.trim()) e.country = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === "cart") {
      setStep("address");
    } else if (step === "address") {
      if (!validateAddress()) return;
      if (selectedAddressId && profile) {
        const saved = profile.addresses.find((a) => a.id === selectedAddressId);
        if (saved) {
          setAddress({
            firstName: saved.firstName, lastName: saved.lastName,
            email: profile.email, phone: saved.phone,
            line1: saved.line1, line2: saved.line2 ?? "",
            city: saved.city, state: saved.state, zip: saved.zip, country: saved.country,
          });
        }
      }
      setStep("payment");
    }
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);

    try {
      const reservedIds: string[] = [];
      for (const item of items) {
        const res = reserveStock(item.product.id, item.quantity, "pending");
        if (!res) {
          setErrors({ payment: `Insufficient stock for ${item.product.name}` });
          setIsProcessing(false);
          return;
        }
        reservedIds.push(res.id);
      }
      setReservationIds(reservedIds);

      await new Promise((r) => setTimeout(r, 1500));

      const orderNumber = generateOrderNumber();
      const provider = getPaymentProvider();
      const paymentResult = await provider.createOrder({
        orderId: orderNumber,
        amount: pricing.total,
        currency: "INR",
        customerEmail: address.email,
        description: `${pricing.itemCount} item(s)`,
      });

      if (!paymentResult.success) {
        reservedIds.forEach((id) => releaseReservation(id));
        setReservationIds([]);
        setErrors({ payment: paymentResult.error ?? "Payment failed" });
        setIsProcessing(false);
        return;
      }

      reservedIds.forEach((id) => confirmReservation(id));
      setReservationIds([]);

      const shippingAddr: OrderAddress = {
        firstName: address.firstName, lastName: address.lastName,
        email: address.email, phone: address.phone,
        line1: address.line1, line2: address.line2 || undefined,
        city: address.city, state: address.state,
        zip: address.zip, country: address.country,
      };

      const now = new Date().toISOString();
      const newOrder = {
        id: orderNumber,
        orderNumber,
        userId: profile?.uid ?? null,
        items: orderItems,
        shippingAddress: shippingAddr,
        billingAddress: sameAsBilling ? shippingAddr : shippingAddr,
        subtotal: pricing.subtotal,
        shipping: pricing.shipping,
        tax: pricing.tax,
        discount: pricing.discount,
        total: pricing.total,
        shippingProvider: shippingCalc.provider,
        status: "Confirmed" as const,
        paymentId: paymentResult.paymentId,
        paymentMethod: "dummy",
        timeline: [
          { timestamp: now, actor: "customer", action: "Order placed" },
          { timestamp: now, actor: "system", action: "Payment confirmed", note: paymentResult.paymentId },
        ],
        createdAt: now,
        updatedAt: now,
      };

      addOrder(newOrder);

      if (profile) {
        const existing = profile.addresses.find(
          (a) => a.line1 === address.line1 && a.city === address.city && a.zip === address.zip
        );
        if (!existing) {
          addAddress({
            label: address.city,
            firstName: address.firstName, lastName: address.lastName,
            phone: address.phone,
            line1: address.line1, line2: address.line2 || undefined,
            city: address.city, state: address.state,
            zip: address.zip, country: address.country,
            isDefaultShipping: false, isDefaultBilling: false,
          });
        }
      }

      addEntry({
        action: "New Order",
        detail: `${orderNumber} placed by ${address.firstName} ${address.lastName} — ${formatPrice(pricing.total)}`,
        type: "order",
      });

      try {
        const { getEmailProvider } = await import("@/lib/email");
        const emailProvider = getEmailProvider();
        await emailProvider.send({
          to: address.email,
          subject: `Order Confirmed — ${orderNumber}`,
          html: orderConfirmationHtml(
            orderNumber,
            orderItems,
            pricing.total,
          ),
        });
      } catch {
        // email failure is non-blocking
      }

      setOrderId(orderNumber);
      clearCart();
      setStep("confirmation");
    } catch {
      setErrors({ payment: "Something went wrong. Please try again." });
    } finally {
      setIsProcessing(false);
    }
  };

  const updateField = (field: keyof AddressForm, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => { const next = { ...prev }; delete next[field]; return next; });
    }
  };

  const inputProps = (field: keyof AddressForm, placeholder: string, type = "text") => ({
    placeholder, type, value: address[field],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => updateField(field, e.target.value),
    className: errors[field] ? "border-red-500 focus:border-red-500" : "",
  });

  const currentStepIndex = STEPS.findIndex((s) => s.key === step);

  return (
    <section className="pt-32 lg:pt-40 pb-24 lg:pb-32 px-6 lg:px-12">
      <div className="max-w-[1400px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-8">
          <BackButton />
          <h1 className="text-4xl md:text-5xl font-semibold mb-2" style={{ fontFamily: "var(--font-heading), serif" }}>
            Checkout
          </h1>
        </motion.div>

        <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const isActive = i === currentStepIndex;
            const isDone = i < currentStepIndex;
            return (
              <div key={s.key} className="flex items-center gap-2">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  isActive ? "bg-gold text-black" : isDone ? "bg-gold/20 text-gold" : "bg-surface text-muted"
                }`}>
                  <Icon className="w-3 h-3" />
                  <span className="hidden sm:inline">{s.label}</span>
                </div>
                {i < STEPS.length - 1 && <div className={`w-6 h-px ${isDone ? "bg-gold" : "bg-border"}`} />}
              </div>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {step === "cart" && (
            <motion.div key="cart" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-4 p-4 bg-card border border-border rounded-[2px]">
                    <div className="w-20 h-20 bg-surface rounded-[2px] overflow-hidden flex-shrink-0">
                      <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium truncate">{item.product.name}</h3>
                      <p className="text-xs text-muted mt-0.5">{formatPrice(item.product.price)}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <button onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.product.stock)} className="w-6 h-6 rounded border border-border flex items-center justify-center text-xs hover:bg-surface transition-colors">−</button>
                        <span className="text-xs font-medium w-4 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.product.stock)} className="w-6 h-6 rounded border border-border flex items-center justify-center text-xs hover:bg-surface transition-colors">+</button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <span className="text-sm font-medium">{formatPrice(item.product.price * item.quantity)}</span>
                      <button onClick={() => removeItem(item.product.id)} className="text-xs text-muted hover:text-red-500 transition-colors">Remove</button>
                    </div>
                  </div>
                ))}
              </div>
              <SummaryPanel items={items} pricing={pricing} shippingMethod={shippingCalc.method} />
            </motion.div>
          )}

          {step === "address" && (
            <motion.div key="address" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-6">
                {profile && profile.addresses.length > 0 && (
                  <div className="p-6 bg-card border border-border rounded-[2px]">
                    <h2 className="text-lg font-medium mb-4">Saved Addresses</h2>
                    <div className="space-y-3">
                      {profile.addresses.map((a) => (
                        <label key={a.id} className={`flex items-start gap-3 p-4 rounded-[2px] border cursor-pointer transition-colors ${selectedAddressId === a.id ? "border-gold bg-gold/5" : "border-border hover:border-border/80"}`}>
                          <input type="radio" name="savedAddress" checked={selectedAddressId === a.id} onChange={() => setSelectedAddressId(a.id)} className="mt-1 accent-gold" />
                          <div className="text-sm">
                            <p className="font-medium">{a.firstName} {a.lastName}</p>
                            <p className="text-muted">{a.line1}{a.line2 ? `, ${a.line2}` : ""}</p>
                            <p className="text-muted">{a.city}, {a.state} {a.zip}</p>
                            <p className="text-muted">{a.phone}</p>
                            {a.isDefaultShipping && <span className="text-xs text-gold mt-1 inline-block">Default</span>}
                          </div>
                        </label>
                      ))}
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      <div className="h-px flex-1 bg-border" />
                      <span className="text-xs text-muted">or enter new</span>
                      <div className="h-px flex-1 bg-border" />
                    </div>
                  </div>
                )}
                <div className="p-6 bg-card border border-border rounded-[2px]">
                  <h2 className="text-lg font-medium mb-6">Shipping Address</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div><Input {...inputProps("firstName", "First name")} />{errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}</div>
                      <div><Input {...inputProps("lastName", "Last name")} />{errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}</div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div><Input {...inputProps("email", "Email", "email")} />{errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}</div>
                      <div><Input {...inputProps("phone", "Phone", "tel")} />{errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}</div>
                    </div>
                    <div><Input {...inputProps("line1", "Address line 1")} />{errors.line1 && <p className="text-xs text-red-500 mt-1">{errors.line1}</p>}</div>
                    <Input {...inputProps("line2", "Address line 2 (optional)")} />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div><Input {...inputProps("city", "City")} />{errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}</div>
                      <div><Input {...inputProps("state", "State")} />{errors.state && <p className="text-xs text-red-500 mt-1">{errors.state}</p>}</div>
                      <div><Input {...inputProps("zip", "Postal code")} />{errors.zip && <p className="text-xs text-red-500 mt-1">{errors.zip}</p>}</div>
                    </div>
                    <div><Input {...inputProps("country", "Country")} />{errors.country && <p className="text-xs text-red-500 mt-1">{errors.country}</p>}</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="secondary" onClick={() => setStep("cart")} className="flex items-center gap-2"><ChevronLeft className="w-4 h-4" />BACK</Button>
                  <Button variant="primary" onClick={handleNext}>CONTINUE TO PAYMENT</Button>
                </div>
              </div>
              <SummaryPanel items={items} pricing={pricing} shippingMethod={shippingCalc.method} />
            </motion.div>
          )}

          {step === "payment" && (
            <motion.div key="payment" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-6">
                <div className="p-6 bg-card border border-border rounded-[2px]">
                  <h2 className="text-lg font-medium mb-2">Payment</h2>
                  <p className="text-xs text-muted mb-6">Demo mode — no real payment will be charged.</p>
                  <div className="p-4 bg-surface rounded-[2px] border border-border">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-gold" />
                      <div>
                        <p className="text-sm font-medium">Dummy Payment</p>
                        <p className="text-xs text-muted">Simulated payment for testing</p>
                      </div>
                    </div>
                  </div>
                  {errors.payment && <p className="text-xs text-red-500 mt-3">{errors.payment}</p>}
                </div>
                <div className="p-6 bg-card border border-border rounded-[2px]">
                  <h2 className="text-lg font-medium mb-4">Shipping to</h2>
                  <div className="text-sm text-muted space-y-1">
                    <p className="font-medium text-foreground">{address.firstName} {address.lastName}</p>
                    <p>{address.line1}</p>
                    {address.line2 && <p>{address.line2}</p>}
                    <p>{address.city}, {address.state} {address.zip}</p>
                    <p>{address.country}</p>
                    <p>{address.phone}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="secondary" onClick={() => setStep("address")} className="flex items-center gap-2"><ChevronLeft className="w-4 h-4" />BACK</Button>
                  <Button variant="primary" onClick={handlePlaceOrder} disabled={isProcessing}>
                    {isProcessing ? "PROCESSING..." : "PLACE ORDER"}
                  </Button>
                </div>
              </div>
              <SummaryPanel items={items} pricing={pricing} shippingMethod={shippingCalc.method} />
            </motion.div>
          )}

          {step === "confirmation" && (
            <motion.div key="confirmation" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg mx-auto text-center py-12">
              <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-8">
                <CheckCircle className="w-10 h-10 text-gold" />
              </div>
              <h1 className="text-3xl md:text-4xl font-semibold mb-4" style={{ fontFamily: "var(--font-heading), serif" }}>
                Order Confirmed
              </h1>
              <p className="text-sm text-muted mb-2">Thank you for your purchase.</p>
              <p className="text-xs text-muted mb-8">Order: <span className="text-gold">{orderId}</span></p>
              <p className="text-xs text-muted mb-8">A confirmation email has been sent to {address.email}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/watches"><Button variant="primary">CONTINUE SHOPPING</Button></Link>
                <Link href="/"><Button variant="secondary">BACK TO HOME</Button></Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function SummaryPanel({
  items, pricing, shippingMethod,
}: {
  items: { product: { id: string; name: string; image: string; price: number }; quantity: number }[];
  pricing: { subtotal: number; shipping: number; tax: number; discount: number; total: number; itemCount: number };
  shippingMethod: string;
}) {
  return (
    <div className="sticky top-40">
      <div className="p-6 bg-card border border-border rounded-[2px]">
        <h2 className="text-lg font-medium mb-6">Order Summary</h2>
        <div className="space-y-4 mb-6 max-h-48 overflow-y-auto">
          {items.map((item) => (
            <div key={item.product.id} className="flex justify-between text-sm">
              <span className="text-muted truncate mr-4">{item.product.name} x{item.quantity}</span>
              <span className="flex-shrink-0">{formatPrice(item.product.price * item.quantity)}</span>
            </div>
          ))}
        </div>
        <Separator className="mb-6" />
        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-sm"><span className="text-muted">Subtotal ({pricing.itemCount} items)</span><span>{formatPrice(pricing.subtotal)}</span></div>
          <div className="flex justify-between text-sm">
            <span className="text-muted">Shipping ({shippingMethod})</span>
            <span className={pricing.shipping === 0 ? "text-gold" : ""}>{pricing.shipping === 0 ? "Free" : formatPrice(pricing.shipping)}</span>
          </div>
          {pricing.discount > 0 && <div className="flex justify-between text-sm"><span className="text-muted">Discount</span><span className="text-green-500">-{formatPrice(pricing.discount)}</span></div>}
          {pricing.tax > 0 && <div className="flex justify-between text-sm"><span className="text-muted">Tax</span><span>{formatPrice(pricing.tax)}</span></div>}
        </div>
        <Separator className="mb-6" />
        <div className="flex justify-between">
          <span className="font-medium">Total</span>
          <span className="text-xl font-medium">{formatPrice(pricing.total)}</span>
        </div>
        <div className="space-y-3 pt-4 mt-4 border-t border-border">
          <div className="flex items-center gap-3 text-xs text-muted"><Truck className="w-4 h-4 text-gold flex-shrink-0" /><span>Pan India shipping</span></div>
          <div className="flex items-center gap-3 text-xs text-muted"><Shield className="w-4 h-4 text-gold flex-shrink-0" /><span>Quality assured products</span></div>
          <div className="flex items-center gap-3 text-xs text-muted"><Lock className="w-4 h-4 text-gold flex-shrink-0" /><span>256-bit SSL encrypted</span></div>
        </div>
      </div>
    </div>
  );
}
