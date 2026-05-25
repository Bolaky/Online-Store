"use client";
import { useLang } from "@/lib/lang";
import type { TranslationKey } from "@/lib/i18n";

const FEATURE_KEYS: { title: TranslationKey; subtitle: TranslationKey }[] = [
  { title: "featureShipping", subtitle: "featureShippingSub" },
  { title: "featureReturns",  subtitle: "featureReturnsSub" },
  { title: "featureSecure",   subtitle: "featureSecureSub" },
  { title: "featureSupport",  subtitle: "featureSupportSub" },
];

const icons = [
  <svg key="0" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>,
  <svg key="1" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>,
  <svg key="2" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>,
  <svg key="3" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>,
];

export default function FeatureStrip() {
  const { t, lang } = useLang();

  return (
    <section className="border-y border-gray-100 bg-gray-50">
      <div className="py-10">
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
          dir={lang === "ar" ? "rtl" : "ltr"}
        >
          {FEATURE_KEYS.map((f, i) => (
            <div key={f.title} className="flex items-center gap-4 px-2">
              <div className="text-gray-700 shrink-0">{icons[i]}</div>
              <div>
                <p className="font-bold text-sm text-gray-900">{t(f.title)}</p>
                <p className="text-xs text-gray-500 mt-0.5">{t(f.subtitle)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
