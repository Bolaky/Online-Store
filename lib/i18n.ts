export type Lang = "ar" | "en";

export type TranslationKey =
  | "home"
  | "categories"
  | "search"
  | "searchPlaceholder"
  | "wishlist"
  | "cart"
  | "cartEmpty"
  | "checkout"
  | "addToCart"
  | "addedToCart"
  | "inCart"
  | "outOfStock"
  | "inStock"
  | "lowStock"
  | "limitedQuantityAvailable"
  | "addToWishlist"
  | "inWishlist"
  | "total"
  | "products"
  | "noProducts"
  | "noResults"
  | "wishlistEmpty"
  | "shopByCategory"
  | "featured"
  | "featuredSub"
  | "bestSellers"
  | "bestSellersSub"
  | "lastPieces"
  | "lastPiecesSub"
  | "quickView"
  | "bestSeller"
  | "lastPiece"
  | "discover"
  | "shopNow"
  | "related"
  | "breadcrumbHome"
  | "section"
  | "browseProducts"
  | "clearCart"
  | "completeOrder"
  | "orderViaWhatsapp"
  | "freeReturn"
  | "fastShipping"
  | "color"
  | "size"
  | "menu"
  | "changeLang"
  | "searchResultsFor"
  | "checkoutTitle"
  | "footerDescription"
  | "footerPolicies"
  | "footerCategories"
  | "contactUs"
  | "whatsapp"
  | "rightsReserved"
  | "madeInEgypt"
  | "checkoutName"
  | "checkoutPhone"
  | "checkoutAddress"
  | "checkoutGovernorate"
  | "checkoutCity"
  | "checkoutNotes"
  | "checkoutSecondaryPhone"
  | "subtotal"
  | "shipping"
  | "checkoutSubmit"
  | "checkoutEmpty"
  | "quantity"
  | "buyNow"
  | "remove"
  | "heroSubtitle1"
  | "heroSubtitle2"
  | "heroSubtitle3"
  | "allCategories"
  | "selectVariant"
  | "selectColor"
  | "selectSize"
  | "viewOptions"
  | "featureShipping"
  | "featureShippingSub"
  | "featureReturns"
  | "featureReturnsSub"
  | "featureSecure"
  | "featureSecureSub"
  | "featureSupport"
  | "featureSupportSub";

