import { useEffect, useState } from "react";

export const usePageLanguage = (): string => {
  const [lang, setLang] = useState(
    document.documentElement.getAttribute("lang") || "en",
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const newLang = document.documentElement.getAttribute("lang") || "en";
      if (newLang !== lang) setLang(newLang);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["lang"],
    });

    return () => observer.disconnect();
  }, [lang]);

  return lang;
};
