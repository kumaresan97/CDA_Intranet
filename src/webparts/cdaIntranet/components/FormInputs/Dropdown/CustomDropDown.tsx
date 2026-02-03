/* eslint-disable @rushstack/no-new-null */
import * as React from "react";
import { Select } from "antd";

interface IOption {
  label: string;
  value: string | number;
}

interface IReDropdownProps {
  label?: string;
  name: string;
  value: string | number | null;
  options: IOption[];
  placeholder?: string;
  required?: boolean;
  error?: string;
  onChange: (name: string, value: string | number) => void;
}

const CustomDropDown: React.FC<IReDropdownProps> = ({
  label,
  name,
  value,
  options,
  required,
  placeholder = "Select an option",
  error,
  onChange,
}) => {
  return (
    <div className="field">
      {label && (
        <label className="field-label">
          {label} {required && <span className="req">*</span>}
        </label>
      )}

      <Select
        value={value === "" || value === null ? undefined : value}
        options={options}
        placeholder={placeholder ?? ""}
        onChange={(val) => onChange(name, val)}
        className={`field-input ${error ? "error-border" : ""}`}
        style={{ width: "100%" }}
      />

      {error && <span className="error-text">{error}</span>}
    </div>
  );
};

export default CustomDropDown;
