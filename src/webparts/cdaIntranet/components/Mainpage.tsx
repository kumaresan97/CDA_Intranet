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
import Search from './Search/Search';
import UpcomingEvents from './events/UpcomingEvents';
import NewsCarousel from './NewsCarousel/NewsCarousel';
import TopService from './TopService/TopService';
import Footer from './Footer/Footer';
import { Modal } from "antd";

// import Card from './Card/Card';
import ServicesResources from './MainSection/MainSection';
import { useState, useMemo, useCallback, useEffect } from 'react';
import BackToTopButton from './BacktoTopButton/BacktoTopButton.module';
import { sp } from '@pnp/sp/presets/all';
import { getAllServices } from '../../Services/ServiceCard/ServiceCard';
import CustomDropDown from './Dropdown/CustomDropDown';
import ReInput from './Input/CustomInput';
import ReTextArea from './TextArea/CustomTextArea';
import CustomModal from './modal/Custommodal';
import Rating from './Rating/CustomRating';
import CustomDragandDrop from './DargandDrop/CustomDragandDrop';
const dummyNews = [
    "Breaking news: First item",
    "Weather update: Today is sunny",
    "Sports: Local team won the match",
    "Market update: Stocks are rising"
];



const categories = {
    all: { name: "الكل", icon: "fas fa-th-large" },
    favorite: { name: "المفضلة", icon: "fas fa-star" },
    gov: { name: "تطبيقات حكومية", icon: "fas fa-building-columns" },
    internal: { name: "تطبيقات داخلية", icon: "fas fa-network-wired" },
    support: { name: "دعم فني", icon: "fas fa-headset" },
    planning: { name: "تخطيط", icon: "fas fa-tasks" },
    policies: { name: "السياسات", icon: "fas fa-gavel" },
    innovation: { name: "الابتكار", icon: "fas fa-lightbulb" },
    knowledge: { name: "بوابة المعارف", icon: "fas fa-brain" },
    communication: { name: "التواصل", icon: "fas fa-comments" }
};

// Delete
// const handleDelete = async (item: any) => {
//     if (!window.confirm("Are you sure you want to delete this service?")) return;
//     try {
//         await sp.web.lists.getByTitle("CategoryService").items.getById(item.id).delete();
//         setServicesData(prev => prev.filter(s => s.id !== item.id));

