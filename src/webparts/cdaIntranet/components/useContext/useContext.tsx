/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-floating-promises */

import { WebPartContext } from "@microsoft/sp-webpart-base";
import { sp } from "@pnp/sp/presets/all";
import * as React from "react";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface LanguageContextType {
  currentLang: string;
  setCurrentLang: (lang: string) => void;
  isArabic: boolean;
  isAdmin: boolean;
  context: WebPartContext;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export const LanguageProvider: React.FC<{
  children: React.ReactNode;
  context: WebPartContext;
}> = ({ children, context }) => {
  const [currentLang, setCurrentLang] = useState("ar");
  const [isAdmin, setIsAdmin] = useState(false);

  const setCurrentLangStable = useCallback((lang: string) => {
    setCurrentLang(lang);
  }, []);

  const isArabic = currentLang.startsWith("ar");

  const checkAdmin = async (): Promise<void> => {
    try {
      // ✅ get current user INSIDE context
      const currentUser = await sp.web.currentUser();
      const currentEmail = currentUser.Email?.toLowerCase();
      console.log("currentEmail: ", currentEmail);

      const users = await sp.web.siteGroups
        .getByName("CDA_Intranet_Admins")
        .users();

      const admin = users.some(
        (u: any) => u.Email?.toLowerCase() === currentEmail,
      );

      setIsAdmin(admin);
    } catch (err) {
      console.error("Admin check failed:", err);
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    checkAdmin();
  }, []);

  return (
    <LanguageContext.Provider
      value={{
        currentLang,
        setCurrentLang: setCurrentLangStable,
        isArabic,
        isAdmin,
        context,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context)
    throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};
