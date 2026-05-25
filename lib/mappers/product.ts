// ============================================================
// lib/mappers/product.ts
// بتحول الـ API response للـ Frontend types
// ============================================================

import { ApiProduct, ApiCategory, ApiProductImage } from "@/lib/api";
import { Product, Category } from "@/types";
import type { Lang } from "@/lib/i18n";
import { normalizeImageUrl } from "@/lib/images";

function imageValue(image: string | ApiProductImage): string {
  if (typeof image === "string") return image;
  return image.image_url || image.image || image.url || image.src || "";
}

function imageOrder(image: string | ApiProductImage): number {
  if (typeof image === "string") return 999;
  return image.sort_order ?? image.display_order ?? image.order ?? 999;
}

function mapProductImages(api: ApiProduct): string[] {
  const rawImages: Array<string | ApiProductImage> = [api.image];

  if (Array.isArray(api.product_images)) {
    rawImages.push(
      ...api.product_images
        .slice()
        .sort((a, b) => imageOrder(a) - imageOrder(b))
    );
  }

  if (Array.isArray(api.images)) {
    rawImages.push(...api.images);
  }

  if (Array.isArray(api.variants)) {
    rawImages.push(
      ...api.variants
        .map((variant) => variant.image)
        .filter((image): image is string => typeof image === "string" && image.trim().length > 0)
    );
  }

  const allImages = rawImages
    .filter((src): src is string => typeof src === "string" && src.trim().length > 0)
    .map(normalizeImageUrl);

  return Array.from(new Set(allImages));
}

// ── Product mapper ────────────────────────────────────────────

export function mapProduct(api: ApiProduct): Product {
  // stockStatus من in_stock و low_stock
  let stockStatus: Product["stockStatus"];
  if (!api.in_stock) {
    stockStatus = "out_of_stock";
  } else if (api.low_stock) {
    stockStatus = "low_stock";
  } else {
    stockStatus = "in_stock";
  }

  const oldPrice =
    typeof api.compare_price === "number" && api.compare_price > api.price
      ? api.compare_price
      : undefined;

  return {
    id:           api.id,
    name:         api.name,
    slug:         (api.slug || api.id || "").trim(),
    category:     api.category,              // category_id until category map resolves it
    categorySlug: api.category,
    image:        normalizeImageUrl(api.image || ""),
    hasVariants:  api.has_variants || !!(api.available_sizes?.length || api.available_colors?.length),
    images:       mapProductImages(api),
    gallery:      mapProductImages(api),
    price:        api.price,
    oldPrice,
    remainingStock: api.remaining_stock,
    stockStatus,
    featured:     api.featured,
    bestSeller:   api.best_seller,
    lastPiece:    api.low_stock && api.in_stock && api.total_stock === 1,
    description:  api.description,
    sizes:        api.available_sizes,
    colors:       api.available_colors,
    variants:     (api.variants || []).map((variant) => ({
      ...variant,
      image: normalizeImageUrl(variant.image || ""),
    })),
  };
}

export function mapProducts(apiProducts: ApiProduct[]): Product[] {
  return apiProducts.map(mapProduct);
}

// ── Category mapper ───────────────────────────────────────────

export function mapCategory(api: ApiCategory, lang: Lang = "ar"): Category {
  const name =
    lang === "en"
      ? (api.name_en || api.name || api.name_ar)
      : (api.name_ar || api.name || api.name_en);
  return {
    id:          api.id,
    name,
    slug:        (api.slug || api.id || "").trim(),
    image:       normalizeImageUrl(api.image || ""),
    description: undefined,
  };
}

export function mapCategories(apiCategories: ApiCategory[], lang: Lang = "ar"): Category[] {
  return apiCategories.map((c) => mapCategory(c, lang));
}

// ── Category lookup helper ─────────────────────────────────────
// بيبني map من category_id → Category
// لحل مشكلة إن الـ API بيرجع "CAT-01" بدل الاسم

export function buildCategoryMap(apiCategories: ApiCategory[]): Map<string, ApiCategory> {
  const map = new Map<string, ApiCategory>();
  apiCategories.forEach((cat) => {
    map.set(cat.id, cat);
    if (cat.slug) map.set(cat.slug, cat);  // lookup by slug كمان
  });
  return map;
}

// بيعمل mapProduct مع تحديث category info من الـ map
export function mapProductWithCategory(
  api: ApiProduct,
  categoryMap: Map<string, ApiCategory>,
  lang: Lang = "ar"
): Product {
  const product     = mapProduct(api);
  const categoryData = categoryMap.get(api.category);

  if (categoryData) {
    product.category     = lang === "en"
      ? (categoryData.name_en || categoryData.name || categoryData.name_ar)
      : (categoryData.name_ar || categoryData.name || categoryData.name_en);
    product.categorySlug = categoryData.slug || api.category;
  }

  return product;
}

export function mapProductsWithCategories(
  apiProducts: ApiProduct[],
  categoryMap: Map<string, ApiCategory>,
  lang: Lang = "ar"
): Product[] {
  return apiProducts.map((p) => mapProductWithCategory(p, categoryMap, lang));
}
