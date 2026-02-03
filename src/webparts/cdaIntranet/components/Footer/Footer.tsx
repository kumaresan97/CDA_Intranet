/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import styles from "./Footer.module.scss";

const Footer = ({ lang }: any): JSX.Element => {
  const year = new Date().getFullYear();
  const langs = lang.startsWith("ar"); // true if Arabic

  return (
    <div>
      <footer className={styles.footer}>
        <div className={styles.container}>
          {langs ? (
            <>
              <p>&copy; {year} جميع الحقوق محفوظة لهيئة تنمية المجتمع - دبي.</p>
              <p className={styles.version}>
                الإصدار 1.2 | آخر تحديث: أغسطس 2025
              </p>
            </>
          ) : (
            <>
              <p>
                &copy; {year} All rights reserved to Community Development
                Authority – Dubai.
              </p>
              <p className={styles.version}>
                Version 1.2 | Last updated: August 2025
              </p>
            </>
          )}
        </div>
      </footer>
    </div>
  );
};

export default Footer;
