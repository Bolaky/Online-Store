// app/page.tsx — Homepage using single getHomepageData call.
// ✅ 1 API call instead of 5 separate calls (quota-efficient)

import HeroSlider        from "@/components/home/HeroSlider";
import CategoriesSection from "@/components/home/CategoriesSection";
import FeatureStrip      from "@/components/home/FeatureStrip";
import PromoBanner       from "@/components/home/PromoBanner";
import ProductsGrid      from "@/components/product/ProductsGrid";
import AnnouncementBar   from "@/components/layout/AnnouncementBar";
import { getHomepageData } from "@/lib/api.server";
import {
  mapProductsWithCategories,
  mapCategories,
  buildCategoryMap,
} from "@/lib/mappers/product";
import { getServerLang }    from "@/lib/server-lang";
import { t }                from "@/lib/i18n";
import { buildHeroSlides }  from "@/lib/hero-slides";
import { parseStoreSettings } from "@/lib/store-settings";
import type { ApiSettings } from "@/lib/api";

export const revalidate = 60;

export default async function HomePage() {
  const lang = await getServerLang();

  // ✅ Single call — replaces 5 separate API calls
  const homepage = await getHomepageData(lang).catch(() => ({
    settings:     {} as ApiSettings,
    categories:   [],
    hero:         [],
    offers:       [],
    featured:     [],
    best_sellers: [],
    last_pieces:  [],
  }));

  const settings    = parseStoreSettings(homepage.settings as ApiSettings, lang);
  const categoryMap = buildCategoryMap(homepage.categories);
  const categories  = mapCategories(homepage.categories, lang);
  const featured    = mapProductsWithCategories(homepage.featured,     categoryMap, lang);
  const bestSellers = mapProductsWithCategories(homepage.best_sellers, categoryMap, lang);
  const lastPieces  = mapProductsWithCategories(homepage.last_pieces,  categoryMap, lang);

  // Hero slides: prefer Hero_sections sheet, fallback to categories
  const heroSlides = buildHeroSlides(
    categories,
    lang,
    homepage.hero.length > 0
      ? homepage.hero.map((h) => ({
          id:       h.id,
          title:    h.title,
          subtitle: h.subtitle,
          cta:      h.button_text || t("shopNow", lang),
          href:     h.link || "/",
          bg:       h.image,
        }))
      : settings.heroSlides
  );

  return (
    <>
      {/* Offers bar — dynamic from Offers_Annoncement sheet */}
      {homepage.offers.length > 0 && (
        <AnnouncementBar
          offers={homepage.offers}
          message={settings.announcement}
        />
      )}
      {homepage.offers.length === 0 && settings.announcement && (
        <AnnouncementBar message={settings.announcement} />
      )}

      <HeroSlider slides={heroSlides} />
      <FeatureStrip />
      <CategoriesSection categories={categories} title={t("shopByCategory", lang)} />

      {featured.length > 0 && (
        <ProductsGrid
          products={featured}
          title={t("featured", lang)}
          subtitle={t("featuredSub", lang)}
          limit={8}
        />
      )}

      {bestSellers.length > 0 && (
        <ProductsGrid
          products={bestSellers}
          title={t("bestSellers", lang)}
          subtitle={t("bestSellersSub", lang)}
          limit={4}
        />
      )}

      {lastPieces.length > 0 && (
        <div className="bg-amber-50">
          <ProductsGrid
            products={lastPieces}
            title={t("lastPieces", lang)}
            subtitle={t("lastPiecesSub", lang)}
            limit={4}
          />
        </div>
      )}

      <PromoBanner
        title={settings.storeTagline || (lang === "ar" ? "أناقتك تبدأ من هنا" : "Your style starts here")}
        subtitle={lang === "ar" ? "مجموعة محدودة" : "Limited collection"}
        cta={t("shopNow", lang)}
        href={categories[0] ? `/category/${categories[0].slug}` : "/"}
        image="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop"
      />
    </>
  );
}
