/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable  @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { sp } from '@pnp/sp/presets/all'
import { message, Modal, Skeleton } from 'antd'
import moment from 'moment'
import * as React from 'react'
import { getChoiceDropdownOptions } from '../../../Services/Department/DepartmentService'
import { getNewsList } from '../../../Services/NewsCarousel/NewsCarousel'
import { ListName } from '../Config/Constant'
import CustomDragandDrop from '../FormInputs/DargandDrop/CustomDragandDrop'
import ReDatePicker from '../FormInputs/Datepicker/CustomDatePicker'
import CustomDropDown from '../FormInputs/Dropdown/CustomDropDown'
import ReInput from '../FormInputs/Input/CustomInput'
import CustomModal from '../modal/Custommodal'
import CustomEditor from '../QuilEditor/CustomQuilEditor'
import { useLanguage } from '../useContext/useContext'
import styles from './NewsCarousel.module.scss'
const img1 = require("../../assets/images/logo.svg")


const NewsPage = ({ homepage }: any): JSX.Element => {
    const { isArabic, isAdmin } = useLanguage()
    const year = new Date().getFullYear();
    const [isopen, setIsopen] = React.useState(false);

    // interface INewsItem {
    //     title: string;
    //     date: string;
    //     image?: string;
    //     summary: string;
    //     category: string;
    //     url?: string;
    // }

    // const newsData: INewsItem[] = [
    //     {
    //         title:
    //             'برنامج "إثراء" يكرِّم 30 مؤسسة نفع عام تقديراً لدورها كشريك أساسي في التنمية الاجتماعية',
    //         date: "17 ديسمبر 2025",
    //         // image: "files/news/Ethra17122529.webp",
    //         image: img1,
    //         summary:
    //             "احتفت الهيئة بجهود مؤسسات النفع العام وكرّمت 30 مؤسسة ضمن الدورة الثانية من برنامج 'إثراء'.",
    //         category: "أخبار مؤسسية",
    //         url: "news_detail_ethra.html",
    //     },
    //     {
    //         title: "هيئة تنمية المجتمع تُقيم مبادرة تطوعية لتجهيز المير",
    //         date: "05 مارس 2025",
    //         image: "files/news/DSC04247.jpg",
    //         summary:
    //             "أقيمت المبادرة في مركز البرشاء المجتمعي بمشاركة جهات حكومية وخيرية.",
    //         category: "أخبار مؤسسية",
    //         url: "news_detail_volunteer.html",
    //     },
    // ];

    const [newsList, setNewsList] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    const [itemTypeMap, setItemTypeMap] = React.useState<
        { en: string; ar: string }[]
    >([]);
    const [errors, setErrors] = React.useState<any>({});





    const loadItemTypeChoices = async () => {
        const result = await getChoiceDropdownOptions(
            ["Category_En", "Category_Ar"],
            ListName.News_Details
        ) as Record<string, any[]>;
        console.log("result: ", result);


        const enOptions = result.Category_En || [];
        const arOptions = result.Category_Ar || [];

        if (enOptions.length !== arOptions.length) {
            console.error("ItemType EN/AR choice count mismatch");
        }

        const map = enOptions.map((en, index) => ({
            en: en.value,
            ar: arOptions[index]?.value || ""
        }));

        setItemTypeMap(map);
    };
    interface INewsFormData {
        id: number | null;

        Title: string;
        Title_Ar: string;

        Summary_EN: string;
        Summary_AR: string;

        Category_En: string;
        Category_Ar: string;

        NewsDate: Date | null;   // for Calendar / DatePicker

        Image: File | null;      // attachment file

        imgUrl: string;          // existing image url (edit mode)
        FileName: string;        // existing / new file name
    }



    const emptyNews = {
        id: null,
        Title: "",
        Title_Ar: "",
        Summary_EN: "",
        Summary_AR: "",
        Category_En: "",
        Category_Ar: "",
        NewsDate: null,
        Image: null,
        imgUrl: "",
        FileName: ""
    };
    const [formData, setFormData] = React.useState<INewsFormData>(emptyNews);


    const handleChange = (name: string, value: any) => {
        setFormData(prev => {
            let updated = {
                ...prev,
                [name]: value
            };

            // EN → AR sync
            if (name === "Category_En") {
                const match = itemTypeMap.find(m => m.en === value);
                if (match) {
                    updated.Category_Ar = match.ar;
                }
            }

            // AR → EN sync
            if (name === "Category_Ar") {
                const match = itemTypeMap.find(m => m.ar === value);
                if (match) {
                    updated.Category_En = match.en;
                }
            }

            return updated;
        });

        setErrors((prev: any) => ({ ...prev, [name]: "" }));
    };


    const openNewsView = async (id: number, views: number) => {


        await incrementViewCount(id, views);
        const url = new URL(window.location.href);

        url.search = "";
        url.searchParams.set("NewsView", id.toString());

        window.history.pushState({}, "", url.toString());
        window.dispatchEvent(new PopStateEvent("popstate"));




    };

    const incrementViewCount = async (id: number, current: number) => {
        try {
            debugger
            await sp.web.lists
                .getByTitle(ListName.News_Details)
                .items.getById(id)
                .update({ ViewCount: current + 1 });
        }
        catch (error) {
            console.error("Increment view count failed", error);
        }
        //   setNews(prev =>
        //     prev.map(n =>
        //       n.id === id ? { ...n, views: n.views + 1 } : n
        //     )
        //   );
    };


    const validateNews = () => {
        const newErrors: any = {};

        if (!formData.Title) newErrors.Title = "Title (EN) is required";
        if (!formData.Title_Ar) newErrors.Title_Ar = "Title (AR) is required";
        if (!formData.Summary_EN) newErrors.Summary_EN = "Summary (EN) is required";
        if (!formData.Summary_AR) newErrors.Summary_AR = "Summary (AR) is required";
        if (!formData.Category_En) newErrors.Category_En = "Category is required";
        if (!formData.Category_Ar) newErrors.Category_Ar = "Category is required";
        if (!formData.NewsDate) newErrors.NewsDate = "Date is required";
        if (!formData.Image && !formData.imgUrl) newErrors.Image = "Image is required";


        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const buildNewsPayload = () => ({
        Title: formData.Title,
        Title_Ar: formData.Title_Ar,
        Summary_EN: formData.Summary_EN,
        Summary_AR: formData.Summary_AR,
        Category_En: formData.Category_En,
        Category_Ar: formData.Category_Ar,
        NewsDate: formData.NewsDate
    });


    const saveNews = async (): Promise<void> => {
        if (!validateNews()) return;

        const payload = buildNewsPayload();
        console.log("payload: ", payload);
        let itemId: number;
        setLoading(true);

        try {
            // ==========================
            // ADD / UPDATE
            // ==========================
            if (formData.id === null) {
                const result = await sp.web.lists
                    .getByTitle(ListName.News_Details)
                    .items.add({
                        ...payload,
                        ViewCount: 0
                    });

                itemId = result.data.Id;
            } else {
                itemId = formData.id;

                await sp.web.lists
                    .getByTitle(ListName.News_Details)
                    .items.getById(itemId)
                    .update(payload);
            }

            // ==========================
            // ATTACHMENT (IMAGE)
            // ==========================
            let imgUrl = formData.imgUrl;
            let fileName = formData.FileName;

            if (formData.Image) {
                const item = sp.web.lists
                    .getByTitle(ListName.News_Details)
                    .items.getById(itemId);

                // remove existing attachment (single image logic)
                const files = await item.attachmentFiles();
                if (files.length > 0) {
                    await item.attachmentFiles
                        .getByName(files[0].FileName)
                        .delete();
                }

                // add new attachment
                const uploaded: any = await item.attachmentFiles.add(
                    formData.Image.name,
                    formData.Image
                );

                imgUrl = uploaded.data.ServerRelativeUrl;
                fileName = uploaded.data.FileName;
            }

            // ==========================
            // LOCAL STATE UPDATE
            // ==========================
            setNewsList((prev: any) => {
                const updatedItem: INewsFormData = {
                    ...formData,
                    id: itemId,
                    imgUrl,
                    FileName: fileName,
                    Image: null // reset file object after save
                };

                return formData.id
                    ? prev.map((n: any) => (n.id === itemId ? updatedItem : n))
                    : [updatedItem, ...prev];
            });

            message.success(formData.id ? "News updated" : "News added");
            // ==========================
            // RESET + CLOSE
            // ==========================
            setFormData({ ...emptyNews });
            setIsopen(false);

        } catch (error) {
            console.error("Save news failed", error);
        }
        finally {
            setLoading(false);
        }
    };



    const handleDelete = (id: number) => {
        Modal.confirm({
            title: "Are you sure want delete?",
            okType: "danger",
            onOk: async () => {
                await sp.web.lists
                    .getByTitle(ListName.News_Details)
                    .items.getById(id)
                    .update({ IsDelete: true });

                setNewsList(prev => prev.filter(p => p.id !== id));
                message.success("Policy deleted");
                setIsopen(false);
                // handleCancel();
            }
        });
    };

    const NewsCardSkeleton = () => {
        return (
            <div
                style={{
                    width: "100%",
                    maxWidth: 380,
                    background: "#fff",
                    borderRadius: 8,
                    overflow: "hidden",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                }}
            >
                {/* IMAGE AREA */}
                <div
                    style={{
                        position: "relative",
                        width: "100%",
                        height: 180, // half card
                        overflow: "hidden",
                    }}
                >
                    <Skeleton.Image
                        active
                        style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: 0,
                        }}
                    />

                    {/* DATE OVER IMAGE */}
                    <div
                        style={{
                            position: "absolute",
                            bottom: 12,
                            left: 12,
                            background: "rgba(0,0,0,0.6)",
                            padding: "6px 12px",
                            borderRadius: 4,
                        }}
                    >
                        <Skeleton.Input
                            active
                            size="small"
                            style={{
                                width: 80,
                                height: 16,
                                background: "#fff",
                            }}
                        />
                    </div>
                </div>

                {/* CONTENT AREA */}
                <div style={{ padding: 16 }}>
                    {/* TITLE */}
                    <Skeleton
                        active
                        title={{ width: "90%" }}
                        paragraph={false}
                    />

                    {/* TWO PARAGRAPHS */}
                    <Skeleton
                        active
                        title={false}
                        paragraph={{
                            rows: 2,
                            width: ["100%", "80%"],
                        }}
                        style={{ marginTop: 12 }}
                    />
                </div>
            </div>
        );
    };

    // const NewsGridSkeleton = ({ count = 6 }) => {
    //     return (
    //         <div
    //             style={{
    //                 display: "grid",
    //                 gridTemplateColumns: "repeat(3, 1fr)",
    //                 gap: 24,
    //                 padding: "24px 0",
    //             }}
    //         >
    //             {Array.from({ length: count }).map((_, index) => (
    //                 <div
    //                     key={index}
    //                     style={{
    //                         background: "#fff",
    //                         borderRadius: 8,
    //                         overflow: "hidden",
    //                         boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    //                     }}
    //                 >
    //                     {/* Image skeleton */}
    //                     <Skeleton.Image
    //                         active
    //                         style={{
    //                             width: "100%",
    //                             height: 180,
    //                             borderRadius: 0,
    //                         }}
    //                     />

    //                     {/* Category badge */}
    //                     <div
    //                         style={{
    //                             padding: "12px 16px 0",
    //                             display: "flex",
    //                             justifyContent: "flex-end",
    //                         }}
    //                     >
    //                         <Skeleton.Input
    //                             active
    //                             size="small"
    //                             style={{
    //                                 width: 70,
    //                                 height: 24,
    //                                 borderRadius: 12,
    //                             }}
    //                         />
    //                     </div>

    //                     {/* Content */}
    //                     <div style={{ padding: "12px 16px 16px" }}>
    //                         {/* Date */}
    //                         <Skeleton.Input
    //                             active
    //                             size="small"
    //                             style={{
    //                                 width: 90,
    //                                 marginBottom: 12,
    //                             }}
    //                         />

    //                         {/* Title */}
    //                         <Skeleton
    //                             active
    //                             title={{ width: "100%" }}
    //                             paragraph={false}
    //                         />

    //                         {/* Summary */}
    //                         <Skeleton
    //                             active
    //                             title={false}
    //                             paragraph={{
    //                                 rows: 3,
    //                                 width: ["100%", "100%", "80%"],
    //                             }}
    //                             style={{ marginTop: 12 }}
    //                         />
    //                     </div>
    //                 </div>
    //             ))}
    //         </div>
    //     )
    // }
    React.useEffect(() => {
        const load = async () => {
            setLoading(true);
            const data = await getNewsList();
            await loadItemTypeChoices();
            setNewsList(data);
            setLoading(false);
        };
        load();
    }, []);

    const categoryOptionsEn = itemTypeMap.map(i => ({
        label: i.en,
        value: i.en
    }));

    const categoryOptionsAr = itemTypeMap.map(i => ({
        label: i.ar,
        value: i.ar
    }));

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
                                onClick={homepage}
                                // onClick={home}
                                // href="../index.html"
                                className={styles.backLink}>
                                <i className="fas fa-home"
                                    style={{
                                        marginLeft: isArabic ? "0.5rem" : 0,
                                        marginRight: isArabic ? 0 : "0.5rem"
                                    }}
                                ></i>
                                {/* Return to Homepage */}

                                {isArabic ? "العودة للرئيسية" : "Return to Homepage"}
                            </a>
                        </div>
                    </div>
                </div>
            </header>



            <main className={styles.main}>
                {/* Breadcrumb */}
                <nav className={styles.breadcrumb}>
                    <a className={styles.homeLink} onClick={homepage}>
                        <i className="fas fa-home" />
                        {isArabic ? "الرئيسية" : "Home"}
                    </a>
                    <span className={styles.separator}>
                        <i className={isArabic ? "fas fa-chevron-left" : "fas fa-chevron-right"} />
                    </span>
                    <span className={styles.current}


                    >
                        {isArabic ? "أخبار مجتمعنا" : "Our Community News"}



                    </span>
                </nav>

                <h1 className={styles.pageTitle}
                    style={{ textAlign: isArabic ? "right" : "left" }}
                >{isAdmin &&
                    <i className='fas fa-plus' onClick={() => {
                        setFormData({ ...emptyNews });
                        setErrors({});
                        setIsopen(true)
                    }}
                        style={{
                            cursor: "pointer",
                            marginLeft: isArabic ? 8 : 0,
                            marginRight: isArabic ? 0 : 8
                        }}
                    ></i>}
                    {isArabic ? "أخبار مجتمعنا" : "Our Community News"}


                </h1>

                {/* News Grid */}

                {loading ? <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: 24,
                    }}
                >
                    {[1, 2, 3].map(i => (
                        <NewsCardSkeleton key={i} />
                    ))}
                </div> : newsList?.length === 0 ?
                    <div className="no-data">
                        <i className="fas fa-inbox"></i>
                        <p>
                            {isArabic ? "لا توجد أخبار لعرضها." : "No news found!."}
                        </p>
                        {/* <p>{lang ? "لم يتم العثور على أي خدمات أو مهام" : "No Service and Tasks found"}</p> */}
                    </div>

                    :
                    <div className={styles.newsGrid}>
                        {newsList.map((news, index) => {
                            const hasImage = !!news.imgUrl;
                            return (
                                <div key={index} className={`dds-card ${styles.newsCard}`} onClick={() => {
                                    if (!isAdmin) {
                                        return
                                    }
                                    else {
                                        setFormData({
                                            ...news,
                                            Summary_EN: news.Summary_EN || "",
                                            Summary_AR: news.Summary_AR || "",
                                            Image: null,

                                        });
                                        setIsopen(true);
                                    }
                                }}>
                                    <div className={styles.imageWrapper}>
                                        <img
                                            // src={"https://images.unsplash.com/photo-1520209759809-a9bcb6cb3241?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1nfGVufDB8fDB8fHww"}
                                            src={hasImage ? news.imgUrl : img1}
                                            className={
                                                hasImage ? styles.coverImage : styles.fallbackImage
                                            }
                                            alt={news?.Title}
                                        />
                                        <span className={styles.category}>{isArabic ? news.Category_Ar : news.Category_En}</span>
                                    </div>

                                    <div className={styles.cardBody}>
                                        <div className={styles.date} style={{ textAlign: "right" }}>
                                            <i className="far fa-calendar-alt" style={{
                                                marginLeft: 8
                                            }} />
                                            {moment(news.NewsDate
                                            ).format("DD/MM/YYYY")}
                                        </div>

                                        <h3 className={styles.cardTitle}>
                                            <a href={news.url}>{isArabic ? news.Title_Ar : news.Title}</a>
                                        </h3>

                                        <div className={styles.summary} dangerouslySetInnerHTML={{ __html: isArabic ? news.Summary_AR : news.Summary_EN }}></div>

                                        {/* <p className={styles.summary}>{isArabic ? news.summaryAr : news.summary}</p> */}

                                        <div className={styles.readMore} onClick={(e) => {
                                            e.stopPropagation();


                                            openNewsView(news.id, news.ViewCount);

                                            // openNewsView(news.id)
                                        }}>
                                            <a href={news.url}>
                                                {isArabic ? "اقرأ التفاصيل" : "Read Details"}
                                                <i className={isArabic ? "fas fa-arrow-left" : "fas fa-arrow-right"} />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                }
            </main>


            <footer className={styles.footer}>
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



            {isopen &&

                <CustomModal
                    visible={isopen}
                    title={formData.id ? "Edit News" : "Add News"}
                    width={800}
                    onCancel={() => {
                        setFormData({ ...emptyNews });
                        setIsopen(false);
                        setErrors({});
                    }}
                    onOk={saveNews}
                    onDelete={
                        formData.id
                            ? () => handleDelete(formData.id!)
                            : undefined
                    }
                >
                    <div className="form-flex-tiles">

                        {/* Title */}
                        <div className="form-row">
                            <ReInput
                                label="Title (EN)"
                                name="Title"
                                placeholder="Title"
                                value={formData.Title}
                                onChange={handleChange}

                                // onChange={(e: any) =>
                                //     setFormData(prev => ({ ...prev, Title: e }))
                                // }
                                required
                                error={errors.Title}
                            />

                            <ReInput
                                label="Title (AR)"
                                name="Title_Ar"
                                placeholder='Title'
                                // placeholder="العنوان"
                                value={formData.Title_Ar}
                                onChange={handleChange}

                                // onChange={(e: any) =>
                                //     setFormData(prev => ({ ...prev, Title_Ar: e }))
                                // }
                                required
                                error={errors.Title_Ar}
                            />
                        </div>

                        {/* Summary */}
                        {/* <div className="form-row"> */}
                        <div >
                            <CustomEditor
                                label="Summary (EN)"
                                value={formData.Summary_EN}
                                // onChange={() => handleChange("Summary_EN", formData.Summary_EN)}

                                // onChange={(v) =>
                                //     setFormData(prev => ({ ...prev, Summary_EN: v }))
                                // }

                                onChange={(v) => {
                                    const value = v?.trimStart() || "";

                                    let cleanedValue = "";

                                    if (value === "<p><br></p>") {
                                        cleanedValue = "";
                                    } else if (
                                        value.replace(/<(.|\n)*?>/g, "").trim().length === 0
                                    ) {
                                        cleanedValue = "";
                                    } else {
                                        cleanedValue = value;
                                    }

                                    setFormData(prev => ({
                                        ...prev,
                                        Summary_EN: cleanedValue
                                    }));


                                }}




                                error={errors.Summary_EN}
                            />
                        </div>

                        <div >
                            <CustomEditor
                                label="Summary (AR)"
                                value={formData.Summary_AR}
                                // onChange={() => handleChange("Summary_AR", formData.Summary_AR)}

                                // onChange={(v) =>
                                //     setFormData(prev => ({ ...prev, Summary_AR: v }))
                                // }

                                onChange={(v) => {
                                    const value = v?.trimStart() || "";

                                    let cleanedValue = "";

                                    if (value === "<p><br></p>") {
                                        cleanedValue = "";
                                    } else if (
                                        value.replace(/<(.|\n)*?>/g, "").trim().length === 0
                                    ) {
                                        cleanedValue = "";
                                    } else {
                                        cleanedValue = value;
                                    }

                                    setFormData(prev => ({
                                        ...prev,
                                        Summary_AR: cleanedValue
                                    }));


                                }}
                                error={errors.Summary_AR}
                            />
                        </div>
                        {/* </div> */}

                        {/* Category */}
                        <div className="form-row">
                            <CustomDropDown
                                label="Category (EN)"
                                name="Category_En"
                                value={formData.Category_En}
                                options={categoryOptionsEn}
                                placeholder="Select category"
                                required
                                onChange={handleChange}

                                // onChange={(val: string) =>
                                //     setFormData(prev => ({ ...prev, Category_En: val }))
                                // }
                                error={errors.Category_En}
                            />

                            <CustomDropDown
                                label="Category (AR)"
                                name="Category_Ar"
                                value={formData.Category_Ar}
                                options={categoryOptionsAr}
                                placeholder="Select category"

                                // placeholختر الفئة"
                                required
                                onChange={handleChange}
                                // onChange={(val: string) =>
                                //     setFormData(prev => ({ ...prev, Category_Ar: val }))
                                // }
                                error={errors.Category_Ar}
                            />
                        </div>

                        {/* Date */}
                        <div className="form-row">
                            <ReDatePicker
                                label="News Date"
                                name="NewsDate"
                                value={formData.NewsDate}
                                onChange={handleChange
                                }
                                required
                                error={errors.NewsDate}
                            />
                        </div>

                        {/* Image */}
                        <CustomDragandDrop
                            file={formData.Image}
                            setFile={(file: any) =>
                                setFormData(prev => ({ ...prev, Image: file }))
                            }
                            label="News Image"
                            required
                            fileName={formData.FileName}
                            iconUrl={formData.imgUrl}
                            setIconUrl={(v: any) =>
                                setFormData((prev: any) => ({
                                    ...prev,
                                    imgUrl: v,
                                }))
                            }
                            setFileName={(v: any) =>
                                setFormData((prev: any) => ({
                                    ...prev,
                                    FileName: v,
                                }))
                            }
                            error={errors.Image}
                        />

                    </div>
                </CustomModal>
            }


        </div>
    )
}

export default NewsPage


