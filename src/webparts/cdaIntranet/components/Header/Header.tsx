/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable  @typescript-eslint/no-use-before-define */
import { sp } from '@pnp/sp/presets/all';
import { Switch } from 'antd';
import * as React from 'react'
import { useLanguage } from '../useContext/useContext';
import styles from "./Header.module.scss"
const logo = require("../../assets/images/logo.svg")
const logo1 = require("../../assets/images/dubai-logo.svg")
interface IDropdownState {
    view: 'sectors' | 'departments';
    selectedSector: string | null;
}
const Header = () => {
    const { currentLang, setCurrentLang, isArabic } = useLanguage();
    const [dateTime, setDateTime] = React.useState<string>("");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    const [dropdownState, setDropdownState] = React.useState<IDropdownState>({
        view: 'sectors',
        selectedSector: null
    });
    const [isopen, setIsopen] = React.useState(false)
    const [hoveredSector, setHoveredSector] = React.useState<string | null>(null);



    const [departmentsData, setDepartmentsData] = React.useState<Record<string, any[]>>({});
    const [sectorUrls, setSectorUrls] = React.useState<
        Record<string, { id: number; url: string; name: string }>
    >({});
    // const [isArabic, setIsArabic] = useState(false);

    const getDepartments = async () => {
        return await sp.web.lists
            .getByTitle("Config_Department")
            .items.select(
                "ID",
                "Department_En",
                "Department_Ar",
                "slug",
                "Sector/ID",
                "Sector/Title",
                "Sector/Title_Ar"
            )
            .expand("Sector")();
    };
    const getSectors = async () => {
        return await sp.web.lists
            .getByTitle("Config_Sector")
            .items.select("ID", "Title", "Title_Ar", "Url")();
    };

    const buildDropdownData = (
        sectors: any[],
        departments: any[],
        lang: any
    ) => {
        const dropdownData: Record<string, any[]> = {};
        const sectorMeta: Record<
            string,
            { id: number; url: string; name: string }
        > = {};

        // const sectorUrls: Record<string, string> = {};

        // 1️⃣ Prepare sector keys
        sectors.forEach(sec => {
            const sectorName = lang === "ar" ? sec.Title_Ar : sec.Title;
            dropdownData[sectorName] = [];
            sectorMeta[sectorName] = {
                id: sec.ID,
                url: sec.Url,
                name: sectorName
            };
            // sectorUrls[sectorName] = sec.Url;
        });

        // 2️⃣ Attach departments to sectors
        departments.forEach(dep => {
            const sectorName =
                lang === "ar" ? dep.Sector.Title_Ar : dep.Sector.Title;

            if (!dropdownData[sectorName]) return;

            dropdownData[sectorName].push({
                id: dep.ID, // department ID
                name: lang === "ar" ? dep.Department_Ar : dep.Department_En,
                slug: dep.Slug,
                sectorId: dep.Sector.ID // parent sector ID
            });
        });

        return { dropdownData, sectorMeta };
    };



    React.useEffect(() => {
        const loadData = async () => {
            const [sectors, departments] = await Promise.all([

                getSectors(),
                getDepartments()
            ]);

            const { dropdownData, sectorMeta } = buildDropdownData(
                sectors,
                departments,
                isArabic ? "ar" : "en"
            );

            console.log("departments: ", departments);
            console.log("sectors: ", sectors);
            setDepartmentsData(dropdownData);
            setSectorUrls(sectorMeta);
        };

        loadData();
    }, [isArabic]);

    // const departmentsData_Ar: Record<string, any[]> = {
    //     "المدير العام": [
    //         {
    //             name: "مكتب المدير العام",
    //             url: "dg_message"
    //         },
    //         { name: "مكتب التدقيق الداخلي وإدارة المخاطر", url: "coming_soon.html" },
    //         { name: "إدارة التسويق والاتصال المؤسسي", url: "coming_soon.html" },
    //         { name: "إدارة الاستراتيجية والأداء المؤسسي", url: "departments/strategy_department" },
    //     ],
    //     "قطاع التنظيم والخدمات الاجتماعية": [
    //         { name: "إدارة التنمية الأسرية", url: "departments/family_department.html" },
    //         { name: "إدارة البرامج المجتمعية", url: "departments/community_programs_department" },
    //         { name: "إدارة التنظيم الاجتماعي", url: "coming_soon.html" },
    //     ],
    //     "قطاع التمكين المجتمعي": [
    //         { name: "إدارة كبار المواطنين", url: "departments/senior_citizens_department" },
    //         { name: "إدارة أصحاب الهمم", url: "departments/people_of_determination_department" },
    //         { name: "إدارة المنافع والتمكين المالي", url: "coming_soon.html" },
    //         { name: "إدارة الرعاية والتأهيل", url: "coming_soon.html" },
    //     ],
    //     "قطاع الدعم المؤسسي": [
    //         { name: "مكتب الشؤون القانونية", url: "coming_soon.html" },
    //         {
    //             name: "إدارة راس المال البشري",
    //             url: "human_capital_department"
    //         },
    //         { name: "إدارة تقنية المعلومات والتحول الرقمي", url: "departments/it_department" },
    //         {
    //             name: "إدارة الشؤون الادارية المالية",
    //             url: "financial_department"
    //         },
    //     ],
    //     "قطاع التطوير الاجتماعي": [
    //         { name: "المرصد الاجتماعي", url: "coming_soon.html" },
    //         { name: "إدارة إسعاد المتعاملين", url: "coming_soon.html" },
    //         { name: "إدارة السياسات والاستراتيجيات الاجتماعية", url: "departments/social_policies_department" },
    //         { name: "إدارة الحالات الاجتماعية", url: "coming_soon.html" },
    //         { name: "إدارة الفرص الاستثمارية والتمويل", url: "departments/investment_opportunities" },
    //     ]
    // }
    // const sectorUrls: any = {
    //     "المدير العام": "sectors/director_general_sector.html",
    //     "قطاع التنظيم والخدمات الاجتماعية": "sectors/social_regulation_sector.html",
    //     "قطاع التمكين المجتمعي": "sectors/community_empowerment_sector.html",
    //     "قطاع الدعم المؤسسي": "sectors/corporate_support_sector.html",
    //     "قطاع التطوير الاجتماعي": "sectors/social_development_sector.html"
    // };
    // const departmentsData_En: Record<string, any[]> = {
    //     "Director General": [
    //         { name: "Director General Office", url: "dg_message" },
    //         { name: "Internal Audit & Risk Management Office", url: "coming_soon.html" },
    //         { name: "Marketing & Corporate Communications", url: "coming_soon.html" },
    //         {
    //             name: "Strategy & Corporate Performance Department",
    //             url: "strategy_department"
    //         },
    //     ],
    //     "Social Regulation & Social Services Sector": [
    //         { name: "Family Development Department", url: "departments/family_department" },
    //         { name: "Community Programs Department", url: "departments/community_programs_department" },
    //         { name: "Social Regulation Department", url: "coming_soon.html" },
    //     ],
    //     "Community Empowerment Sector": [
    //         { name: "Senior Citizens Department", url: "departments/senior_citizens_department" },
    //         { name: "People of Determination Department", url: "departments/people_of_determination_department" },
    //         { name: "Financial Benefits & Empowerment Department", url: "coming_soon.html" },
    //         { name: "Care & Rehabilitation Department", url: "coming_soon.html" },
    //     ],
    //     "Corporate Support Sector": [
    //         { name: "Legal Affairs Office", url: "coming_soon.html" },
    //         {
    //             name: "Human Capital Department",
    //             url: "human_capital_department"
    //         },
    //         { name: "IT & Digital Transformation Department", url: "departments/it_department" },
    //         {
    //             name: "Administrative & Financial Affairs Department",
    //             url: "financial_department"
    //         },
    //     ],
    //     "Social Development Sector": [
    //         { name: "Social Observatory", url: "coming_soon.html" },
    //         { name: "Customer Happiness Department", url: "coming_soon.html" },
    //         { name: "Social Policies & Strategies Department", url: "departments/social_policies_department" },
    //         { name: "Social Cases Department", url: "coming_soon.html" },
    //         { name: "Investment Opportunities & Funding Department", url: "departments/investment_opportunities" },
    //     ],
    // };
    // const departmentsData = currentLang === 'en' ? departmentsData_En : departmentsData_Ar
    const updateDateTime = () => {
        const now = new Date();
        const options: Intl.DateTimeFormatOptions = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,

        };
        const locale = currentLang === 'en' ? 'en-US' : 'ar-AE';
        setDateTime(now.toLocaleString(locale, options));
    };

    React.useEffect(() => {
        updateDateTime(); // initial load
        const interval = setInterval(updateDateTime, 60000); // update every 1 minute
        return () => clearInterval(interval); // cleanup
    }, [currentLang]);
    const sectors = Object.keys(departmentsData);

    const handleMobileMenuToggle = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleDesktopDropdownToggle = () => {
        setDropdownState({ view: 'sectors', selectedSector: null });
        setIsopen(prev => !prev);
        setHoveredSector(null);
    };
    const handleMobileDepartmentsToggle = () => {
        setDropdownState(prev => ({ ...prev, view: prev.view === 'sectors' ? 'departments' : 'sectors' }));
    };

    const handleSectorClick = (sector: string, isMobile: boolean = false) => {
        if (isMobile) {
            setDropdownState({ view: 'departments', selectedSector: sector });
        }
    };

    const handleMobileBack = () => {
        setDropdownState({ view: 'sectors', selectedSector: null });
    };
    // const updateQueryParam = (value: string): void => {
    //     const url = new URL(window.location.href);
    //     url.searchParams.set('dept', value);
    //     window.history.replaceState({}, '', url.toString());
    //     window.dispatchEvent(new PopStateEvent('popstate', { state: null }));
    // };
    // const updateSectorQueryParam = (value: string): void => {
    //     const url = new URL(window.location.href);
    //     url.searchParams.set('Sector', value);
    //     window.history.replaceState({}, '', url.toString());
    //     window.dispatchEvent(new PopStateEvent('popstate', { state: null }));
    // };


    const updateSectorQueryParam = (value: string): void => {
        const url = new URL(window.location.href);

        url.searchParams.delete("dept"); // remove dept if switching
        url.searchParams.set("sector", value);

        window.history.replaceState({}, "", url.toString());
        window.dispatchEvent(new PopStateEvent("popstate"));
    };

    const updateQueryParam = (value: string): void => {
        const url = new URL(window.location.href);

        url.searchParams.delete("sector"); // remove sector if switching
        url.searchParams.set("dept", value);

        window.history.replaceState({}, "", url.toString());
        window.dispatchEvent(new PopStateEvent("popstate"));
    };




    const handleSectorHover = (sector: string) => {
        setHoveredSector(sector);
    };
    const renderDesktopDropdown = () => (
        <div
            className={styles.dropdowncontainer} >
            {/* Sectors Column */}
            <div className={styles.sectorsColumn}
                style={{
                    borderLeft: isArabic ? "1px solid var(--dds-gray-200)" : "none",
                    borderRight: !isArabic ? "1px solid var(--dds-gray-200)" : "none",
                    paddingLeft: isArabic ? "0" : "1rem",
                    paddingRight: isArabic ? "1rem" : "0",

                }}
            >
                <h3
                    style={{
                        textAlign: isArabic ? "right" : "left"
                    }}
                >{isArabic ? "القطاعات" : "Sectors"}</h3>
                <div
                    // className="space-y-1"
                    className={styles.sectorItem}
                >
                    {sectors.map(sector => (
                        <button
                            key={sector}
                            data-sector={sector}
                            style={{
                                textAlign: isArabic ? "right" : "left"
                            }}
                            className={`sector-item ${styles.buttonItem}`}
                            onMouseEnter={() => handleSectorHover(sector)}
                        >
                            <span
                                className={styles.fontSemiBlue}
                            >{sector}</span>
                            <i
                                className={`fas ${isArabic ? "fa-chevron-left" : "fa-chevron-right"
                                    } text-dds-primary`}
                            />

                            {/* <i className="fas fa-chevron-left 
                            text-dds-primary"
                            ></i> */}
                        </button>
                    ))}
                </div>
            </div>
            {/* Departments Column */}
            <div className={styles.departmentContainer}
                id="departments-pane"
            >
                {hoveredSector && departmentsData[hoveredSector] ? (
                    <>
                        {/* <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "0.75rem",
                            paddingBottom: "0.5rem",
                            // borderBottom: "1px solid #f3f4f6",
                        }}>
                            <h3 className="dropdown-header !p-0 !mb-2" style={{
                                flexGrow: 1
                            }}>{hoveredSector}</h3>

                            <i
                                title='Sector View'
                                onClick={() => {

                                    updateSectorQueryParam(sectorUrls[hoveredSector]?.id.toString() || "");
                                }}
                                className="fas fa-arrow-left"
                                style={{
                                    marginRight: "0.25rem",
                                    cursor: "pointer",
                                    backgroundColor: "#e0e7ff",
                                    padding: "0.5rem",
                                    borderRadius: "50%",
                                    color: "#3730a3",
                                    // mr-1
                                }}
                            ></i>
                            <p>Sector view</p>
                        </div> */}

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: "0.75rem",
                                paddingBottom: "0.5rem",
                            }}
                        >
                            {/* LEFT : Sector title */}
                            <h3
                                className="dropdown-header !p-0 !mb-0"
                                style={{ flexGrow: 1, textAlign: isArabic ? "right" : "left" }}
                            >
                                {hoveredSector}
                            </h3>

                            {/* RIGHT : Arrow + text */}
                            <div
                                onClick={() => {
                                    updateSectorQueryParam(
                                        sectorUrls[hoveredSector]?.id?.toString() || ""
                                    );
                                }}
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "0.4rem",
                                    cursor: "pointer",
                                    color: '#004a70',
                                    fontWeight: 500,
                                }}
                                title="Sector View"
                            >
                                <span>Sector view</span>

                                <i
                                    className={isArabic ? "fas fa-arrow-left" : "fas fa-arrow-right"}
                                    style={{
                                        backgroundColor: "#e0e7ff",
                                        padding: "0.45rem",
                                        borderRadius: "50%",
                                        fontSize: "0.75rem",
                                    }}
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            {departmentsData[hoveredSector].map((d) => (
                                <a
                                    key={d.name}
                                    href="#"
                                    className="dropdown-item block w-full text-right p-3 hover:bg-blue-100 rounded-lg transition-colors"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        updateQueryParam(d.id); // Single value as requested
                                    }}
                                >
                                    {d.name}
                                </a>
                            ))}
                        </div>
                    </>

                ) : (
                    <div className={styles.emptyMsg}>
                        <i
                            className="fas fa-mouse-pointer fa-2x mb-3"
                        ></i>
                        <p>{isArabic ? "مرر الفأرة فوق قطاع لعرض الإدارات" : "Hover over a sector to view departments"}</p>
                    </div>
                )}
            </div>
        </div>
    );

    const renderMobileDropdown = () => {
        if (dropdownState.view === 'sectors') {
            return sectors.map(sector => (
                <button
                    key={sector}
                    data-sector={sector}
                    className="sector-link w-full text-right block text-white/90 p-3 rounded-lg hover:bg-white/20 text-sm flex justify-between items-center"
                    onClick={() => handleSectorClick(sector, true)}
                >
                    <span>{sector}</span>
                    <i className="fas fa-chevron-left text-xs"></i>
                </button>
            ));
        }
        if (dropdownState.view === 'departments' && dropdownState.selectedSector) {
            const departments = departmentsData[dropdownState.selectedSector];
            return (
                <>
                    <div className="flex items-center mb-4">
                        <button
                            className="back-to-sectors text-white/90 p-3 rounded-lg hover:bg-white/20 font-bold"
                            onClick={handleMobileBack}
                        >
                            <i className="fas fa-arrow-right ml-2"></i> [translate:رجوع]
                        </button>
                        <h3 className="flex-grow text-center font-bold text-white text-lg">{dropdownState.selectedSector}</h3>
                    </div>
                    <div className="space-y-1">
                        {departments.map(dept => (
                            <a key={dept.name} href={dept.url} className="block text-white/90 p-2 rounded-lg hover:bg-white/20 text-sm pr-6">
                                {dept.name}
                            </a>
                        ))}
                    </div>
                </>
            );
        }
        return null;
    };
    return (
        <div >
            <header className={styles.header}>
                <div className={styles.container}>
                    <div className={styles.topBar}>
                        <div className={styles.logoLeft}>
                            <a
                            // href="index.html"
                            >
                                <img src={logo} alt="CDA Logo" className={styles.logoCda} />
                            </a>
                        </div>
                        <div className={styles.logoRight}>
                            <a
                                // href="https://www.dubai.ae/"
                                target="_blank">
                                <img
                                    src={logo1}
                                    className={styles.logoDubai}
                                />
                            </a>
                        </div>
                        <div className={styles.menuBtnBox}>
                            <button id="mobile-menu-button" className={styles.mobileMenuButton}>
                                <i className="fas fa-bars"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <nav id="main-nav" className={`bg-dds-blue-700  ${styles.mainNavHeader}`}>
                    <div className={styles.mainNavContainer}>
                        <div className={`navbar-links ${styles.subMenu}`}>
                            <div className={styles.leftSection}>
                                <div style={{
                                    ...(isArabic ? { marginLeft: 20 } : { marginRight: 20 })
                                }}>
                                    <Switch
                                        checkedChildren="En"
                                        unCheckedChildren="Ar"
                                        checked={currentLang === 'en'}
                                        onChange={(checked) => setCurrentLang(checked ? 'en' : 'ar')}
                                    />
                                </div>
                                <a
                                    // href="index.html"
                                    className="active">
                                    <i className="fas fa-home ml-2"></i>
                                    {isArabic ? "الرئيسية" : "Home"}
                                </a>
                                {/* <!-- Departments Dropdown --> */}
                                <div
                                    className={styles.departmentSection}
                                    id="departments-dropdown-container">
                                    <button id="departments-dropdown-button" className="navbar-links-button" onClick={handleDesktopDropdownToggle}
                                    >
                                        <i className="fas fa-sitemap "></i>
                                        <span>{isArabic ? "القطاعات والإدارات" : "Sectors & Departments"}</span>
                                        <i
                                            className={`fas fa-chevron-down ${styles.icontext}`}
                                            style={{
                                                transition: 'transform 0.2s',
                                                transform: isopen ? 'rotate(180deg)' : 'rotate(0deg)',
                                            }}
                                        ></i>
                                    </button>
                                    <div id="departments-dropdown-menu"
                                        className={styles.dropdownmenu}
                                        style={{
                                            display: isopen ? "block" : "none",
                                            right: isArabic ? 0 : "unset",
                                            left: !isArabic ? 0 : "unset"
                                        }}
                                    >
                                        <div className="dropdown-content">
                                            {renderDesktopDropdown()}
                                            {/* <!-- Content is injected by JS --> */}
                                        </div>
                                    </div>

                                </div>
                                <a
                                // href="coming_soon.html
                                // "
                                >
                                    <i className="fas fa-bell ml-2"></i>
                                    {isArabic ? "الإشعارات" : "Notifications"}
                                </a>

                                <a
                                // href="coming_soon.html"
                                >
                                    <i className="fas fa-phone-alt ml-2"></i>
                                    {isArabic ? "اتصل بنا" : "Contact Us"}
                                </a>
                            </div>
                            <div id="datetime" className={styles.rightSection}>
                                {dateTime}
                            </div>
                        </div>
                    </div>
                </nav>
            </header>

            {/* <!-- Mobile Menu --> */}
            <div id="mobile-menu" className={styles.mobileSidebar} >
                <div className={styles.mobilemenuContainer}>
                    <button id="close-mobile-menu" className={styles.title} onClick={handleMobileMenuToggle} >
                        &times;
                    </button>
                    <a
                        // href="index.html"
                        className={styles.menuItem}
                    >الرئيسية</a >

                    {/* <!-- Mobile Departments Accordion --> */}
                    <div>
                        <button
                            id="mobile-departments-button"
                            className={styles.mobiledepartment}
                            onClick={handleMobileDepartmentsToggle}

                        >
                            <span>القطاعات والإدارات</span>
                            <i
                                className={`fas fa-chevron-down ${styles.smallTextAnimated}`}
                            ></i>
                        </button>
                        <div
                            id="mobile-departments-content"
                            className={styles.hiddenList}
                        >
                            {renderMobileDropdown()}

                            {/* <!-- Mobile content is injected by JS --> */}
                        </div>
                    </div>

                    <a
                        // href="coming_soon.html"
                        className={styles.menuItem}
                    >الإشعارات</a >
                    <a
                        // href="coming_soon.html"

                        className={styles.menuItem}
                    >اتصل بنا</a>
                </div>
            </div>

        </div>
    )
}

export default Header
