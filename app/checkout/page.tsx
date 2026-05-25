"use client";
// app/checkout/page.tsx
// ✅ Shipping locations loaded from backend (Shipping_Rates sheet)
// ✅ Checkout totals from backend getCheckoutQuote only
// ✅ Frontend never calculates prices

import { useState, useEffect, useRef } from "react";
import Link       from "next/link";
import Image      from "next/image";
import { useCart } from "@/lib/cart";
import { useLang } from "@/lib/lang";
import {
  ApiSettings,
  CheckoutQuote,
  createOrder,
  getCheckoutQuote,
  getShippingRates,
  getSettings,
} from "@/lib/api";
import {
  parseShippingOptionsFromSource,
  ShippingOption,
  buildGovernorateFallbackOptions,
  getShippingFeeForGovernorate,
} from "@/lib/store-settings";
import {
  cartToOrderItems,
  buildWhatsAppOrderMessage,
  openWhatsApp,
} from "@/lib/checkout";
import { formatCurrency } from "@/lib/utils";
import { DEFAULT_PLACEHOLDER_IMAGE_URL } from "@/lib/constants";
import { normalizeImageUrl } from "@/lib/images";

function isLanguageLabel(value: unknown): value is { ar: string; en: string } {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as any).ar === "string" &&
    (value as any).ar.trim().length > 0 &&
    typeof (value as any).en === "string" &&
    (value as any).en.trim().length > 0
  );
}

function isValidShippingOptions(value: unknown): value is ShippingOption[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every((option) =>
      option &&
      typeof option === "object" &&
      typeof option.id === "string" &&
      option.id.trim().length > 0 &&
      isLanguageLabel(option.label) &&
      Array.isArray(option.cities) &&
      option.cities.length > 0 &&
      option.cities.every((city: unknown) => {
        if (!city || typeof city !== "object") return false;
        const cityObj = city as { id: unknown; label: unknown };
        return (
          typeof cityObj.id === "string" &&
          cityObj.id.trim().length > 0 &&
          isLanguageLabel(cityObj.label)
        );
      })
    )
  );
}

