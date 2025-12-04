
/* eslint-disable  @typescript-eslint/no-empty-function   */

import * as React from 'react';
import { useCallback } from 'react';
import ServiceCard from '../reusableCard/ServiceCard';
import styles from "./MainSection.module.scss"
// import Searchomponent from '../Search/Search';
// import ServiceCard from '../../reusableCard/ServiceCard';
// interface ServiceItem {
//     title: string;
//     description: string;
//     url: string;
//     icon: string;
//     color: string;
//     category: string;
//     type: string;
//     views: number;
//     rating?: number;
// }

// servicesData: ServiceItem[];
interface Props {
    filteredData: any[];
    favorites: string[];
    onFavoriteToggle: (title: string) => void;
    activeCategory?: string;

    onEdit: (item: any) => void;
    onDelete: (item: any) => void;
    onAdd: () => void;
}

const ServicesResources: React.FC<Props> = ({ filteredData,
    favorites,
    onFavoriteToggle,
    activeCategory,
    onEdit, onDelete, onAdd
}) => {


    const renderCardsByType = useCallback(
        (type: string) =>
            filteredData
                .filter((item) => item.Type_En === type)
                .map((item) => (
                    <ServiceCard
                        key={item.Title}
                        item={item}
                        // isFavorite={favorites.includes(item.Title)}
                        isFavorite={item.IsFavorite}
                        onFavoriteToggle={() => onFavoriteToggle(item)}
                        // onFavoriteToggle={onFavoriteToggle}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                )),
        [filteredData, favorites, onFavoriteToggle]
    );





    return (


        <>

            <div>
                <i
                    onClick={() => {
                        onAdd()
                    }}


                    className='fas fa-plus'
                    style={{
                        cursor: "pointer",
                        color: "var(--dds-white)",
                        fontSize: "1.25rem",
                        backgroundColor: "var(--dds-blue-700)",
                        borderRadius: "50%",
                        padding: "0.40rem",
                        margin: "10px 0px"
                    }}

                ></i>
            </div>


            <section
                id="favorites-section"
                className={favorites?.length > 0 ? undefined : styles.hidden}
                style={{ marginBottom: '2rem' }}
            >
                <h3 className={` dds-section-title ${styles.sectionTitle}`}>
                    <i className="fas fa-star text-dds-gold-500"></i>خدماتك المفضلة
                </h3>

                <div className={styles.gridLayout}>
                    {favorites?.length > 0 ? (

                        // renderCardsByType("favorite")
                        filteredData
                            .filter((item) => item.IsFavorite)

                            // .filter((item) => favorites.includes(item?.Title))
                            .map((item) => (
                                <ServiceCard
                                    key={item.Title}
                                    item={item}
                                    // isFavorite={true}
                                    // onFavoriteToggle={onFavoriteToggle}
                                    isFavorite={item.IsFavorite}
                                    onFavoriteToggle={() => onFavoriteToggle(item)}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                />
                            ))
                    ) : (
                        <div className={styles.favoritesEmptyBox}>
                            <i className="far fa-star fa-2x"></i>
                            <p>لم تقم بإضافة أي خدمات للمفضلة بعد.</p>
                        </div>
                    )}
                </div>
            </section>

            <section
                id="general-section"
                className={activeCategory === "favorite" ? styles.hidden : styles.mb8}
            >
                <h3
                    // className={styles.sectionTitle}
                    className={` dds-section-title ${styles.sectionTitle}`}
                >
                    <i className="fas fa-bullhorn"></i>منصة التواصل
                </h3>
                <div className={styles.gridLayout}>{renderCardsByType("general")}</div>
            </section>

            <section
                id="programs-section"
                className={activeCategory === "favorite" ? styles.hidden : styles.mb8}
            >
                <h3
                    // className={styles.sectionTitle}
                    className={` dds-section-title ${styles.sectionTitle}`}
                >
                    <i className="fas fa-laptop-code"></i>الدخول إلى البرامج
                </h3>
                <div className={styles.gridLayout}>{renderCardsByType("program")}</div>
            </section>

            <section
                id="libraries-section"
                className={activeCategory === "favorite" ? styles.hidden : undefined}

            >
                <h3
                    // className={styles.sectionTitle}
                    className={` dds-section-title ${styles.sectionTitle}`}
                >
                    <i className="fas fa-book-open"></i>المكتبات والموارد
                </h3>
                <div className={styles.gridLayout}>{renderCardsByType("library")}</div>
            </section>

            {filteredData.length === 0 && (
                <div className={styles.noResults} id="no-results">
                    <i className="fas fa-search fa-3x"></i>
                    <h4>لا توجد نتائج مطابقة</h4>
                    <p>يرجى المحاولة باستخدام كلمات بحث مختلفة.</p>
                </div>
            )}









        </>
    );
};

export default ServicesResources;