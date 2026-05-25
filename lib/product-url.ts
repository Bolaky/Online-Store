/** مسار صفحة المنتج — يوفّر slug-only كعنوان عام. */
export function productPath(product: { slug?: string; id: string }): string {
  const slug = product.slug?.trim();
  const id = product.id.trim();
  if (slug && slug.length > 0) {
    return `/product/${encodeURIComponent(slug)}`;
  }
  return `/product/${encodeURIComponent(id)}`;
}

export function decodeProductParam(param: string): string {
  try {
    const decoded = decodeURIComponent(param);
    // support legacy fallback format `slug--id` by using the slug part only
    if (decoded.includes("--")) {
      return decoded.split("--")[0] || decoded;
    }
    return decoded;
  } catch {
    return param;
  }
}
