// ============================================================
// lib/mappers/product.ts
// بتحول الـ API response للـ Frontend types
// ============================================================

import { ApiProduct, ApiCategory } from "@/lib/api";
import { Product, Category } from "@/types";
import { DEFAULT_PLACEHOLDER_IMAGE_URL } from "@/lib/constants";

// ── Product mapper ────────────────────────────────────────────

const GOOGLE_DRIVE_FILE_ID_RE = /(?:drive\.google\.com\/file\/d\/|drive\.google\.com\/open\?id=|drive\.google\.com\/uc\?id=)([a-zA-Z0-9_-]+)/;

function normalizeGoogleDriveUrl(url: string): string {
  if (!url) return DEFAULT_PLACEHOLDER_IMAGE_URL;
  const match = url.match(GOOGLE_DRIVE_FILE_ID_RE);
  if (!match) return url;
  return `https://drive.google.com/thumbnail?sz=w1000&id=${match[1]}`;
}

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

  // compare_price = أعلى سعر في الـ variants (لو موجود)
  let oldPrice: number | undefined;
  if (api.variants && api.variants.length > 0) {
    const comparePrices = api.variants
      .map((v) => v.compare_price || 0)
      .filter((p) => p > 0 && p > api.price);
    if (comparePrices.length > 0) {
      oldPrice = Math.max(...comparePrices);
    }
  }

  return {
    id:           api.id,
    name:         api.name,
    slug:         api.slug || api.id,
    category:     api.name || api.category,  // هيتحدث لو عندنا categories map
    categorySlug: api.category,              // category_id مؤقتاً — هيتحل بـ categories map
    image:        normalizeGoogleDriveUrl(api.image || DEFAULT_PLACEHOLDER_IMAGE_URL),
    images:       [],                        // هيجي من Product_Image endpoint لاحقاً
    price:        api.price,
    oldPrice,
    stockStatus,
    featured:     api.featured,
    bestSeller:   api.best_seller,
    lastPiece:    api.low_stock && api.in_stock && api.total_stock === 1,
    description:  api.description,
    sizes:        api.available_sizes,
    colors:       api.available_colors,
  };
}

export function mapProducts(apiProducts: ApiProduct[]): Product[] {
  return apiProducts.map(mapProduct);
}

// ── Category mapper ───────────────────────────────────────────

export function mapCategory(api: ApiCategory): Category {
  return {
    id:          api.id,
    name:        api.name,
    slug:        api.slug || api.id,
    image:       normalizeGoogleDriveUrl(api.image || DEFAULT_PLACEHOLDER_IMAGE_URL),
    description: undefined,
  };
}

export function mapCategories(apiCategories: ApiCategory[]): Category[] {
  return apiCategories.map(mapCategory);
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
  categoryMap: Map<string, ApiCategory>
): Product {
  const product     = mapProduct(api);
  const categoryData = categoryMap.get(api.category);

  if (categoryData) {
    product.category     = categoryData.name;
    product.categorySlug = categoryData.slug || api.category;
  }

  return product;
}

export function mapProductsWithCategories(
  apiProducts: ApiProduct[],
  categoryMap: Map<string, ApiCategory>
): Product[] {
  return apiProducts.map((p) => mapProductWithCategory(p, categoryMap));
}
