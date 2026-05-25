import type { HeroSlide } from "@/components/home/HeroSlider";
import type { Category } from "@/types";
import type { Lang } from "@/lib/i18n";
import { t } from "@/lib/i18n";

const HERO_BACKGROUNDS = [
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1600&q=80&auto=format&fit=crop",
];

const HERO_SUBTITLE_KEYS = ["heroSubtitle1", "heroSubtitle2", "heroSubtitle3"] as const;

const FALLBACK_TITLES_AR = ["مجموعة الصيف", "إكسسوارات فاخرة", "عروض خاصة"];
const FALLBACK_TITLES_EN = ["Summer Collection", "Luxury Accessories", "Special Offers"];

/** دائماً 3 شرائح — من الأقسام ثم احتياطي */
export function buildHeroSlides(
  categories: Category[],
  lang: Lang,
  heroSlides?: Array<{ id: string | number; title: string; subtitle: string; cta: string; href: string; bg: string }>
): HeroSlide[] {
  if (heroSlides && heroSlides.length > 0) {
    return heroSlides.slice(0, 3);
  }

  const slides: HeroSlide[] = [];

  categories.slice(0, 3).forEach((cat, i) => {
    slides.push({
      id:       cat.id,
      title:    cat.name,
      subtitle: t(HERO_SUBTITLE_KEYS[i], lang),
      cta:      i === 1 ? t("discover", lang) : t("shopNow", lang),
      href:     `/category/${cat.slug}`,
      bg:       cat.image || HERO_BACKGROUNDS[i],
    });
  });

  while (slides.length < 3) {
    const i = slides.length;
    slides.push({
      id:       `fallback-${i}`,
      title:    lang === "ar" ? FALLBACK_TITLES_AR[i] : FALLBACK_TITLES_EN[i],
      subtitle: t(HERO_SUBTITLE_KEYS[i], lang),
      cta:      i === 1 ? t("discover", lang) : t("shopNow", lang),
      href:     "/",
      bg:       HERO_BACKGROUNDS[i],
    });
  }

  return slides.slice(0, 3);
}
