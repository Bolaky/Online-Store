export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  image: string;
  images?: string[];
  price: number;
  oldPrice?: number;
  stockStatus: "in_stock" | "out_of_stock" | "low_stock";
  featured: boolean;
  bestSeller: boolean;
  lastPiece: boolean;
  description?: string;
  sizes?: string[];
  colors?: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description?: string;
}
