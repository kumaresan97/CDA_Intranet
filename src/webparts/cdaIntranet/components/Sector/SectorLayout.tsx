/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable  @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/explicit-function-return-type */


import { sp } from '@pnp/sp/presets/all';
import { message, Modal, Skeleton } from 'antd';
import * as React from 'react'
import { useState } from 'react';
import CustomDragandDrop from '../FormInputs/DargandDrop/CustomDragandDrop';
import ReInput from '../FormInputs/Input/CustomInput';
import ReTextArea from '../FormInputs/TextArea/CustomTextArea';
import CustomModal from '../modal/Custommodal';
import { useLanguage } from '../useContext/useContext';
import styles from "./SectorLayout.module.scss"



const img1 = require("../../assets/images/logo.svg");
const DefaultImg: any = require("../../assets/images/Department.png")
interface IDepartmentForm {
    id: number | null;
    Title: string;
    Title_Ar: string;
    Description: string;
    Description_Ar: string;
    About?: string;
    About_Ar?: string;
    SectorId?: number | null;
    imgUrl: string | null;
    FileName: string | null;
    Icon: File | null;
    IsDelete: boolean;
}

interface IDepartment {
    id: any;
    title: string;
    title_Ar: string;
    description: string;
    descriptionAr: string;
    imgUrl: string | null;
    FileName: string | null;
    sectorId: number;
    IsDelete: boolean;
}


