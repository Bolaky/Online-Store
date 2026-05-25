"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { t as translate, type Lang, type TranslationKey, LANG_COOKIE } from "@/lib/i18n";

export type { Lang };

interface LangContextValue {
  lang:       Lang;
  toggleLang: () => void;
  setLang:    (l: Lang) => void;
  t:        (key: TranslationKey) => string;
}

const LangContext = createContext<LangContextValue>({
  lang:       "ar",
  toggleLang: () => {},
  setLang:    () => {},
  t:          (key) => key,
});

const LANG_KEY = LANG_COOKIE;

function applyLangToDocument(l: Lang) {
  document.documentElement.lang = l;
  document.documentElement.dir  = l === "ar" ? "rtl" : "ltr";
  document.cookie = `${LANG_COOKIE}=${l};path=/;max-age=31536000;SameSite=Lax`;
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ar");
  const router = useRouter();

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LANG_KEY) as Lang | null;
      if (saved === "ar" || saved === "en") {
        setLangState(saved);
        applyLangToDocument(saved);
      }
    } catch {}
  }, []);

  const setLang = useCallback(
    (l: Lang) => {
      setLangState(l);
      try { localStorage.setItem(LANG_KEY, l); } catch {}
      applyLangToDocument(l);
      router.refresh();
    },
    [router]
  );

  const toggleLang = useCallback(() => {
    setLangState((current) => {
      const next: Lang = current === "ar" ? "en" : "ar";
      try { localStorage.setItem(LANG_KEY, next); } catch {}
      applyLangToDocument(next);
      router.refresh();
      return next;
    });
  }, [router]);

  const t = useCallback(
    (key: TranslationKey) => translate(key, lang),
    [lang]
  );

  return (
    <LangContext.Provider value={{ lang, toggleLang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
