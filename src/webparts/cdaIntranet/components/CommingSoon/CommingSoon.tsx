/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { useLanguage } from "../useContext/useContext";
import styles from "./CommingSoon.module.scss";

const CommingSoon = ({ homepage }: any): JSX.Element => {
  const { isArabic } = useLanguage();

  return (
    <div>
      <main className={styles.mainContainer}>
        <div className={styles.contentCenter}>
          <div className={styles.iconContainer}>
            <i className="fas fa-hourglass-half" />
          </div>

          <h1>{isArabic ? "قريباً" : "Coming Soon"}</h1>

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
            <a
              onClick={() => {
                if (homepage) {
                  homepage();
                } else {
                  window.location.href = "/";
                }
              }}
              dir={isArabic ? "rtl" : "ltr"}
            >
              <i
                className="fas fa-home"
                style={{
                  marginLeft: isArabic ? "10px" : 0,
                  marginRight: isArabic ? 0 : "10px",
                }}
              />
              {isArabic ? "العودة إلى الصفحة الرئيسية" : "Back to Home"}
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CommingSoon;
