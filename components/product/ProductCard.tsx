"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types";
import { formatPrice, calcDiscount } from "@/lib/utils";
import { DEFAULT_PLACEHOLDER_IMAGE_URL } from "@/lib/constants";
import { toggleWishlist, isInWishlist } from "@/lib/wishlist";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [wishlisted, setWishlisted] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setWishlisted(isInWishlist(product.id));
  }, [product.id]);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    const { added } = toggleWishlist(product.id);
    setWishlisted(added);
    window.dispatchEvent(new Event("wishlistUpdate"));
  };

  const discount = product.oldPrice ? calcDiscount(product.price, product.oldPrice) : 0;

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative overflow-hidden rounded-2xl bg-gray-50 aspect-[3/4]">
        {/* Image */}
        <Image
          src={imgError ? DEFAULT_PLACEHOLDER_IMAGE_URL : product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setImgError(true)}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              -{discount}%
            </span>
          )}
          {product.bestSeller && (
            <span className="bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              الأكثر مبيعًا
            </span>
          )}
          {product.lastPiece && (
            <span className="bg-orange-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              آخر قطعة
            </span>
          )}
          {product.stockStatus === "out_of_stock" && (
            <span className="bg-gray-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              نفد المخزون
            </span>
          )}
        </div>

        {/* Wishlist button */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 left-3 w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center transition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100"
          aria-label="أضف للمفضلة"
        >
          <svg
            className={`w-4 h-4 transition-colors ${wishlisted ? "fill-red-500 text-red-500" : "fill-none text-gray-600"}`}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {/* Quick view hover bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white text-sm font-medium py-3 text-center translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          عرض سريع
        </div>
      </div>

      {/* Info */}
      <div className="mt-3 px-1" dir="rtl">
        <p className="text-xs text-gray-400 mb-1">{product.category}</p>
        <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-black transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 mt-2">
          <span className="font-bold text-gray-900 text-sm">{formatPrice(product.price)}</span>
          {product.oldPrice && (
            <span className="text-gray-400 line-through text-xs">{formatPrice(product.oldPrice)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
