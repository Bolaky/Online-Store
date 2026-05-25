export const WISHLIST_KEY = "store_wishlist";

function normalizeWishlistItem(item: unknown): string {
  if (typeof item === "string") return item.trim();
  if (typeof item === "number" || typeof item === "boolean") return String(item).trim();
  if (item && typeof item === "object") {
    const obj = item as Record<string, unknown>;
    const candidate =
      obj.product_id || obj.productId || obj.id || obj.slug || obj.name;
    if (typeof candidate === "string") return candidate.trim();
    if (typeof candidate === "number") return String(candidate).trim();
  }
  return "";
}

export function getWishlist(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(WISHLIST_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map(normalizeWishlistItem)
      .filter((item) => item.length > 0);
  } catch {
    return [];
  }
}

export function addToWishlist(productId: string): string[] {
  const wishlist = getWishlist();
  if (!wishlist.includes(productId)) {
    wishlist.push(productId);
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  }
  return wishlist;
}

export function removeFromWishlist(productId: string): string[] {
  const wishlist = getWishlist().filter((id) => id !== productId);
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  return wishlist;
}

export function toggleWishlist(productId: string): { wishlist: string[]; added: boolean } {
  const wishlist = getWishlist();
  if (wishlist.includes(productId)) {
    return { wishlist: removeFromWishlist(productId), added: false };
  } else {
    return { wishlist: addToWishlist(productId), added: true };
  }
}

export function isInWishlist(productId: string): boolean {
  return getWishlist().includes(productId);
}
