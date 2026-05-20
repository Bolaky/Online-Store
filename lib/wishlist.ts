export const WISHLIST_KEY = "store_wishlist";

export function getWishlist(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(WISHLIST_KEY);
    return data ? JSON.parse(data) : [];
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
