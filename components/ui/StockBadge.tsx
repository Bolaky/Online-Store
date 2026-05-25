"use client";

import { Product } from "@/types";
import { useLang } from "@/lib/lang";
import { t } from "@/lib/i18n";

export default function StockBadge({ status }: { status: Product["stockStatus"] }) {
  const { lang } = useLang();
  const map = {
    in_stock: { label: t("inStock", lang), color: "bg-green-100 text-green-700" },
    low_stock: { label: t("lowStock", lang), color: "bg-amber-100 text-amber-700" },
    out_of_stock: { label: t("outOfStock", lang), color: "bg-red-100 text-red-700" },
  };
  const { label, color } = map[status];
  return (
    <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${color}`}>
      {label}
    </span>
  );
}
