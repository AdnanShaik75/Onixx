import type { EmailProvider, EmailMessage, OrderItem } from "@/lib/types";

export class ConsoleEmailProvider implements EmailProvider {
  name = "console";

  async send(message: EmailMessage): Promise<{ success: boolean; error?: string }> {
    if (process.env.NODE_ENV === "production") {
      return { success: true };
    }
    console.log("[Email] To:", message.to);
    console.log("[Email] Subject:", message.subject);
    console.log("[Email] Body:", message.text || message.html);
    return { success: true };
  }
}

let _provider: EmailProvider | null = null;

export function getEmailProvider(): EmailProvider {
  if (!_provider) {
    _provider = new ConsoleEmailProvider();
  }
  return _provider;
}

export function orderConfirmationHtml(orderNumber: string, items: OrderItem[], total: number): string {
  const rows = items.map(i => `
    <tr>
      <td>${i.productName}</td>
      <td>${i.sku}</td>
      <td>${i.quantity}</td>
      <td>₹${i.unitPrice.toLocaleString("en-IN")}</td>
      <td>₹${i.lineTotal.toLocaleString("en-IN")}</td>
    </tr>
  `).join("");
  return `
    <h2>Order Confirmed</h2>
    <p>Thank you for your order <strong>${orderNumber}</strong>.</p>
    <table>
      <thead><tr><th>Item</th><th>SKU</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <p><strong>Total: ₹${total.toLocaleString("en-IN")}</strong></p>
  `;
}

export function orderStatusHtml(orderNumber: string, status: string): string {
  return `
    <h2>Order Status Update</h2>
    <p>Your order <strong>${orderNumber}</strong> is now <strong>${status}</strong>.</p>
  `;
}
