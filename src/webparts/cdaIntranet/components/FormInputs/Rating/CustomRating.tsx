import * as React from "react";
import { Rate } from "antd";

interface IRatingProps {
    value?: number;
    onChange?: (name: string, value: number) => void; // updated type
    tooltips?: string[];
    readOnly?: boolean;
    name?: string;
    error?: any
}

const Rating: React.FC<IRatingProps> = ({
    value,
    onChange,
    tooltips = ["terrible", "bad", "normal", "good", "wonderful"],
    readOnly = false,
    name,
    error
}) => {
    const handleRateChange = (val: number) => {
        if (onChange && name) {
            onChange(name, val);
        }
    };

    return (
        <div className="field">
            <label className="field-label">
                Rating
                {/* {label} {required && <span className="req">*</span>} */}
            </label>
            <Rate
                tooltips={tooltips}
                onChange={handleRateChange}
                value={value}
                disabled={readOnly}
            />
            {value ?
                <span className="ant-rate-text">{tooltips[value - 1]}</span>
                : ""}

            {error && <span className="error-text">{error}</span>}

        </div>
    );
};

export default Rating;
