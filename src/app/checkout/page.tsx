"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, Truck, Shield, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { BackButton } from "@/components/shared/back-button";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
  cardName: string;
}

interface FormErrors {
  [key: string]: string;
}

const initialFormData: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address1: "",
  address2: "",
  city: "",
  state: "",
  zip: "",
  country: "",
  cardNumber: "",
  cardExpiry: "",
  cardCvv: "",
  cardName: "",
};

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState("");

  if (items.length === 0 && !orderComplete) {
    return (
      <section className="pt-32 lg:pt-40 pb-24 lg:pb-32 px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto text-center py-24">
          <h1
            className="text-3xl md:text-4xl font-semibold mb-4"
            style={{ fontFamily: "var(--font-heading), serif" }}
          >
            Nothing to Checkout
          </h1>
          <p className="text-sm text-muted mb-8">
            Add some watches to your bag first.
          </p>
          <Link href="/watches">
            <Button variant="primary">SHOP COLLECTION</Button>
          </Link>
        </div>
      </section>
    );
  }

  if (orderComplete) {
    return (
      <section className="pt-32 lg:pt-40 pb-24 lg:pb-32 px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto text-center py-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="w-10 h-10 text-gold" />
            </div>
            <h1
              className="text-3xl md:text-4xl font-semibold mb-4"
              style={{ fontFamily: "var(--font-heading), serif" }}
            >
              Order Confirmed
            </h1>
            <p className="text-sm text-muted mb-2">
              Thank you for your purchase. Your order has been placed successfully.
            </p>
            <p className="text-xs text-muted mb-8">
              Order ID: <span className="text-gold">{orderId}</span>
            </p>
            <p className="text-xs text-muted mb-8">
              A confirmation email has been sent to {formData.email}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/watches">
                <Button variant="primary">CONTINUE SHOPPING</Button>
              </Link>
              <Link href="/">
                <Button variant="secondary">BACK TO HOME</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email address";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.address1.trim()) newErrors.address1 = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.zip.trim()) newErrors.zip = "Postal code is required";
    if (!formData.country.trim()) newErrors.country = "Country is required";
    if (!formData.cardNumber.trim()) newErrors.cardNumber = "Card number is required";
    else if (formData.cardNumber.replace(/\s/g, "").length < 16) newErrors.cardNumber = "Invalid card number";
    if (!formData.cardExpiry.trim()) newErrors.cardExpiry = "Expiry date is required";
    else if (!/^\d{2}\s*\/\s*\d{2}$/.test(formData.cardExpiry)) newErrors.cardExpiry = "Use MM / YY format";
    if (!formData.cardCvv.trim()) newErrors.cardCvv = "CVV is required";
    else if (formData.cardCvv.length < 3) newErrors.cardCvv = "Invalid CVV";
    if (!formData.cardName.trim()) newErrors.cardName = "Name on card is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 16);
    return cleaned.replace(/(\d{4})/g, "$1 ").trim();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const generatedOrderId = `ONX-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    setOrderId(generatedOrderId);
    clearCart();
    setOrderComplete(true);
    setIsSubmitting(false);
  };

  const inputProps = (field: keyof FormData, placeholder: string, type = "text") => ({
    placeholder,
    type,
    value: formData[field],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;
      if (field === "cardNumber") value = formatCardNumber(value);
      if (field === "cardCvv") value = value.replace(/\D/g, "").slice(0, 4);
      handleChange(field, value);
    },
    className: errors[field] ? "border-red-500 focus:border-red-500" : "",
  });

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
            Checkout
          </h1>
          <div className="flex items-center gap-2 text-xs text-muted mt-3">
            <Lock className="w-3 h-3" />
            <span>Secure checkout powered by industry-standard encryption</span>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <div className="p-6 bg-card border border-border rounded-[2px]">
                <h2 className="text-lg font-medium mb-6">Contact Information</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Input {...inputProps("firstName", "First name")} />
                      {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
                    </div>
                    <div>
                      <Input {...inputProps("lastName", "Last name")} />
                      {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
                    </div>
                  </div>
                  <div>
                    <Input {...inputProps("email", "Email address", "email")} />
                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <Input {...inputProps("phone", "Phone number", "tel")} />
                    {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                  </div>
                </div>
              </div>

              <div className="p-6 bg-card border border-border rounded-[2px]">
                <h2 className="text-lg font-medium mb-6">Shipping Address</h2>
                <div className="space-y-4">
                  <div>
                    <Input {...inputProps("address1", "Address line 1")} />
                    {errors.address1 && <p className="text-xs text-red-500 mt-1">{errors.address1}</p>}
                  </div>
                  <Input {...inputProps("address2", "Address line 2 (optional)")} />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <Input {...inputProps("city", "City")} />
                      {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
                    </div>
                    <div>
                      <Input {...inputProps("state", "State / Province")} />
                      {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state}</p>}
                    </div>
                    <div>
                      <Input {...inputProps("zip", "Zip / Postal code")} />
                      {errors.zip && <p className="text-xs text-red-500 mt-1">{errors.zip}</p>}
                    </div>
                  </div>
                  <div>
                    <Input {...inputProps("country", "Country")} />
                    {errors.country && <p className="text-xs text-red-500 mt-1">{errors.country}</p>}
                  </div>
                </div>
              </div>

              <div className="p-6 bg-card border border-border rounded-[2px]">
                <h2 className="text-lg font-medium mb-6">Payment</h2>
                <div className="space-y-4">
                  <div>
                    <Input {...inputProps("cardNumber", "Card number")} inputMode="numeric" />
                    {errors.cardNumber && <p className="text-xs text-red-500 mt-1">{errors.cardNumber}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Input {...inputProps("cardExpiry", "MM / YY")} inputMode="numeric" />
                      {errors.cardExpiry && <p className="text-xs text-red-500 mt-1">{errors.cardExpiry}</p>}
                    </div>
                    <div>
                      <Input {...inputProps("cardCvv", "CVV")} inputMode="numeric" />
                      {errors.cardCvv && <p className="text-xs text-red-500 mt-1">{errors.cardCvv}</p>}
                    </div>
                  </div>
                  <div>
                    <Input {...inputProps("cardName", "Name on card")} />
                    {errors.cardName && <p className="text-xs text-red-500 mt-1">{errors.cardName}</p>}
                  </div>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="sticky top-40 p-6 bg-card border border-border rounded-[2px]">
                <h2 className="text-lg font-medium mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6 max-h-48 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex justify-between text-sm">
                      <span className="text-muted truncate mr-4">
                        {item.product.name} x{item.quantity}
                      </span>
                      <span className="flex-shrink-0">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <Separator className="mb-6" />

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Subtotal</span>
                    <span>{formatPrice(totalPrice())}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Shipping</span>
                    <span className="text-gold">Free</span>
                  </div>
                </div>

                <Separator className="mb-6" />

                <div className="flex justify-between mb-8">
                  <span className="text-base font-medium">Total</span>
                  <span className="text-xl font-medium">
                    {formatPrice(totalPrice())}
                  </span>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full mb-6"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "PROCESSING..." : "PLACE ORDER"}
                </Button>

                <div className="space-y-3 pt-4 border-t border-border">
                  <div className="flex items-center gap-3 text-xs text-muted">
                    <Truck className="w-4 h-4 text-gold flex-shrink-0" />
                    <span>Pan India shipping</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted">
                    <Shield className="w-4 h-4 text-gold flex-shrink-0" />
                    <span>Quality assured products</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted">
                    <Lock className="w-4 h-4 text-gold flex-shrink-0" />
                    <span>256-bit SSL encrypted</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </form>
      </div>
    </section>
  );
}
