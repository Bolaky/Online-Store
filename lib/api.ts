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
  compare_price?: number;
  category: string;          // category_id زي "CAT-01"
  image: string;
  images?: Array<string | ApiProductImage>;
  product_images?: Array<string | ApiProductImage>;
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

export interface ApiProductImage {
  product_id?: string;
  productId?: string;
  image?: string;
  image_url?: string;
  url?: string;
  src?: string;
  sort_order?: number;
  order?: number;
  display_order?: number;
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
  [key: string]: unknown;
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

export async function getProductBySlug(
  identifier: string,
  lang: "ar" | "en" = "ar"
): Promise<ApiProduct> {
  // Try slug lookup first; fallback to product_id only if slug fetch fails.
  try {
    const data = await apiFetch<{ success: boolean; product?: ApiProduct; data?: ApiProduct }>(
      "getProduct",
      { slug: identifier, lang }
    );
    const product = data.product || data.data;
    if (!product) throw new Error("Product not found");
    return product;
  } catch {
    const fallback = await apiFetch<{ success: boolean; product?: ApiProduct; data?: ApiProduct }>(
      "getProduct",
      { product_id: identifier, lang }
    );
    const product = fallback.product || fallback.data;
    if (!product) throw new Error("Product not found");
    return product;
  }
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
  const data = await getProducts({ in_stock: true, lang });
  return data.products;
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

// ── Orders ────────────────────────────────────────────────────

export interface CreateOrderItem {
  product_id:  string;
  qty:         number;
  variant_id?: string;
}

export interface CheckoutQuote {
  subtotal:     number;
  shipping_fee: number;
  cod_fee:      number;
  total:        number;
}

export type ShippingRatesPayload = unknown;

export interface CreateOrderInput {
  phone:                string;
  secondary_phone?:     string;
  address:              string;
  customer_name?:       string;
  notes?:               string;
  order_lang?:          "ar" | "en";
  source?:              string;
  shipping_governorate?: string;
  shipping_city?:        string;
  items:                CreateOrderItem[];
}

export interface CreateOrderResult {
  success:      boolean;
  order_id?:    string;
  subtotal?:    number;
  shipping_fee?: number;
  cod_fee?:     number;
  total?:       number;
  profit?:      number;
  error?:       string;
}

export async function getCheckoutQuote(
  items: CreateOrderItem[],
  governorate: string,
  city: string,
  lang: "ar" | "en" = "ar"
): Promise<CheckoutQuote> {
  const data = await apiFetch<{ success: boolean; quote: CheckoutQuote }>(
    "getCheckoutQuote",
    { items, governorate, city, lang }
  );
  return data.quote;
}

export async function getShippingRates(lang: "ar" | "en" = "ar"): Promise<ShippingRatesPayload> {
  const actions = ["getShippingRates", "getShippingOptions", "getShippingLocations"];

  for (const action of actions) {
    try {
      const data = await apiFetch<Record<string, unknown>>(action, { lang });
      return (
        data.shipping_rates ??
        data.shippingRates ??
        data.rates ??
        data.locations ??
        data.shipping_options ??
        data.data ??
        data
      );
    } catch {
      // Try the next common Apps Script action name.
    }
  }

  throw new Error("Shipping rates unavailable");
}

export async function createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
  const data = await apiFetch<CreateOrderResult & { success: boolean }>(
    "createOrder",
    {
      phone:                 input.phone,
      secondary_phone:       input.secondary_phone,
      address:               input.address,
      customer_name:         input.customer_name,
      notes:                 input.notes,
      order_lang:            input.order_lang || "ar",
      source:                input.source || "website",
      shipping_governorate:  input.shipping_governorate,
      shipping_city:         input.shipping_city,
      items:                 input.items,
    }
  );
  return data;
}

// ── Track view ────────────────────────────────────────────────

export async function trackView(productId: string, sessionId?: string): Promise<void> {
  try {
    await apiFetch("trackView", { product_id: productId, session_id: sessionId });
  } catch {
    // fire-and-forget — مش نوقف الصفحة لو فشل
  }
}
