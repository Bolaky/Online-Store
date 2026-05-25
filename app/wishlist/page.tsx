"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { getWishlist } from "@/lib/wishlist";
import { getProductBySlug } from "@/lib/api";
import { Product } from "@/types";
import ProductCard from "@/components/product/ProductCard";
import { useLang } from "@/lib/lang";
import { mapProductWithCategory, buildCategoryMap } from "@/lib/mappers/product";
import { getCategories } from "@/lib/api";

export default function WishlistPage() {
  const { t, lang } = useLang();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading]   = useState(true);

  const loadWishlist = useCallback(async () => {
    const ids = getWishlist();
    if (ids.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [categoryList, ...productResults] = await Promise.all([
        getCategories(lang).catch(() => []),
        ...ids.map(async (id) => {
          const identifier = id.trim();
          const product = await getProductBySlug(identifier, lang).catch(() => null);
          if (product) return product;
          return getProductBySlug(identifier, lang === "ar" ? "en" : "ar").catch(() => null);
        }),
      ]);

      const categoryMap = buildCategoryMap(categoryList);
      const mapped = productResults
        .filter((p): p is NonNullable<typeof p> => p !== null)
        .map((api) => mapProductWithCategory(api, categoryMap, lang));

      setProducts(mapped);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [lang]);

  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  useEffect(() => {
    const refresh = () => loadWishlist();
    window.addEventListener("wishlistUpdate", refresh);
    return () => window.removeEventListener("wishlistUpdate", refresh);
  }, [loadWishlist]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" dir={lang === "ar" ? "rtl" : "ltr"}>
      <h1
        className="text-3xl font-black text-gray-900 mb-8"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        {t("wishlist")}
      </h1>

      {loading ? (
        <p className="text-gray-400 text-sm text-center py-16">...</p>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-gray-400 mb-6">{t("wishlistEmpty")}</p>
          <Link
            href="/"
            className="inline-block bg-black text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            {t("browseProducts")}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
