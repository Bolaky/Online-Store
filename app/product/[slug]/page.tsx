// app/product/[slug]/page.tsx

import { notFound } from "next/navigation";
import { getProductBySlug, getProductsByCategory, getCategories } from "@/lib/api.server";
import {
  mapProduct,
  mapProductsWithCategories,
  buildCategoryMap,
} from "@/lib/mappers/product";
import { formatPrice, calcDiscount } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/product/ProductCard";
import StockBadge from "@/components/ui/StockBadge";
import WishlistToggle from "@/components/ui/WishlistToggle";
import SizeColorSelector from "@/components/ui/SizeColorSelector";
import TrackView from "@/components/ui/TrackView";
import type { Metadata } from "next";

interface Props {
  params: { slug: string };
}

export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const api = await getProductBySlug(params.slug).catch(() => null);
  if (!api) return { title: "منتج غير موجود" };
  return {
    title: `${api.name} | متجر`,
    description: api.short_desc || api.description,
  };
}

export default async function ProductPage({ params }: Props) {
  const [apiProduct, apiCategories] = await Promise.all([
    getProductBySlug(params.slug).catch(() => null),
    getCategories().catch(() => []),
  ]);

  if (!apiProduct) notFound();

  const categoryMap = buildCategoryMap(apiCategories);
  const product     = mapProduct(apiProduct);

  // تصحيح category name و slug من الـ map
  const catData = categoryMap.get(apiProduct.category);
  if (catData) {
    product.category     = catData.name;
    product.categorySlug = catData.slug || apiProduct.category;
  }

  // Related products
  const rawRelated = await getProductsByCategory(apiProduct.category).catch(() => []);
  const related    = mapProductsWithCategories(
    rawRelated.filter((p) => p.id !== apiProduct.id).slice(0, 4),
    categoryMap
  );

  const discount = product.oldPrice
    ? calcDiscount(product.price, product.oldPrice)
    : 0;

  // WhatsApp number من Settings (هنضيفه لاحقاً مع getSettings)
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP || "201000000000";

  return (
    <div className="min-h-screen" dir="rtl">
      {/* TrackView — client component بيعمل trackView call */}
      <TrackView productId={apiProduct.id} />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-black transition-colors">الرئيسية</Link>
          <span>/</span>
          <Link href={`/category/${product.categorySlug}`} className="hover:text-black transition-colors">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium line-clamp-1">{product.name}</span>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">

          {/* Images */}
          <div className="space-y-3">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-gray-50">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {discount > 0 && (
                <div className="absolute top-4 right-4 bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-full">
                  -{discount}%
                </div>
              )}
              {product.lastPiece && (
                <div className="absolute top-4 left-4 bg-orange-600 text-white text-sm font-bold px-3 py-1.5 rounded-full">
                  آخر قطعة!
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col gap-5">
            <div>
              <Link
                href={`/category/${product.categorySlug}`}
                className="text-xs text-gray-500 uppercase tracking-widest hover:text-black transition-colors"
              >
                {product.category}
              </Link>
              <h1
                className="text-3xl md:text-4xl font-black text-gray-900 mt-2 leading-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {product.name}
              </h1>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-2xl font-black text-gray-900">{formatPrice(product.price)}</span>
              {product.oldPrice && (
                <>
                  <span className="text-gray-400 line-through text-lg">{formatPrice(product.oldPrice)}</span>
                  <span className="bg-red-100 text-red-600 text-sm font-bold px-2.5 py-0.5 rounded-full">
                    وفر {formatPrice(product.oldPrice - product.price)}
                  </span>
                </>
              )}
            </div>

            {/* Stock */}
            <StockBadge status={product.stockStatus} />

            {/* Description */}
            {product.description && (
              <p className="text-gray-600 leading-relaxed text-sm">{product.description}</p>
            )}

            {/* Size / Color selector — client component */}
            <SizeColorSelector
              sizes={product.sizes}
              colors={product.colors}
              variants={apiProduct.variants}
            />

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <button
                disabled={product.stockStatus === "out_of_stock"}
                className="flex-1 bg-black text-white font-bold py-4 rounded-full hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
              >
                {product.stockStatus === "out_of_stock" ? "نفد المخزون" : "أضف للسلة"}
              </button>
              <WishlistToggle productId={product.id} />
            </div>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/${whatsappNumber}?text=أريد طلب: ${product.name} - السعر: ${formatPrice(product.price)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 bg-[#25D366] text-white font-semibold py-3.5 rounded-full hover:bg-[#128C7E] transition-colors text-sm"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.113.549 4.094 1.512 5.816L.057 23.852a.75.75 0 00.916.927l6.184-1.621A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.693-.528-5.217-1.444l-.374-.223-3.876 1.016 1.036-3.773-.243-.389A9.96 9.96 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/>
              </svg>
              اطلب عبر واتساب
            </a>

            {/* Trust badges */}
            <div className="flex items-center gap-4 text-xs text-gray-500 pt-2 border-t border-gray-100">
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                شحن سريع
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                إرجاع مجاني 14 يوم
              </span>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-16">
            <div className="text-center mb-8">
              <h2
                className="text-2xl md:text-3xl font-black text-gray-900"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                منتجات مشابهة
              </h2>
              <div className="w-10 h-0.5 bg-black mx-auto mt-3" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
