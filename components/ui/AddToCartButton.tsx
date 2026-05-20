"use client";
import { useState } from "react";
import { useCart } from "@/lib/cart";

interface Props {
  productId:   string;
  name:        string;
  image:       string;
  price:       number;
  slug:        string;
  variantId?:  string;
  size?:       string;
  color?:      string;
  outOfStock?: boolean;
}

export default function AddToCartButton({
  productId, name, image, price, slug,
  variantId, size, color, outOfStock,
}: Props) {
  const { addItem, isInCart } = useCart();
  const [added, setAdded]     = useState(false);

  const inCart = isInCart(productId, variantId);

  const handleClick = () => {
    if (outOfStock) return;
    addItem({ productId, variantId, name, image, price, size, color, slug });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (outOfStock) {
    return (
      <button
        disabled
        className="flex-1 bg-gray-200 text-gray-400 font-bold py-4 rounded-full cursor-not-allowed text-sm"
      >
        نفد المخزون
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`flex-1 font-bold py-4 rounded-full transition-all duration-300 text-sm ${
        added || inCart
          ? "bg-green-600 text-white"
          : "bg-black text-white hover:bg-gray-800"
      }`}
    >
      {added ? "✓ تمت الإضافة" : inCart ? "في السلة" : "أضف للسلة"}
    </button>
  );
}