function safeNumber(value: unknown): number {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const { t, lang }          = useLang();

  const [name,        setName]       = useState("");
  const [phone,           setPhone]          = useState("");
  const [secondaryPhone,  setSecondaryPhone] = useState("");
  const [address,         setAddress]        = useState("");
  const [notes,           setNotes]          = useState("");

  // Shipping locations — loaded from backend
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [locationsReady,  setLocationsReady]  = useState(false);
  const [governorate,     setGovernorate]     = useState("");
  const [shippingError,  setShippingError]   = useState("");

  // Quote — from backend only
  const [quote,        setQuote]       = useState<CheckoutQuote | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError,   setQuoteError]   = useState("");

  // Order submission
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");
  const [orderId,   setOrderId]   = useState("");
  const [whatsapp,  setWhatsapp]  = useState("201000000000");

  const dir = lang === "ar" ? "rtl" : "ltr";

  // Load settings + shipping locations from backend
  useEffect(() => {
    let cancelled = false;

    async function loadCheckoutData() {
      try {
        const settings = await getSettings(lang).catch((): ApiSettings => ({} as ApiSettings));
        if (cancelled) return;

        if (typeof settings.whatsapp === "string") {
          setWhatsapp(settings.whatsapp.replace(/\D/g, ""));
        }

        const directShipping = await getShippingRates(lang).catch(() => null);
        if (cancelled) return;

        const directOptions = parseShippingOptionsFromSource(directShipping);
        const options = isValidShippingOptions(directOptions)
          ? directOptions
          : buildGovernorateFallbackOptions();

        setShippingOptions(options);
        setLocationsReady(true);

        if (options.length > 0) {
          setGovernorate(options[0].id);
          setShippingError("");
        } else {
          setGovernorate("");
          setShippingError(
            lang === "ar"
              ? "لا توجد خيارات شحن متاحة حالياً."
              : "No shipping options are currently available."
          );
        }
      } catch {
        if (cancelled) return;
        setShippingOptions([]);
        setGovernorate("");
        setLocationsReady(true);
        setShippingError(
          lang === "ar"
            ? "تعذر الاتصال ببيانات الشحن. حاول لاحقاً."
            : "Unable to load shipping data. Please try again later."
        );
      }
    }

    loadCheckoutData();

    return () => {
      cancelled = true;
    };
  }, [lang]);

  const selectedGovernorate =
    shippingOptions.find((o) => o.id === governorate) ?? shippingOptions[0];

  const cartSubtotal = items.reduce(
    (sum, item) => sum + safeNumber(item.price) * safeNumber(item.quantity),
    0
  );
  const fallbackShippingFee = governorate ? getShippingFeeForGovernorate(governorate) : 0;
  const safeSubtotal = quote?.subtotal ?? cartSubtotal;
  const safeShipping = quote?.shipping_fee ?? fallbackShippingFee;
  const safeCod = quote?.cod_fee ?? 0;
  const safeTotal = safeSubtotal + safeShipping + safeCod;
  const isCheckoutValid =
    items.length > 0 &&
    name.trim() &&
    phone.trim() &&
    governorate.trim() &&
    address.trim() &&
    locationsReady &&
    shippingOptions.length > 0;

  const quoteTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!items.length || !governorate || !locationsReady) {
      setQuote(null);
      return;
    }

    // Debounce — avoid firing on every keystroke during location change
    if (quoteTimerRef.current) clearTimeout(quoteTimerRef.current);

    quoteTimerRef.current = setTimeout(() => {
      let cancelled = false;
      setQuoteLoading(true);
      setQuoteError("");

      getCheckoutQuote(
        cartToOrderItems(items),
        selectedGovernorate?.id ?? governorate,
        "",
        lang
      )
        .then((q) => { if (!cancelled) setQuote(q); })
        .catch(() => {
          if (!cancelled) setQuoteError(
            lang === "ar"
              ? "تعذر تحميل تفاصيل الشحن. حاول مرة أخرى."
              : "Unable to load shipping quote. Please try again."
          );
        })
        .finally(() => { if (!cancelled) setQuoteLoading(false); });

      return () => { cancelled = true; };
    }, 400);

    return () => {
      if (quoteTimerRef.current) clearTimeout(quoteTimerRef.current);
    };
  }, [items, governorate, lang, locationsReady]);

  // --- Submit order ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!items.length || !name.trim() || !phone.trim() || !address.trim()) return;
    if (secondaryPhone.trim() && !/^[+0-9\s\-()]{6,20}$/.test(secondaryPhone.trim())) {
      setError(
        lang === "ar"
          ? "يرجى إدخال رقم الهاتف الثانوي بشكل صحيح أو تركه فارغاً."
          : "Please enter a valid secondary phone number or leave it empty."
      );
      setLoading(false);
      return;
    }
    if (!shippingOptions.length || !governorate) {
      setError(
        lang === "ar"
          ? "لا يمكن إتمام الطلب قبل تحديد بيانات الشحن الصحيحة."
          : "Unable to place order before shipping details are available."
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await createOrder({
        phone:                phone.trim(),
        secondary_phone:      secondaryPhone.trim() || undefined,
        address:              address.trim(),
        customer_name:        name.trim(),
        notes:                notes.trim() || undefined,
        order_lang:           lang,
        source:               "website",
        items:                cartToOrderItems(items),
        shipping_governorate: selectedGovernorate?.id ?? governorate,
        shipping_city:        "",
      });

      if (!result.success || !result.order_id) {
        throw new Error(result.error || "Order failed");
      }

      const snapshotItems = [...items];

      const msg = buildWhatsAppOrderMessage({
        lang,
        orderId:             result.order_id,
        total:               result.total ?? 0,
        name:                name.trim(),
        phone:               phone.trim(),
        secondaryPhone:      secondaryPhone.trim() || undefined,
        address:             address.trim(),
        notes:               notes.trim(),
        items:               snapshotItems,
        shippingGovernorate: selectedGovernorate?.label[lang] ?? governorate,
        shippingCity:        "",
        shippingCost:        result.shipping_fee,
      });

      clearCart();
      setOrderId(result.order_id);
      setSubmitted(true);
      openWhatsApp(whatsapp, msg);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(
        lang === "ar"
          ? `تعذر تسجيل الطلب: ${message}. حاول مرة أخرى.`
          : `Could not place order: ${message}. Please try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  // --- Empty cart ---
  if (items.length === 0 && !submitted) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center" dir={dir}>
        <p className="text-gray-400 mb-6">{t("checkoutEmpty")}</p>
        <Link href="/" className="inline-block bg-black text-white px-8 py-3 rounded-full text-sm font-medium">
          {t("browseProducts")}
        </Link>
      </div>
    );
  }

  // --- Success ---
  if (submitted) {
    return (
      <div
        className="max-w-lg mx-auto px-4 py-12 flex flex-col items-center gap-6"
        dir={dir}
      >
        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
          <svg
            className="w-10 h-10 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Title */}
        <div className="text-center">
          <h1
            className="text-2xl font-black text-gray-900 mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {lang === "ar" ? "تم استلام طلبك بنجاح ✅" : "Order received successfully ✅"}
          </h1>

          <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
            {lang === "ar"
              ? "شكراً لثقتك بنا. سيتم مراجعة طلبك والتواصل معك خلال وقت قصير."
              : "Thank you for your order. Your order is now under review and we’ll contact you shortly."}
          </p>
        </div>

        {/* Order card */}
        <div className="w-full bg-white border border-gray-100 rounded-2xl p-5 space-y-3 shadow-sm">
          {orderId && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">
                {lang === "ar" ? "رقم الطلب" : "Order ID"}
              </span>

              <span className="text-sm font-bold text-gray-900 font-mono tracking-wide">
                {orderId}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-gray-50">
            <span className="text-xs text-gray-400">
              {lang === "ar" ? "الحالة" : "Status"}
            </span>

            <span className="text-xs font-semibold bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full">
              {lang === "ar" ? "قيد المراجعة" : "Under Review"}
            </span>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-50">
            <span className="text-xs text-gray-400">
              {lang === "ar" ? "التوصيل المتوقع" : "Estimated delivery"}
            </span>

            <span className="text-xs text-gray-700">
              {lang === "ar" ? "خلال ٣–٥ أيام عمل" : "Within 3–5 business days"}
            </span>
          </div>
        </div>

        {/* WhatsApp note */}
        <div className="w-full bg-green-50 rounded-2xl p-4 flex gap-3 items-start border border-green-100">
          <svg
            className="w-5 h-5 text-green-600 mt-0.5 shrink-0"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.113.549 4.094 1.512 5.816L.057 23.852a.75.75 0 00.916.927l6.184-1.621A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.693-.528-5.217-1.444l-.374-.223-3.876 1.016 1.036-3.773-.243-.389A9.96 9.96 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z" />
          </svg>

          <div>
            <p className="text-sm font-semibold text-green-800 mb-1">
              {lang === "ar"
                ? "تأكيد الطلب عبر واتساب"
                : "WhatsApp confirmation"}
            </p>

            <p className="text-xs text-green-700 leading-relaxed">
              {lang === "ar"
                ? "تم فتح واتساب تلقائياً لتأكيد الطلب بشكل أسرع."
                : "WhatsApp has been opened automatically for faster confirmation."}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="w-full grid grid-cols-2 gap-3">
          <Link
            href="/"
            replace
            className="flex items-center justify-center gap-2 border border-gray-200 rounded-full py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>

            {lang === "ar" ? "العودة للرئيسية" : "Back to home"}
          </Link>

          <Link
            href="/collections"
            replace
            className="flex items-center justify-center gap-2 bg-black text-white rounded-full py-3 text-sm font-bold hover:bg-gray-800 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 14H4L5 9z"
              />
            </svg>

            {lang === "ar" ? "متابعة التسوق" : "Continue shopping"}
          </Link>
        </div>
      </div>
    );
  }

  // --- Form ---
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10" dir={dir}>
      <h1
        className="text-3xl font-black text-gray-900 mb-8"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        {t("checkoutTitle")}
      </h1>

      {shippingError && (
        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-5 mb-6 text-sm text-amber-900">
          {shippingError}
        </div>
      )}

      {!locationsReady ? (
        <div className="rounded-2xl bg-gray-50 border border-gray-200 p-6 mb-6 text-center text-sm text-gray-500">
          {lang === "ar" ? "جاري تحميل خيارات الشحن..." : "Loading shipping options..."}
        </div>
      ) : shippingOptions.length === 0 ? (
        <div className="rounded-2xl bg-red-50 border border-red-200 p-6 mb-6 text-center text-sm text-red-700">
          {shippingError || (lang === "ar" ? "لا توجد خيارات شحن متاحة." : "No shipping available.")}
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Order summary */}
        <div className="space-y-4">
          {items.map((item) => (
            <div key={`${item.productId}_${item.variantId}`}
              className="flex gap-3 pb-4 border-b border-gray-100">
              <div className="relative w-16 h-20 rounded-lg overflow-hidden bg-gray-50 shrink-0">
                <Image
                  src={normalizeImageUrl(item.image)}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold line-clamp-2">{item.name}</p>
                <p className="text-xs text-gray-400 mt-1">× {item.quantity}</p>
                <p className="text-sm font-bold mt-1">
                  {formatCurrency(item.price * item.quantity, lang)} {lang === "ar" ? "جنيه" : "EGP"}
                </p>
              </div>
            </div>
          ))}

          {/* Totals — backend quote only with safe frontend fallback */}
          <div className="flex justify-between font-black text-lg pt-2">
            <span>{t("subtotal")}</span>
            <span>{`${formatCurrency(safeSubtotal, lang)} ${lang === "ar" ? "جنيه" : "EGP"}`}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>{t("shipping")}</span>
            <span>{`${formatCurrency(safeShipping, lang)} ${lang === "ar" ? "جنيه" : "EGP"}`}</span>
          </div>
          {safeCod > 0 && (
            <div className="flex justify-between text-sm text-gray-500">
              <span>{lang === "ar" ? "رسوم الدفع عند الاستلام" : "COD fee"}</span>
              <span>{`${formatCurrency(safeCod, lang)} ${lang === "ar" ? "جنيه" : "EGP"}`}</span>
            </div>
          )}
          <div className="flex justify-between font-black text-lg pt-4 border-t border-gray-100">
            <span>{t("total")}</span>
            <span>{`${formatCurrency(safeTotal, lang)} ${lang === "ar" ? "جنيه" : "EGP"}`}</span>
          </div>
          {quoteError && (
            <div className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{quoteError}</div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("checkoutName")} *</label>
            <input required value={name} onChange={(e) => setName(e.target.value)} disabled={loading}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black disabled:opacity-60" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("checkoutPhone")} *</label>
            <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={loading}
              dir="ltr"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black disabled:opacity-60" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("checkoutSecondaryPhone")}</label>
            <input type="tel" value={secondaryPhone} onChange={(e) => setSecondaryPhone(e.target.value)} disabled={loading}
              dir="ltr"
              placeholder={lang === "ar" ? "رقم هاتف ثانوي" : "Secondary phone"}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black disabled:opacity-60" />
          </div>

          {/* Governorate — from backend */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("checkoutGovernorate")} *</label>
            <select required value={governorate}
              onChange={(e) => setGovernorate(e.target.value)}
              disabled={loading || !locationsReady || shippingOptions.length === 0}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black disabled:opacity-60">
              {shippingOptions.length > 0 ? (
                shippingOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>{opt.label[lang]}</option>
                ))
              ) : (
                <option>{lang === "ar" ? "لا توجد محافظات" : "No governorates"}</option>
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("checkoutAddress")} *</label>
            <textarea required value={address} onChange={(e) => setAddress(e.target.value)} disabled={loading}
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black resize-none disabled:opacity-60" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("checkoutNotes")}</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} disabled={loading}
              rows={2}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black resize-none disabled:opacity-60" />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{error}</p>
          )}

          <button type="submit" disabled={loading || !isCheckoutValid}
            className="w-full bg-black text-white font-bold py-4 rounded-full hover:bg-gray-800 transition-colors text-sm mt-2 disabled:opacity-60 disabled:cursor-not-allowed">
            {loading
              ? (lang === "ar" ? "جاري تسجيل الطلب..." : "Placing order...")
              : t("checkoutSubmit")}
          </button>

          {!quote && !quoteLoading && !quoteError && (
            <p className="text-xs text-gray-400 text-center">
              {lang === "ar"
                ? "اختر المحافظة لحساب الشحن"
                : "Select your governorate to calculate shipping"}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

