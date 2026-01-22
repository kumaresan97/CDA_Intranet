import * as  React from 'react'
import { useLanguage } from '../useContext/useContext'
import styles from "./CommingSoon.module.scss"

const CommingSoon = ({ homepage }: any) => {
    const { isArabic } = useLanguage()
    console.log("isArabic: ", isArabic);
    return (
        <div>
            {/* <main className={styles.mainContainer}>
                <div className={styles.contentCenter}>
                    <div className={styles.iconContainer}>
                        <i className="fas fa-hourglass-half"></i>
                    </div>

                    <h1>قريباً</h1>
                    <p className={styles.primaryText}>المحتوى سيكون متاحاً قريباً.</p>
                    <p className={styles.secondaryText}>Content will be available soon.</p>

                    <div className={styles.buttonContainer}>
                        <a
                            onClick={goHome}

                        >
                            <i className="fas fa-home"></i>
                            العودة إلى الصفحة الرئيسية
                        </a>
                    </div>
                </div>
            </main> */}


            <main
                className={styles.mainContainer}
            >
                <div className={styles.contentCenter}>
                    <div className={styles.iconContainer}>
                        <i className="fas fa-hourglass-half"></i>
                    </div>

                    <h1>
                        {isArabic ? "قريباً" : "Coming Soon"}
                    </h1>

                    <p className={styles.primaryText}>
                        {isArabic
                            ? "المحتوى سيكون متاحاً قريباً."
                            : "Content will be available soon."}
                    </p>

                    <p className={styles.secondaryText}>
                        {isArabic
                            ? "نحن نعمل على تجهيز هذه الصفحة."
                            : "We are working on preparing this page."}
                    </p>

                    <div className={styles.buttonContainer}>
                        <a onClick={() => {
                            if (homepage) {
                                homepage()
                            } else {
                                window.location.href = '/';
                            }
                        }}
                        >
                            <i className="fas fa-home"></i>
                            {isArabic ? "العودة إلى الصفحة الرئيسية" : "Back to Home"}
                        </a>
                    </div>
                </div>
            </main>

        </div>
    )
}

export default CommingSoon
