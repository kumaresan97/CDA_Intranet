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
import { Modal } from "antd";

interface Props {
    visible: boolean;
    title: string;
    onOk: () => void;
    onCancel: () => void;
    children: React.ReactNode;
    okText?: string;
    cancelText?: string;
    width?: number | string;        // ⬅ added
    bodyHeight?: string;            // ⬅ added (scroll height)
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
    bodyHeight = "60vh"             // default scroll height
}: Props) => {
    return (
        <Modal
            title={title}
            open={visible}
            onOk={onOk}
            onCancel={onCancel}
            okText={okText}
            cancelText={cancelText}
            width={width}            // ⬅ set width
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