const SectorLayout = ({ id, home }: any) => {
    const [isopen, setIsopen] = useState(false);
    const [sectorLoading, setSectorLoading] = useState(true);
    const [deptLoading, setDeptLoading] = useState(true);

    const [errors, setErrors] = useState<any>({});
    const emptyDepartment: IDepartmentForm = {
        id: null,          // null → add | number → edit
        Title: "",
        Title_Ar: "",
        Description: "",
        Description_Ar: "",
        About: "",
        About_Ar: "",
        SectorId: null,
        // file: null as File | null,
        imgUrl: "",
        FileName: "",
        Icon: null as File | null,
        IsDelete: false
    };

    const [form, setForm] = React.useState<any>(emptyDepartment);
    const { isArabic, isAdmin } = useLanguage()
    const [sector, setSector] = useState<any>(null);
    const [departments, setDepartments] = useState<IDepartment[]>([]);
    const year = new Date().getFullYear();


    const handleChange = (name: string, value: any) => {
        setForm((prev: any) => ({
            ...prev,
            [name]: value
        }));
        setErrors((prev: any) => ({
            ...prev,
            [name]: ""
        }));
    };

    const editDepartment = (dept: any) => {

        setForm({
            id: dept.id,
            Title: dept.title,
            Title_Ar: dept.title_Ar,
            Description: dept.description,
            Description_Ar: dept.descriptionAr,
            About: dept.about,
            About_Ar: dept.aboutAr,
            SectorId: dept.sectorId,
            imgUrl: dept.imgUrl,
            FileName: dept.FileName,
            Icon: null,
            IsDelete: dept.IsDelete || false
        });
    };


    const getSectorById = async (sectorId: number, isArabic: boolean) => {
        const [sector] = await sp.web.lists
            .getByTitle("Config_Sector")
            .items
            .filter(`ID eq ${sectorId}`)
            .select(
                "ID",
                "Title",
                "Title_Ar",
                "Description_En",
                "Description_Ar",
                "Overview_En",
                "Overview_Ar",
                "AttachmentFiles"
            ).expand("AttachmentFiles")();

        return {
            id: sector.ID,
            title: isArabic ? sector.Title_Ar : sector.Title,
            description: isArabic ? sector.Description_Ar : sector.Description_En,
            overview: isArabic ? sector.Overview_Ar : sector.Overview_En,
            imgUrl: sector.AttachmentFiles.length > 0 ? sector.AttachmentFiles[0].ServerRelativeUrl : null
        };
    };

    const getDepartmentsBySector = async (sectorId: number) => {
        const items = await sp.web.lists
            .getByTitle("Config_Department")
            .items
            .select(
                "ID",
                "Title",
                "Title_Ar",
                "Description",
                "Description_Ar",
                "About",
                "About_Ar",
                "Department_En",
                "Department_Ar",
                "Sector/ID",
                "AttachmentFiles",
                "IsDelete"
            )
            .expand("Sector,AttachmentFiles")
            .filter(`Sector/ID eq ${sectorId} and IsDelete ne 1`)();

        let departments = items.map(dept => ({
            id: dept.ID,
            title: dept.Department_En,
            title_Ar: dept.Department_Ar,
            descriptionAr: dept.Description_Ar,
            description: dept.Description,
            aboutAr: dept.About_Ar,
            about: dept.About,
            imgUrl: dept.AttachmentFiles.length > 0 ? dept.AttachmentFiles[0].ServerRelativeUrl : null,
            FileName: dept.AttachmentFiles.length > 0 ? dept.AttachmentFiles[0].FileName : null,
            Icon: null,
            sectorId: dept.Sector.ID,
            IsDelete: dept.IsDelete || false

        }));

        return departments;
    };

    const saveDepartment = async () => {
        if (!validateForm()) return;

        setErrors({});
        setIsopen(false)


        try {
            setDeptLoading(true);
            let itemId: number = form.id;
            let imgUrl = form.imgUrl || null;
            let fileName = form.FileName || null;
            const sectorId = form.SectorId || Number(id);

            /* ================= ADD ================= */
            if (!form.id) {
                const result = await sp.web.lists
                    .getByTitle("Config_Department")
                    .items.add({
                        Department_En: form.Title,
                        Department_Ar: form.Title_Ar,
                        Description: form.Description,
                        Description_Ar: form.Description_Ar,
                        About: form.About,
                        About_Ar: form.About_Ar,
                        SectorId: sectorId,
                        IsDelete: false
                    });

                itemId = result.data.ID;
            }

            /* ================= UPDATE ================= */
            else {
                await sp.web.lists
                    .getByTitle("Config_Department")
                    .items.getById(itemId)
                    .update({
                        Department_En: form.Title,
                        Department_Ar: form.Title_Ar,
                        Description: form.Description,
                        Description_Ar: form.Description_Ar,
                        About: form.About,
                        About_Ar: form.About_Ar,
                        SectorId: sectorId
                    });

                // Delete old attachment ONLY if new icon selected
                if (form.Icon) {
                    const oldFiles = await sp.web.lists
                        .getByTitle("Config_Department")
                        .items.getById(itemId)
                        .attachmentFiles();

                    for (const file of oldFiles) {
                        await sp.web.lists
                            .getByTitle("Config_Department")
                            .items.getById(itemId)
                            .attachmentFiles.getByName(file.FileName)
                            .delete();
                    }
                }
            }

            /* ================= ICON UPLOAD ================= */
            if (form.Icon) {
                await sp.web.lists
                    .getByTitle("Config_Department")
                    .items.getById(itemId)
                    .attachmentFiles.add(form.Icon.name, form.Icon);

                const files = await sp.web.lists
                    .getByTitle("Config_Department")
                    .items.getById(itemId)
                    .attachmentFiles();

                if (files.length > 0) {
                    imgUrl = files[0].ServerRelativeUrl;
                    fileName = files[0].FileName;
                }
            }

            /* ================= LOCAL STATE UPDATE ================= */
            setDepartments((prev: any[]) => {
                const updatedItem = {
                    id: itemId,
                    title: form.Title,
                    title_Ar: form.Title_Ar,
                    description: form.Description,
                    descriptionAr: form.Description_Ar,
                    about: form.About,
                    aboutAr: form.About_Ar,
                    imgUrl,
                    FileName: fileName,
                    sectorId,
                    IsDelete: false
                };

                // UPDATE
                if (form.id) {
                    return prev.map(dep =>
                        dep.id === itemId ? { ...dep, ...updatedItem } : dep
                    );
                }

                // ADD
                return [...prev, updatedItem];
            });

            /* ================= RESET ================= */
            message.success(form.id ? "Department updated successfully" : "Department added successfully");

            setForm({ ...emptyDepartment });
            setIsopen(false)

        } catch (error) {
            message.error("Failed to save department");

            console.error("Save department failed", error);
            setDeptLoading(false);
        }
        finally {
            setDeptLoading(false);
        }
    };

    const updateQueryParam = (value: string): void => {
        const url = new URL(window.location.href);

        url.searchParams.delete("sector"); // remove sector if switching
        url.searchParams.set("dept", value);

        window.history.replaceState({}, "", url.toString());
        window.dispatchEvent(new PopStateEvent("popstate"));
    };



    // const saveDepartment = async () => {
    //     //   setLoading(true);

    //     try {
    //         let itemId = form.id;

    //         if (!itemId) {
    //             // ➕ CREATE
    //             const result = await sp.web.lists
    //                 .getByTitle("Config_Department")
    //                 .items.add({
    //                     Department_En: form.Title,
    //                     Department_Ar: form.Title_Ar,
    //                     Description: form.Description,
    //                     Description_Ar: form.Description_Ar,
    //                     //   About: form.About,
    //                     //   About_Ar: form.About_Ar,
    //                     SectorId: form.SectorId || Number(id)
    //                 });

    //             itemId = result.data.ID;
    //         } else {
    //             // ✏️ UPDATE
    //             await sp.web.lists
    //                 .getByTitle("Config_Department")
    //                 .items.getById(itemId)
    //                 .update({
    //                     Department_En: form.Title,
    //                     Department_Ar: form.Title_Ar,
    //                     Description: form.Description,
    //                     Description_Ar: form.Description_Ar,
    //                     // About: form.About,
    //                     // About_Ar: form.About_Ar,
    //                     SectorId: form.SectorId
    //                 });

    //             if (form.Icon) {
    //                 const attachments = await sp.web.lists
    //                     .getByTitle("Config_Department")
    //                     .items.getById(itemId)
    //                     .attachmentFiles();

    //                 for (const file of attachments) {
    //                     await sp.web.lists
    //                         .getByTitle("Config_Department")
    //                         .items.getById(itemId)
    //                         .attachmentFiles.getByName(file.FileName)
    //                         .delete();
    //                 }
    //             }
    //         }

    //         // 📎 Upload attachment (icon/image)
    //         if (form.Icon) {
    //             await sp.web.lists
    //                 .getByTitle("Config_Department")
    //                 .items.getById(itemId)
    //                 .attachmentFiles.add(form.Icon.name, form.Icon);
    //         }

    //         // 🔄 Reload list
    //         const updated = await getDepartmentsBySector(form.SectorId || Number(id));
    //         setDepartments(updated);

    //         // ♻️ Reset form
    //         setForm(emptyDepartment);

    //     } finally {
    //         // setLoading(false);
    //     }
    // };

    // const deleteDepartment = async (id: number) => {
    //     // 1️⃣ Soft delete in SharePoint
    //     await sp.web.lists
    //         .getByTitle("Config_Department")
    //         .items.getById(id)
    //         .update({
    //             IsDelete: true
    //         });

    //     // 2️⃣ Remove from UI state
    //     setDepartments((prev: any[]) =>
    //         prev.filter(dep => dep.id !== id)
    //     );

    //     setIsopen(false);
    // };

    const deleteDepartment = (deptId: number) => {
        Modal.confirm({
            // title: isArabic ? "حذف الإدارة" : "Delete Department",
            title: "Delete Department",
            content: "Are you sure you want to delete this department?",
            // content: isArabic
            //     ? "هل أنت متأكد من حذف هذه الإدارة؟"
            //     : "Are you sure you want to delete this department?",
            // okText: isArabic ? "نعم" : "Yes",
            okText: "Yes",
            // cancelText: isArabic ? "لا" : "No",
            cancelText: "No",
            okButtonProps: { danger: true },
            async onOk() {
                try {
                    setIsopen(false)

                    setDeptLoading(true);

                    await sp.web.lists
                        .getByTitle("Config_Department")
                        .items.getById(deptId)
                        .update({ IsDelete: true });

                    // ✅ Local state update (no refetch)
                    setDepartments(prev =>
                        prev.filter(d => d.id !== deptId)
                    );

                    message.success(
                        // isArabic
                        //     ? "تم حذف الإدارة بنجاح"
                        // : 
                        "Department deleted successfully"
                    );
                } catch (error) {
                    console.log("error: ", error);
                    message.error(
                        isArabic
                            ? "حدث خطأ أثناء الحذف"
                            : "Failed to delete department"
                    );
                } finally {
                    setDeptLoading(false);
                }
            }
        });
    };



    // const deleteDepartment = (deptId: number) => {
    //     Modal.confirm({
    //         title: "Delete Department",
    //         content: "Are you sure you want to delete this department?",
    //         okText: "Yes",
    //         cancelText: "No",
    //         onOk: async () => {
    //             await sp.web.lists
    //                 .getByTitle("Config_Department").items.getById(deptId).update({ IsDelete: true });

    //             setDepartments(prev => prev.filter(d => d.id !== deptId));

    //             message.success("Department deleted successfully");
    //         }
    //     });
    // };

    const SectorSkeleton = () => (
        <>
            <Skeleton.Input active style={{ width: 250, height: 20 }} />
            <Skeleton.Avatar active size={64} shape="square" />
            <Skeleton
                active
                title={{ width: "60%" }}
                paragraph={{ rows: 3 }}
            />
        </>
    );


    const validateForm = () => {
        const newErrors: any = {};
        if (!form.Title?.trim()) {
            newErrors.Title = "English title is required";
        }

        if (!form.Title_Ar?.trim()) {
            newErrors.Title_Ar = "Arabic title is required";
        }

        if (!form.Description?.trim()) {
            newErrors.Description = "English description is required";
        }

        if (!form.Description_Ar?.trim()) {
            newErrors.Description_Ar = "Arabic description is required";
        }
        if (!form.About?.trim()) {
            newErrors.About = "English about is required";
        }
        if (!form.About_Ar?.trim()) {
            newErrors.About_Ar = "Arabic about is required";
        }


        if (!form.imgUrl && !form.Icon) {
            newErrors.Icon = "Icon is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const DepartmentSkeleton = ({ count = 6 }) => {
        return (
            <div className={styles.departmentsGrid}>
                {Array.from({ length: count }).map((_, index) => (
                    <div
                        key={index}
                        className={`dds-card ${styles.departmentCard}`}
                    >
                        {/* Header */}
                        <div className={styles.cardHeader}>
                            <Skeleton.Avatar
                                active
                                size={48}
                                shape="square"
                            />

                            <Skeleton.Avatar
                                active
                                size={24}
                                shape="circle"
                            />
                        </div>

                        {/* Title */}
                        <Skeleton
                            active
                            title={{ width: "70%" }}
                            paragraph={{ rows: 2, width: ["100%", "85%"] }}
                        />
                    </div>
                ))}
            </div>
        );
    };



    // React.useEffect(() => {
    //     const load = async () => {
    //         setLoading(true);
    //         const [sectorData, deptData] = await Promise.all([

    //             getSectorById(id, isArabic),
    //             getDepartmentsBySector(id)
    //         ]);

    //         setSector(sectorData);
    //         setDepartments(deptData);
    //         setLoading(false);
    //     };

    //     load();
    // }, [id, isArabic]);


    React.useEffect(() => {
        const load = async () => {
            try {
                setSectorLoading(true);
                setDeptLoading(true);

                const [sectorData, deptData] = await Promise.all([
                    getSectorById(id, isArabic),
                    getDepartmentsBySector(id)
                ]);

                setSector(sectorData);
                setDepartments(deptData);
            } catch (error) {
                console.error("Error loading sector or departments:", error);
                setSectorLoading(false);
                setDeptLoading(false);
            }
            finally {
                setSectorLoading(false);
                setDeptLoading(false);
            }
        };

        load();
    }, [id, isArabic]);


    if (!sector) return null;

    return (
        <div dir={isArabic ? "rtl" : "ltr"}>
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
                                        marginLeft: isArabic ? "0.5rem" : 0,
                                        marginRight: isArabic ? 0 : "0.5rem"
                                    }}

                                ></i>
                                {isArabic ? "العودة للرئيسية" : "Return to Homepage"}
                            </a>
                        </div>
                    </div>
                </div>
            </header>




            <main className={styles.main}>
                <>
                    {sectorLoading ? (
                        SectorSkeleton()) :
                        <>
                            <nav className={styles.breadcrumbNav} aria-label="Breadcrumb">
                                <ol className={styles.breadcrumbList}>
                                    <li className={styles.breadcrumbItem}>
                                        <a
                                            onClick={home}

                                            // onClick={()}
                                            //  href="../index.html"
                                            className={styles.breadcrumbLink}>
                                            <i className={`${styles.homeIcon} fas fa-home`}></i>
                                            {isArabic ? "الرئيسية" : "Home"}

                                            {/* الرئيسية */}
                                        </a>
                                    </li>

                                    <li>
                                        <div className={styles.breadcrumbCurrent}>
                                            <i className={`${styles.chevronIcon} fas fa-chevron-left`}></i>
                                            <span className={styles.currentText}>
                                                {isArabic ? sector.title : sector.title}
                                                {/* قطاع التنظيم والخدمات الاجتماعية */}
                                            </span>
                                        </div>
                                    </li>
                                </ol>
                            </nav>

                            <section className={styles.heroSection}>
                                {
                                    sector?.imgUrl && (
                                        <div className={styles.iconWrapper}>
                                            <img src={sector?.imgUrl} alt="" className={styles.heroIcon} />
                                            {/* <i className={`${styles.heroIcon} fas fa-hands-helping`}></i> */}
                                        </div>)
                                }


                                <h1 className={styles.heroTitle}>
                                    {sector?.title}
                                    {/* قطاع التنظيم والخدمات الاجتماعية */}
                                </h1>

                                <p className={styles.heroDescription}>
                                    {sector?.description}
                                    {/* تنظيم الخدمات الاجتماعية وضمان جودتها لجميع فئات المجتمع */}
                                </p>
                            </section>

                            <section className={styles.aboutSection}>
                                <h2 className={styles.sectionTitle}>
                                    <i className="fas fa-info-circle"></i>
                                    {/* <span>نبذة عن القطاع</span> */}
                                    {isArabic ? "نبذة عن القطاع" : "About the Sector"}

                                </h2>

                                <p className={styles.sectionText}>
                                    {sector?.overview}
                                    {/* يتولى قطاع التنظيم والخدمات الاجتماعية مسؤولية تنظيم القطاع الاجتماعي
                        في دبي، وضمان جودة الخدمات المقدمة لمختلف فئات المجتمع. يعمل القطاع
                        على ترخيص المهنيين والمنشآت الاجتماعية، وتطوير برامج التنمية الأسرية
                        والمجتمعية التي تعزز التماسك الاجتماعي، بالإضافة إلى الإشراف على تنفيذ
                        المعايير واللوائح المنظمة للعمل الاجتماعي. */}
                                </p>
                            </section>
                        </>
                    }


                    <h2 className={styles.departmentsTitle}>
                        {isAdmin &&
                            <i className='fas fa-plus' onClick={() => {
                                setErrors({})
                                setIsopen(true)
                            }}></i>}
                        <i className="fas fa-sitemap"></i>
                        {isArabic ? "الإدارات التابعة" : "Departments"}

                    </h2>

                    {/* <div className={styles.departmentsGrid}>

                    {departments.map((dept) => (
                        <a
                            
                            onClick={() => {
                                editDepartment(dept)

                                setIsopen(true)
                            }}
                            className={`dds-card ${styles.departmentCard}`}
                        >
                            <div className={styles.cardHeader}>
                                {dept.imgUrl && (
                                    <div className={styles.cardIconWrapper}>
                                        <img src={dept.imgUrl} alt="" className={styles.cardIcon}

                                        />
                                    </div>
                                )}

                                <i className={`${styles.cardArrow} fas fa-arrow-left`} onClick={() => updateQueryParam(dept.id)}></i>
                            </div>

                            <h3 className={styles.cardTitle}>
                                {isArabic ? dept.title_Ar : dept.title}
                            </h3>

                            <p className={styles.cardDescription}>
                                {isArabic ? dept.descriptionAr : dept.description}
                            </p>
                        </a>
                    ))}

                </div> */}

                    {deptLoading ? DepartmentSkeleton({ count: 3 }) : departments && departments.length > 0 ? (
                        <div className={styles.departmentsGrid}>
                            {departments.map((dept) => (
                                <a
                                    key={dept.id}
                                    className={`dds-card ${styles.departmentCard}`}
                                    onClick={() => {
                                        if (!isAdmin) {
                                            // updateQueryParam(dept.id);
                                            return;
                                        }
                                        else {
                                            editDepartment(dept);
                                            setIsopen(true);

                                        }



                                    }}
                                >
                                    <div className={styles.cardHeader}>
                                        {(dept.imgUrl || DefaultImg) && (
                                            <div className={styles.cardIconWrapper}>
                                                <img
                                                    src={dept.imgUrl || DefaultImg}
                                                    alt=""
                                                    className={styles.cardIcon}
                                                />
                                            </div>
                                        )}

                                        <i
                                            className={`${styles.cardArrow} fas fa-arrow-left`}
                                            onClick={(e) => {
                                                e.stopPropagation(); // ✅ prevent edit click
                                                updateQueryParam(dept.id);
                                            }}
                                        />
                                    </div>

                                    <h3 className={styles.cardTitle}>
                                        {isArabic ? dept.title_Ar : dept.title}
                                    </h3>

                                    <p className={styles.cardDescription}>
                                        {isArabic ? dept.descriptionAr : dept.description}
                                    </p>
                                </a>
                            ))}
                        </div>
                    ) : (
                        <div className="no-data">
                            <i className="fas fa-inbox"></i>
                            <p>
                                {isArabic
                                    ? "لا توجد إدارات تابعة"
                                    : "No departments found"}
                            </p>
                        </div>
                    )}

                </>

            </main>



            <footer className={departments?.length === 0 ? `common-footer ${styles.footer}` : styles.footer}>
                <div className={styles.container}>
                    {/* <p>
                        &copy; {year} جميع الحقوق محفوظة لهيئة تنمية المجتمع - دبي.
                    </p> */}

                    <p dir={isArabic ? "rtl" : "ltr"}>
                        &copy; {year}{" "}
                        {isArabic
                            ? "جميع الحقوق محفوظة لهيئة تنمية المجتمع - دبي."
                            : "All rights reserved to the Community Development Authority – Dubai."}
                    </p>
                </div>
            </footer>



            {isAdmin &&

                <CustomModal
                    visible={isopen}
                    title="Add"
                    width={800}
                    onCancel={() => {
                        setForm({ ...emptyDepartment });
                        setErrors({});
                        setIsopen(false)
                    }}
                    onOk={() => {
                        saveDepartment();
                        // setIsopen(false)
                    }}
                    onDelete={form.id ? () => deleteDepartment(form.id,) : undefined}
                    deleteText="Delete " >
                    <>
                        {/* <Button onClick={() => {

                            if (form?.Url) {
                                window.open(form.Url, "_blank", "noopener,noreferrer");
                            }
                        }
                        }>Click</Button> */}

                        {/* {isEditMode &&

                        <i
                            className="fas fa-external-link-alt linkIcon"
                            onClick={(e) => {

                                e.stopPropagation();

                                if (form.Url) {
                                    window.open(form.Url, "_blank", "noopener,noreferrer");
                                }
                            }}
                        />
                    } */}

                        <div className="form-flex-tiles">

                            <div className="form-row">
                                <ReInput
                                    label="Title (EN)"
                                    name="Title"
                                    placeholder='Title'
                                    value={form.Title}
                                    onChange={handleChange}

                                    required
                                    error={errors.Title}
                                />

                                <ReInput
                                    label="Title (AR)"
                                    name="Title_Ar"
                                    placeholder='Title'
                                    value={form.Title_Ar}
                                    onChange={handleChange}
                                    required
                                    error={errors.Title_Ar}
                                />
                            </div>
                            <div className="form-row">
                                <ReTextArea
                                    label="Description (EN)"
                                    placeholder=' Description_En'
                                    name="Description"
                                    value={form.Description}
                                    onChange={handleChange}
                                    required
                                    error={errors.Description}
                                    rows={3}
                                    autoSize={false}


                                />
                                <ReTextArea
                                    label=" Description (AR)"
                                    placeholder=' Description_Ar'
                                    name="Description_Ar"
                                    value={form.Description_Ar}
                                    onChange={handleChange}
                                    required
                                    error={errors.Description_Ar}
                                    rows={3}
                                    autoSize={false}

                                />
                            </div>
                            <div className='form-row'>
                                <ReTextArea
                                    label="About (EN)"
                                    placeholder='About'
                                    name="About"
                                    value={form.About}
                                    onChange={handleChange}
                                    required
                                    error={errors.About}
                                    rows={5}
                                    autoSize={false}

                                />
                                <ReTextArea
                                    label="About (AR)"
                                    placeholder='About_Ar'
                                    name="About_Ar"
                                    value={form.About_Ar}
                                    onChange={handleChange}
                                    required
                                    error={errors.About_Ar}
                                    rows={5}
                                    autoSize={false}

                                />
                            </div>
                            <CustomDragandDrop
                                file={form.Icon}
                                setFile={(file) => handleChange("Icon", file)}
                                // setFile={(file) => setForm({ ...form, Icon: file })}
                                iconUrl={form.imgUrl}
                                fileName={form.FileName}
                                error={errors.Icon}
                                accept="image/*"
                                label={"Icon"}
                                required

                                setIconUrl={(v: any) =>
                                    setForm((prev: any) => ({
                                        ...prev,
                                        imgUrl: v,
                                    }))
                                }
                                setFileName={(v: any) =>
                                    setForm((prev: any) => ({
                                        ...prev,
                                        FileName: v,
                                    }))
                                }
                            />
                        </div>
                    </>
                </CustomModal>
            }


        </div>
    )
}

export default SectorLayout
