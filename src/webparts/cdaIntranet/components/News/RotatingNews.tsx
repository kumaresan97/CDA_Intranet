import * as  React from 'react'
import styles from "./RotatingNews.module.scss"

const RotatingNews = ({ newsData }: any) => {
    const visibleNews = newsData.slice(0, 7);
    const tickerList = [...visibleNews, ...visibleNews];
    return (
        <div>

            <div className={styles.NewsContainer} >
                <div className={styles.RotatingNewsInner} >
                    <div className={styles.flexRow}>
                        <span className={styles.badge}>
                            <i className="fas fa-bullhorn mr-2"></i>الأخبار</span >
                        <div className={`${styles.fullFlex} news-ticker-wrap`}>
                            <div className={`news-ticker ${styles.absoluteFlex}`}
                            >

                                {tickerList.map((news, index) => (
                                    <React.Fragment key={index}>
                                        <a href="coming_soon.html" className={styles.newsItem}>
                                            {news}
                                        </a>

                                        {/* add bullet separator except the last item */}
                                        {index !== tickerList.length - 1 && (
                                            <span className={styles.bullet}>•</span>
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default RotatingNews
