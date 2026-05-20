// ============================================================
// lib/api.ts — كل calls للـ API بتمر من هنا
// الـ Frontend بيكلم /api/... (Next.js Route Handlers)
// اللي بدوره بيكلم الـ Apps Script بـ API_SECRET سيرفر فقط
// ============================================================

// ── Types ─────────────────────────────────────────────────────

export interface ApiProduct {
  id: string;
  sku: string;
  name: string;
  price: number;
  category: string;          // category_id زي "CAT-01"
  image: string;
  in_stock: boolean;
  has_variants: boolean;
  total_stock: number;
  remaining_stock: number;
  low_stock: boolean;
  featured: boolean;
  best_seller: boolean;
  variants: ApiVariant[];
  available_colors?: string[];
  available_sizes?: string[];
  rating: number;
  rating_count: number;
  short_desc: string;
  brand: string;
  slug: string;
  views_count: number;
  favorites_count: number;
  cart_count: number;
  orders_count: number;
  revenue_total: number;
  // تفاصيل (getProduct فقط)
  description?: string;
  tags?: string;
  weight?: string;
  dimensions?: string;
  seo_title?: string;
  seo_description?: string;
  last_order_at?: string;
  last_view_at?: string;
}

export interface ApiVariant {
  variant_id: string;
  sku: string;
  color: string;
  size: string;
  price: number;
  compare_price: number;
  stock_quantity: number;
  image: string;
  in_stock: boolean;
}

export interface ApiCategory {
  id: string;
  name: string;
  name_ar: string;
  name_en: string;
  slug: string;
  image: string;
  parent_id: string | null;
  sort_order: number;
}

export interface ApiSettings {
  store_name?: string;
  store_tagline?: string;
  whatsapp?: string;
  support_email?: string;
  facebook_url?: string;
  instagram_url?: string;
  logo_url?: string;
  favicon_url?: string;
  [key: string]: string | undefined;
}

export interface ProductsResponse {
  products: ApiProduct[];
  total: number;
  page: number;
  pages: number;
}

export interface ProductFilters {
  category?: string;
  brand?: string;
  search?: string;
  featured?: boolean;
  best_seller?: boolean;
  in_stock?: boolean;
  page?: number;
  limit?: number;
  lang?: "ar" | "en";
}

// ── Base fetcher ──────────────────────────────────────────────

async function apiFetch<T>(action: string, body?: Record<string, unknown>): Promise<T> {
  const res = await fetch("/api/store", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, ...body }),
    next: { revalidate: 0 },
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const data = await res.json();
  if (!data.success) throw new Error(data.error || "API error");

  return data as T;
}

// ── Products ──────────────────────────────────────────────────

export async function getProducts(filters?: ProductFilters): Promise<ProductsResponse> {
  const data = await apiFetch<ProductsResponse & { success: boolean }>(
    "getProducts",
    { filters: filters || {}, lang: filters?.lang || "ar" }
  );
  // ✅ defensive: نضمن إن products دايماً array
  return {
    products: Array.isArray(data.products) ? data.products : [],
    total:    data.total  ?? 0,
    page:     data.page   ?? 1,
    pages:    data.pages  ?? 1,
  };
}

export async function getProductBySlug(slug: string, lang: "ar" | "en" = "ar"): Promise<ApiProduct> {
  const data = await apiFetch<{ success: boolean; product: ApiProduct }>(
    "getProduct",
    { slug, lang }
  );
  return data.product;
}

export async function getFeaturedProducts(lang: "ar" | "en" = "ar"): Promise<ApiProduct[]> {
  const data = await getProducts({ featured: true, lang });
  return data.products;
}

export async function getBestSellers(lang: "ar" | "en" = "ar"): Promise<ApiProduct[]> {
  const data = await getProducts({ best_seller: true, lang });
  return data.products;
}

export async function getLastPieces(lang: "ar" | "en" = "ar"): Promise<ApiProduct[]> {
  // آخر القطع = low_stock + in_stock
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

export async function getCategories(lang: "ar" | "en" = "ar"): Promise<ApiCategory[]> {
  const data = await apiFetch<{ success: boolean; categories: ApiCategory[]; total: number }>(
    "getCategories",
    { lang }
  );
  // ✅ defensive: نضمن إن categories دايماً array
  return Array.isArray(data.categories) ? data.categories : [];
}

// ── Settings ─────────────────────────────────────────────────

export async function getSettings(lang: "ar" | "en" = "ar"): Promise<ApiSettings> {
  const data = await apiFetch<{ success: boolean; settings: ApiSettings }>(
    "getSettings",
    { lang }
  );
  // ✅ defensive: نضمن إن settings دايماً object
  return (data.settings && typeof data.settings === "object") ? data.settings : {};
}

// ── Track view ────────────────────────────────────────────────

export async function trackView(productId: string, sessionId?: string): Promise<void> {
  try {
    await apiFetch("trackView", { product_id: productId, session_id: sessionId });
  } catch {
    // fire-and-forget — مش نوقف الصفحة لو فشل
  }
}
