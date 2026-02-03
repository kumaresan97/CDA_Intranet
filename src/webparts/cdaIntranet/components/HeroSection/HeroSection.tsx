/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-floating-promises */

import { Skeleton } from "antd";
import * as React from "react";
import { getSpeechPageData } from "../../../Services/getManagerspeech";
import styles from "./HeroSection.module.scss";
const logo = require("../../assets/images/mujtamana_logo.svg");

const HeroSection = ({ lang, loading }: any): JSX.Element => {
  const langs = lang.startsWith("ar");
  const [speechdata, setspeechdata] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const updateQueryParam = (value: string): void => {
    const url = new URL(window.location.href);
    url.searchParams.set("dept", value);
    window.history.replaceState({}, "", url.toString());
    window.dispatchEvent(new PopStateEvent("popstate", { state: null }));
  };

  const getSpeechPageDatas = async (): Promise<void> => {
    setIsLoading(true);

    try {
      const data = await getSpeechPageData();

      setspeechdata(data ?? []);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const HeroSkeleton = (): JSX.Element => {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "50px 32px",
          borderRadius: "16px",
          background: "#fff",
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          direction: "rtl",
          gap: "24px",
          marginBottom: "2rem",
        }}
      >
        {/* RIGHT: Profile Image */}
        <div
          style={{
            width: "10%",
          }}
        >
          <Skeleton.Avatar active size={96} shape="circle" />
        </div>

        {/* CENTER: Text content */}
        <div style={{ flex: 1, padding: "0 24px" }}>
          <Skeleton.Input
            active
            size="default"
            style={{ width: "40%", marginBottom: 12 }}
          />
          <Skeleton.Input
            active
            size="small"
            style={{ width: "90%", marginBottom: 8 }}
          />

          <Skeleton.Input active size="small" style={{ width: "25%" }} />
        </div>

        {/* LEFT: Logos */}
        <div
          style={{
            width: "10%",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Skeleton.Avatar active size={64} shape="square" />
        </div>
      </div>
    );
  };

  React.useEffect(() => {
    getSpeechPageDatas();
  }, []);
  return isLoading ? (
    HeroSkeleton()
  ) : (
    <div>
      {/* <!-- NEW: Combined Header Section --> */}
      <section
        className="mb-8"
        style={{
          marginBottom: "2rem",
        }}
      >
        <div className={styles.heroContainer}>
          <div className={styles.logoSection}>
            <div className={`dds-card ${styles.cardContainer}`}>
              <div className={styles.imagesContainer}>
                <img
                  src={speechdata[0]?.image}
                  alt="معالي حصة بنت عيسى بوحميد"
                  loading="lazy"
                  className={styles.image}
                />
              </div>
              <div
                className={styles.messageSecction}
                style={{
                  textAlign: langs ? "right" : "left",
                }}
              >
                <h3 className={styles.Title}>
                  {langs ? speechdata[0]?.titleAr : speechdata[0]?.title}
                </h3>
                <p className={styles.message}>
                  {langs ? speechdata[0]?.About_Ar : speechdata[0]?.About_En}
                </p>
                <a
                  onClick={() => {
                    updateQueryParam("dg_message");
                  }}
                  className={styles.link}
                >
                  {langs ? "اقرأ الرسالة كاملة" : "Read full message"}
                  <i
                    className={
                      langs ? "fas fa-arrow-left " : "fas fa-arrow-right"
                    }
                    style={{
                      marginRight: langs ? "0.25rem" : 0,
                      marginLeft: langs ? 0 : "0.25rem",
                    }}
                  />
                </a>
              </div>
              <div className={styles.iconRow}>
                <img
                  loading="lazy"
                  src={logo}
                  alt="شعار مجتمعنا"
                  className={styles.img}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
