const BRAND = "ONIXX";
const ACCENT = "#c9a96e";
const BG_DARK = "#0a0a0a";
const BG_CARD = "#141414";
const TEXT = "#fafafa";
const TEXT_MUTED = "#a0a0a0";
const BORDER = "#222222";

function wrap(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${BRAND}</title>
</head>
<body style="margin:0;padding:0;background-color:${BG_DARK};font-family:'Helvetica Neue',Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BG_DARK};">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="100%" style="max-width:600px;background-color:${BG_CARD};border-radius:12px;border:1px solid ${BORDER};">
          <tr>
            <td style="padding:40px 32px 0 32px;text-align:center;">
              <h1 style="margin:0 0 4px 0;font-size:28px;letter-spacing:6px;color:${ACCENT};font-weight:700;">${BRAND}</h1>
              <p style="margin:0 0 24px 0;font-size:12px;letter-spacing:4px;color:${TEXT_MUTED};text-transform:uppercase;">Timeless Craftsmanship</p>
              <div style="height:1px;background:linear-gradient(to right,transparent,${ACCENT},transparent);margin-bottom:32px;"></div>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 32px 32px;color:${TEXT};font-size:15px;line-height:1.7;">
              ${content}
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 32px 32px;">
              <div style="height:1px;background:linear-gradient(to right,transparent,${BORDER},transparent);margin-bottom:24px;"></div>
              <table role="presentation" width="100%">
                <tr>
                  <td style="text-align:center;color:${TEXT_MUTED};font-size:12px;line-height:1.8;">
                    <p style="margin:0 0 8px 0;font-size:13px;color:${ACCENT};letter-spacing:3px;font-weight:600;">${BRAND}</p>
                    <p style="margin:0 0 4px 0;">Timeless Craftsmanship, Delivered to Your Doorstep.</p>
                    <p style="margin:0 0 4px 0;">&copy; ${new Date().getFullYear()} ${BRAND}. All rights reserved.</p>
                    <p style="margin:0;font-size:11px;">You are receiving this email because you have an account with ${BRAND}.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function welcomeEmail(customerName: string): string {
  return wrap(`
    <h2 style="color:${ACCENT};font-size:20px;margin:0 0 16px 0;">Welcome to ${BRAND}, ${customerName}!</h2>
    <p style="margin:0 0 16px 0;">Thank you for joining the ${BRAND} family. We are delighted to have you with us.</p>
    <p style="margin:0 0 24px 0;">Explore our exclusive collection of premium timepieces, crafted for those who value precision, elegance, and timeless style.</p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 24px 0;">
      <tr>
        <td style="background-color:${ACCENT};border-radius:6px;text-align:center;">
          <a href="https://onixx.in/collections/all" style="display:inline-block;padding:14px 36px;color:${BG_DARK};text-decoration:none;font-size:14px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">Browse Collection</a>
        </td>
      </tr>
    </table>
    <p style="margin:0;color:${TEXT_MUTED};font-size:13px;">If you have any questions, simply reply to this email — we are always happy to help.</p>
  `);
}

export function passwordResetEmail(resetLink: string): string {
  return wrap(`
    <h2 style="color:${ACCENT};font-size:20px;margin:0 0 16px 0;">Reset Your Password</h2>
    <p style="margin:0 0 16px 0;">We received a request to reset the password for your ${BRAND} account.</p>
    <p style="margin:0 0 8px 0;">Click the button below to set a new password:</p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 24px 0;">
      <tr>
        <td style="background-color:${ACCENT};border-radius:6px;text-align:center;">
          <a href="${resetLink}" style="display:inline-block;padding:14px 36px;color:${BG_DARK};text-decoration:none;font-size:14px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">Reset Password</a>
        </td>
      </tr>
    </table>
    <p style="margin:0 0 16px 0;color:${TEXT_MUTED};font-size:13px;">This link will expire in <strong style="color:${ACCENT};}">1 hour</strong>. If you did not request a password reset, please ignore this email.</p>
    <p style="margin:0;color:${TEXT_MUTED};font-size:13px;">If the button does not work, copy and paste this URL into your browser:</p>
    <p style="margin:4px 0 0 0;font-size:12px;word-break:break-all;color:${ACCENT};">${resetLink}</p>
  `);
}

export function orderConfirmationEmail(
  orderNumber: string,
  customerName: string,
  items: { name: string; qty: number; price: number }[],
  total: number,
  shippingAddress: string,
): string {
  const rows = items
    .map(
      (item) => `
    <tr>
      <td style="padding:10px 8px;border-bottom:1px solid ${BORDER};color:${TEXT};font-size:14px;">${item.name}</td>
      <td style="padding:10px 8px;border-bottom:1px solid ${BORDER};color:${TEXT_MUTED};font-size:14px;text-align:center;">${item.qty}</td>
      <td style="padding:10px 8px;border-bottom:1px solid ${BORDER};color:${ACCENT};font-size:14px;text-align:right;">₹${item.price.toLocaleString("en-IN")}</td>
    </tr>`,
    )
    .join("");

  return wrap(`
    <h2 style="color:${ACCENT};font-size:20px;margin:0 0 8px 0;">Order Confirmed!</h2>
    <p style="margin:0 0 20px 0;color:${TEXT_MUTED};font-size:14px;">Thank you for your purchase, ${customerName}.</p>

    <p style="margin:0 0 4px 0;font-size:13px;color:${TEXT_MUTED};">Order Number</p>
    <p style="margin:0 0 20px 0;font-size:16px;font-weight:700;color:${TEXT};letter-spacing:1px;">${orderNumber}</p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 16px 0;">
      <thead>
        <tr>
          <th style="padding:10px 8px;border-bottom:2px solid ${ACCENT};color:${ACCENT};font-size:12px;letter-spacing:1px;text-transform:uppercase;text-align:left;">Item</th>
          <th style="padding:10px 8px;border-bottom:2px solid ${ACCENT};color:${ACCENT};font-size:12px;letter-spacing:1px;text-transform:uppercase;text-align:center;">Qty</th>
          <th style="padding:10px 8px;border-bottom:2px solid ${ACCENT};color:${ACCENT};font-size:12px;letter-spacing:1px;text-transform:uppercase;text-align:right;">Price</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
      <tfoot>
        <tr>
          <td colspan="2" style="padding:12px 8px 4px 8px;color:${TEXT_MUTED};font-size:14px;text-align:right;border-top:2px solid ${BORDER};"><strong>Total:</strong></td>
          <td style="padding:12px 8px 4px 8px;color:${ACCENT};font-size:18px;font-weight:700;text-align:right;border-top:2px solid ${BORDER};">₹${total.toLocaleString("en-IN")}</td>
        </tr>
      </tfoot>
    </table>

    <div style="margin:24px 0;padding:16px;background-color:${BG_DARK};border-radius:8px;border:1px solid ${BORDER};">
      <p style="margin:0 0 6px 0;font-size:12px;color:${TEXT_MUTED};text-transform:uppercase;letter-spacing:1px;">Shipping Address</p>
      <p style="margin:0;font-size:14px;color:${TEXT};line-height:1.6;">${shippingAddress}</p>
    </div>

    <p style="margin:0 0 24px 0;color:${TEXT_MUTED};font-size:13px;">We will send you a confirmation once your order has been dispatched.</p>

    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0;">
      <tr>
        <td style="background-color:${ACCENT};border-radius:6px;text-align:center;">
          <a href="https://onixx.in/account/orders" style="display:inline-block;padding:14px 36px;color:${BG_DARK};text-decoration:none;font-size:14px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">View Order</a>
        </td>
      </tr>
    </table>
  `);
}

export function orderShippedEmail(orderNumber: string, customerName: string, trackingUrl?: string): string {
  return wrap(`
    <h2 style="color:${ACCENT};font-size:20px;margin:0 0 8px 0;">Your Order Has Been Shipped!</h2>
    <p style="margin:0 0 20px 0;">Good news, ${customerName}! Your order is on its way.</p>

    <p style="margin:0 0 4px 0;font-size:13px;color:${TEXT_MUTED};">Order Number</p>
    <p style="margin:0 0 24px 0;font-size:16px;font-weight:700;color:${TEXT};letter-spacing:1px;">${orderNumber}</p>

    ${trackingUrl ? `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 24px 0;">
      <tr>
        <td style="background-color:${ACCENT};border-radius:6px;text-align:center;">
          <a href="${trackingUrl}" style="display:inline-block;padding:14px 36px;color:${BG_DARK};text-decoration:none;font-size:14px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">Track Your Order</a>
        </td>
      </tr>
    </table>
    ` : `<p style="margin:0 0 24px 0;color:${TEXT_MUTED};font-size:13px;">A tracking link will be shared with you shortly.</p>`}

    <p style="margin:0;color:${TEXT_MUTED};font-size:13px;">Expected delivery within 5–7 business days. We will notify you once it arrives.</p>
  `);
}

export function orderDeliveredEmail(orderNumber: string, customerName: string): string {
  return wrap(`
    <h2 style="color:${ACCENT};font-size:20px;margin:0 0 8px 0;">Delivered!</h2>
    <p style="margin:0 0 16px 0;">Hi ${customerName}, your order has been delivered successfully.</p>

    <p style="margin:0 0 4px 0;font-size:13px;color:${TEXT_MUTED};">Order Number</p>
    <p style="margin:0 0 24px 0;font-size:16px;font-weight:700;color:${TEXT};letter-spacing:1px;">${orderNumber}</p>

    <p style="margin:0 0 16px 0;">We hope you love your new timepiece. If you have a moment, we would love to hear your thoughts.</p>

    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 24px 0;">
      <tr>
        <td style="background-color:${ACCENT};border-radius:6px;text-align:center;">
          <a href="https://onixx.in/account/orders" style="display:inline-block;padding:14px 36px;color:${BG_DARK};text-decoration:none;font-size:14px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">Leave a Review</a>
        </td>
      </tr>
    </table>

    <p style="margin:0;color:${TEXT_MUTED};font-size:13px;">Thank you for shopping with ${BRAND}. We look forward to serving you again!</p>
  `);
}

export function orderCancelledEmail(orderNumber: string, customerName: string, reason?: string): string {
  return wrap(`
    <h2 style="color:${ACCENT};font-size:20px;margin:0 0 8px 0;">Order Cancelled</h2>
    <p style="margin:0 0 16px 0;">Hi ${customerName}, your order has been cancelled as requested.</p>

    <p style="margin:0 0 4px 0;font-size:13px;color:${TEXT_MUTED};">Order Number</p>
    <p style="margin:0 0 16px 0;font-size:16px;font-weight:700;color:${TEXT};letter-spacing:1px;">${orderNumber}</p>

    ${reason ? `<p style="margin:0 0 16px 0;color:${TEXT_MUTED};font-size:14px;">Reason: ${reason}</p>` : ""}

    <p style="margin:0 0 8px 0;">Any amount charged will be refunded to your original payment method within 5–7 business days.</p>
    <p style="margin:0;color:${TEXT_MUTED};font-size:13px;">If you have any questions, please reach out to our support team. We are always happy to assist.</p>
  `);
}

export function orderReturnEmail(orderNumber: string, customerName: string, status: string): string {
  return wrap(`
    <h2 style="color:${ACCENT};font-size:20px;margin:0 0 8px 0;">Return Status Update</h2>
    <p style="margin:0 0 16px 0;">Hi ${customerName}, here is the latest status on your return request.</p>

    <p style="margin:0 0 4px 0;font-size:13px;color:${TEXT_MUTED};">Order Number</p>
    <p style="margin:0 0 8px 0;font-size:16px;font-weight:700;color:${TEXT};letter-spacing:1px;">${orderNumber}</p>

    <div style="margin:16px 0 24px 0;padding:16px;background-color:${BG_DARK};border-radius:8px;border:1px solid ${BORDER};text-align:center;">
      <p style="margin:0 0 4px 0;font-size:12px;color:${TEXT_MUTED};text-transform:uppercase;letter-spacing:1px;">Return Status</p>
      <p style="margin:0;font-size:18px;font-weight:700;color:${ACCENT};">${status}</p>
    </div>

    <p style="margin:0;color:${TEXT_MUTED};font-size:13px;">We will keep you posted as your return progresses. If you have any questions, feel free to contact us.</p>
  `);
}

export function lowStockAdminEmail(productName: string, currentStock: number): string {
  return wrap(`
    <h2 style="color:${ACCENT};font-size:20px;margin:0 0 16px 0;">Low Stock Alert</h2>

    <div style="margin:0 0 16px 0;padding:16px;background-color:${BG_DARK};border-radius:8px;border:1px solid ${BORDER};">
      <p style="margin:0 0 8px 0;font-size:12px;color:${TEXT_MUTED};text-transform:uppercase;letter-spacing:1px;">Product</p>
      <p style="margin:0 0 16px 0;font-size:16px;font-weight:700;color:${TEXT};">${productName}</p>
      <p style="margin:0 0 4px 0;font-size:12px;color:${TEXT_MUTED};text-transform:uppercase;letter-spacing:1px;">Current Stock</p>
      <p style="margin:0;font-size:24px;font-weight:700;color:${currentStock <= 0 ? "#ef4444" : "#f59e0b"};">${currentStock}</p>
    </div>

    <p style="margin:0;color:${TEXT_MUTED};font-size:13px;">Please restock this item at the earliest to avoid lost sales.</p>
  `);
}

export function newOrderAdminEmail(orderNumber: string, customerName: string, total: number): string {
  return wrap(`
    <h2 style="color:${ACCENT};font-size:20px;margin:0 0 16px 0;">New Order Received</h2>

    <p style="margin:0 0 4px 0;font-size:13px;color:${TEXT_MUTED};">Order Number</p>
    <p style="margin:0 0 4px 0;font-size:16px;font-weight:700;color:${TEXT};letter-spacing:1px;">${orderNumber}</p>

    <p style="margin:0 0 4px 0;font-size:13px;color:${TEXT_MUTED};">Customer</p>
    <p style="margin:0 0 16px 0;font-size:16px;font-weight:600;color:${TEXT};">${customerName}</p>

    <div style="margin:0 0 24px 0;padding:16px;background-color:${BG_DARK};border-radius:8px;border:1px solid ${BORDER};text-align:center;">
      <p style="margin:0 0 4px 0;font-size:12px;color:${TEXT_MUTED};text-transform:uppercase;letter-spacing:1px;">Order Total</p>
      <p style="margin:0;font-size:28px;font-weight:700;color:${ACCENT};">₹${total.toLocaleString("en-IN")}</p>
    </div>

    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0;">
      <tr>
        <td style="background-color:${ACCENT};border-radius:6px;text-align:center;">
          <a href="https://onixx.in/admin/orders/${orderNumber}" style="display:inline-block;padding:14px 36px;color:${BG_DARK};text-decoration:none;font-size:14px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">View in Admin</a>
        </td>
      </tr>
    </table>
  `);
}