const translations: Record<TranslationKey, Record<Lang, string>> = {
  home:               { ar: "الرئيسية", en: "Home" },
  categories:         { ar: "الأقسام", en: "Categories" },
  search:             { ar: "بحث", en: "Search" },
  searchPlaceholder:  { ar: "ابحث عن منتج...", en: "Search for a product..." },
  wishlist:           { ar: "المفضلة", en: "Wishlist" },
  cart:               { ar: "السلة", en: "Cart" },
  cartEmpty:          { ar: "السلة فارغة", en: "Your cart is empty" },
  checkout:           { ar: "إتمام الطلب", en: "Checkout" },
  addToCart:          { ar: "أضف للسلة", en: "Add to cart" },
  addedToCart:        { ar: "✓ تمت الإضافة", en: "✓ Added" },
  inCart:             { ar: "في السلة", en: "In cart" },
  outOfStock:         { ar: "نفد المخزون", en: "Out of stock" },
  inStock:            { ar: "متوفر", en: "In stock" },
  lowStock:           { ar: "كميات محدودة", en: "Low stock" },
  limitedQuantityAvailable: { ar: "كمية محدودة متاحة", en: "Limited quantity available" },
  addToWishlist:      { ar: "أضف للمفضلة", en: "Add to wishlist" },
  inWishlist:         { ar: "في المفضلة", en: "In wishlist" },
  total:              { ar: "الإجمالي", en: "Total" },
  products:           { ar: "منتج", en: "product" },
  noProducts:         { ar: "لا توجد منتجات", en: "No products found" },
  noResults:          { ar: "لا توجد نتائج", en: "No results found" },
  wishlistEmpty:      { ar: "المفضلة فارغة", en: "Your wishlist is empty" },
  shopByCategory:     { ar: "تسوق حسب القسم", en: "Shop by category" },
  featured:           { ar: "المنتجات المميزة", en: "Featured products" },
  featuredSub:        { ar: "اختيارات بعناية لأجلك", en: "Handpicked for you" },
  bestSellers:        { ar: "الأكثر مبيعًا", en: "Best sellers" },
  bestSellersSub:     { ar: "أحبها عملاؤنا", en: "Customer favorites" },
  lastPieces:         { ar: "⏳ آخر القطع", en: "⏳ Last pieces" },
  lastPiecesSub:      { ar: "لا تفوتها — كميات محدودة جداً", en: "Limited stock — don't miss out" },
  quickView:          { ar: "عرض سريع", en: "Quick view" },
  bestSeller:         { ar: "الأكثر مبيعًا", en: "Best seller" },
  lastPiece:          { ar: "آخر قطعة", en: "Last piece" },
  discover:           { ar: "اكتشفي المجموعة", en: "Discover collection" },
  shopNow:            { ar: "تسوقي الآن", en: "Shop now" },
  related:            { ar: "منتجات مشابهة", en: "Related products" },
  breadcrumbHome:     { ar: "الرئيسية", en: "Home" },
  section:            { ar: "قسم", en: "Category" },
  browseProducts:     { ar: "تصفح المنتجات", en: "Browse products" },
  clearCart:          { ar: "إفراغ السلة", en: "Clear cart" },
  completeOrder:      { ar: "إتمام الطلب", en: "Complete order" },
  orderViaWhatsapp:   { ar: "اطلب عبر واتساب", en: "Order via WhatsApp" },
  freeReturn:         { ar: "إرجاع مجاني 14 يوم", en: "14-day free returns" },
  fastShipping:       { ar: "شحن سريع", en: "Fast shipping" },
  color:              { ar: "اللون", en: "Color" },
  size:               { ar: "المقاس", en: "Size" },
  menu:               { ar: "القائمة", en: "Menu" },
  changeLang:         { ar: "تغيير اللغة", en: "Change language" },
  searchResultsFor:   { ar: "نتائج البحث عن", en: "Search results for" },
  checkoutTitle:      { ar: "إتمام الطلب", en: "Checkout" },
  checkoutName:       { ar: "الاسم الكامل", en: "Full name" },
  footerDescription:  { ar: "أزياء عصرية تجمع بين الأناقة والراحة لكل مناسبة.", en: "Modern fashion with elegance and comfort for every occasion." },
  footerPolicies:     { ar: "سياسات المتجر", en: "Store policies" },
  footerCategories:   { ar: "الأقسام", en: "Categories" },
  contactUs:          { ar: "تواصل معنا", en: "Contact us" },
  whatsapp:           { ar: "واتساب", en: "WhatsApp" },
  rightsReserved:     { ar: "جميع الحقوق محفوظة.", en: "All rights reserved." },
  madeInEgypt:        { ar: "صُنع بـ ❤️ في مصر", en: "Made with ❤️ in Egypt" },
  checkoutPhone:      { ar: "رقم الهاتف", en: "Phone number" },
  checkoutSecondaryPhone: { ar: "رقم هاتف ثانوي (اختياري)", en: "Secondary phone (optional)" },
  checkoutAddress:    { ar: "العنوان", en: "Address" },
  checkoutGovernorate:{ ar: "المحافظة", en: "Governorate" },
  checkoutCity:       { ar: "المدينة", en: "City" },
  checkoutNotes:      { ar: "ملاحظات (اختياري)", en: "Notes (optional)" },
  subtotal:           { ar: "المجموع الفرعي", en: "Subtotal" },
  shipping:           { ar: "شحن", en: "Shipping" },
  checkoutSubmit:     { ar: "تأكيد الطلب", en: "Place order" },
  checkoutEmpty:      { ar: "السلة فارغة — أضف منتجات أولاً", en: "Cart is empty — add products first" },
  remove:             { ar: "حذف", en: "Remove" },
  heroSubtitle1:      { ar: "أناقة لا حدود لها", en: "Unlimited elegance" },
  heroSubtitle2:      { ar: "أكملي إطلالتك بلمسة من الأناقة", en: "Complete your look with style" },
  heroSubtitle3:      { ar: "على مجموعة مختارة", en: "On selected items" },
  allCategories:      { ar: "كل الأقسام", en: "All categories" },
  selectVariant:      { ar: "اختر اللون والمقاس أولاً", en: "Please select options first" },
  selectColor:        { ar: "اختر اللون", en: "Please select a color" },
  selectSize:         { ar: "اختر المقاس", en: "Please select a size" },
  quantity:           { ar: "الكمية", en: "Quantity" },
  buyNow:             { ar: "اطلب الان", en: "Order now" },
  viewOptions:        { ar: "اختر الخيارات", en: "Choose options" },
  featureShipping:    { ar: "شحن سريع", en: "Fast shipping" },
  featureShippingSub: { ar: "خلال 2-5 أيام عمل", en: "Within 2-5 business days" },
  featureReturns:     { ar: "إرجاع مجاني", en: "Free returns" },
  featureReturnsSub:  { ar: "خلال 14 يوم من الاستلام", en: "Within 14 days of delivery" },
  featureSecure:      { ar: "دفع آمن", en: "Secure payment" },
  featureSecureSub:   { ar: "بياناتك محمية تمامًا", en: "Your data is fully protected" },
  featureSupport:     { ar: "دعم 24/7", en: "24/7 support" },
  featureSupportSub:  { ar: "نحن هنا لمساعدتك دائمًا", en: "We are always here to help" },
};

export function t(key: TranslationKey, lang: Lang): string {
  return translations[key]?.[lang] ?? key;
}

export const LANG_COOKIE = "store_lang";
