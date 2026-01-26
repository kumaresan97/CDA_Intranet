/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as React from 'react'
import Header from './Header/Header'
import HeroSection from './HeroSection/HeroSection';
import RotatingNews from './News/RotatingNews'
import styles from "./CdaIntranet.module.scss"
import Category from './Category/Category';
import UpcomingEvents from './events/UpcomingEvents';
import NewsCarousel from './NewsCarousel/NewsCarousel';
import TopService from './TopService/TopService';
import Footer from './Footer/Footer';
import ServicesResources from './MainSection/MainSection';
import { useState, useEffect } from 'react';
// import BackToTopButton from './BacktoTopButton/BacktoTopButton.module';
import { getAllServices, getCategories, getTypes } from '../../Services/ServiceCard/ServiceCard';
// import Layout from './Layout/Layout';
// import { getCurrentDepartment, getCurrentSelection } from '../../Services/SPServices/SpServices';
// import { getCurrentSelection } from '../../Services/SPServices/SpServices';
import { useLanguage } from './useContext/useContext';
// import { getSpeechPageData } from '../../Services/getManagerspeech';
import { message } from 'antd';
// import SectorLayout from './Sector/SectorLayout';
// import Layout from './Layout/Layout';
// import NewsPage from './NewsCarousel/NewsPage';
// import NewsDetail from './NewsCarousel/NewsDetail';
// import SectorLayout from './Sector/SectorLayout';
// import NewsPage from './NewsCarousel/NewsPage';
const dummyNews = [
    {
        ar: "ورشة عمل قادمة حول الابتكار في الخدمات الحكومية",
        en: "Upcoming workshop on innovation in government services"
    },
    {
        ar: "تم إطلاق خدمة جديدة في البوابة الداخلية",
        en: "A new service has been launched on the internal portal"
    },
    {
        ar: "تحديثات على نظام الموارد البشرية",
        en: "Updates on the human resources system"
    },
    {
        ar: "دورة تدريبية حول أمن المعلومات",
        en: "Training course on information security"
    },
    {
        ar: "إطلاق بوابة الموظفين الجديدة الشهر القادم",
        en: "Launch of the new employee portal next month"
    }
];
const categories = {
    all: { name: { ar: "الكل", en: "Everyone" }, icon: "fas fa-th-large" },
    favorite: { name: { ar: "المفضلة", en: "Favorite" }, icon: "fas fa-star" },
    gov: { name: { ar: "تطبيقات حكومية", en: "Government application" }, icon: "fas fa-building-columns" },
    internal: { name: { ar: "تطبيقات داخلية", en: "Internal application" }, icon: "fas fa-network-wired" },
    support: { name: { ar: "دعم فني", en: "Technical support" }, icon: "fas fa-headset" },
    planning: { name: { ar: "تخطيط", en: "Planning" }, icon: "fas fa-tasks" },
    policies: { name: { ar: "السياسات", en: "Policies" }, icon: "fas fa-gavel" },
    innovation: { name: { ar: "الابتكار", en: "Innovation" }, icon: "fas fa-lightbulb" },
    knowledge: { name: { ar: "بوابة المعارف", en: "Knowledge Portal" }, icon: "fas fa-brain" },
    communication: { name: { ar: "التواصل", en: "Communication" }, icon: "fas fa-comments" },
};
const Mainpage = ({ context, ref }: any) => {
    // const [urlDept, setUrlDept] = useState<string | null>(null);
    const { currentLang, isArabic } = useLanguage(); // ✅ Stable reference
    // const scrollContainerRef = React.useRef<HTMLDivElement>(null);
    const [category, setCategory] = React.useState<{ id: number, en: string, ar: string }[]>([]);
    const [types, setTypes] = React.useState<{ id: number, en: string, ar: string }[]>([]);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [activeCategory, setActiveCategory] = useState<"all" | "favorite" | string>("all");
    const [servicesData, setServicesData] = useState<any[]>([]);
    // const [selection, setSelection] = useState<{
    //     type: "dept" | "sector" | "newsPage" | "newsView" | null;
    //     id: string | null;
    // }>({ type: null, id: null });
    // const [hero, setHero] = useState<any[]>([])
    // const[isLoading,setIsLoading]=useState<boolean>(false);
    // const [favorites, setFavorites] = useState<string[]>([]);

    useEffect(() => {
        const loadAllData = async () => {
            setLoading(true);
            try {
                // const [services, categoryList, typeList, herosec] = await Promise.all([
                const [services, categoryList, typeList] = await Promise.all([
                    getAllServices(),
                    getCategories(),
                    getTypes(),
                    // getSpeechPageData()
                ]);
                // Services 
                setServicesData(services);
                // const fav = services
                //     .filter((x: any) => x.IsFavorite)
                //     .map((x: any) => x.id); setFavorites(fav);
                // Upcoming Events
                // setHero(herosec ?? [])
                setCategory(categoryList)
                // Types
                setTypes(typeList)

            } catch (err) {
                console.error("Error loading data:", err);
            } finally {
                setLoading(false);
            }
        };
        loadAllData();
        message.config({
            top: 120,
            duration: 3,
        });
    }, []);

    // useEffect(() => {
    //     const handleUrlChange = () => {
    //         const dept = getCurrentDepartment();
    //         setUrlDept(dept);
    //     };
    //     // Initial load
    //     handleUrlChange();
    //     // Listen to URL changes
    //     window.addEventListener('popstate', handleUrlChange);
    //     // ✅ Cleanup INSIDE useEffect
    //     return () => {
    //         window.removeEventListener('popstate', handleUrlChange);
    //     };
    // }, []); 

    // useEffect(() => {
    //     const handleUrlChange = () => {
    //         setSelection(getCurrentSelection());
    //     };

    //     handleUrlChange(); // initial load
    //     window.addEventListener("popstate", handleUrlChange);

    //     return () => {
    //         window.removeEventListener("popstate", handleUrlChange);
    //     };
    // }, []);

    // const goHome = () => {
    //     const url = new URL(window.location.href);
    //     url.searchParams.delete('dept');
    //     window.history.replaceState({}, '', url.toString());
    //     setUrlDept(null); // ✅ Trigger re-render
    // };

    // const goHome = () => {
    //     const url = new URL(window.location.href);

    //     // Remove both query params
    //     url.searchParams.delete('dept');
    //     url.searchParams.delete('sector');

    //     // Update browser URL without reload
    //     window.history.replaceState({}, '', url.toString());

    //     // Reset state to trigger re-render
    //     setSelection({ type: null, id: null }); // using the unified state from previous hook
    // };
    // console.log(selection, "selection");

    // const goHome = () => {
    //     const url = new URL(window.location.href);

    //     // 🔥 remove EVERYTHING after ?
    //     url.search = "";

    //     window.history.pushState({}, "", url.toString());
    //     window.dispatchEvent(new PopStateEvent("popstate"));

    //     setSelection({ type: null, id: null });
    // };


    return (
        <div className='antialiased'>
            <div
            // ref={scrollContainerRef} id="top"
            // style={{
            //     maxHeight: `calc(100vh - 48px)`,
            //     // maxHeight: "calc(100vh - 70px)",
            //     overflowY: "auto",
            //     overflowX: "hidden"

            // }}
            >
                <div
                    dir={isArabic ? "rtl" : "ltr"}
                >




                    <Header />
                    <RotatingNews newsData={dummyNews}
                        lang={currentLang}
                    />
                    <div className={styles.container}>
                        <HeroSection lang={currentLang} loading={loading} />
                        <Category
                            categories={categories}
                            activeCategory={activeCategory}
                            onSelect={(key) => setActiveCategory(key)}
                            lang={currentLang}
                        />
                        <div className={styles.gridwrapper}>
                            {/* <!-- Right Column: Services & Resources --> */}
                            <div className={styles.leftContent}>

                                {/* <Search value={searchTerm}
                                                onChange={handleSearchChange} /> */}

                                <ServicesResources
                                    lang={currentLang}
                                    category={category}
                                    types={types}

                                    serviceData={servicesData}
                                    setServicesData={setServicesData}
                                    // favorites={favorites}
                                    // setFavorites={setFavorites}
                                    activeCategory={activeCategory}
                                    loading={loading}
                                    setLoading={setLoading}


                                />
                            </div>
                            <div className={styles.rightSide}>
                                <div className={styles.StickyContainer}>
                                    <UpcomingEvents
                                        lang={currentLang}
                                    />
                                    <NewsCarousel />
                                    <TopService servicesData={servicesData} lang={currentLang} loading={loading} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <Footer lang={currentLang}
                    />
                    {/* <BackToTopButton scrollContainerRef={ref} /> */}


                </div>


                {/* <BackToTopButton /> */}
            </div>
        </div>
    )
}
export default Mainpage


