import PolicyPage from "@/components/layout/PolicyPage";
import { getSettings } from "@/lib/api.server";
import { getServerLang } from "@/lib/server-lang";
import { parseStoreSettings } from "@/lib/store-settings";
import type { ApiSettings } from "@/lib/api";

export const revalidate = 60;

export default async function ShippingPolicyPage() {
  const lang = await getServerLang();
  const settings = parseStoreSettings(
    (await getSettings(lang).catch(() => ({}))) as ApiSettings,
    lang
  );

  return (
    <PolicyPage
      title={lang === "ar" ? "سياسة الشحن" : "Shipping policy"}
      body={settings.shippingPolicy}
      fallback={
        lang === "ar"
          ? "سياسة الشحن سيتم تحديثها قريبا."
          : "The shipping policy will be updated soon."
      }
    />
  );
}
