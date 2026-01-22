
// /* eslint-disable @typescript-eslint/no-var-requires */

// // import * as React from 'react'
// // import styles from "./NewsCarousel.module.scss"

// // const img1 = require("../../assets/images/image001.jpg");
// // const img2 = require("../../assets/images/image002.jpg");
// // const img3 = require("../../assets/images/image003.jpg");

// // const NewsCarousel = () => {


// //     React.useEffect(() => {
// //         const slides = document.querySelectorAll(`.carousel-item`);
// //         let currentSlide = 0;
// //         const totalSlides = slides.length;

// //         if (totalSlides > 0) {
// //             const intervalId = setInterval(() => {
// //                 slides[currentSlide].classList.add("hidden");
// //                 currentSlide = (currentSlide + 1) % totalSlides;
// //                 slides[currentSlide].classList.remove("hidden");
// //             }, 5000);

// //             return () => clearInterval(intervalId); // cleanup
// //         }
// //     }, []);
// //     return (
// //         <div>

// //             <div className={`dds-card ${styles.container}`}>
// //                 <h3 className={`dds-section-title text-lg ${styles.subcontainer}`}>
// //                     <i className="fas fa-newspaper"></i>أحدث الأخبار
// //                 </h3>
// //                 <div
// //                     id="heroCarousel"
// //                     className="carousel slide"
// //                     data-bs-ride="carousel"
// //                 >
// //                     <div
// //                         className={styles.carouselcontainer}
// //                     // className="relative w-full overflow-hidden rounded-lg h-64"
// //                     >
// //                         <div
// //                             className={`carousel-item ${styles.carouselitem}`}
// //                         >
// //                             <img
// //                                 src={img1}

// //                                 // src={`../../assets/images/image001.jpg`}
// //                                 className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
// //                                 alt="خبر 1"
// //                             />
// //                         </div>
// //                         <div
// //                             className={`carousel-item ${styles.carouselitem}  ${styles.hidden}`}

// //                         // className="carousel-item hidden duration-700 ease-in-out"
// //                         >
// //                             <img
// //                                 src={img2}

// //                                 // src="image002.jpg"
// //                                 // src={`../../assets/images/image002.jpg`}

// //                                 className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
// //                                 alt="خبر 2"
// //                             />
// //                         </div>
// //                         <div
// //                             className={`carousel-item ${styles.carouselitem}  ${styles.hidden}`}

// //                         // className="carousel-item hidden duration-700 ease-in-out"
// //                         >
// //                             <img
// //                                 src={img3}
// //                                 // src="image003.jpg"
// //                                 // src={`../../assets/images/image003.jpg`}

// //                                 className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
// //                                 alt="خبر 3"
// //                             />
// //                         </div>
// //                     </div>
// //                 </div>
// //             </div>

// //         </div>
// //     )
// // }

// // export default NewsCarousel







// /* eslint-disable @typescript-eslint/no-var-requires */
// /* eslint-disable @typescript-eslint/no-empty-function  */

// import { Button } from 'antd';
// import * as React from 'react';
// import CustomDragandDrop from '../DargandDrop/CustomDragandDrop';
// import CustomModal from '../modal/Custommodal';
// import styles from "./NewsCarousel.module.scss";

// const img1 = require("../../assets/images/image001.jpg");
// const img2 = require("../../assets/images/image002.jpg");
// const img3 = require("../../assets/images/image003.jpg");

// const NewsCarousel = () => {


//     // const [images, setImages] = React.useState([]);
//     const [selectedImage, setSelectedImage] = React.useState<File | null>(null);
//     const [modalOpen, setModalOpen] = React.useState(false);

//     const slideRef = React.useRef<HTMLDivElement[]>([]);
//     const currentIndex = React.useRef(0);


//     const handleOk = () => {
//     }

//     const handleCancel = () => {
//         setModalOpen(false);
//     }

