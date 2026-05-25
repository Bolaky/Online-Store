import type { CartItem } from "@/lib/cart";
import type { CreateOrderItem } from "@/lib/api";
import type { Lang } from "@/lib/i18n";
import { formatCurrency } from "@/lib/utils";

export function cartToOrderItems(items: CartItem[]): CreateOrderItem[] {
  return items.map((item) => ({
    product_id: item.productId,
    qty:        item.quantity,
    ...(item.variantId ? { variant_id: item.variantId } : {}),
  }));
}

export function buildWhatsAppOrderMessage(opts: {
  lang:      Lang;
  orderId?:  string;
  total:     number;
  name:      string;
  phone:     string;
  secondaryPhone?: string;
  address:   string;
  notes?:    string;
  items:     CartItem[];
  shippingGovernorate?: string;
  shippingCity?: string;
  shippingCost?: number;
}): string {
  const {
    lang,
    orderId,
    total,
    name,
    phone,
    secondaryPhone,
    address,
    notes,
    items,
    shippingGovernorate,
    shippingCity,
    shippingCost,
  } = opts;

  const lines = items.map(
    (i) =>
      `• ${i.name}${i.size || i.color ? ` (${[i.color, i.size].filter(Boolean).join(", ")})` : ""} × ${i.quantity} = ${formatCurrency(i.price * i.quantity, lang)}`
  );

  const currency = lang === "ar" ? "جنيه" : "EGP";

  return [
    lang === "ar" ? "طلب جديد من المتجر:" : "New store order:",
    orderId
      ? (lang === "ar" ? `رقم الطلب: ${orderId}` : `Order #: ${orderId}`)
      : "",
    "",
    ...lines,
    "",
    lang === "ar"
      ? `الإجمالي: ${formatCurrency(total, lang)} ${currency}`
      : `Total: ${formatCurrency(total, lang)} ${currency}`,
    typeof shippingCost === "number"
      ? lang === "ar"
        ? `سعر الشحن: ${formatCurrency(shippingCost, lang)} ${currency}`
        : `Shipping cost: ${formatCurrency(shippingCost, lang)} ${currency}`
      : "",
    lang === "ar" ? `الاسم: ${name}` : `Name: ${name}`,
    lang === "ar" ? `الهاتف: ${phone}` : `Phone: ${phone}`,
    secondaryPhone
      ? lang === "ar"
        ? `هاتف ثانوي: ${secondaryPhone}`
        : `Secondary phone: ${secondaryPhone}`
      : "",
    lang === "ar" ? `العنوان: ${address}` : `Address: ${address}`,
    shippingGovernorate
      ? lang === "ar"
        ? `المحافظة: ${shippingGovernorate}`
        : `Governorate: ${shippingGovernorate}`
      : "",
    shippingCity
      ? lang === "ar"
        ? `المدينة: ${shippingCity}`
        : `City: ${shippingCity}`
      : "",
    notes ? (lang === "ar" ? `ملاحظات: ${notes}` : `Notes: ${notes}`) : "",
    lang === "ar"
      ? "أرجو تأكيد الطلب وموعد الشحن."
      : "Please confirm the order and shipping details.",
  ]
    .filter(Boolean)
    .join("\n");
}

export function openWhatsApp(phone: string, message: string) {
  const normalized = phone.replace(/\D/g, "");
  window.open(
    `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`,
    "_blank"
  );
}
