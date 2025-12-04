import * as React from 'react'
import styles from "./TopService.module.scss"
console.log("styles: ", styles);
// interface ServiceItem {
//     title: string;
//     icon?: string;
//     color?: string;
//     url: string;
//     type?: string;
//     category?: string;
//     description?: string;
//     views: number;
//     rating?: number;
// }

// interface Props {
//     servicesData: ServiceItem[];
// }

const TopService = ({ servicesData }: any) => {

    const topServices = [...servicesData]
        .sort((a, b) => b.views - a.views)
        .slice(0, 5);
    return (
        <div>

            {/* <!-- Top Services --> */}
            <div className="dds-card p-4">
                <h3 className="dds-section-title text-lg">
                    <i className="fas fa-chart-line"></i>الأكثر استخداماً
                </h3>
                <div id="top-services-list" className="space-y-3">
                    {/* <!-- Top services will be injected here --> */}


                    {topServices.map((item, index) => {
                        const isExternal =
                            item.url?.startsWith("http") || item.url?.startsWith("//");

                        return (
                            <a
                                key={index}
                                href={item.url}
                                target={isExternal ? "_blank" : "_self"}
                                rel={isExternal ? "noopener noreferrer" : undefined}
                                className={styles.serviceItem}
                            // className="flex items-center gap-3 group p-2 rounded-lg hover:bg-gray-50 transition"
                            >
                                <div
                                    className={styles.serviceIndex}
                                // className="w-8 h-8 flex-shrink-0 flex items-center justify-center text-white rounded-full font-bold text-sm"
                                // style={{ backgroundColor: item.color || "#0070a4" }}
                                >
                                    {index + 1}
                                </div>

                                <div className="flex-grow">
                                    <p
                                        className={styles.serviceTitle}
                                    // className="font-semibold text-sm text-gray-700 group-hover:text-blue-600 transition"
                                    >
                                        {item?.Title}
                                    </p>
                                </div>

                                <div
                                    className={styles.serviceViews}
                                // className="text-sm text-gray-500 font-bold flex items-center gap-1"
                                >
                                    {item.views.toLocaleString()}{" "}
                                    <i className="fas fa-eye text-xs"></i>
                                </div>
                            </a>
                        );
                    })}
                </div>
            </div>

        </div>
    )
}

export default TopService
