// app/page.tsx — الصفحة الرئيسية بـ fetch حقيقي من الـ API

import HeroSlider from "@/components/home/HeroSlider";
import CategoriesSection from "@/components/home/CategoriesSection";
import FeatureStrip from "@/components/home/FeatureStrip";
import PromoBanner from "@/components/home/PromoBanner";
import ProductsGrid from "@/components/product/ProductsGrid";
import {
  getFeaturedProducts,
  getBestSellers,
  getLastPieces,
  getCategories,
} from "@/lib/api.server";
import {
  mapProductsWithCategories,
  mapCategories,
  buildCategoryMap,
} from "@/lib/mappers/product";

export const revalidate = 60; // ISR — بيتحدث كل دقيقة

export default async function HomePage() {
  // ── Fetch كل الداتا بالتوازي ─────────────────────────────
  const [featuredRaw, bestSellersRaw, lastPiecesRaw, apiCategories] =
    await Promise.all([
      getFeaturedProducts().catch(() => []),
      getBestSellers().catch(() => []),
      getLastPieces().catch(() => []),
      getCategories().catch(() => []),
    ]);

  const categoryMap  = buildCategoryMap(apiCategories);
  const featured     = mapProductsWithCategories(featuredRaw,    categoryMap);
  const bestSellers  = mapProductsWithCategories(bestSellersRaw, categoryMap);
  const lastPieces   = mapProductsWithCategories(lastPiecesRaw,  categoryMap);
  const categories   = mapCategories(apiCategories);

  return (
    <>
      {/* 1. Hero */}
      <HeroSlider />

      {/* 2. Trust strip */}
      <FeatureStrip />

      {/* 3. Categories */}
      <CategoriesSection categories={categories} />

      {/* 4. Featured */}
      {featured.length > 0 && (
        <ProductsGrid
          products={featured}
          title="المنتجات المميزة"
          subtitle="اختيارات بعناية لأجلك"
          limit={8}
        />
      )}

      {/* 5. Promo Banner */}
      <PromoBanner
        title="أناقتك تبدأ من هنا"
        subtitle="مجموعة محدودة"
        cta="تسوقي الآن"
        href={categories[0] ? `/category/${categories[0].slug}` : "/"}
        image="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80"
      />

      {/* 6. Best Sellers */}
      {bestSellers.length > 0 && (
        <ProductsGrid
          products={bestSellers}
          title="الأكثر مبيعًا"
          subtitle="أحبها عملاؤنا"
          limit={4}
        />
      )}

      {/* 7. Last Pieces */}
      {lastPieces.length > 0 && (
        <div className="bg-amber-50">
          <ProductsGrid
            products={lastPieces}
            title="⏳ آخر القطع"
            subtitle="لا تفوتها — كميات محدودة جداً"
            limit={4}
          />
        </div>
      )}
    </>
  );
}
