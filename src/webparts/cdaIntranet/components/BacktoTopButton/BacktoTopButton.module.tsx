import * as React from "react";
import styles from "./BacktoTopButton.module.scss";
import { useEffect } from "react";

interface BackToTopProps {
  scrollContainerRef?: React.RefObject<HTMLElement>;
}

const BackToTopButton: React.FC<BackToTopProps> = ({ scrollContainerRef }) => {
  const [show, setShow] = React.useState(false);

  const scrollToTop = (): void => {
    scrollContainerRef?.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const container = scrollContainerRef?.current;
    if (!container) return;

    const handleScroll = (): void => {
      setShow(container.scrollTop < 300);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [scrollContainerRef]);

  return (
    <button
      className={`${styles.backtoTop} ${show ? styles.show : ""}`}
      onClick={scrollToTop}
      aria-label="Back to top"
      type="button"
    >
      <i className="fas fa-arrow-up" />
    </button>
  );
};

export default BackToTopButton;
