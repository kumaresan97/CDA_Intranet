import * as React from "react";
import styles from "./Category.module.scss";
import { ICategory } from "../Mainpage";

interface Category {
  name: {
    ar: string;
    en: string;
  };
  icon: string;
}

interface Props {
  categories: ICategory;
  activeCategory: keyof ICategory;
  onSelect: (key: keyof ICategory) => void;
  lang: string;
}

const Category: React.FC<Props> = ({
  categories,
  activeCategory,
  onSelect,
  lang,
}) => {
  const langs = lang.startsWith("ar"); // true if Arabic

  return (
    <section className={styles.wrapper}>
      <div className={styles.filterContainer}>
        {(Object.keys(categories) as Array<keyof ICategory>).map((key) => {
          const isActive = activeCategory === key;

          return (
            <button
              key={key}
              className={`dds-btn ${
                isActive ? "dds-btn-primary" : styles.categoryBtn
              }`}
              onClick={() => onSelect(key)}
            >
              <i
                className={`${categories[key].icon} ${
                  langs ? styles.icon : styles.iconltr
                }`}
              />
              {categories[key].name[langs ? "ar" : "en"]}
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default Category;
