import PolicyPage from "@/components/layout/PolicyPage";
import { getSettings } from "@/lib/api.server";
import { getServerLang } from "@/lib/server-lang";
import { parseStoreSettings } from "@/lib/store-settings";
import type { ApiSettings } from "@/lib/api";

export const revalidate = 60;

export default async function ReturnsPolicyPage() {
  const lang = await getServerLang();
  const settings = parseStoreSettings(
    (await getSettings(lang).catch(() => ({}))) as ApiSettings,
    lang
  );

  return (
    <PolicyPage
      title={lang === "ar" ? "سياسة الاستبدال والاسترجاع" : "Returns and exchange policy"}
      body={settings.returnsPolicy}
      fallback={
        lang === "ar"
          ? "سياسة الاستبدال والاسترجاع سيتم تحديثها قريبا."
          : "The returns and exchange policy will be updated soon."
      }
    />
  );
}
