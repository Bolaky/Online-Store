// app/category/[slug]/page.tsx

import { notFound } from "next/navigation";
import { getCategories, getProductsByCategory } from "@/lib/api.server";
import { getServerLang } from "@/lib/server-lang";
import { normalizeImageUrl } from "@/lib/images";
import { t } from "@/lib/i18n";
import {
  mapProductsWithCategories,
  mapCategories,
  buildCategoryMap,
} from "@/lib/mappers/product";
import ProductCard from "@/components/product/ProductCard";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

interface Props {
  params: { slug: string };
}

export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = await getServerLang();
  const apiCategories = await getCategories(lang).catch(() => []);
  const cat = apiCategories.find((c) => c.slug === params.slug);
  if (!cat) return { title: lang === "ar" ? "قسم غير موجود" : "Category not found" };
  const title = lang === "en"
    ? (cat.name_en || cat.name || cat.name_ar)
    : (cat.name_ar || cat.name || cat.name_en);
  return {
    title: `${title} | ${lang === "ar" ? "متجر" : "Store"}`,
    description: lang === "ar" ? cat.name_ar : cat.name_en || cat.name,
  };
}

export default async function CategoryPage({ params }: Props) {
  const lang = await getServerLang();
  const apiCategories = await getCategories(lang).catch(() => []);
  const category      = apiCategories.find((c) => c.slug === params.slug);

  if (!category) notFound();

  const categoryMap = buildCategoryMap(apiCategories);
  const rawProducts = await getProductsByCategory(category.id, lang).catch(() => []);
  const products    = mapProductsWithCategories(rawProducts, categoryMap, lang);
  const categories  = mapCategories(apiCategories, lang);
  const dir         = lang === "ar" ? "rtl" : "ltr";
  const catName     = lang === "en"
    ? (category.name_en || category.name || category.name_ar)
    : (category.name_ar || category.name || category.name_en);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        {category.image ? (
          <Image
            src={normalizeImageUrl(category.image)}
            alt={category.name}
            fill
            className="object-cover object-top"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gray-200" />
        )}
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center justify-center text-center text-white" dir={dir}>
          <div>
            <p className="text-sm tracking-widest uppercase text-white/70 mb-3">{t("section", lang)}</p>
            <h1
              className="text-4xl md:text-6xl font-black"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {catName}
            </h1>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4" dir={dir}>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-black transition-colors">{t("breadcrumbHome", lang)}</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{catName}</span>
        </div>
      </div>

      {/* Category nav tabs */}
      <div className="border-b border-gray-100 sticky top-16 md:top-20 z-30 bg-white/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-hide" dir={dir}>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className={`shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  cat.slug === params.slug
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" dir={dir}>
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500">{products.length} {t("products", lang)}</p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl font-bold text-gray-300 mb-3">{t("noProducts", lang)}</p>
            <Link
              href="/"
              className="inline-block bg-black text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              {t("breadcrumbHome", lang)}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
