

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

type SelectionType = {
    type: "dept" | "sector" | "newsPage" | "newsView" | null;
    id: string | null;
};

const MainpageWrapper = () => {
    const { isArabic } = useLanguage();
    const scrollRef = React.useRef<HTMLDivElement>(null);

    // const dir = isArabic ? "rtl" : "ltr";

    const [selection, setSelection] = useState<SelectionType>({
        type: null,
        id: null,
    });

    useEffect(() => {
        const handleUrlChange = () => {
            setSelection(getCurrentSelection());
        };

        handleUrlChange();
        window.addEventListener("popstate", handleUrlChange);

        return () => window.removeEventListener("popstate", handleUrlChange);
    }, []);

    const goHome = () => {
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
            >
                <div />
            </Layout>
        ),

        sector: <SectorLayout id={selection.id!} home={goHome} />,

        newsPage: <NewsPage homepage={goHome} />,

        newsView: <NewsDetail id={selection.id!} homepage={goHome} />,
    };
    const isMainPage = !selection.type;


    return (
        // <div ref={scrollRef}
        //     style={{
        //         maxHeight: "calc(100vh - 48px)",
        //         overflowY: "auto",
        //         overflowX: "hidden",
        //     }}
        // // dir={isArabic ? "rtl" : "ltr"}
        // >
        //     {routes[selection.type ?? ""] ?? <Mainpage ref={scrollRef} />}
        // </div>

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
            ) : (
                <div style={{
                    maxHeight: "calc(100vh - 48px)",
                    overflowY: "auto",
                    overflowX: "hidden",
                }}>
                    {routes[selection.type ?? ""]}
                </div>
            )}
        </>
    );
};

export default MainpageWrapper;

