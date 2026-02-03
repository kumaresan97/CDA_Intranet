/* eslint-disable @rushstack/no-new-null */
import * as React from "react";
import { DatePicker } from "antd";
import * as moment from "moment";

interface IReDatePickerProps {
  label: string;
  name: string;
  value: Date | null;
  onChange: (name: string, value: Date | null) => void;
  required?: boolean;
  error?: string;
}

const ReDatePicker: React.FC<IReDatePickerProps> = ({
  label,
  name,
  value,
  onChange,
  required,
  error,
}) => {
  return (
    <div className="field">
      <label className="field-label">
        {label} {required && <span className="req">*</span>}
      </label>

      <DatePicker
        value={value ? moment(value) : null}
        onChange={(d) => onChange(name, d ? d.toDate() : null)}
        format="YYYY-MM-DD"
        className={`field-input ${error ? "error-border" : ""}`}
        style={{ width: "100%" }}
      />

      {error && <span className="error-text">{error}</span>}
    </div>
  );
};

export default ReDatePicker;
