// import { Skeleton } from "antd";
// import * as React from "react";

// const FormSkeleton = () => {
//     return (
//         <>
//             {Array.from({ length: 4 }).map((_, i) => (
//                 <div key={i} className="form-skeleton-row">
//                     {/* Left icon */}
//                     <Skeleton.Avatar
//                         active
//                         shape="square"
//                         size={20}
//                         className="left-icon"
//                     />

//                     {/* Text */}
//                     <Skeleton
//                         active
//                         title={false}
//                         paragraph={{ rows: 1, width: "100%" }}
//                         className="text-skeleton"
//                     />

//                     {/* Right icon */}
//                     <Skeleton.Avatar
//                         active
//                         shape="circle"
//                         size={18}
//                         className="right-icon"
//                     />
//                 </div>
//             ))}
//         </>
//     );
// };

// export default FormSkeleton;


// import { Skeleton } from "antd";
// import * as React from "react";

// const ThreeColumnSkeleton = () => {
//     return (
//         <div className="skeleton-grid">
//             {Array.from({ length: 3 }).map((_, i) => (
//                 <div key={i} className="skeleton-card">
//                     <Skeleton.Avatar
//                         active
//                         shape="square"
//                         size={20}
//                         className="skeleton-icon"
//                     />

//                     <Skeleton
//                         active
//                         title={false}
//                         paragraph={{ rows: 1, width: "70%" }}
//                     />

//                     <Skeleton.Avatar
//                         active
//                         shape="circle"
//                         size={18}
//                         className="skeleton-download"
//                     />
//                 </div>
//             ))}
//         </div>
//     );
// };

// export default ThreeColumnSkeleton;

import { Skeleton } from "antd";
import * as React from "react";

const App: React.FC = () => {
    return (
        <div className="skeleton-grid">
            {[1, 2, 3].map((item) => (
                <div className="skeleton-card" key={item}>
                    <Skeleton
                        active
                        avatar

                        paragraph={{ rows: 0 }}
                    />
                </div>
            ))}
        </div>
    );
};

export default App;


