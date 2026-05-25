import Link from "next/link";
import { getProducts } from "@/lib/api.server";
import { getCategories } from "@/lib/api.server";
import { getServerLang } from "@/lib/server-lang";
import {
  mapProductsWithCategories,
  buildCategoryMap,
  mapCategories,
} from "@/lib/mappers/product";
import ProductCard from "@/components/product/ProductCard";
import { t } from "@/lib/i18n";

interface Props {
  searchParams: { q?: string };
}

export const revalidate = 60;

export default async function SearchPage({ searchParams }: Props) {
  const lang  = await getServerLang();
  const query = (searchParams.q || "").trim();

  const [apiCategories, productsData] = await Promise.all([
    getCategories(lang).catch(() => []),
    query
      ? getProducts({ search: query, lang, limit: 48 }).catch(() => ({
          products: [],
          total: 0,
          page: 1,
          pages: 1,
        }))
      : Promise.resolve({ products: [], total: 0, page: 1, pages: 1 }),
  ]);

  const categoryMap = buildCategoryMap(apiCategories);
  const products    = mapProductsWithCategories(productsData.products, categoryMap, lang);
  const dir         = lang === "ar" ? "rtl" : "ltr";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" dir={dir}>
      <h1
        className="text-3xl font-black text-gray-900 mb-2"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        {t("search", lang)}
      </h1>
      {query && (
        <p className="text-gray-500 text-sm mb-8">
          {t("searchResultsFor", lang)} &quot;{query}&quot; — {products.length} {t("products", lang)}
        </p>
      )}

      {!query ? (
        <p className="text-gray-400 text-center py-16">{t("searchPlaceholder", lang)}</p>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-gray-400 mb-6">{t("noResults", lang)}</p>
          <Link
            href="/"
            className="inline-block bg-black text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            {t("home", lang)}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
