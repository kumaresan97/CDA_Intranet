import * as React from 'react'
import styles from "./Footer.module.scss"

const Footer = () => {
    return (
        <div>

            <footer className={styles.footer}>
                <div className={styles.container}>
                    <p>
                        &copy; <span id="current-year"></span> جميع الحقوق محفوظة لهيئة تنمية
                        المجتمع - دبي.
                    </p>
                    <p className={styles.version}>
                        الإصدار 1.2 | آخر تحديث: أغسطس 2025
                    </p>
                </div>
            </footer>


        </div>
    )
}

export default Footer
