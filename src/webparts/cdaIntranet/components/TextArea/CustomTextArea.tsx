import * as React from "react";
import { Input } from "antd";

const { TextArea } = Input;

interface ReTextAreaProps {
    label: string;
    name: string;
    value: string;
    placeholder?: string;
    required?: boolean;
    error?: string;
    rows?: number;
    onChange: (name: string, value: string) => void;
}

const ReTextArea: React.FC<ReTextAreaProps> = ({
    label,
    name,
    value,
    placeholder = "",
    required = false,
    error = "",
    rows = 4,
    onChange,
    ...rest
}) => {
    return (
        // <div className="mb-4">
        //   {/* LABEL */}
        //   <label className="block mb-1 font-semibold text-gray-700">
        //     {label} {required && <span className="text-red-500">*</span>}
        //   </label>

        //   {/* TEXTAREA */}
        //   <TextArea
        //     rows={rows}
        //     name={name}
        //     value={value}
        //     placeholder={placeholder}
        //     className={`rounded-lg ${error ? "border-red-500" : ""}`}
        //     onChange={(e) => onChange(name, e.target.value)}
        //   />

        //   {/* ERROR MSG */}
        //   {error && (
        //     <p className="text-red-500 text-xs mt-1">{error}</p>
        //   )}
        // </div>



        <div className="field">
            <label className="field-label">
                {label} {required && <span className="req">*</span>}
            </label>

            <TextArea
                {...rest}

                value={value}
                onChange={(e) => onChange(name, e.target.value)}
                className={`field-input ${error ? "error-border" : ""}`}
            />

            {error && <span className="error-text">{error}</span>}
        </div>
    );
};

export default ReTextArea;
