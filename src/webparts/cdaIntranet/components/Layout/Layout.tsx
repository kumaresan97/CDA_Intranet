/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { sp } from '@pnp/sp/presets/all';
import * as React from 'react'
import { useEffect, useState } from 'react';
import CommingSoon from '../CommingSoon/CommingSoon';
import AboutSection from '../Department/About/DepartmentAbout';
import ResourceSection from '../Department/Card/DepartmentCard';
import DepartmentFormResource from '../Department/Form/DepartmentFormResource';
import DepartmentHeader from '../Department/Header/Departmentheader';
import DepartmentService from '../Department/Service/DepartmentService';
import MessageSecction from '../MessageSection/MessageSecction';
import styles from "./Layout.module.scss"
const img1 = require("../../assets/images/logo.svg")
const Layout = ({ home, lang, dept }: any): JSX.Element => {
    const [loading, setLoading] = React.useState(true);
    const [deptInfo, setDeptInfo] = useState<any>(null);
    const year = new Date().getFullYear();
    const loadDeptData = async () => {
        setLoading(true);
        // 1️⃣ Get Department
        const deptData = await sp.web.lists
            .getByTitle("Config_Department")
            // .getByTitle("Department_About")
            .items
            // .filter(`DepartmentId eq '${dept}'`)
            .filter(`ID eq '${dept}'`)
            .select("*,AttachmentFiles")
            .expand("AttachmentFiles")();
        console.log("deptData: ", deptData);
        if (deptData.length === 0) {
            setLoading(false);
            return;
        }
        const d = deptData[0];
        const deptPayload = {
            id: d.Id,
            // title: lang ? d.Title_Ar : d.Title,
            title: lang ? d.Department_Ar : d.Department_En,
            subtitle: lang ? d.Description_Ar : d.Description,
            icon:
                d.AttachmentFiles?.length > 0
                    ? d.AttachmentFiles[0].ServerRelativeUrl
                    : null,
            about: lang ? d.About_Ar : d.About
        };

        setDeptInfo(deptPayload);

        setLoading(false);



    };
    useEffect(() => {
        if (dept !== "dg_message" && dept !== "coming_soon") {
            loadDeptData();
        }

    }, [dept]);
    return (
        <div dir={lang ? "rtl" : "ltr"}>
            <header className={styles.header}>
                {/* Top Bar */}
                <div className={styles.container}>
                    <div className={styles.topBar}>
                        <div className={styles.logoLeft}>
                            <img src={img1} alt="شعار هيئة تنمية المجتمع"
                            />
                        </div>
                        <div >
                            <a
                                onClick={home}
                                // href="../index.html"
                                className={styles.backLink}>
                                <i className="fas fa-home"
                                    style={{
                                        marginLeft: lang ? "0.5rem" : 0,
                                        marginRight: lang ? 0 : "0.5rem"
                                    }}
                                ></i>
                                {lang ? "العودة للرئيسية" : "Return to Homepage"}
                            </a>
                        </div>
                    </div>
                </div>
            </header>
            {/* {dept == "dg_message" ? */}
            {dept === "dg_message" ?

                <MessageSecction lang={lang} ></MessageSecction>
                // <main className={styles.mainContainer}>

                //     <section className={styles.pageHeader}>
                //         <i className="fas fa-user-tie"></i>
                //         <h1>{lang ? speechdata[0]?.titleAr : speechdata[0]?.title}</h1>
                //         <p>{lang ? speechdata[0].designationAr : speechdata[0]?.designationEn}</p>
                //     </section>

                //     <div className={`dds-card ${styles.ddsCard}`}>
                //         <div className={styles.contentWrapper}>

                //             <div className={styles.imageSection}>
                //                 <img
                //                     loading='lazy'
                //                     src={speechdata[0]?.image}
                //                     alt="معالي حصة بنت عيسى بوحميد"
                //                 />
                //                 <h3>{lang ? speechdata[0].nameAr : speechdata[0]?.nameEn}</h3>
                //                 <p>{lang ? speechdata[0].designationAr : speechdata[0]?.designationEn}</p>
                //             </div>

                //             <div className={styles.messageSection}>

                //                 {(lang ? speechdata[0]?.descAr : speechdata[0]?.descEn)
                //                     ?.split("\n")
                //                     .map((p: string, i: number) => (
                //                         <p key={i}>{p}</p>
                //                     ))}
                //             </div>
                //         </div>
                //     </div>
                // </main>
                : dept == "coming_soon" ? <CommingSoon homepage={home} /> : deptInfo ?
                    <div className={styles.mainContainer} >

                        {/* HEADER */}
                        <DepartmentHeader
                            icon={deptInfo?.icon}
                            title={deptInfo?.title}
                            subtitle={deptInfo?.subtitle}
                            loading={loading}
                        />
                        <div className={` dds-card ${styles.ddsCard}`}>
                            {/* ABOUT */}
                            <AboutSection
                                title={lang ? "نبذة عن الإدارة" : "About the administration"}
                                icon="fas fa-info-circle"
                                content={deptInfo?.about}
                                loading={loading}
                            />
                            <DepartmentService
                                // deptId={deptInfo}
                                deptId={dept}
                                lang={lang}
                            />
                            {/* POLICIES */}
                            <ResourceSection
                                // id={deptInfo}
                                id={dept}
                                lang={lang}
                            />
                            <DepartmentFormResource
                                // deptId={deptInfo}
                                deptId={dept}
                                lang={lang}
                            />
                        </div>
                    </div> : <CommingSoon homepage={home} />
            }
            <footer className={styles.footer}>
                <div className={styles.container}>
                    {/* <p>
                        &copy; {year} جميع الحقوق محفوظة لهيئة تنمية المجتمع - دبي.
                    </p> */}

                    <p dir={lang ? "rtl" : "ltr"}>
                        &copy; {year}{" "}
                        {lang
                            ? "جميع الحقوق محفوظة لهيئة تنمية المجتمع - دبي."
                            : "All rights reserved to the Community Development Authority – Dubai."}
                    </p>
                </div>
            </footer>
        </div>
    )
}

export default Layout
