// import * as React from "react";
// import { Modal } from "antd";

// interface Props {
//     visible: boolean;
//     title: string; // header title
//     onOk: () => void; // function to call on OK
//     onCancel: () => void; // function to call on Cancel
//     children: React.ReactNode; // modal body content
//     okText?: string; // optional OK button text
//     cancelText?: string; // optional Cancel button text
// }

// const CustomModal = ({
//     visible,
//     title,
//     onOk,
//     onCancel,
//     children,
//     okText = "حفظ",
//     cancelText = "إلغاء"
// }: Props) => {
//     return (
//         <Modal
//             title={title}
//             visible={visible}
//             onOk={onOk}
//             onCancel={onCancel}
//             okText={okText}
//             cancelText={cancelText}
//         >
//             {children}
//         </Modal>
//     );
// };

// export default CustomModal;



import * as React from "react";
import { Button, Modal } from "antd";

interface Props {
    visible: boolean;
    title: string;
    onOk: () => void;
    onCancel: () => void;
    children: React.ReactNode;
    okText?: string;
    cancelText?: string;
    width?: number | string;        // ⬅ added
    bodyHeight?: string;
    /** 🔥 NEW */
    onDelete?: () => void;
    deleteText?: string;         // ⬅ added (scroll height)
}


const CustomModal = ({
    visible,
    title,
    onOk,
    onCancel,
    children,
    okText = "Submit",
    cancelText = "Cancel",
    width = 400,                    // default width
    bodyHeight = "70vh",
    deleteText = "Delete",
    onDelete
    // default scroll height
}: Props) => {
    return (
        <Modal
            title={title}
            open={visible}
            onOk={onOk}
            onCancel={onCancel}
            okText={okText}
            cancelText={cancelText}
            width={width}



            footer={
                <div style={{ display: onDelete ? "flex" : "", justifyContent: onDelete ? "space-between" : "" }}>

                    {/* 🔴 LEFT – DELETE */}
                    {onDelete && (
                        <Button
                            danger
                            type="default"
                            onClick={onDelete}
                            style={{
                                borderColor: "#ff4d4f",
                                color: "#ff4d4f"
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = "#ff4d4f";
                                e.currentTarget.style.color = "#fff";
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = "transparent";
                                e.currentTarget.style.color = "#ff4d4f";
                            }}
                        >
                            {deleteText}
                        </Button>
                    )}

                    {/* RIGHT – CANCEL / SUBMIT */}
                    <div>
                        <Button onClick={onCancel} style={{ marginRight: 8 }}>
                            {cancelText}
                        </Button>
                        <Button type="primary" onClick={onOk}>
                            {okText}
                        </Button>
                    </div>
                </div>
            }// ⬅ set width
            bodyStyle={{
                maxHeight: bodyHeight,   // ⬅ scroll inside modal
                overflowY: "auto",
                paddingRight: "10px"
            }}
        >
            {children}
        </Modal>
    );
};

export default CustomModal;

