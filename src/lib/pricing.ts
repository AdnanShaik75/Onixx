import type { PricingInput, PricingResult } from "@/lib/types";

const DEFAULT_TAX_RATE = 0;

export function calculatePricing(input: PricingInput): PricingResult {
  const subtotal = input.items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );
  const itemCount = input.items.reduce((sum, item) => sum + item.quantity, 0);
  const tax = Math.round(subtotal * (input.taxRate ?? DEFAULT_TAX_RATE));
  const discount = Math.min(input.discountAmount ?? 0, subtotal);
  const total = Math.max(0, subtotal - discount + input.shippingCost + tax);

  return {
    subtotal,
    shipping: input.shippingCost,
    tax,
    discount,
    total,
    itemCount,
  };
}

export function buildPricingInput(
  items: { unitPrice: number; quantity: number }[],
  shippingCost: number,
  taxRate = DEFAULT_TAX_RATE,
  discountAmount = 0,
): PricingInput {
  return { items, shippingCost, taxRate, discountAmount };
}
