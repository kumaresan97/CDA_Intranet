/* eslint-disable @typescript-eslint/no-var-requires */


import * as React from 'react'
import styles from "./Header.module.scss"

const logo = require("../../assets/images/logo.svg")

interface IDropdownState {
    view: 'sectors' | 'departments';
    selectedSector: string | null;
}

const Header = () => {

    const [dateTime, setDateTime] = React.useState<string>("");

    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    const [dropdownState, setDropdownState] = React.useState<IDropdownState>({
        view: 'sectors',
        selectedSector: null
    });
    const [departmentsPaneContent, setDepartmentsPaneContent] = React.useState(`  
        <div class="text-center text-gray-500 pt-16">
    <i class="fas fa-mouse-pointer fa-2x mb-3"></i>
    <p>مرر الفأرة فوق قطاع لعرض الإدارات</p>
  </div>
        
        `);

    const departmentsData: Record<string, any[]> = {
        "المدير العام": [
            { name: "مكتب المدير العام", url: "departments/dg_message.html" },
            { name: "مكتب التدقيق الداخلي وإدارة المخاطر", url: "coming_soon.html" },
            { name: "إدارة التسويق والاتصال المؤسسي", url: "coming_soon.html" },
            { name: "إدارة الاستراتيجية والأداء المؤسسي", url: "departments/strategy_department.html" },
        ],
        "قطاع التنظيم والخدمات الاجتماعية": [
            { name: "إدارة التنمية الأسرية", url: "departments/family_department.html" },
            { name: "إدارة البرامج المجتمعية", url: "departments/community_programs_department.html" },
            { name: "إدارة التنظيم الاجتماعي", url: "coming_soon.html" },
        ],
        "قطاع التمكين المجتمعي": [
            { name: "إدارة كبار المواطنين", url: "departments/senior_citizens_department.html" },
            { name: "إدارة أصحاب الهمم", url: "departments/people_of_determination_department.html" },
            { name: "إدارة المنافع والتمكين المالي", url: "coming_soon.html" },
            { name: "إدارة الرعاية والتأهيل", url: "coming_soon.html" },
        ],
        "قطاع الدعم المؤسسي": [
            { name: "مكتب الشؤون القانونية", url: "coming_soon.html" },
            { name: "إدارة راس المال البشري", url: "departments/human_capital_department.html" },
            { name: "إدارة تقنية المعلومات والتحول الرقمي", url: "departments/it_department.html" },
            { name: "إدارة الشؤون الادارية المالية", url: "departments/financial_department.html" },
        ],
        "قطاع التطوير الاجتماعي": [
            { name: "المرصد الاجتماعي", url: "coming_soon.html" },
            { name: "إدارة إسعاد المتعاملين", url: "coming_soon.html" },
            { name: "إدارة السياسات والاستراتيجيات الاجتماعية", url: "departments/social_policies_department.html" },
            { name: "إدارة الحالات الاجتماعية", url: "coming_soon.html" },
            { name: "إدارة الفرص الاستثمارية والتمويل", url: "departments/investment_opportunities.html" },
        ],
    };

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

        setDateTime(now.toLocaleString("ar-AE", options));
    };

    React.useEffect(() => {
        updateDateTime(); // initial load

        const interval = setInterval(updateDateTime, 60000); // update every 1 minute
        return () => clearInterval(interval); // cleanup
    }, []);



    const sectors = Object.keys(departmentsData);

    const handleMobileMenuToggle = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleDesktopDropdownToggle = () => {
        setDropdownState({ view: 'sectors', selectedSector: null });
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

    const handleSectorHover = (sector: string) => {
        const departments = departmentsData[sector];
        setDepartmentsPaneContent(
            `<h3 class="dropdown-header !p-0 !mb-2">${sector}</h3>
       <div class="space-y-1">${departments.map(d =>
                `<a href="${d.url}" class="dropdown-item">${d.name}</a>`
            ).join('')}</div>`
        );
    };

    const renderDesktopDropdown = () => (
        <div
            // className="flex flex-row gap-6" 
            className={styles.dropdowncontainer}
        >
            {/* Sectors Column */}
            <div
                // className="w-1/3 border-l border-gray-200 pl-4"
                className={styles.sectorsColumn}
            >
                <h3 className="dropdown-header !p-0 !mb-2"
                // style={{
                //     padding: "0 !important",
                //     marginBottom: "0.5rem !important"
                // }}
                >القطاعات</h3>
                <div
                    // className="space-y-1"
                    className={styles.sectorItem}
                >
                    {sectors.map(sector => (
                        <button
                            key={sector}
                            data-sector={sector}
                            className={`sector-item ${styles.buttonItem}`}
                            // className="sector-item w-full text-right p-3 bg-gray-50 hover:bg-blue-100 rounded-lg transition-colors duration-200 flex justify-between items-center"
                            onMouseEnter={() => handleSectorHover(sector)}
                        >
                            <span
                                // className="font-semibold text-dds-blue-700"
                                className={styles.fontSemiBlue}
                            >{sector}</span>
                            <i className="fas fa-chevron-left 
                            text-dds-primary"
                            ></i>
                        </button>
                    ))}
                </div>
            </div>
            {/* Departments Column */}
            <div
                // className="w-2/3"
                className={styles.departmentContainer}
                id="departments-pane" dangerouslySetInnerHTML={{ __html: departmentsPaneContent }} />
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
                        <h3 className="flex-grow text-center font-bold text-white text-lg">[translate:{dropdownState.selectedSector}]</h3>
                    </div>
                    <div className="space-y-1">
                        {departments.map(dept => (
                            <a key={dept.name} href={dept.url} className="block text-white/90 p-2 rounded-lg hover:bg-white/20 text-sm pr-6">
                                [translate:{dept.name}]
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
                            <a href="index.html">
                                <img src={logo} alt="CDA Logo" className={styles.logoCda} />
                            </a>
                        </div>

                        <div className={styles.logoRight}>
                            <a href="https://www.dubai.ae/" target="_blank">
                                <img
                                    src="https://dda.gov.ae/.../logo-governmant-of-dubai-white.svg"
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
                                <a href="index.html" className="active"><i className="fas fa-home ml-2"></i>الرئيسية</a>

                                {/* <!-- Departments Dropdown --> */}
                                <div
                                    // className="relative"
                                    className={styles.departmentSection}
                                    id="departments-dropdown-container">
                                    <button id="departments-dropdown-button" className="navbar-links-button" onClick={handleDesktopDropdownToggle}
                                    >
                                        <i className="fas fa-sitemap "></i>
                                        <span>القطاعات والإدارات</span>
                                        <i
                                            className={`fas fa-chevron-down ${styles.icontext}`}
                                        // className="fas fa-chevron-down text-xs mr-2 transition-transform duration-200"
                                        ></i>
                                    </button>
                                    <div id="departments-dropdown-menu"
                                        className={styles.dropdownmenu}
                                    // className="absolute right-0 mt-2 w-screen max-w-4xl lg:w-[800px] bg-white rounded-lg shadow-2xl z-50 hidden text-black p-4"
                                    >
                                        <div className="dropdown-content">

                                            {renderDesktopDropdown()}

                                            {/* <!-- Content is injected by JS --> */}
                                        </div>
                                    </div>
                                </div>

                                <a href="coming_soon.html"><i className="fas fa-bell ml-2"></i>الإشعارات</a>
                                <a href="coming_soon.html"><i className="fas fa-phone-alt ml-2"></i>اتصل بنا</a>
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
                        href="index.html"
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
                        href="coming_soon.html"
                        className={styles.menuItem}
                    >الإشعارات</a >
                    <a
                        href="coming_soon.html"

                        className={styles.menuItem}
                    >اتصل بنا</a>
                </div>
            </div>

        </div>
    )
}

export default Header
