export function formatPrice(price: number): string {
  return `${price.toLocaleString("ar-EG")} جنيه`;
}

export function calcDiscount(price: number, oldPrice: number): number {
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
