import * as React from 'react';
// import { useState, useEffect } from 'react';
import styles from "./ServieCard.module.scss"

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

// interface Props {
//     servicesData: ServiceItem[];
// }


const ServiceCard: React.FC<{
    item: any; isFavorite: boolean; onFavoriteToggle: (title: string) => void,

    onEdit: (item: any) => void;
    onDelete: (item: any) => void;
}> = ({ item, isFavorite, onFavoriteToggle, onEdit, onDelete }) => {
    const ratingStars = (rating?: number) => {
        if (!rating) return null;
        const fullStars = Math.floor(rating);
        const emptyStars = 5 - fullStars;
        return (
            <div
                className={styles.ratingStar}
            // className="flex items-center justify-center gap-1 text-xs"
            >
                {[...Array(fullStars)].map((_, i) => (
                    <i key={`full-${i}`}
                        className={`fas fa-star ${styles.yellowStar}`}
                    // className="fas fa-star text-yellow-400"
                    ></i>
                ))}
                {[...Array(emptyStars)].map((_, i) => (
                    <i key={`empty-${i}`}
                        className={`far fa-star ${styles.grayStar}`}
                    //  className="far fa-star text-gray-300"
                    ></i>
                ))}
            </div>
        );
    };

    // const isAnchor = item.url && item.url !== '#';
    // const isExternal = isAnchor && (item.url.startsWith('http') || item.url.startsWith('//'));

    const isAnchor = item.Url_En && item.Url_En !== '#';
    const isExternal = isAnchor && (item.Url_En.startsWith('http') || item.Url_En.startsWith('//'));
    const targetAttr = isExternal ? '_blank' : undefined;

    const Container: React.ElementType = isAnchor ? 'a' : 'div';

    return (
        <Container
            href={isAnchor ? item.url : undefined}
            target={targetAttr}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            className={` dds-card service-card ${styles.cardCotainer}`}
            // className="dds-card service-card flex flex-col p-4"
            data-title={item.Title.toLowerCase()}
            data-category={item.Category_En}
            data-type={item.Type_En}
        >
            <div
                // className="flex justify-between items-start mb-3"

                className={styles.innerBody}
            >
                <div
                    className={styles.wrapper}

                // className="w-12 h-12 flex items-center justify-center rounded-lg"
                // style={{ backgroundColor: `${item?.Color}1A` }}
                >

                    <img src={item?.attachmentUrl} alt="Icons" />
                    {/* <i className={`${item.Icon} text-2xl`} style={{ color: item.Color }}></i> */}
                </div>
                <button
                    className={`favorite-btn ${styles.starbutton} ${isFavorite ? styles.yellowStar : styles.grayStar}`}
                    // className={`favorite-btn text-xl ${isFavorite ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400 transition z-10`}
                    onClick={(e) => {
                        e.preventDefault();
                        onFavoriteToggle(item);
                    }}
                    aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                    <i className={isFavorite ? 'fas fa-star' : 'far fa-star'}></i>
                </button>
            </div>
            <div
                // className="flex-grow"
                className={styles.item}
            >
                <h4
                    className={styles.itemTitle}
                // className="font-bold text-md text-dds-gray-900 mb-1 text-center"
                >{item.Title}</h4>
                <p
                    className={styles.itemDescription}
                // className="text-sm text-dds-gray-500 mb-4 text-center"
                >{item.Description_En}</p>
            </div>
            <div
                className={styles.arrowSection}
            // className="mt-auto pt-4 border-t border-gray-100"
            >
                <div
                    className={styles.arrowwrapper}
                // className="flex justify-between items-center"
                >
                    {!isAnchor ? (
                        <a href={item.URL_En} target={targetAttr} rel={isExternal ? 'noopener noreferrer' : undefined}
                            // className="text-sm font-bold text-dds-primary hover:underline"
                            className={styles.myText}
                        >
                            فتح <i className="fas fa-arrow-left mr-1 text-xs"></i>
                        </a>
                    ) : (
                        <div className="text-sm font-bold text-dds-primary">
                            فتح <i className="fas fa-arrow-left mr-1 text-xs"></i>
                        </div>
                    )}
                    <span
                        className={styles.viewSetion}
                    // className="text-xs text-gray-400 flex items-center gap-1"
                    >
                        <i className="fas fa-eye"></i> {item.views.toLocaleString()}
                    </span>
                </div>
                {ratingStars(item.Rating)}


                <div style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "10px",
                    marginTop: "10px"

                }}>
                    <i
                        className="fas fa-edit text-blue-600 cursor-pointer"
                        onClick={() => onEdit(item)}

                        // onClick={() => console.log("edit", item.title)}

                        style={{ cursor: "pointer", color: "var(--dds-blue-600)" }}
                    />
                    <i
                        className="fas fa-trash text-red-600 cursor-pointer"


                        // onClick={() => console.log("delete", item.title)}
                        onClick={() => onDelete(item)}

                        style={{ cursor: "pointer", color: "red" }}

                    />
                </div>
            </div>
        </Container>
    );
};
export default ServiceCard;