import * as React from "react";
import { Rate } from "antd";

interface IRatingProps {
    value?: number;
    onChange?: (name: string, value: number) => void; // updated type
    tooltips?: string[];
    readOnly?: boolean;
    name?: string;
}

const Rating: React.FC<IRatingProps> = ({
    value = 0,
    onChange,
    tooltips = ["terrible", "bad", "normal", "good", "wonderful"],
    readOnly = false,
    name
}) => {
    const handleChange = (val: number) => {
        if (onChange && name) {
            onChange(name, val);
        }
    };

    return (
        <span>
            <label htmlFor="" className="field-label"> Rating</label>
            <Rate
                tooltips={tooltips}
                onChange={handleChange}
                value={value}
                disabled={readOnly}
            />
            {value ? value
                // <span className="ant-rate-text">{tooltips[value - 1]}</span>
                : ""}
        </span>
    );
};

export default Rating;
