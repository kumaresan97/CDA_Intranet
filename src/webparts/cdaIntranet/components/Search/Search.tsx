import * as React from 'react'
import styles from "./Search.module.scss"

const Search = ({ value, onChange }: any) => {
    return (


        <div className={styles.searchWrapper}>
            <input
                type="text"
                id="searchInput"
                value={value}
                onChange={(e) => onChange(e.target.value)}                // className="w-full pl-12 pr-4 py-3 text-base border-2 border-dds-gray-200 rounded-full focus:ring-2 focus:ring-dds-gold-500 focus:border-dds-gold-500 outline-none transition-all"
                placeholder="ابحث عن خدمة، تطبيق، أو سياسة..."
            />
            <i
                className={`fas fa-search ${styles.searchIcon} `}
            ></i>
        </div>


    )
}

export default Search
