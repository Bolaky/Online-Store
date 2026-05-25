// ============================================================
// lib/api.server.ts
// Server Components ONLY — calls Apps Script directly.
// API_SECRET never exposed to browser.
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

// ── Homepage — single call (quota-efficient) ──────────────────

export interface ApiHeroSection {
  id:          string;
  title:       string;
  subtitle:    string;
  button_text: string;
  image:       string;
  link:        string;
  sort_order:  number;
}

export interface ApiOffer {
  id:         string;
  content:    string;
  link:       string;
  bg_color:   string;
  text_color: string;
  priority:   number;
}

export interface HomepageData {
  settings:     ApiSettings;
  categories:   ApiCategory[];
  hero:         ApiHeroSection[];
  offers:       ApiOffer[];
  featured:     ApiProduct[];
  best_sellers: ApiProduct[];
  last_pieces:  ApiProduct[];
}

export async function getHomepageData(
  lang: "ar" | "en" = "ar"
): Promise<HomepageData> {
  const data = await serverFetch<{ success: boolean; data: HomepageData }>(
    "getHomepageData",
    { lang, featured_limit: 8, best_seller_limit: 8, last_pieces_limit: 6 }
  );
  const d = data.data || {} as Partial<HomepageData>;
  return {
    settings:     (d.settings && typeof d.settings === "object") ? d.settings : {},
    categories:   Array.isArray(d.categories)   ? d.categories   : [],
    hero:         Array.isArray(d.hero)          ? d.hero         : [],
    offers:       Array.isArray(d.offers)        ? d.offers       : [],
    featured:     Array.isArray(d.featured)      ? d.featured     : [],
    best_sellers: Array.isArray(d.best_sellers)  ? d.best_sellers : [],
    last_pieces:  Array.isArray(d.last_pieces)   ? d.last_pieces  : [],
  };
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
  identifier: string,
  lang: "ar" | "en" = "ar"
): Promise<ApiProduct> {
  try {
    const data = await serverFetch<{ success: boolean; data?: ApiProduct; product?: ApiProduct }>(
      "getProduct",
      { slug: identifier, lang }
    );
    const product = (data as any).data || (data as any).product;
    if (product) return product;
  } catch {
    // fallback below
  }

  const fallback = await serverFetch<{ success: boolean; data?: ApiProduct; product?: ApiProduct }>(
    "getProduct",
    { product_id: identifier, lang }
  );
  const product = (fallback as any).data || (fallback as any).product;
  if (!product) throw new Error("Product not found");
  return product;
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
  // ✅ Backend filters low_stock — frontend does NOT derive this
  const data = await getProducts({ in_stock: true, lang });
  return data.products.filter((p) => p.low_stock === true);
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
  return (data.settings && typeof data.settings === "object") ? data.settings : {};
}
