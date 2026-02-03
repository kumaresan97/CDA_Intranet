/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as React from "react";
import Header from "./Header/Header";
import HeroSection from "./HeroSection/HeroSection";
import RotatingNews from "./News/RotatingNews";
import styles from "./CdaIntranet.module.scss";
import Category from "./Category/Category";
import UpcomingEvents from "./events/UpcomingEvents";
import NewsCarousel from "./NewsCarousel/NewsCarousel";
import TopService from "./TopService/TopService";
import Footer from "./Footer/Footer";
import ServicesResources from "./MainSection/MainSection";
import { useState, useEffect } from "react";
import {
  getAllServices,
  getCategories,
  getTypes,
} from "../../Services/ServiceCard/ServiceCard";
import { useLanguage } from "./useContext/useContext";
import { message } from "antd";

// Interfaces
export interface ICategoryItem {
  name: {
    ar: string;
    en: string;
  };
  icon: string;
}

export interface ICategory {
  all: ICategoryItem;
  favorite: ICategoryItem;
  gov: ICategoryItem;
  internal: ICategoryItem;
  support: ICategoryItem;
  planning: ICategoryItem;
  policies: ICategoryItem;
  innovation: ICategoryItem;
  knowledge: ICategoryItem;
  communication: ICategoryItem;
}

const dummyNews = [
  {
    ar: "ورشة عمل قادمة حول الابتكار في الخدمات الحكومية",
    en: "Upcoming workshop on innovation in government services",
  },
  {
    ar: "تم إطلاق خدمة جديدة في البوابة الداخلية",
    en: "A new service has been launched on the internal portal",
  },
  {
    ar: "تحديثات على نظام الموارد البشرية",
    en: "Updates on the human resources system",
  },
  {
    ar: "دورة تدريبية حول أمن المعلومات",
    en: "Training course on information security",
  },
  {
    ar: "إطلاق بوابة الموظفين الجديدة الشهر القادم",
    en: "Launch of the new employee portal next month",
  },
];
const categories: ICategory = {
  all: { name: { ar: "الكل", en: "Everyone" }, icon: "fas fa-th-large" },
  favorite: { name: { ar: "المفضلة", en: "Favorite" }, icon: "fas fa-star" },
  gov: {
    name: { ar: "تطبيقات حكومية", en: "Government Applications" },
    icon: "fas fa-building-columns",
  },
  internal: {
    name: { ar: "تطبيقات داخلية", en: "Internal Applications" },
    icon: "fas fa-network-wired",
  },
  support: {
    name: { ar: "دعم فني", en: "Technical Support" },
    icon: "fas fa-headset",
  },
  planning: { name: { ar: "تخطيط", en: "Planning" }, icon: "fas fa-tasks" },
  policies: { name: { ar: "السياسات", en: "Policies" }, icon: "fas fa-gavel" },
  innovation: {
    name: { ar: "الابتكار", en: "Innovation" },
    icon: "fas fa-lightbulb",
  },
  knowledge: {
    name: { ar: "بوابة المعارف", en: "Knowledge Portal" },
    icon: "fas fa-brain",
  },
  communication: {
    name: { ar: "التواصل", en: "Communication Platform" },
    icon: "fas fa-comments",
  },
};
const Mainpage = ({ context, ref }: any) => {
  const { currentLang, isArabic } = useLanguage(); // ✅ Stable reference
  const [category, setCategory] = React.useState<
    { id: number; en: string; ar: string }[]
  >([]);
  const [types, setTypes] = React.useState<
    { id: number; en: string; ar: string }[]
  >([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<keyof ICategory>("all");
  const [servicesData, setServicesData] = useState<any[]>([]);

  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      try {
        const [services, categoryList, typeList] = await Promise.all([
          getAllServices(),
          getCategories(),
          getTypes(),
        ]);
        // Services
        setServicesData(services);
        setCategory(categoryList);
        // Types
        setTypes(typeList);
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

  return (
    <div className="antialiased">
      <div>
        <div dir={isArabic ? "rtl" : "ltr"}>
          <Header />
          <RotatingNews newsData={dummyNews} lang={currentLang} />
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
                <ServicesResources
                  lang={currentLang}
                  category={category}
                  types={types}
                  serviceData={servicesData}
                  setServicesData={setServicesData}
                  activeCategory={activeCategory}
                  loading={loading}
                  setLoading={setLoading}
                />
              </div>
              <div className={styles.rightSide}>
                <div className={styles.StickyContainer}>
                  <UpcomingEvents lang={currentLang} />
                  <NewsCarousel />
                  <TopService
                    servicesData={servicesData}
                    lang={currentLang}
                    loading={loading}
                  />
                </div>
              </div>
            </div>
          </div>
          <Footer lang={currentLang} />
        </div>
      </div>
    </div>
  );
};
export default Mainpage;
