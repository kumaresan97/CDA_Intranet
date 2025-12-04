/* eslint-disable @typescript-eslint/no-var-requires */


import * as React from 'react'
import styles from "./HeroSection.module.scss"
const logo = require("../../assets/images/mujtamana_logo.svg")

const HeroSection = () => {
    return (
        <div>

            {/* <!-- NEW: Combined Header Section --> */}
            <section className="mb-8" style={{
                marginBottom: "2rem"
            }}>
                {/* <!-- REVERTED: Original order --> */}
                <div

                    // className="flex flex-col lg:flex-row justify-between items-center gap-8 mb-8"
                    className={styles.heroContainer}
                >
                    {/* <!-- Combined DG Message and Logo Section --> */}
                    <div
                        // className="w-full order-1"
                        className={styles.logoSection}
                    >
                        <div
                            className={`dds-card ${styles.cardContainer}`}
                        // className="dds-card flex flex-col md:flex-row items-center gap-8 p-6 bg-gradient-to-r from-blue-50 to-white border-l-8 border-dds-gold-500 h-full"
                        >
                            {/* <!-- Images Container --> */}
                            <div
                                className={styles.imagesContainer}
                            // className="flex items-center justify-center gap-6 w-full md:w-auto"
                            >
                                <img
                                    src="https://www.cda.gov.ae/ar/MediaCenter/News/PublishingImages/Hessa%20Bu%20Humaid.jpg"
                                    alt="معالي حصة بنت عيسى بوحميد"
                                    className={styles.image}
                                // className="rounded-full shadow-lg w-24 h-24 md:w-32 md:h-32 object-cover border-4 border-white"
                                />
                            </div>
                            {/* <!-- DG Message Text --> */}
                            <div
                                className={styles.messageSecction}
                            // className="flex-grow text-center md:text-right"
                            >
                                <h3
                                    className={styles.Title}
                                // className="text-xl md:text-2xl font-bold text-dds-blue-700 mb-1"
                                >
                                    {/* كلمة المدير العام */}
                                    General Manager's Speech



                                </h3>
                                <p
                                    className={styles.message}
                                // className="mt-2 text-dds-gray-900 text-sm leading-relaxed"

                                >
                                    {/* يسرنا في هيئة تنمية المجتمع أن نواصل مسيرتنا في خدمة وتنمية
                                    المجتمع، بالتعاون مع مختلف الجهات الحكومية، بهدف تعزيز سعادة
                                    الأفراد وجودة حياتهم. */}

                                    We at the Community Development Authority are pleased to continue our journey in serving and developing the community, in cooperation with various government agencies, with the aim of enhancing the happiness of individuals and their quality of life.
                                </p>
                                <a
                                    href="departments/dg_message.html"
                                    className={styles.link}
                                // className="text-sm font-bold text-dds-primary hover:underline mt-2 inline-block"
                                >اقرأ الرسالة كاملة
                                    <i className="fas fa-arrow-left mr-1 text-xs"></i ></a>
                            </div>
                            <div
                                className={styles.iconRow}
                            // className="flex items-center justify-center gap-6 w-full md:w-auto"
                            >
                                <img
                                    src={logo}
                                    alt="شعار مجتمعنا"
                                    className={styles.img}
                                // className="max-h-32 md:max-h-40 object-contain"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    )
}

export default HeroSection
