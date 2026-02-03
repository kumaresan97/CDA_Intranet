/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import styles from "./ServieCard.module.scss";

const DefaultImg: any = require("../../assets/images/global.png");

const ServiceCard: React.FC<{
  item: any;
  isFavorite: boolean;
  onFavoriteToggle: (item: string) => void;
  handleViewCount: (item: any) => void;
  onEdit: (item: any) => void;
  onDelete: (item: any) => void;
  lang: boolean;
  isAdmin: any;
}> = ({
  item,
  isFavorite,
  isAdmin,
  handleViewCount,
  onFavoriteToggle,
  onEdit,
  onDelete,
  lang,
}) => {
  const ratingStars = (rating?: number): JSX.Element | null => {
    if (!rating) return null;
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;
    return (
      <div className={styles.ratingStar}>
        {[...Array(fullStars)].map((_, i) => (
          <i key={`full-${i}`} className={`fas fa-star ${styles.yellowStar}`} />
        ))}
        {[...Array(emptyStars)].map((_, i) => (
          <i key={`empty-${i}`} className={`far fa-star ${styles.grayStar}`} />
        ))}
      </div>
    );
  };
  const isAnchor = item.Url_En && item.Url_En !== "#";
  const isExternal =
    isAnchor &&
    (item.Url_En.startsWith("http") || item.Url_En.startsWith("//"));
  const targetAttr = isExternal ? "_blank" : undefined;
  const Container: React.ElementType = isAnchor ? "a" : "div";

  const QueryParam = (): void => {
    const url = new URL(window.location.href);

    // Manually append without "="
    const baseUrl = url.origin + url.pathname;
    const params = url.searchParams.toString();

    const newUrl = params
      ? `${baseUrl}?${params}&coming_soon`
      : `${baseUrl}?coming_soon`;

    window.history.replaceState({}, "", newUrl);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <Container
      href={isAnchor ? item.url : undefined}
      target={targetAttr}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className={` dds-card service-card ${styles.cardCotainer}`}
      data-title={item.Title.toLowerCase()}
      data-category={item.Category_En}
      data-type={item.Type_En}
    >
      <div className={styles.innerBody}>
        <div className={styles.wrapper}>
          <img src={item?.attachmentUrl || DefaultImg} alt="Icons" />
        </div>
        <button
          className={`favorite-btn ${styles.starbutton} ${isFavorite ? styles.yellowStar : styles.grayStar}`}
          onClick={(e) => {
            e.preventDefault();
            onFavoriteToggle(item);
          }}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <i className={isFavorite ? "fas fa-star" : "far fa-star"} />
        </button>
      </div>
      <div className={styles.item}>
        <h4 className={styles.itemTitle}>
          {lang ? item.Title_Ar : item.Title}
        </h4>
        <p className={styles.itemDescription}>
          {lang ? item.Description_Ar : item.Description_En}
        </p>
      </div>
      <div className={styles.arrowSection}>
        <div className={styles.arrowwrapper}>
          {!isAnchor ? (
            <a
              onClick={() => {
                if (item.url) {
                  handleViewCount(item);
                } else {
                  QueryParam();
                }
              }} // <-- ADD HERE
              target={targetAttr}
              rel={isExternal ? "noopener noreferrer" : undefined}
              className={styles.myText}
            >
              {lang ? (
                <>
                  فتح <i className="fas fa-arrow-left mr-1 text-xs" />
                </>
              ) : (
                <>
                  Open <i className="fas fa-arrow-right ml-1 text-xs" />
                </>
              )}
            </a>
          ) : (
            <div className="text-sm font-bold text-dds-primary">
              {lang ? (
                <>
                  فتح <i className="fas fa-arrow-left mr-1 text-xs" />
                </>
              ) : (
                <>
                  Open <i className="fas fa-arrow-right ml-1 text-xs" />
                </>
              )}
            </div>
          )}
          {item?.views ? (
            <span className={styles.viewSetion}>
              <i className="fas fa-eye" /> {item.views.toLocaleString()}
            </span>
          ) : (
            ""
          )}
        </div>
        {ratingStars(item.Rating)}

        {isAdmin && (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
              marginTop: "10px",
            }}
          >
            <i
              className="fas fa-edit text-blue-600 cursor-pointer"
              onClick={() => onEdit(item)}
              style={{ cursor: "pointer", color: "var(--dds-blue-600)" }}
            />
            <i
              className="fas fa-trash text-red-600 cursor-pointer"
              onClick={() => onDelete(item)}
              style={{ cursor: "pointer", color: "red" }}
            />
          </div>
        )}
      </div>
    </Container>
  );
};
export default React.memo(ServiceCard);