//         // loadServices();
//     } catch (err) {
//         console.error(err);
//     }
// };
const Mainpage = ({ context }: any) => {
    console.log("context: ", context);
    const scrollContainerRef = React.useRef<HTMLDivElement>(null);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [upcomingEvents, setUpcomingEvents] = React.useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeCategory, setActiveCategory] = useState<"all" | "favorite" | string>("all");
    const [servicesData, setServicesData] = useState<any[]>([]);
    // const [activeCategory, setActiveCategory] = React.useState<any>("all");

    const [favorites, setFavorites] = useState<string[]>(() => {
        const saved = localStorage.getItem("ddsPortalFavorites");
        return saved ? JSON.parse(saved) : [];
    });
    const [ismodalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any | null>(null);

    // Form state for Add/Update
    const [form, setForm] = useState<any>({
        id: 0,
        Title: "",
        Title_Ar: "",
        Description_En: "",
        Description_Ar: "",
        URL_En: "",
        URL_Ar: "",
        Icon: "",
        Color: "",
        Category_En: "",
        Category_Ar: "",
        Type_En: "",
        Type_Ar: "",
        Rating: 0,
        IsFavorite: false,
        views: 0,
    });

    const [errors, setErrors] = useState<any>({});

    // Fetch services
    const loadServices = async () => {
        setLoading(true);
        try {
            const data = await getAllServices();

            const fav = data.filter((x: any) => x.IsFavorite === true);
            setFavorites(fav.map((x: any) => x.Title));
            console.log("dataservice: ", data);
            setServicesData(data)
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadServices();
    }, []);

    // Handle form change
    const handleChange = (name: string, value: any) => {
        setForm((prev: any) => ({ ...prev, [name]: value }));
    };

    // Validate
    const validate = () => {
        const e: any = {};
        if (!form.Title) e.Title = "Title (EN) is required";
        if (!form.Title_Ar) e.Title_Ar = "Title (AR) is required";
        if (!form.Description_En) e.Description_En = "Description (EN) is required";
        if (!form.Description_Ar) e.Description_Ar = "Description (AR) is required";
        if (!form.Category_En) e.Category_En = "Category (EN) is required";
        if (!form.Category_Ar) e.Category_Ar = "Category (AR) is required";
        if (!form.Type_En) e.Type_En = "Type (EN) is required";
        if (!form.Type_Ar) e.Type_Ar = "Type (AR) is required";

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    // Add / Update
    // const handleSubmit = async () => {
    //     if (!validate()) return;

    //     try {
    //         if (editingItem) {
    //             // Update
    //             await sp.web.lists.getByTitle("CategoryService").items.getById(editingItem.id).update({
    //                 Title: form.Title,
    //                 Title_Ar: form.Title_Ar,
    //                 Description_En: form.Description_En,
    //                 Description_Ar: form.Description_Ar,
    //                 URL_En: form.URL_En,
    //                 URL_Ar: form.URL_Ar,
    //                 Icon: form.Icon,
    //                 Color: form.Color,
    //                 Category_En: form.Category_En,
    //                 Category_Ar: form.Category_Ar,
    //                 Type_En: form.Type_En,
    //                 Type_Ar: form.Type_Ar,
    //                 Rating: Number(form.Rating) || 0,
    //                 IsFavorite: form.IsFavorite,
    //             });

    //             // 🔥 Update state locally
    //             setServicesData(prev =>
    //                 prev.map(s => s.id === editingItem.id ? { ...s, ...form } : s)
    //             );
    //         } else {
    //             // Add
    //             let res = await sp.web.lists.getByTitle("CategoryService").items.add({
    //                 Title: form.Title,
    //                 Title_Ar: form.Title_Ar,
    //                 Description_En: form.Description_En,
    //                 Description_Ar: form.Description_Ar,
    //                 URL_En: form.URL_En,
    //                 URL_Ar: form.URL_Ar,
    //                 Icon: form.Icon,
    //                 Color: form.Color,
    //                 Category_En: form.Category_En,
    //                 Category_Ar: form.Category_Ar,
    //                 Type_En: form.Type_En,
    //                 Type_Ar: form.Type_Ar,
    //                 Rating: Number(form.Rating) || 0,
    //                 IsFavorite: form.IsFavorite,
    //                 // views: 0,
    //             });

    //             setServicesData(prev => [
    //                 ...prev,
    //                 {
    //                     ...form,
    //                     id: res.data.Id
    //                 }
    //             ]);
    //         }

    //         setIsModalOpen(false);
    //         setEditingItem(null);
    //         setForm({
    //             id: 0,
    //             Title: "",
    //             Title_Ar: "",
    //             Description_En: "",
    //             Description_Ar: "",
    //             URL_En: "",
    //             URL_Ar: "",
    //             Icon: null as File | null, // changed to File object
    //             Color: "",
    //             Category_En: "",
    //             Category_Ar: "",
    //             Type_En: "",
    //             Type_Ar: "",
    //             Rating: 0,
    //             IsFavorite: false,
    //             views: 0,
    //         });

    //         // loadServices();
    //     } catch (err) {
    //         console.error("Error saving item:", err);
    //     }
    // };


    const handleSubmit = async () => {
        if (!validate()) return;

        try {
            let itemId: number;

            // ===========================
            //  UPDATE
            // ===========================
            if (editingItem) {
                await sp.web.lists.getByTitle("CategoryService").items.getById(editingItem.id).update({
                    Title: form.Title,
                    Title_Ar: form.Title_Ar,
                    Description_En: form.Description_En,
                    Description_Ar: form.Description_Ar,
                    URL_En: form.URL_En,
                    URL_Ar: form.URL_Ar,
                    Color: form.Color,
                    Category_En: form.Category_En,
                    Category_Ar: form.Category_Ar,
                    Type_En: form.Type_En,
                    Type_Ar: form.Type_Ar,
                    Rating: Number(form.Rating) || 0,
                    IsFavorite: form.IsFavorite,
                });

                itemId = editingItem.id;

                // ---- Single Attachment Logic (EDIT) ----
                if (form.Icon && form.Icon instanceof File) {
                    const current = await sp.web.lists
                        .getByTitle("CategoryService")
                        .items.getById(itemId)
                        .attachmentFiles();

                    // delete old attachment (only one)
                    if (current.length > 0) {
                        await sp.web.lists
                            .getByTitle("CategoryService")
                            .items.getById(itemId)
                            .attachmentFiles.getByName(current[0].FileName)
                            .delete();
                    }

                    // upload new attachment
                    await sp.web.lists
                        .getByTitle("CategoryService")
                        .items.getById(itemId)
                        .attachmentFiles.add(form.Icon.name, form.Icon);
                }
                let attachmentUrl = `${sp.web.toUrl()}/Lists/CategoryService/Attachments/${itemId}/${form.Icon.name}`;


                // update UI state
                setServicesData(prev =>
                    prev.map(s => s.id === itemId ? { ...s, ...form, attachmentUrl: attachmentUrl } : s)
                );
            }

            // ===========================
            //  ADD NEW
            // ===========================
            else {
                const res = await sp.web.lists.getByTitle("CategoryService").items.add({
                    Title: form.Title,
                    Title_Ar: form.Title_Ar,
                    Description_En: form.Description_En,
                    Description_Ar: form.Description_Ar,
                    URL_En: form.URL_En,
                    URL_Ar: form.URL_Ar,
                    Color: form.Color,
                    Category_En: form.Category_En,
                    Category_Ar: form.Category_Ar,
                    Type_En: form.Type_En,
                    Type_Ar: form.Type_Ar,
                    Rating: Number(form.Rating) || 0,
                    IsFavorite: form.IsFavorite,
                });

                itemId = res.data.Id;

                // ---- Single Attachment Logic (ADD) ----
                if (form.Icon && form.Icon instanceof File) {
                    await sp.web.lists
                        .getByTitle("CategoryService")
                        .items.getById(itemId)
                        .attachmentFiles.add(form.Icon.name, form.Icon);
                }

                let attachmentUrl = `${sp.web.toUrl()}/Lists/CategoryService/Attachments/${itemId}/${form.Icon.name}`;


                // update UI state
                setServicesData(prev => [
                    ...prev,
                    { ...form, id: itemId, attachmentUrl: attachmentUrl }
                ]);
            }

            // reset
            setIsModalOpen(false);
            setEditingItem(null);
            setForm({
                id: 0,
                Title: "",
                Title_Ar: "",
                Description_En: "",
                Description_Ar: "",
                URL_En: "",
                URL_Ar: "",
                Icon: null,     // File object
                Color: "",
                Category_En: "",
                Category_Ar: "",
                Type_En: "",
                Type_Ar: "",
                Rating: 0,
                IsFavorite: false,
                views: 0,
                attachmentUrl: ""
            });

        } catch (err) {
            console.error("Error saving item:", err);
        }
    };


    const handleDelete = (item: any) => {
        Modal.confirm({
            title: "Delete Service?",
            content: "Are you sure you want to delete this service?",
            okText: "Delete",
            okType: "danger",
            cancelText: "Cancel",
            onOk: async () => {
                try {
                    await sp.web.lists
                        .getByTitle("CategoryService")
                        .items.getById(item.id)
                        .delete();

                    // Update local state directly
                    setServicesData(prev => prev.filter(s => s.id !== item.id));

                } catch (err) {
                    console.error("Error deleting service:", err);
                }
            },
        });
    };


    // Edit
    const handleEdit = (item: any) => {
        setEditingItem(item);
        setForm(item);
        setIsModalOpen(true);
    };



    const handleSearchChange = useCallback((value: string) => {
        setSearchTerm(value);
    }, []);

    // 🔥 Memoized to avoid re-renders
    const filteredData = useMemo(() => {
        let filtered = servicesData.filter((item) => {
            const matchesSearch =
                item.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item?.Description_En?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesCategory =
                activeCategory === "all" || item.Category_En === activeCategory;

            return matchesSearch && matchesCategory;
        });

        if (activeCategory === "favorite") {
            // filtered = filtered.filter((item) => favorites.includes(item.Title));
            filtered = filtered.filter(item => item.IsFavorite);

        }

        return filtered;
    }, [servicesData, searchTerm, activeCategory, favorites]);

    // 🎯 Favorite toggle
    // const handleFavoriteToggle = useCallback((title: string) => {
    //     setFavorites((prev) => {
    //         const updated = prev.includes(title)
    //             ? prev.filter((x) => x !== title)
    //             : [...prev, title];

    //         localStorage.setItem("ddsPortalFavorites", JSON.stringify(updated));
    //         return updated;
    //     });
    // }, []);




    const handleFavoriteToggle = async (item: any) => {
        try {
            const newStatus = !item.IsFavorite;

            await sp.web.lists
                .getByTitle("CategoryService")
                .items.getById(item.id)
                .update({ IsFavorite: newStatus });


            setServicesData(prev =>
                prev.map(s =>
                    s.id === item.id ? { ...s, IsFavorite: newStatus } : s
                )
            );

            // Update UI
            // loadServices();

        } catch (err) {
            console.error("Error updating favorite:", err);
        }
    };

    // const backToTopRef = React.useRef<HTMLAnchorElement>(null);

    console.log("upcomingEvents: ", upcomingEvents);
    console.log("form: ", form);

    const loadUpcomingEvents = async () => {
        setLoading(true);
        try {
            const items = await sp.web.lists
                .getByTitle("UpcomingEvents")
                .items.select(
                    "Id",
                    "Event_En",
                    "Event_Ar",
                    "Description_En",
                    "Description_Ar",
                    "EventDate"
                )();

            // 🔥 Format items
            const formatted = items?.map((item: any) => ({
                ID: item.Id,
                title_en: item.Event_En || "",
                title_ar: item.Event_Ar || "",
                description_en: item.Description_En || "",
                description_ar: item.Description_Ar || "",
                date: item.EventDate,
            }));

            setUpcomingEvents(formatted);
            setLoading(false);
        } catch (err) {
            setLoading(false);
            console.error("Error loading upcoming events:", err);
        }
    };
    useEffect(() => {
        loadUpcomingEvents();


    }, []);
    return loading ? <>Loading....</> : (
        <>
            <div dir='rtl' ref={scrollContainerRef}>
                <Header />
                <RotatingNews newsData={dummyNews} />
                <div className={styles.container}>
                    <HeroSection />
                    <Category
                        categories={categories}
                        activeCategory={activeCategory}
                        onSelect={(key) => setActiveCategory(key)}
                    />
                    <div className={styles.gridwrapper}>
                        {/* <!-- Right Column: Services & Resources --> */}
                        <div className={styles.leftContent}>

                            <Search value={searchTerm}
                                onChange={handleSearchChange} />

                            <ServicesResources filteredData={filteredData}
                                favorites={favorites}
                                onFavoriteToggle={handleFavoriteToggle}
                                activeCategory={activeCategory}

                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onAdd={() => {
                                    setErrors({

                                    })
                                    setEditingItem(null);
                                    setForm({
                                        id: 0,
                                        Title: "",
                                        Title_Ar: "",
                                        Description_En: "",
                                        Description_Ar: "",
                                        URL_En: "",
                                        URL_Ar: "",
                                        Icon: "",
                                        Color: "",
                                        Category_En: "",
                                        Category_Ar: "",
                                        Type_En: "",
                                        Type_Ar: "",
                                        Rating: 0,
                                        IsFavorite: false,
                                        views: 0,
                                    });
                                    setIsModalOpen(true);
                                }}

                            />
                        </div>
                        <div className={styles.rightSide}>
                            <div className={styles.StickyContainer}>
                                <UpcomingEvents eventsData={upcomingEvents} />
                                <NewsCarousel />
                                <TopService servicesData={servicesData} />
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
            <BackToTopButton scrollContainerRef={scrollContainerRef} />


            <CustomModal
                title="Add Service"
                visible={ismodalOpen}
                onCancel={() => {

                    setErrors({})
                    setIsModalOpen(false)
                }
                }
                onOk={handleSubmit}
                width={800}
                bodyHeight="60vh"

            >
                <div className={styles.formGrid}>

                    {/* LEFT SIDE – English */}
                    <div className={styles.column}>

                        <ReInput label="Title (EN)" name="Title"
                            value={form.Title} onChange={handleChange}
                            required error={errors?.Title}
                        />

                        <ReTextArea label="Description (EN)" name="Description_En"
                            value={form.Description_En} onChange={handleChange}
                            required error={errors?.Description_En}
                        />

                        <ReTextArea label="URL (EN)" name="URL_En"
                            value={form.URL_En} onChange={handleChange}
                        />
                        {/* 
                        <ReInput label="Icon" name="Icon" value={form.Icon}
                            onChange={handleChange}
                        /> */}

                        <CustomDragandDrop
                            file={form.Icon}
                            setFile={(file: File | null) => handleChange("Icon", file)}
                        />
                        <CustomDropDown
                            label="Category (EN)"
                            name="Category_En"
                            value={form.Category_En}
                            options={[
                                { label: "Policies", value: "policies" },
                                { label: "Innovation", value: "innovation" },
                                { label: "Internal", value: "internal" },
                                { label: "Gov", value: "gov" },
                                { label: "Support", value: "support" },
                                { label: "Planning", value: "planning" },
                                { label: "Communication", value: "communication" },
                                { label: "Knowledge", value: "knowledge" }]}
                            required
                            placeholder="Select category"
                            onChange={handleChange}
                            error={errors?.Category_En}
                        />

                        <CustomDropDown
                            label="Type (EN)"
                            name="Type_En"
                            value={form.Type_En}
                            options={[
                                { label: "Program", value: "program" },
                                { label: "Library", value: "library" },
                                { label: "General", value: "general" },
                            ]}
                            required
                            placeholder="Select type"
                            onChange={handleChange}
                            error={errors?.Type_En}
                        />

                    </div>

                    {/* RIGHT SIDE – Arabic */}
                    <div className={styles.column}>

                        <ReInput label="Title (AR)" name="Title_Ar"
                            value={form.Title_Ar} onChange={handleChange}
                            required error={errors?.Title_Ar}
                        />

                        <ReTextArea label="Description (AR)" name="Description_Ar"
                            value={form.Description_Ar} onChange={handleChange}
                            required error={errors?.Description_Ar}
                        />

                        <ReTextArea label="URL (AR)" name="URL_Ar"
                            value={form.URL_Ar} onChange={handleChange}
                        />

                        {/* <ReInput label="Color (Hex)" name="Color"
                            value={form.Color} onChange={handleChange}
                        /> */}

                        <CustomDropDown
                            label="Category (AR)"
                            name="Category_Ar"
                            value={form.Category_Ar}
                            options={[
                                { label: "Policies", value: "policies" },
                                { label: "Innovation", value: "innovation" },
                                { label: "Internal", value: "internal" },
                                { label: "Gov", value: "gov" },
                                { label: "Support", value: "support" },
                                { label: "Planning", value: "planning" },
                                { label: "Communication", value: "communication" },
                                { label: "Knowledge", value: "knowledge" }]}
                            required
                            placeholder="Select category"
                            onChange={handleChange}
                            error={errors?.Category_Ar}
                        />

                        <CustomDropDown
                            label="Type (AR)"
                            name="Type_Ar"
                            value={form.Type_Ar}
                            options={[
                                { label: "Program", value: "program" },
                                { label: "Library", value: "library" },
                                { label: "General", value: "general" },
                            ]}
                            required
                            placeholder="Select type"
                            onChange={handleChange}
                            error={errors?.Type_Ar}
                        />

                        {/* <ReInput label="Rating (0-5)" name="Rating"
                            value={form.Rating} onChange={handleChange}
                        /> */}

                        <Rating value={form.Rating} onChange={handleChange} name="Rating" />

                    </div>

                </div>
            </CustomModal>

        </>
    )
}

export default Mainpage


