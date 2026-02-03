/* eslint-disable @rushstack/no-new-null */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-var-requires */
import * as React from "react";
import { useEffect, useState } from "react";
import { getCurrentSelection } from "../../Services/SPServices/SpServices";
import SectorLayout from "./Sector/SectorLayout";
import NewsPage from "./NewsCarousel/NewsPage";
import NewsDetail from "./NewsCarousel/NewsDetail";
import Layout from "./Layout/Layout";
import Mainpage from "./Mainpage";
import { useLanguage } from "./useContext/useContext";
import BackToTopButton from "./BacktoTopButton/BacktoTopButton.module";
import CommingSoon from "./CommingSoon/CommingSoon";
import styles from "./Layout/Layout.module.scss";

type SelectionType = {
  type: "dept" | "sector" | "newsPage" | "newsView" | "coming_soon" | null;
  id: string | null;
};

const img1 = require("../assets/images/logo.svg");

const MainpageWrapper = (): JSX.Element => {
  const { isArabic } = useLanguage();
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const year = new Date().getFullYear();

  const [selection, setSelection] = useState<SelectionType>({
    type: null,
    id: null,
  });

  useEffect(() => {
    const handleUrlChange = (): void => {
      setSelection(getCurrentSelection());
    };

    handleUrlChange();
    window.addEventListener("popstate", handleUrlChange);

    return () => window.removeEventListener("popstate", handleUrlChange);
  }, []);

  const goHome = (): void => {
    const url = new URL(window.location.href);
    url.search = "";
    window.history.pushState({}, "", url.toString());
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  /** ✅ Route Map (no switch / no if chains) */
  const routes: Record<string, React.ReactNode> = {
    dept: (
      <Layout
        childern="div"
        isFinish
        home={goHome}
        lang={isArabic}
        dept={selection.id}
      />
    ),

    sector: <SectorLayout id={selection.id!} home={goHome} />,

    newsPage: <NewsPage homepage={goHome} />,

    newsView: <NewsDetail id={selection.id!} homepage={goHome} />,
  };
  const isMainPage = !selection.type;

  return (
    <>
      {isMainPage ? (
        <div
          ref={scrollRef}
          style={{
            maxHeight: "calc(100vh - 48px)",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          <Mainpage />
          <BackToTopButton scrollContainerRef={scrollRef} />
        </div>
      ) : selection.type === "coming_soon" ? (
        <>
          <header className={styles.header}>
            {/* Top Bar */}
            <div className={styles.container}>
              <div className={styles.topBar}>
                <div className={styles.logoLeft}>
                  <img src={img1} alt="شعار هيئة تنمية المجتمع" />
                </div>
                <div>
                  <a
                    onClick={goHome}
                    className={styles.backLink}
                    dir={isArabic ? "rtl" : "ltr"}
                  >
                    <i
                      className="fas fa-home"
                      style={{
                        marginLeft: isArabic ? "10px" : 0,
                        marginRight: isArabic ? 0 : "10px",
                      }}
                    />
                    {isArabic ? "العودة للرئيسية" : "Return to Homepage"}
                  </a>
                </div>
              </div>
            </div>
          </header>
          <CommingSoon homepage={goHome} />
          <footer className={styles.footer}>
            <div className={styles.container}>
              <p dir={isArabic ? "rtl" : "ltr"}>
                &copy; {year}{" "}
                {isArabic
                  ? "جميع الحقوق محفوظة لهيئة تنمية المجتمع - دبي."
                  : "All rights reserved to the Community Development Authority – Dubai."}
              </p>
            </div>
          </footer>
        </>
      ) : (
        <div
          style={{
            maxHeight: "calc(100vh - 48px)",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          {routes[selection.type ?? ""]}
        </div>
      )}
    </>
  );
};

export default MainpageWrapper;
