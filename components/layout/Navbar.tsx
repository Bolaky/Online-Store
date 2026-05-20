"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { useLang } from "@/lib/lang";
import { DEFAULT_PLACEHOLDER_IMAGE_URL } from "@/lib/constants";

interface NavbarProps {
  categories: { id: string; name: string; slug: string }[];
}

export default function Navbar({ categories }: NavbarProps) {
  const [scrolled,     setScrolled]     = useState(false);
  const [menuOpen,     setMenuOpen]     = useState(false);
  const [searchOpen,   setSearchOpen]   = useState(false);
  const [searchQuery,  setSearchQuery]  = useState("");
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartOpen,     setCartOpen]     = useState(false);
  const { lang, toggleLang } = useLang();

  const { count: cartCount, items, removeItem, updateQty, total } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const update = () => {
      try {
        const wl = JSON.parse(localStorage.getItem("store_wishlist") || "[]");
        setWishlistCount(wl.length);
      } catch {}
    };
    update();
    window.addEventListener("wishlistUpdate", update);
    return () => window.removeEventListener("wishlistUpdate", update);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <>
      <nav className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-sm shadow-md" : "bg-white shadow-sm"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* Left: hamburger + desktop nav */}
            <div className="flex items-center gap-6">
              <button
                className="md:hidden text-gray-700 hover:text-black transition-colors"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="القائمة"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {menuOpen
                    ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
                </svg>
              </button>

              <div className="hidden md:flex items-center gap-6">
                {categories.map((cat) => (
                  <Link key={cat.id} href={`/category/${cat.slug}`}
                    className="text-sm font-medium text-gray-700 hover:text-black transition-colors relative group">
                    {cat.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all group-hover:w-full" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Center: Logo */}
            <Link href="/"
              className="absolute left-1/2 -translate-x-1/2 text-2xl md:text-3xl font-black tracking-tighter text-black"
              style={{ fontFamily: "'Playfair Display', serif" }}>
              مصري
            </Link>

            {/* Right: icons */}
            <div className="flex items-center gap-3 md:gap-4">
              {/* Language toggle */}
              <button
                onClick={() => toggleLang()}
                className="text-xs font-bold text-gray-600 hover:text-black transition-colors border border-gray-200 rounded-full px-2.5 py-1 hover:border-black"
                aria-label="تغيير اللغة"
              >
                {lang === "ar" ? "EN" : "عر"}
              </button>

              {/* Search */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="text-gray-700 hover:text-black transition-colors"
                aria-label="بحث"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Wishlist */}
              <Link href="/wishlist" className="relative text-gray-700 hover:text-black transition-colors" aria-label="المفضلة">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart button */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative text-gray-700 hover:text-black transition-colors"
                aria-label="السلة"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 14H4L5 9z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className={`overflow-hidden transition-all duration-300 ${searchOpen ? "max-h-16 pb-3" : "max-h-0"}`}>
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن منتج..."
                className="w-full border border-gray-200 rounded-full py-2.5 pr-10 pl-4 text-sm focus:outline-none focus:border-black transition-colors text-right"
                dir="rtl"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${menuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}>
        <div className="absolute inset-0 bg-black/50" onClick={() => setMenuOpen(false)} />
        <div className={`absolute top-0 right-0 h-full w-72 bg-white shadow-2xl transition-transform duration-300 ${menuOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="p-6 pt-20">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">الأقسام</p>
            <nav className="flex flex-col gap-1">
              <Link href="/" onClick={() => setMenuOpen(false)}
                className="py-3 px-4 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-black transition-all font-medium text-right">
                الرئيسية
              </Link>
              {categories.map((cat) => (
                <Link key={cat.id} href={`/category/${cat.slug}`}
                  onClick={() => setMenuOpen(false)}
                  className="py-3 px-4 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-black transition-all font-medium text-right">
                  {cat.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Cart Drawer */}
      {cartOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setCartOpen(false)} />
          <div className="fixed top-0 left-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col" dir="rtl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="text-lg font-black text-gray-900">
                سلة الشراء
                {cartCount > 0 && <span className="mr-2 text-sm font-normal text-gray-500">({cartCount} منتج)</span>}
              </h2>
              <button onClick={() => setCartOpen(false)} className="text-gray-400 hover:text-black text-2xl leading-none">×</button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-16">
                  <svg className="w-16 h-16 mx-auto text-gray-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 14H4L5 9z" />
                  </svg>
                  <p className="text-gray-400 text-sm">السلة فارغة</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={`${item.productId}_${item.variantId}`} className="flex gap-4 pb-4 border-b border-gray-50 last:border-0">
                    <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-gray-50 shrink-0">
                      <img src={item.image || DEFAULT_PLACEHOLDER_IMAGE_URL} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 line-clamp-2">{item.name}</p>
                      {(item.size || item.color) && (
                        <p className="text-xs text-gray-400 mt-1">{[item.color, item.size].filter(Boolean).join(" — ")}</p>
                      )}
                      <p className="text-sm font-bold text-gray-900 mt-1">
                        {(item.price * item.quantity).toLocaleString("ar-EG")} جنيه
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button onClick={() => updateQty(item.productId, item.variantId, item.quantity - 1)}
                          className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:border-black transition-colors">−</button>
                        <span className="text-sm font-medium w-5 text-center">{item.quantity}</span>
                        <button onClick={() => updateQty(item.productId, item.variantId, item.quantity + 1)}
                          className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:border-black transition-colors">+</button>
                        <button onClick={() => removeItem(item.productId, item.variantId)}
                          className="mr-auto text-gray-300 hover:text-red-500 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-gray-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">الإجمالي</span>
                  <span className="text-xl font-black text-gray-900">{total.toLocaleString("ar-EG")} جنيه</span>
                </div>
                <Link href="/checkout" onClick={() => setCartOpen(false)}
                  className="block w-full bg-black text-white text-center font-bold py-4 rounded-full hover:bg-gray-800 transition-colors text-sm">
                  إتمام الطلب
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
