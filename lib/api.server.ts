// ============================================================
// lib/api.server.ts
// للـ Server Components فقط — بيكلم Apps Script مباشرة
// الـ API_SECRET محفوظ على السيرفر مش بيوصل للمتصفح
// ============================================================

import {
  ApiProduct,
  ApiCategory,
  ApiSettings,
  ProductsResponse,
  ProductFilters,
} from "@/lib/api";

const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL!;
const API_SECRET      = process.env.API_SECRET;

// ── Base fetcher ──────────────────────────────────────────────

async function serverFetch<T>(
  action: string,
  body?: Record<string, unknown>
): Promise<T> {
  if (!APPS_SCRIPT_URL) {
    console.warn("[API] APPS_SCRIPT_URL not set — returning empty data");
    throw new Error("APPS_SCRIPT_URL not configured");
  }

  const payload: Record<string, unknown> = { action, ...body };

  // Private actions تحتاج api_secret
  const PRIVATE = ["createOrder","cancelOrder","updateOrderStatus","getOrder","upsertCustomer"];
  if (PRIVATE.includes(action) && API_SECRET) {
    payload.api_secret = API_SECRET;
  }

  const res = await fetch(APPS_SCRIPT_URL, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(payload),
    next:    { revalidate: 60 },
  });

  if (!res.ok) throw new Error(`Apps Script HTTP ${res.status}`);

  const data = await res.json();
  if (data.success === false) throw new Error(data.error || "API error");

  return data as T;
}

// ── Products ──────────────────────────────────────────────────

export async function getProducts(
  filters?: ProductFilters
): Promise<ProductsResponse> {
  const data = await serverFetch<ProductsResponse & { success: boolean }>(
    "getProducts",
    { filters: filters || {}, lang: filters?.lang || "ar" }
  );
  return {
    products: Array.isArray(data.products) ? data.products : [],
    total:    data.total  ?? 0,
    page:     data.page   ?? 1,
    pages:    data.pages  ?? 1,
  };
}

export async function getProductBySlug(
  slug: string,
  lang: "ar" | "en" = "ar"
): Promise<ApiProduct> {
  const data = await serverFetch<{ success: boolean; product: ApiProduct }>(
    "getProduct",
    { slug, lang }
  );
  return data.product;
}

export async function getFeaturedProducts(
  lang: "ar" | "en" = "ar"
): Promise<ApiProduct[]> {
  const data = await getProducts({ featured: true, lang });
  return data.products;
}

export async function getBestSellers(
  lang: "ar" | "en" = "ar"
): Promise<ApiProduct[]> {
  const data = await getProducts({ best_seller: true, lang });
  return data.products;
}

export async function getLastPieces(
  lang: "ar" | "en" = "ar"
): Promise<ApiProduct[]> {
  const data = await getProducts({ in_stock: true, lang });
  return data.products.filter((p) => p.low_stock);
}

export async function getProductsByCategory(
  categoryId: string,
  lang: "ar" | "en" = "ar"
): Promise<ApiProduct[]> {
  const data = await getProducts({ category: categoryId, lang });
  return data.products;
}

// ── Categories ────────────────────────────────────────────────

export async function getCategories(
  lang: "ar" | "en" = "ar"
): Promise<ApiCategory[]> {
  const data = await serverFetch<{
    success: boolean;
    categories: ApiCategory[];
  }>("getCategories", { lang });
  return Array.isArray(data.categories) ? data.categories : [];
}

// ── Settings ─────────────────────────────────────────────────

export async function getSettings(
  lang: "ar" | "en" = "ar"
): Promise<ApiSettings> {
  const data = await serverFetch<{
    success: boolean;
    settings: ApiSettings;
  }>("getSettings", { lang });
  return typeof data.settings === "object" ? data.settings : {};
}
