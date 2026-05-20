import { Product } from "@/types";
import ProductCard from "./ProductCard";

interface ProductsGridProps {
  products: Product[];
  title?: string;
  subtitle?: string;
  showAll?: boolean;
  limit?: number;
  viewAllHref?: string;
}

export default function ProductsGrid({
  products,
  title,
  subtitle,
  showAll = false,
  limit = 4,
  viewAllHref,
}: ProductsGridProps) {
  const displayed = showAll ? products : products.slice(0, limit);

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {(title || subtitle) && (
        <div className="text-center mb-10" dir="rtl">
          {title && (
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              {title}
            </h2>
          )}
          {subtitle && <p className="text-gray-500 mt-2 text-sm">{subtitle}</p>}
          <div className="w-12 h-0.5 bg-black mx-auto mt-4" />
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {displayed.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {viewAllHref && !showAll && products.length > limit && (
        <div className="text-center mt-10">
          <a
            href={viewAllHref}
            className="inline-block border-2 border-black text-black font-semibold px-10 py-3 rounded-full hover:bg-black hover:text-white transition-all duration-300 text-sm"
          >
            عرض الكل
          </a>
        </div>
      )}
    </section>
  );
}
