"use client";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { useLang } from "@/lib/lang";

interface Props {
  productId:      string;
  name:           string;
  image:          string;
  price:          number;
  slug:           string;
  variantId?:     string;
  size?:          string;
  color?:         string;
  quantity?:      number;
  outOfStock?:    boolean;
  disabled?:      boolean;
  disabledLabel?: string;
  onClick?:       () => void;
}

export default function AddToCartButton({
  productId, name, image, price, slug,
  variantId, size, color, quantity, outOfStock, disabled, disabledLabel, onClick,
}: Props) {
  const { addItem, isInCart } = useCart();
  const { t } = useLang();
  const [added, setAdded]     = useState(false);

  const inCart = isInCart(productId, variantId);

  const handleClick = () => {
    if (outOfStock || disabled) return;
    if (onClick) {
      onClick();
      return;
    }

    addItem({
      productId,
      variantId,
      name,
      image,
      price,
      size,
      color,
      slug,
      quantity: quantity ?? 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (outOfStock) {
    return (
      <button
        type="button"
        disabled
        className="flex-1 bg-gray-200 text-gray-400 font-bold py-4 rounded-full cursor-not-allowed text-sm"
      >
        {t("outOfStock")}
      </button>
    );
  }

  if (disabled) {
    return (
      <button
        type="button"
        disabled
        className="flex-1 bg-gray-100 text-gray-500 font-bold py-4 rounded-full cursor-not-allowed text-sm border border-gray-200"
      >
        {disabledLabel || t("selectVariant")}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`flex-1 font-bold py-4 rounded-full transition-all duration-300 text-sm ${
        added || inCart
          ? "bg-green-600 text-white"
          : "bg-black text-white hover:bg-gray-800"
      }`}
    >
      {added ? t("addedToCart") : inCart ? t("inCart") : t("addToCart")}
    </button>
  );
}
