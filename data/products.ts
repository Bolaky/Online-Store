import { Product, Category } from "@/types";

export const categories: Category[] = [
  {
    id: "cat-1",
    name: "فساتين",
    slug: "dresses",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80",
    description: "أحدث تصاميم الفساتين العصرية",
  },
  {
    id: "cat-2",
    name: "بلوزات",
    slug: "tops",
    image: "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600&q=80",
    description: "بلوزات أنيقة لكل مناسبة",
  },
  {
    id: "cat-3",
    name: "بناطيل",
    slug: "pants",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80",
    description: "بناطيل عصرية وعملية",
  },
  {
    id: "cat-4",
    name: "إكسسوارات",
    slug: "accessories",
    image: "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=600&q=80",
    description: "إكسسوارات تكمل إطلالتك",
  },
];

export const products: Product[] = [
  {
    id: "p-1",
    name: "فستان سهرة أنيق",
    slug: "elegant-evening-dress",
    category: "فساتين",
    categorySlug: "dresses",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80",
      "https://images.unsplash.com/photo-1566479179817-27b83f5a3f73?w=800&q=80",
    ],
    price: 899,
    oldPrice: 1299,
    stockStatus: "in_stock",
    featured: true,
    bestSeller: false,
    lastPiece: false,
    description: "فستان سهرة راقٍ مصنوع من أجود أنواع الأقمشة، مثالي للمناسبات الرسمية والحفلات.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["أسود", "أحمر", "كحلي"],
  },
  {
    id: "p-2",
    name: "فستان كاجوال يومي",
    slug: "casual-daily-dress",
    category: "فساتين",
    categorySlug: "dresses",
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&q=80",
    price: 459,
    oldPrice: 599,
    stockStatus: "in_stock",
    featured: true,
    bestSeller: true,
    lastPiece: false,
    description: "فستان كاجوال مريح ومناسب للاستخدام اليومي.",
    sizes: ["S", "M", "L"],
    colors: ["بيج", "أبيض", "وردي"],
  },
  {
    id: "p-3",
    name: "فستان صيفي زاهي",
    slug: "vibrant-summer-dress",
    category: "فساتين",
    categorySlug: "dresses",
    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&q=80",
    price: 349,
    stockStatus: "low_stock",
    featured: false,
    bestSeller: true,
    lastPiece: true,
    description: "فستان صيفي خفيف بألوان زاهية تناسب أجواء الصيف.",
    sizes: ["XS", "S", "M"],
    colors: ["أصفر", "برتقالي"],
  },
  {
    id: "p-4",
    name: "بلوزة بأكمام واسعة",
    slug: "wide-sleeve-blouse",
    category: "بلوزات",
    categorySlug: "tops",
    image: "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600&q=80",
    price: 279,
    oldPrice: 380,
    stockStatus: "in_stock",
    featured: true,
    bestSeller: false,
    lastPiece: false,
    description: "بلوزة أنيقة بأكمام واسعة تمنحك مظهرًا عصريًا.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["أبيض", "أسود", "رمادي"],
  },
  {
    id: "p-5",
    name: "بلوزة كروب تريندي",
    slug: "trendy-crop-top",
    category: "بلوزات",
    categorySlug: "tops",
    image: "https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=600&q=80",
    price: 199,
    stockStatus: "in_stock",
    featured: false,
    bestSeller: true,
    lastPiece: false,
    description: "بلوزة كروب عصرية مناسبة للإطلالات الكاجوال.",
    sizes: ["XS", "S", "M"],
    colors: ["وردي", "أبيض", "أسود"],
  },
  {
    id: "p-6",
    name: "بنطلون كلاسيك واسع",
    slug: "wide-classic-pants",
    category: "بناطيل",
    categorySlug: "pants",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80",
    price: 499,
    oldPrice: 699,
    stockStatus: "in_stock",
    featured: true,
    bestSeller: true,
    lastPiece: false,
    description: "بنطلون كلاسيكي واسع يجمع بين الأناقة والراحة.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["أسود", "بيج", "كاكي"],
  },
  {
    id: "p-7",
    name: "بنطلون جينز مضلع",
    slug: "ribbed-jeans",
    category: "بناطيل",
    categorySlug: "pants",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80",
    price: 599,
    oldPrice: 750,
    stockStatus: "low_stock",
    featured: false,
    bestSeller: false,
    lastPiece: true,
    description: "بنطلون جينز مضلع بقصة عصرية ومريحة.",
    sizes: ["S", "M", "L"],
    colors: ["أزرق فاتح", "أزرق غامق"],
  },
  {
    id: "p-8",
    name: "قلادة ذهبية أنيقة",
    slug: "elegant-gold-necklace",
    category: "إكسسوارات",
    categorySlug: "accessories",
    image: "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=600&q=80",
    price: 189,
    oldPrice: 250,
    stockStatus: "in_stock",
    featured: true,
    bestSeller: true,
    lastPiece: false,
    description: "قلادة ذهبية أنيقة تضيف لمسة من الفخامة لأي إطلالة.",
    colors: ["ذهبي", "فضي"],
  },
  {
    id: "p-9",
    name: "حقيبة يد عصرية",
    slug: "modern-handbag",
    category: "إكسسوارات",
    categorySlug: "accessories",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80",
    price: 850,
    oldPrice: 1100,
    stockStatus: "in_stock",
    featured: true,
    bestSeller: false,
    lastPiece: false,
    description: "حقيبة يد عصرية مصنوعة من الجلد الطبيعي بتصميم فاخر.",
    colors: ["أسود", "بني", "بيج"],
  },
  {
    id: "p-10",
    name: "فستان مطرز فاخر",
    slug: "luxury-embroidered-dress",
    category: "فساتين",
    categorySlug: "dresses",
    image: "https://images.unsplash.com/photo-1566479179817-27b83f5a3f73?w=600&q=80",
    price: 1299,
    stockStatus: "low_stock",
    featured: true,
    bestSeller: false,
    lastPiece: true,
    description: "فستان فاخر مطرز يدويًا بتصميم استثنائي لإطلالة لا تُنسى.",
    sizes: ["XS", "S", "M", "L"],
    colors: ["أبيض", "كريمي"],
  },
  {
    id: "p-11",
    name: "بلوزة مخططة كلاسيك",
    slug: "classic-striped-blouse",
    category: "بلوزات",
    categorySlug: "tops",
    image: "https://images.unsplash.com/photo-1503342394128-c104d54dba01?w=600&q=80",
    price: 240,
    oldPrice: 320,
    stockStatus: "in_stock",
    featured: false,
    bestSeller: true,
    lastPiece: false,
    description: "بلوزة مخططة كلاسيكية دائمة الأناقة.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["أبيض وأسود", "أبيض وأزرق"],
  },
  {
    id: "p-12",
    name: "إسكارف حرير ملون",
    slug: "colorful-silk-scarf",
    category: "إكسسوارات",
    categorySlug: "accessories",
    image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&q=80",
    price: 150,
    stockStatus: "in_stock",
    featured: false,
    bestSeller: true,
    lastPiece: false,
    description: "إسكارف حرير ناعم بألوان متعددة يناسب جميع الإطلالات.",
    colors: ["متعدد الألوان"],
  },
];

// Helper functions — easy to swap for API/Google Sheets later
export function getAllProducts(): Product[] {
  return products;
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.categorySlug === categorySlug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

export function getBestSellers(): Product[] {
  return products.filter((p) => p.bestSeller);
}

export function getLastPieces(): Product[] {
  return products.filter((p) => p.lastPiece);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
