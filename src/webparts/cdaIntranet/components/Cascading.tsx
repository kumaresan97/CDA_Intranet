import * as React from "react";
import styles from "./Cascading.module.scss";

interface Option {
    label: string;
    value: string;
    children?: Option[];
}

const options: Option[] = [
    {
        label: "Fruits",
        value: "fruits",
        children: [
            { label: "Apple", value: "apple" },
            { label: "Banana", value: "banana" },
        ],
    },
    {
        label: "Vegetables",
        value: "vegetables",
        children: [
            { label: "Carrot", value: "carrot" },
            { label: "Spinach", value: "spinach" },
        ],
    },
];

export const CascadingDropdown: React.FC = () => {
    const [parentValue, setParentValue] = React.useState("");
    const [childValue, setChildValue] = React.useState("");

    const handleParentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setParentValue(e.target.value);
        setChildValue(""); // reset child
    };

    const childOptions = options.find((o) => o.value === parentValue)?.children || [];

    return (
        <div className={styles.container}>
            <div className={styles.dropdownGroup}>
                <div className={styles.dropdown}>
                    <label>Category</label>
                    <select value={parentValue} onChange={handleParentChange}>
                        <option value="">Select</option>
                        {options.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.dropdown}>
                    <label>Subcategory</label>
                    <select value={childValue} onChange={(e) => setChildValue(e.target.value)}>
                        <option value="">Select</option>
                        {childOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};
