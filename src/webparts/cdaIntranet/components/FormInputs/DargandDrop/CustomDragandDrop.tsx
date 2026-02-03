/* eslint-disable @rushstack/no-new-null */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { Upload } from "antd";
const { Dragger } = Upload;

interface ISingleImageUploaderProps {
  file: File | null;
  setFile: (file: File | null) => void;
  error?: any;
  label?: any;
  required?: boolean | any;
  iconUrl?: any; // <-- added to support existing URL
  fileName?: string | any;
  setIconUrl?: (val: string | null) => void;
  setFileName?: (val: string | null) => void;
  accept?: string; // <-- dynamic accept types
}

const CustomDragandDrop: React.FC<ISingleImageUploaderProps> = ({
  file,
  setFile,
  error,
  label,
  required,
  iconUrl,
  fileName,
  setIconUrl,
  setFileName,

  accept = "*/*",
}: any) => {
  let fileList: any[] = [];

  if (file instanceof File) {
    fileList = [
      {
        uid: "-1",
        name: file.name,
        status: "done",
        url: URL.createObjectURL(file),
      },
    ];
  }

  // CASE 2 — existing SharePoint icon URL (only when file is null)
  else if (!file && iconUrl && fileName) {
    fileList = [
      {
        uid: "-2",
        name: fileName,
        status: "done",
        url: iconUrl,
      },
    ];
  }
  const props = {
    name: "file",
    multiple: false,
    maxCount: 1,
    accept,
    beforeUpload(f: File) {
      setFile(f);
      return false;
    },
    onRemove() {
      setFile(null);
      setIconUrl?.(null);
      setFileName?.(null);
    },
    fileList,
  };

  return (
    <>
      <div
        className="custom-drag-drop-wrapper"
        style={{ marginBottom: error ? 0 : 20 }}
      >
        <label className="field-label">
          {label} {required && <span className="req">*</span>}
        </label>
        <Dragger
          {...props}
          style={{ padding: 20, borderColor: error ? "red" : undefined }}
        >
          <p className="ant-upload-text">Click or Drag image here</p>
        </Dragger>
        {error && <span className="error-text">{error}</span>}
      </div>
    </>
  );
};

export default CustomDragandDrop;