//     React.useEffect(() => {
//         const slides = slideRef.current;
//         if (!slides || slides.length === 0) return;

//         // show first slide
//         slides[0].classList.remove(styles.hidden);

//         const interval = setInterval(() => {
//             slides[currentIndex.current].classList.add(styles.hidden);

//             currentIndex.current =
//                 (currentIndex.current + 1) % slides.length;

//             slides[currentIndex.current].classList.remove(styles.hidden);
//         }, 4000);

//         return () => clearInterval(interval);
//     }, []);

//     return (
//         <>
//             <div className={`dds-card ${styles.container}`}>

//                 <div className='dds-section-title' style={{
//                     display: "flex", alignItems: "center", justifyContent: "space-between"
//                 }}>
//                     {/* <h3 className={`dds-section-title text-lg ${styles.subcontainer}`}> */}
//                     <h3 className={`text-lg ${styles.subcontainer}`}>
//                         <i className="fas fa-newspaper" /> أحدث الأخبار
//                     </h3>
//                     <i className="fas fa-plus" onClick={() => {
//                         setModalOpen(true)
//                     }} ></i>
//                 </div>

//                 <div className={styles.carouselcontainer}>
//                     {[img1, img2, img3].map((img, index) => (
//                         <div
//                             key={index}
//                             ref={(el) => (slideRef.current[index] = el!)}
//                             className={`${styles.carouselitem} ${index === 0 ? "" : styles.hidden}`}
//                         >
//                             <img
//                                 src={img}
//                                 className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
//                                 alt="news"
//                             />

//                                 {/* Edit/Delete buttons top-left */}
//             <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 10, display: 'flex', gap: '5px' }}>
//               <Button type="default" onClick={() => setEditingImage(img)}>Edit</Button>
//               <Button danger onClick={() => handleDelete(img)}>Delete</Button>
//             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>


//             <CustomModal visible={modalOpen} onOk={handleOk} onCancel={handleCancel} title="">

//                 <div>
//                     <CustomDragandDrop file={selectedImage} setFile={setSelectedImage} />
//                 </div>


//             </CustomModal>
//         </>
//     );
// };

// export default NewsCarousel;





/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-floating-promises */

import * as React from 'react';
// import { Button } from 'antd';
import styles from "./NewsCarousel.module.scss";
import { Empty, Skeleton } from "antd";

import { getNewsList, INewsImage } from '../../../Services/NewsCarousel/NewsCarousel';
import { useLanguage } from '../useContext/useContext';

