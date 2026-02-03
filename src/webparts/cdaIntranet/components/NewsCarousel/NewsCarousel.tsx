/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-floating-promises */
import * as React from "react";
import styles from "./NewsCarousel.module.scss";
import { Empty, Skeleton } from "antd";
import {
  getNewsList,
  INewsImage,
} from "../../../Services/NewsCarousel/NewsCarousel";
import { useLanguage } from "../useContext/useContext";
import { useEffect, useRef, useState } from "react";

const NewsCarousel = (): JSX.Element => {
  const { isArabic } = useLanguage();

  const [images, setImages] = useState<INewsImage[]>([]);
  const [isloading, setIsLoading] = useState(false);
  const slideRef = useRef<HTMLDivElement[]>([]);
  const currentIndex = useRef(0);
  const [hovering, setHovering] = useState(false);

  /** Load Images */
  const loadImages = async (): Promise<void> => {
    setIsLoading(true);

    const data: any = await getNewsList(true);
    setImages(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadImages();
  }, []);

  /** Carousel Auto Slide */
  useEffect(() => {
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

  return (
    <>
      {/* MAIN CARD */}
      <div className={`dds-card ${styles.container}`}>
        {/* Header */}
        <div className="dds-section-title">
          <h3
            className={`text-lg ${styles.subcontainer}`}
            onClick={updateNewsQueryParam}
            style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
          >
            <i
              className="fas fa-newspaper"
              style={{
                ...(isArabic
                  ? { marginLeft: "10px" }
                  : { marginRight: "10px" }),
              }}
            />{" "}
            {isArabic ? "أحدث الأخبار" : "Latest News"}
          </h3>
        </div>

        <div className={styles.carouselcontainer}>
          {/* 1️⃣ Loading state */}
          {isloading && (
            <div
              style={{
                width: "100%",
                height: "100%",
              }}
            >
              <Skeleton.Image
                active
                style={{
                  width: "100% !important",
                  height: "100% !important",
                  borderRadius: "8px",
                }}
              />
            </div>
          )}

          {/* 2️⃣ No images */}
          {!isloading && images.length === 0 && (
            <div
              style={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Empty
                description="No images available"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            </div>
          )}

          {/* 3️⃣ Images carousel */}
          {!isloading &&
            images.length > 0 &&
            images.map((img, index) => (
              <div
                key={img.Name}
                ref={(el) => (slideRef.current[index] = el!)}
                className={`${styles.carouselitem} ${index === 0 ? "" : styles.hidden}`}
                onMouseEnter={() => setHovering(true)}
                onMouseLeave={() => setHovering(false)}
              >
                <img src={img.ServerRelativeUrl} alt="news" />
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default NewsCarousel;
