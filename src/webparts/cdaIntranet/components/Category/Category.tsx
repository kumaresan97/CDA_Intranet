import * as React from 'react'
import styles from "./Category.module.scss"

interface Category {
    name: string;
    icon: string;
}

interface Props {
    categories: Record<string, Category>;
    activeCategory: string;
    onSelect: (key: string) => void;
}

const Category: React.FC<Props> = ({
    categories,
    activeCategory,
    onSelect,
}) => {
    return (
        <section className={styles.wrapper}>
            <div className={styles.filterContainer}>
                {Object.keys(categories).map((key) => {
                    const isActive = activeCategory === key;
                    return (
                        <button
                            key={key}
                            className={`dds-btn  ${isActive ? "dds-btn-primary" : styles.categoryBtn
                                }`}
                            onClick={() => onSelect(key)}
                        >
                            <i className={`${categories[key].icon} ${styles.icon}`} />
                            {categories[key].name}
                        </button>
                    );
                })}
            </div>
        </section>
    );
}

export default Category
