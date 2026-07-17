import type { PaymentProvider, PaymentOrder, PaymentResult, RefundResult } from "@/lib/types";

export class DummyPaymentProvider implements PaymentProvider {
  name = "dummy";

  async createOrder(order: PaymentOrder): Promise<PaymentResult> {
    const paymentId = `pay_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    return {
      success: true,
      paymentId,
      orderId: order.orderId,
      status: "captured",
    };
  }

  async verifyPayment(paymentId: string): Promise<PaymentResult> {
    return {
      success: true,
      paymentId,
      orderId: "",
      status: "captured",
    };
  }

  async refund(_paymentId: string, amount: number): Promise<RefundResult> {
    const refundId = `ref_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    return {
      success: true,
      refundId,
      paymentId: _paymentId,
      amount,
      status: "refunded",
    };
  }
}

let _provider: PaymentProvider | null = null;

export function getPaymentProvider(): PaymentProvider {
  if (!_provider) {
    _provider = new DummyPaymentProvider();
  }
  return _provider;
}
