"use client";
import { useState, useEffect } from "react";
import { toggleWishlist, isInWishlist } from "@/lib/wishlist";
import { useLang } from "@/lib/lang";

interface WishlistToggleProps {
  productId: string;
  iconOnly?: boolean;
}

export default function WishlistToggle({ productId, iconOnly = false }: WishlistToggleProps) {
  const [wishlisted, setWishlisted] = useState(false);
  const { t } = useLang();

  useEffect(() => {
    setWishlisted(isInWishlist(productId));
  }, [productId]);

  const handle = () => {
    const { added } = toggleWishlist(productId);
    setWishlisted(added);
    window.dispatchEvent(new Event("wishlistUpdate"));
  };

  if (iconOnly) {
    return (
      <button
        type="button"
        onClick={handle}
        className={`w-11 h-11 flex items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 transition-colors hover:bg-gray-100 ${
          wishlisted ? "text-red-500" : ""
        }`}
        aria-label={wishlisted ? t("inWishlist") : t("addToWishlist")}
      >
        <svg
          className={`w-5 h-5 transition-colors ${wishlisted ? "fill-red-500 text-red-500" : "fill-none text-current"}`}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handle}
      className={`flex items-center gap-2 px-6 py-3.5 rounded-full border-2 font-semibold text-sm transition-all duration-300 ${
        wishlisted
          ? "border-red-500 bg-red-50 text-red-600"
          : "border-gray-300 text-gray-700 hover:border-black hover:text-black"
      }`}
    >
      <svg
        className={`w-4 h-4 transition-colors ${wishlisted ? "fill-red-500 text-red-500" : "fill-none text-current"}`}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
      {wishlisted ? t("inWishlist") : t("addToWishlist")}
    </button>
  );
}
