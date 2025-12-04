
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
import CustomDragandDrop from '../DargandDrop/CustomDragandDrop';
import CustomModal from '../modal/Custommodal';
import styles from "./NewsCarousel.module.scss";
import { Modal } from "antd";

import { addNewsImage, deleteNewsImage, getNewsImages, INewsImage } from '../../../Services/NewsCarousel/NewsCarousel';

const NewsCarousel = () => {

    const [images, setImages] = React.useState<INewsImage[]>([]);
    const [modalOpen, setModalOpen] = React.useState(false);
    const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
    const [editingImage, setEditingImage] = React.useState<INewsImage | null>(null);

    const slideRef = React.useRef<HTMLDivElement[]>([]);
    const currentIndex = React.useRef(0);
    const [hovering, setHovering] = React.useState(false);

    /** Load Images */
    const loadImages = async () => {
        const data = await getNewsImages();
        console.log("data: ", data);
        setImages(data);
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

    /** Add or Update Submit */
    const handleSave = async () => {
        if (!selectedFile) return;

        if (editingImage) {
            // Delete old file, add new file
            await deleteNewsImage(editingImage.Name);
            await addNewsImage(selectedFile);
        } else {
            // Add new file
            await addNewsImage(selectedFile);
        }

        setSelectedFile(null);
        setEditingImage(null);
        setModalOpen(false);
        loadImages();
    };


    const showDeleteConfirm = (img: INewsImage) => {
        Modal.confirm({
            title: "Delete Image?",
            content: "Are you sure you want to delete this image?",
            okText: "Delete",
            okType: "danger",
            cancelText: "Cancel",
            onOk: async () => {
                await deleteNewsImage(img.Name);
                loadImages();
            }
        });
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
                <div className='dds-section-title' style={{ display: "flex", justifyContent: "space-between" }}>
                    <h3 className={`text-lg ${styles.subcontainer}`}>
                        <i className="fas fa-newspaper" /> أحدث الأخبار
                    </h3>

                    {/* Add Button */}
                    <i className="fas fa-plus"
                        style={{ cursor: "pointer", fontSize: "1.125rem", color: "var(--dds-blue-500)" }}
                        onClick={() => {
                            setModalOpen(true); setEditingImage(null)
                                ;

                            setSelectedFile(null)
                        }} />
                </div>

                {/* CAROUSEL */}
                <div className={styles.carouselcontainer}>
                    {images.map((img, index) => (
                        <div
                            key={img.Name}
                            ref={(el) => (slideRef.current[index] = el!)}
                            className={`${styles.carouselitem} ${index === 0 ? "" : styles.hidden}`}
                            onMouseEnter={() => setHovering(true)}
                            onMouseLeave={() => setHovering(false)}
                        // style={{ position: "relative" }}
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
                </div>
            </div>

            {/* ADD / EDIT MODAL */}
            <CustomModal
                visible={modalOpen}
                onOk={handleSave}
                onCancel={() => {
                    setModalOpen(false);
                    setSelectedFile(null);
                    setEditingImage(null);
                }}
                title={editingImage ? "Edit Image" : "Add Image"}
            >
                <CustomDragandDrop file={selectedFile} setFile={setSelectedFile} />
            </CustomModal>
        </>
    );
};

export default NewsCarousel;

