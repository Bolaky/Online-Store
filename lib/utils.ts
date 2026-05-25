import type { Lang } from "@/lib/i18n";

export function formatCurrency(value: number, lang: Lang = "ar"): string {
  return value.toLocaleString(lang === "ar" ? "ar-EG" : "en-US");
}

export function formatPrice(price: number, lang: Lang = "ar"): string {
  const currency = lang === "ar" ? "جنيه" : "EGP";
  return `${formatCurrency(price, lang)} ${currency}`;
}

export function calcDiscount(price: number, oldPrice: number): number {
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
