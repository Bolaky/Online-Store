import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center text-center px-4" dir="rtl">
      <div>
        <p className="text-8xl font-black text-gray-100 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>404</p>
        <h1 className="text-2xl font-black text-gray-900 mb-3">الصفحة غير موجودة</h1>
        <p className="text-gray-500 text-sm mb-8">عذرًا، لم نتمكن من إيجاد ما تبحثين عنه.</p>
        <Link href="/" className="inline-block bg-black text-white font-semibold px-8 py-3 rounded-full hover:bg-gray-800 transition-colors text-sm">
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}
