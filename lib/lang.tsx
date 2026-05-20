"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type Lang = "ar" | "en";

interface LangContextValue {
  lang:       Lang;
  toggleLang: () => void;
  setLang:    (l: Lang) => void;
}

const LangContext = createContext<LangContextValue>({
  lang:       "ar",
  toggleLang: () => {},
  setLang:    () => {},
});

const LANG_KEY = "store_lang";

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ar");

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LANG_KEY) as Lang | null;
      if (saved === "ar" || saved === "en") setLangState(saved);
    } catch {}
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem(LANG_KEY, l); } catch {}

    // تغيير اتجاه الصفحة فوراً
    document.documentElement.lang = l;
    document.documentElement.dir  = l === "ar" ? "rtl" : "ltr";
  };

  const toggleLang = () => setLang(lang === "ar" ? "en" : "ar");

  return (
    <LangContext.Provider value={{ lang, toggleLang, setLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
