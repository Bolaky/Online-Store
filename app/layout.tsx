import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import { LangProvider } from "@/lib/lang";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import { getSettings, getCategories } from "@/lib/api.server";
import { mapCategories } from "@/lib/mappers/product";
import { getServerLang } from "@/lib/server-lang";
import { parseStoreSettings } from "@/lib/store-settings";
import type { ApiSettings } from "@/lib/api";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getServerLang();
  const settings = parseStoreSettings(
    (await getSettings(lang).catch(() => ({}))) as ApiSettings,
    lang
  );
  return {
    title:       `${settings.storeName} | ${lang === "ar" ? "أزياء عصرية" : "Modern fashion"}`,
    description:
      settings.storeTagline ||
      (lang === "ar"
        ? "أزياء عصرية تجمع بين الأناقة والراحة"
        : "Modern fashion with style and comfort"),
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const lang = await getServerLang();

  const [settingsRaw, apiCategories] = await Promise.all([
    getSettings(lang).catch(() => ({})),
    getCategories(lang).catch(() => []),
  ]);

  const settings   = parseStoreSettings(settingsRaw as ApiSettings, lang);
  const categories = mapCategories(apiCategories, lang);

  return (
    <html lang={lang} dir={lang === "ar" ? "rtl" : "ltr"} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Cairo:wght@300;400;600;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: "'Cairo', sans-serif" }} className="bg-white text-gray-900 antialiased">
        <LangProvider>
          <CartProvider>
            <AnnouncementBar message={settings.announcement} />
            <Navbar categories={categories} storeName={settings.storeName} />
            <main className="min-h-screen">{children}</main>
            <Footer
              storeName={settings.storeName}
              whatsapp={settings.whatsapp}
              categories={categories}
            />
            <WhatsAppButton whatsapp={settings.whatsapp} />
          </CartProvider>
        </LangProvider>
      </body>
    </html>
  );
}
