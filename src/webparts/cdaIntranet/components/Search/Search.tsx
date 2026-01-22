import * as React from 'react'
import { useLanguage } from '../useContext/useContext';
import styles from "./Search.module.scss"

const Search = ({ value, onChange }: any) => {
    const { isArabic } = useLanguage();
    return (


        <div className={styles.searchWrapper}>
            <input
                type="text"
                id="searchInput"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                // placeholder="ابحث عن خدمة، تطبيق، أو سياسة..."
                placeholder={
                    isArabic
                        ? "ابحث عن خدمة، تطبيق، أو سياسة..."
                        : "Search for a service, application, or policy..."
                }
            />
            <i
                className={`fas fa-search ${styles.searchIcon} `}
            ></i>
        </div>


    )
}

export default Search
