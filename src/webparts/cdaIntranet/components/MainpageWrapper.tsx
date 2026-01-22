// import * as React from "react";
// import { useEffect, useState } from "react";
// import { getCurrentSelection } from "../../Services/SPServices/SpServices";
// // import MainpageContent from "./MainpageContent";
// import SectorLayout from "./Sector/SectorLayout";
// import NewsPage from "./NewsCarousel/NewsPage";
// import NewsDetail from "./NewsCarousel/NewsDetail";
// import Layout from "./Layout/Layout";
// import { useLanguage } from "./useContext/useContext";
// import Mainpage from "./Mainpage";

// const MainpageWrapper = () => {
//     const { isArabic } = useLanguage();

//     const [selection, setSelection] = useState<{
//         type: "dept" | "sector" | "newsPage" | "newsView" | null;
//         id: string | null;
//     }>({ type: null, id: null });

//     useEffect(() => {
//         const handleUrlChange = () => {
//             setSelection(getCurrentSelection());
//         };

//         handleUrlChange();
//         window.addEventListener("popstate", handleUrlChange);

//         return () => window.removeEventListener("popstate", handleUrlChange);
//     }, []);

//     const goHome = () => {
//         const url = new URL(window.location.href);
//         url.search = "";
//         window.history.pushState({}, "", url.toString());
//         window.dispatchEvent(new PopStateEvent("popstate"));
//     };

//     // 🔁 ROUTE SWITCH ONLY
//     switch (selection.type) {
//         case "dept":
//             return (
//                 <Layout childern={`div`} isFinish home={goHome} lang={isArabic} dept={selection.id}>
//                     <div />
//                 </Layout>
//             );

//         case "sector":
//             return <SectorLayout id={selection.id!} home={goHome} />;

//         case "newsPage":
//             return <NewsPage homepage={goHome} />;

//         case "newsView":
//             return <NewsDetail id={selection.id!} homepage={goHome} />;

//         default:
//             return <Mainpage />;
//     }
// };

// export default MainpageWrapper;

import * as React from "react";
import { useEffect, useState } from "react";
import { getCurrentSelection } from "../../Services/SPServices/SpServices";
import SectorLayout from "./Sector/SectorLayout";
import NewsPage from "./NewsCarousel/NewsPage";
import NewsDetail from "./NewsCarousel/NewsDetail";
import Layout from "./Layout/Layout";
import Mainpage from "./Mainpage";
import { useLanguage } from "./useContext/useContext";

type SelectionType = {
    type: "dept" | "sector" | "newsPage" | "newsView" | null;
    id: string | null;
};

const MainpageWrapper = () => {
    const { isArabic } = useLanguage();
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

    return (
        <div >
            {routes[selection.type ?? ""] ?? <Mainpage />}
        </div>
    );
};

export default MainpageWrapper;

