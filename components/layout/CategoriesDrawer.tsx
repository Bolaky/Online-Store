"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Category } from "@/types";
import { useLang } from "@/lib/lang";

interface Props {
  open:       boolean;
  onClose:    () => void;
  categories: Category[];
}

export default function CategoriesDrawer({ open, onClose, categories }: Props) {
  const pathname = usePathname();
  const { t, lang } = useLang();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden />
      <div
        className={`absolute top-0 h-full w-72 max-w-[85vw] bg-white shadow-2xl transition-transform duration-300 ${
          lang === "ar" ? "right-0" : "left-0"
        }`}
        dir={lang === "ar" ? "rtl" : "ltr"}
      >
        <div className="flex items-center justify-between px-5 py-5 border-b border-gray-100">
          <h2 className="text-lg font-black text-gray-900">{t("categories")}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-black text-2xl leading-none"
            aria-label={lang === "ar" ? "إغلاق" : "Close"}
          >
            ×
          </button>
        </div>
        <nav className="p-4 flex flex-col gap-1 overflow-y-auto max-h-[calc(100vh-4rem)]">
          <Link
            href="/"
            onClick={onClose}
            className={`py-3 px-4 rounded-xl text-sm font-medium transition-colors ${
              pathname === "/"
                ? "bg-black text-white"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            {t("home")}
          </Link>
          {categories.length === 0 ? (
            <p className="text-xs text-gray-400 px-4 py-2">
              {lang === "ar" ? "لا توجد أقسام" : "No categories"}
            </p>
          ) : (
            categories.map((cat) => {
              const href = `/category/${encodeURIComponent(cat.slug)}`;
              const active =
                pathname === href || pathname === `/category/${cat.slug}`;
              return (
                <Link
                  key={cat.id}
                  href={href}
                  onClick={onClose}
                  className={`py-3 px-4 rounded-xl text-sm font-medium transition-colors ${
                    active
                      ? "bg-black text-white"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {cat.name}
                </Link>
              );
            })
          )}
        </nav>
      </div>
    </div>
  );
}