const NewsCarousel = () => {
    const { isArabic } = useLanguage()


    const [images, setImages] = React.useState<INewsImage[]>([]);
    const [isloading, setIsLoading] = React.useState(false)

    const slideRef = React.useRef<HTMLDivElement[]>([]);
    const currentIndex = React.useRef(0);
    const [hovering, setHovering] = React.useState(false);

    /** Load Images */
    const loadImages = async () => {
        setIsLoading(true)

        const data: any = await getNewsList(true);
        setImages(data);
        setIsLoading(false)

    };

    React.useEffect(() => { loadImages(); }, []);

    /** Carousel Auto Slide */
    React.useEffect(() => {
        if (images.length === 0) return;

        const slides = slideRef.current;
        slides[0]?.classList.remove(styles.hidden);

        const interval = setInterval(() => {
            if (hovering) return;

            slides[currentIndex.current]?.classList.add(styles.hidden);
            currentIndex.current = (currentIndex.current + 1) % slides.length;
            slides[currentIndex.current]?.classList.remove(styles.hidden);

        }, 4000);

        return () => clearInterval(interval);

    }, [images, hovering]);






    const updateNewsQueryParam = (): void => {
        const url = new URL(window.location.href);

        url.searchParams.delete("dept");
        url.searchParams.set("NewsPage", "true");

        window.history.replaceState({}, "", url.toString());
        window.dispatchEvent(new PopStateEvent("popstate"));
    };


    /** Delete */
    // const handleDelete = async (image: INewsImage) => {
    //     await deleteNewsImage(image.Name);
    //     loadImages();
    // };

    return (
        <>
            {/* MAIN CARD */}
            <div className={`dds-card ${styles.container}`}>

                {/* Header */}
                <div className='dds-section-title'
                // style={{ display: "flex", justifyContent: "space-between" }}
                >
                    <h3 className={`text-lg ${styles.subcontainer}`} onClick={updateNewsQueryParam} style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>

                        {/* {isAdmin &&

                            <i className="fas fa-plus"
                                style={{ cursor: "pointer", marginLeft: "10px", fontSize: "1.125rem", color: "var(--dds-blue-500)" }}
                                onClick={() => {
                                    setModalOpen(true);
                                    setEditingImage(null);
                                    setSelectedFile(null)
                                    setImageError("");

                                }} />
                        } */}
                        <i className="fas fa-newspaper" style={{
                            ...(isArabic ? { marginLeft: "10px" } : { marginRight: "10px" })


                        }} /> {isArabic ? "أحدث الأخبار" : "Latest News"}

                        {/* <i className="fas fa-newspaper" /> أحدث الأخبار */}
                    </h3>

                    {/* Add Button */}

                </div>

                {/* CAROUSEL */}

                {/* <div className={styles.carouselcontainer}>



                    {


                    images.map((img, index) => (
                        <div
                            key={img.Name}
                            ref={(el) => (slideRef.current[index] = el!)}
                            className={`${styles.carouselitem} ${index === 0 ? "" : styles.hidden}`}
                            onMouseEnter={() => setHovering(true)}
                            onMouseLeave={() => setHovering(false)}
                        >
                            <img
                                src={img.ServerRelativeUrl}
                                className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                                alt="news"
                            />

                            <div className={styles.actions}>
                                <i
                                    className="fas fa-edit"
                                    onClick={async () => {
                                        setEditingImage(img);
                                        const response = await fetch(img.ServerRelativeUrl);
                                        const blob = await response.blob();
                                        const file = new File([blob], img.Name, { type: blob.type });

                                        setSelectedFile(file); // Set file internally

                                        setModalOpen(true);
                                        // setSelectedFile(img);
                                        // setModalOpen(true);
                                    }}
                                />

                                <i
                                    className="fas fa-trash"
                                    onClick={() => showDeleteConfirm(img)}
                                />
                            </div>
                        </div>
                    ))}
                </div> */}

                <div className={styles.carouselcontainer}>

                    {/* 1️⃣ Loading state */}
                    {isloading && (
                        <div style={{
                            width: "100%",
                            height: "100%"
                        }}>
                            <Skeleton.Image
                                active
                                style={{
                                    width: "100% !important",
                                    height: "100% !important",
                                    borderRadius: "8px",
                                }}
                            ></Skeleton.Image>
                            {/* <Skeleton.Input
                                active
                                style={{ width: "100%", height: "100%" }}
                            // /> */}
                        </div>

                        // />
                    )}

                    {/* 2️⃣ No images */}
                    {!isloading && images.length === 0 && (
                        <div style={{
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                            <Empty
                                description="No images available"
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                            />
                        </div>
                    )}

                    {/* 3️⃣ Images carousel */}
                    {!isloading && images.length > 0 && images.map((img, index) => (
                        <div
                            key={img.Name}
                            ref={(el) => (slideRef.current[index] = el!)}
                            className={`${styles.carouselitem} ${index === 0 ? "" : styles.hidden}`}
                            onMouseEnter={() => setHovering(true)}
                            onMouseLeave={() => setHovering(false)}
                        >
                            <img
                                src={img.ServerRelativeUrl}
                                alt="news"
                            />


                        </div>
                    ))}

                </div>
            </div>


        </>
    );
};

export default NewsCarousel;

