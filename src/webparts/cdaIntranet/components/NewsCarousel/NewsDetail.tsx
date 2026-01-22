/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable  @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { Skeleton } from 'antd'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { getNewsById } from '../../../Services/NewsCarousel/NewsCarousel'
import { useLanguage } from '../useContext/useContext'
import styles from './NewsDetail.module.scss'
const img1 = require("../../assets/images/logo.svg")

const NewsDetail = ({ id, homepage }: any) => {
    const { isArabic } = useLanguage();
    const year = new Date().getFullYear();


    const [news, setNews] = useState<any>(null);
    const [loading, setLoading] = useState(true);


    const NewsDetailsSkeleton = () => {
        return (
            <div
                style={{
                    maxWidth: 900,
                    margin: "0 auto",
                    padding: 24,
                    background: "#fff",
                }}
            >
                {/* Banner */}
                <Skeleton.Image
                    active
                    style={{
                        width: "100%",
                        height: 260,
                        borderRadius: 8,
                        marginBottom: 24,
                    }}
                />

                {/* Title */}
                <Skeleton
                    active
                    title={{ width: "80%" }}
                    paragraph={false}
                />

                {/* Meta row */}
                <div
                    style={{
                        display: "flex",
                        gap: 12,
                        margin: "12px 0 24px",
                        alignItems: "center",
                    }}
                >
                    <Skeleton.Input active size="small" style={{ width: 120 }} />
                    <Skeleton.Input active size="small" style={{ width: 100 }} />
                </div>

                {/* Content paragraphs */}
                {[1, 2, 3, 4, 5].map((_, index) => (
                    <Skeleton
                        key={index}
                        active
                        title={false}
                        paragraph={{
                            rows: 4,
                            width: "100%",
                        }}
                        style={{ marginBottom: 16 }}
                    />
                ))}

                {/* Footer */}
                <div
                    style={{
                        marginTop: 32,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Skeleton.Input active style={{ width: 160 }} />
                    <Skeleton.Avatar active size="small" />
                </div>
            </div>
        );
    };
    useEffect(() => {
        if (!id) return;

        const load = async () => {
            setLoading(true);
            const data = await getNewsById(Number(id));
            setNews(data);
            setLoading(false);
        };

        load();
    }, []);
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
            {loading ? <NewsDetailsSkeleton /> :


                <main className={styles.main}>
                    {/* Breadcrumb */}
                    <nav
                        //  className={styles.breadcrumb} 
                        className={`${styles.breadcrumb} `}

                        aria-label="Breadcrumb">
                        <ol>
                            <li>
                                <a
                                    onClick={homepage}
                                // onClick={() => window.location.href = 'index.html'}
                                >
                                    <i className="fas fa-home"></i>
                                    {isArabic ? 'الرئيسية' : 'Home'}
                                </a>
                            </li>

                            <li>
                                <i
                                    className={isArabic ? "fas fa-chevron-left" : "fas fa-chevron-right"}
                                ></i>
                                <a
                                // onClick={() => window.location.href = 'community_news.html'}
                                >
                                    {isArabic ? 'أخبار مجتمعنا' : 'Community News'}
                                </a>
                            </li>

                            <li>
                                <i
                                    // className="fas fa-chevron-left"
                                    className={isArabic ? "fas fa-chevron-left" : "fas fa-chevron-right"}

                                ></i>
                                <span>
                                    {isArabic ? 'تفاصيل الخبر' : 'News Details'}
                                </span>
                            </li>
                        </ol>
                    </nav>

                    {/* Article */}
                    <article className={styles.article}>
                        {/* Hero Image */}
                        <div className={styles.hero}>
                            <img
                                src={news?.image}
                                // src="files/news/DSC04247.jpg"
                                alt="News"
                            // onError={(e: any) => {
                            //     e.target.src = 'logo.svg';
                            //     e.target.className = styles.fallbackImage;
                            // }}
                            />

                            <div className={styles.heroOverlay}>
                                {/* <span className={styles.category}>أخبار مؤسسية</span> */}
                                <span className={styles.category}>{isArabic ? news?.categoryAr : news?.category}</span>

                                <h1>
                                    {isArabic ? news?.titleAr : news?.title}
                                    {/* هيئة تنمية المجتمع تُقيم مبادرة تطوعية لتجهيز المير والمواد الغذائية */}
                                </h1>

                                <div className={styles.meta}>
                                    {/* <span><i className="far fa-calendar-alt"></i> 05 مارس 2025</span> */}
                                    <span><i className="far fa-calendar-alt"></i> {moment(news?.date).format("DD MMMM YYYY")}</span>
                                    {/* <span><i className="far fa-eye"></i> 850 مشاهدة</span> */}
                                    <span><i className="far fa-eye"></i> {news?.views}</span>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className={styles.content}>
                            <div className={styles.articleContent} dangerouslySetInnerHTML={{ __html: isArabic ? news?.summaryAr : news?.summary }}>
                                {/* <p className={styles.highlight}>
                                في إطار حملة ساعة تبني مجتمعاً التي أطلقتها هيئة تنمية المجتمع في دبي...
                            </p>

                            <p>
                                وشهدت المبادرة مشاركة عدد من الجهات الحكومية والخيرية...
                            </p>

                            <p>
                                وتم خلال المبادرة تجهيز وتعبئة 500 صندوق مير غذائي...
                            </p> */}
                            </div>

                            {/* Footer */}
                            <div className={styles.socialBar}>
                                <div className={styles.share}>
                                    <span>{isArabic ? "مشاركة الخبر:" : "Share the news:"}</span>
                                    <a><i className="fab fa-twitter"></i></a>
                                    <a><i className="fab fa-linkedin"></i></a>
                                    <a><i className="fab fa-whatsapp"></i></a>
                                </div>

                                <a
                                    className={styles.back}
                                    onClick={() => window.history.back()}
                                // onClick={() => window.location.href = 'community_news.html'}
                                >
                                    <i className={isArabic ? "fas fa-arrow-right" : "fas fa-arrow-left"}></i>
                                    {isArabic ? "العودة لأخبار مجتمعنا" : "Return to Our Community News"}
                                </a>
                            </div>
                        </div>
                    </article>
                </main>
            }



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

        </div>
    )
}

export default NewsDetail
