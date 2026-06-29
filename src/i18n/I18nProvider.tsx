import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { en } from "./en";
import { he } from "./he";

export type Lang = "en" | "he";
type Dict = typeof en;

const DICTS: Record<Lang, Dict> = { en, he };

interface I18nCtx {
  lang: Lang;
  dir: "ltr" | "rtl";
  setLang: (l: Lang) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const Ctx = createContext<I18nCtx | null>(null);

const get = (obj: any, path: string) =>
  path.split(".").reduce((o, k) => (o == null ? undefined : o[k]), obj);

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem("lang")) as Lang | null;
    return saved === "he" || saved === "en" ? saved : "en";
  });
  const dir = lang === "he" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  const setLang = useCallback((l: Lang) => {
    localStorage.setItem("lang", l);
    setLangState(l);
  }, []);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      const dict = DICTS[lang];
      let value = get(dict, key);
      if (typeof value !== "string") value = get(DICTS.en, key);
      if (typeof value !== "string") return key;
      if (vars) {
        for (const k of Object.keys(vars)) {
          value = value.replace(new RegExp(`\\{${k}\\}`, "g"), String(vars[k]));
        }
      }
      return value;
    },
    [lang]
  );

  return <Ctx.Provider value={{ lang, dir, setLang, t }}>{children}</Ctx.Provider>;
};

export const useI18n = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useI18n outside provider");
  return c;
};