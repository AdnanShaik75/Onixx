import type { ShippingProvider, ShippingCalculation } from "@/lib/types";

const FREE_SHIPPING_THRESHOLD = 500000;

export class FlatRateShippingProvider implements ShippingProvider {
  name = "flat_rate";

  calculate(subtotal: number): ShippingCalculation {
    const cost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 999;
    return {
      provider: this.name,
      method: cost === 0 ? "Free Shipping" : "Standard Shipping",
      cost,
      estimatedDays: { min: 3, max: 7 },
    };
  }
}

let _provider: ShippingProvider | null = null;

export function getShippingProvider(): ShippingProvider {
  if (!_provider) {
    _provider = new FlatRateShippingProvider();
  }
  return _provider;
}
