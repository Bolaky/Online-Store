"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { normalizeImageUrl } from "@/lib/images";
import { useCart } from "@/lib/cart";
import { useLang } from "@/lib/lang";
import { productPath } from "@/lib/product-url";
import { formatCurrency } from "@/lib/utils";
import { DEFAULT_PLACEHOLDER_IMAGE_URL } from "@/lib/constants";

export default function CartDrawer() {
  const { items, count, total, removeItem, updateQty, clearCart } = useCart();
  const { lang } = useLang();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("cartItemAdded", handler);
    return () => window.removeEventListener("cartItemAdded", handler);
  }, []);

  return (
    <>
      {/* Cart icon trigger في الـ Navbar — هيتحكم فيه Navbar */}
      <button
        onClick={() => setOpen(true)}
        className="relative text-gray-700 hover:text-black transition-colors"
        aria-label="السلة"
        id="cart-trigger"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 14H4L5 9z" />
        </svg>
        {count > 0 && (
          <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-50"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-black text-gray-900">
            سلة الشراء
            {count > 0 && (
              <span className="mr-2 text-sm font-normal text-gray-500">({count} منتج)</span>
            )}
          </h2>
          <button
            onClick={() => setOpen(false)}
            className="text-gray-400 hover:text-black transition-colors text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <svg className="w-16 h-16 mx-auto text-gray-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 14H4L5 9z" />
              </svg>
              <p className="text-gray-400 text-sm">السلة فارغة</p>
              <button
                onClick={() => setOpen(false)}
                className="mt-4 text-sm text-black underline"
              >
                تصفح المنتجات
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={`${item.productId}_${item.variantId}`}
                className="flex gap-4 pb-4 border-b border-gray-50 last:border-0">
                {/* Image */}
                <Link href={productPath({ slug: item.slug, id: item.productId })} onClick={() => setOpen(false)}>
                  <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-gray-50 shrink-0">
                    <Image
                      src={normalizeImageUrl(item.image)}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Link
                    href={productPath({ slug: item.slug, id: item.productId })}
                    onClick={() => setOpen(false)}
                    className="text-sm font-semibold text-gray-900 hover:text-black line-clamp-2"
                  >
                    {item.name}
                  </Link>
                  {(item.size || item.color) && (
                    <p className="text-xs text-gray-400 mt-1">
                      {[item.color, item.size].filter(Boolean).join(" — ")}
                    </p>
                  )}
                  <p className="text-sm font-bold text-gray-900 mt-1">
                    {formatCurrency(item.price * item.quantity, lang)} {lang === "ar" ? "جنيه" : "EGP"}
                  </p>

                  {/* Qty controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQty(item.productId, item.variantId, item.quantity - 1)}
                      className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-black hover:text-black transition-colors text-lg leading-none"
                    >
                      −
                    </button>
                    <span className="text-sm font-medium w-5 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQty(item.productId, item.variantId, item.quantity + 1)}
                      className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-black hover:text-black transition-colors text-lg leading-none"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeItem(item.productId, item.variantId)}
                      className="mr-auto text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-gray-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">{lang === "ar" ? "الإجمالي" : "Total"}</span>
              <span className="text-xl font-black text-gray-900">
                {formatCurrency(total, lang)} {lang === "ar" ? "جنيه" : "EGP"}
              </span>
            </div>
            <Link
              href="/checkout"
              onClick={() => setOpen(false)}
              className="block w-full bg-black text-white text-center font-bold py-4 rounded-full hover:bg-gray-800 transition-colors text-sm"
            >
              إتمام الطلب
            </Link>
            <button
              onClick={clearCart}
              className="block w-full text-center text-xs text-gray-400 hover:text-red-500 transition-colors py-1"
            >
              إفراغ السلة
            </button>
          </div>
        )}
      </div>
    </>
  );
}
