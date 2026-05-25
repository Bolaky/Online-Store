import PolicyPage from "@/components/layout/PolicyPage";
import { getSettings } from "@/lib/api.server";
import { getServerLang } from "@/lib/server-lang";
import { parseStoreSettings } from "@/lib/store-settings";
import type { ApiSettings } from "@/lib/api";

export const revalidate = 60;

export default async function PrivacyPolicyPage() {
  const lang = await getServerLang();
  const settings = parseStoreSettings(
    (await getSettings(lang).catch(() => ({}))) as ApiSettings,
    lang
  );

  return (
    <PolicyPage
      title={lang === "ar" ? "سياسة الخصوصية" : "Privacy policy"}
      body={settings.privacyPolicy}
      fallback={
        lang === "ar"
          ? "سياسة الخصوصية سيتم تحديثها قريبا."
          : "The privacy policy will be updated soon."
      }
    />
  );
}
