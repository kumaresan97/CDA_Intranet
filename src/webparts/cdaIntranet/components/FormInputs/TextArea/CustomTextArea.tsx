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
  autoSize?: boolean;
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
  autoSize = true,
  ...rest
}) => {
  return (
    <div className="field">
      <label className="field-label">
        {label} {required && <span className="req">*</span>}
      </label>

      <TextArea
        {...rest}
        placeholder={placeholder ?? ""}
        autoSize={{ minRows: rows, maxRows: 5 }}
        value={value ?? undefined}
        onChange={(e) => onChange(name, e.target.value)}
        className={`field-input ${error ? "error-border" : ""}`}
      />

      {error && <span className="error-text">{error}</span>}
    </div>
  );
};

export default ReTextArea;
