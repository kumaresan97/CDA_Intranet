import { Input } from "antd";
import * as React from "react";

interface IReInputProps {
    label: string;
    name: string;
    value: string;
    onChange: (name: string, value: string) => void;
    required?: boolean;
    error?: string;
    [key: string]: any;
    placeholder?: string;
}

const ReInput: React.FC<IReInputProps> = ({
    label,
    name,
    value,
    onChange,
    required,
    error,
    ...rest

}) => {
    return (
        <div className="field">
            <label className="field-label">
                {label} {required && <span className="req">*</span>}
            </label>

            <Input
                {...rest}

                value={value}
                onChange={(e) => onChange(name, e.target.value)}
                className={`field-input ${error ? "error-border" : ""}`}
            />

            {error && <span className="error-text">{error}</span>}
        </div>
    );
};

export default ReInput;
