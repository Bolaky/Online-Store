import PolicyPage from "@/components/layout/PolicyPage";
import { getSettings } from "@/lib/api.server";
import { getServerLang } from "@/lib/server-lang";
import { parseStoreSettings } from "@/lib/store-settings";
import type { ApiSettings } from "@/lib/api";

export const revalidate = 60;

export default async function TermsPage() {
  const lang = await getServerLang();
  const settings = parseStoreSettings(
    (await getSettings(lang).catch(() => ({}))) as ApiSettings,
    lang
  );

  return (
    <PolicyPage
      title={lang === "ar" ? "الشروط والأحكام" : "Terms and conditions"}
      body={settings.terms}
      fallback={
        lang === "ar"
          ? "الشروط والأحكام سيتم تحديثها قريبا."
          : "The terms and conditions will be updated soon."
      }
    />
  );
}
