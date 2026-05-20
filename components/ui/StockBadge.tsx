import { Product } from "@/types";

export default function StockBadge({ status }: { status: Product["stockStatus"] }) {
  const map = {
    in_stock: { label: "متاح في المخزن", color: "bg-green-100 text-green-700" },
    low_stock: { label: "كميات محدودة", color: "bg-amber-100 text-amber-700" },
    out_of_stock: { label: "نفد المخزون", color: "bg-red-100 text-red-700" },
  };
  const { label, color } = map[status];
  return (
    <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${color}`}>
      {label}
    </span>
  );
}
