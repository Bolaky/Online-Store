import { cookies } from "next/headers";
import type { Lang } from "@/lib/i18n";
import { LANG_COOKIE } from "@/lib/i18n";

export async function getServerLang(): Promise<Lang> {
  const value = cookies().get(LANG_COOKIE)?.value;
  return value === "en" ? "en" : "ar";
}
