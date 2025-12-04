import * as React from "react";
import { Upload } from "antd";
const { Dragger } = Upload;

interface ISingleImageUploaderProps {
    file: File | null;
    setFile: (file: File | null) => void;
}

const CustomDragandDrop: React.FC<ISingleImageUploaderProps> = ({ file, setFile }: any) => {

    const fileList: any = file
        ? [{
            uid: "-1",
            name: file.name,
            status: "done",
            url: URL.createObjectURL(file)
        }]
        : [];
    const props = {
        name: "file",
        multiple: false,
        maxCount: 1,
        accept: "image/*",
        beforeUpload(f: File) {
            setFile(f);
            return false;
        },
        onRemove() {
            setFile(null);
        },
        fileList
    };

    return (
        <Dragger {...props} style={{ padding: 20 }}>
            <p className="ant-upload-text">Click or Drag image here</p>
        </Dragger>
    );
};

export default CustomDragandDrop;
