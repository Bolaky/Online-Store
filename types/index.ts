export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  image: string;
  images?: string[];
  gallery?: string[];
  price: number;
  oldPrice?: number;
  remainingStock?: number;
  stockStatus: "in_stock" | "out_of_stock" | "low_stock";
  featured: boolean;
  bestSeller: boolean;
  lastPiece: boolean;
  description?: string;
  sizes?: string[];
  colors?: string[];
  hasVariants?: boolean;
  variants?: ProductVariant[];
}

export interface ProductVariant {
  variant_id: string;
  sku?: string;
  color?: string;
  size?: string;
  price?: number;
  compare_price?: number;
  stock_quantity?: number;
  image?: string;
  in_stock?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description?: string;
}
