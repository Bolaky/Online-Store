// app/layout.tsx

import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import { LangProvider } from "@/lib/lang";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar         from "@/components/layout/Navbar";
import Footer         from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import { getSettings, getCategories } from "@/lib/api.server";
import { mapCategories } from "@/lib/mappers/product";

export const metadata: Metadata = {
  title:       "متجر | أزياء عصرية",
  description: "أزياء عصرية تجمع بين الأناقة والراحة لكل مناسبة",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Fetch settings + categories للـ Navbar و Footer
  const [settings, apiCategories] = await Promise.all([
    getSettings("ar").catch(() => ({})),
    getCategories("ar").catch(() => []),
  ]);

  const categories  = mapCategories(apiCategories);
  const storeName   = settings.store_name  || "متجر";
  const whatsapp    = settings.whatsapp    || "201000000000";

  return (
    <html lang="ar" dir="rtl">
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
          <AnnouncementBar />
          <Navbar categories={categories} />
          <main className="min-h-screen">{children}</main>
          <Footer storeName={storeName} whatsapp={whatsapp} categories={categories} />
          <WhatsAppButton whatsapp={whatsapp} />
        </CartProvider>
        </LangProvider>
      </body>
    </html>
  );
}
