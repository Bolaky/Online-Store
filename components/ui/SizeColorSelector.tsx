"use client";
import { useState } from "react";
import { ApiVariant } from "@/lib/api";
import { useLang } from "@/lib/lang";
import { formatPrice } from "@/lib/utils";

interface Props {
  sizes?: string[];
  colors?: string[];
  variants?: ApiVariant[];
}

export default function SizeColorSelector({ sizes, colors, variants }: Props) {
  const { lang } = useLang();
  const [selectedSize,  setSelectedSize]  = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  // لو عنده variants، نحسب الـ stock للـ combination المختارة
  const selectedVariant = variants?.find(
    (v) =>
      (!selectedSize  || v.size  === selectedSize) &&
      (!selectedColor || v.color === selectedColor)
  );

  const isOutOfStock = selectedVariant
    ? selectedVariant.stock_quantity === 0
    : false;

  if (!sizes?.length && !colors?.length) return null;

  return (
    <div className="flex flex-col gap-4">
      {/* Colors */}
      {colors && colors.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-gray-800 mb-3">
            اللون
            {selectedColor && (
              <span className="font-normal text-gray-500 mr-2">— {selectedColor}</span>
            )}
          </p>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(selectedColor === color ? null : color)}
                className={`px-4 py-2 border-2 rounded-full text-sm transition-all duration-200 ${
                  selectedColor === color
                    ? "border-black bg-black text-white"
                    : "border-gray-300 text-gray-700 hover:border-black"
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sizes */}
      {sizes && sizes.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-gray-800 mb-3">
            المقاس
            {selectedSize && (
              <span className="font-normal text-gray-500 mr-2">— {selectedSize}</span>
            )}
          </p>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(selectedSize === size ? null : size)}
                className={`px-4 py-2 border-2 rounded-full text-sm transition-all duration-200 ${
                  selectedSize === size
                    ? "border-black bg-black text-white"
                    : "border-gray-300 text-gray-700 hover:border-black"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Variant price لو اختلف عن السعر الأساسي */}
      {selectedVariant && selectedVariant.price > 0 && (
        <p className="text-sm text-gray-600">
          سعر هذا الاختيار:{" "}
          <span className="font-bold text-gray-900">
            {formatPrice(selectedVariant.price, lang)}
          </span>
          {selectedVariant.compare_price > 0 && selectedVariant.compare_price > selectedVariant.price && (
            <span className="line-through text-gray-400 mr-2 text-xs">
              {formatPrice(selectedVariant.compare_price, lang)}
            </span>
          )}
        </p>
      )}

      {isOutOfStock && (
        <p className="text-sm text-red-500 font-medium">هذا الاختيار غير متاح حالياً</p>
      )}
    </div>
  );
}
