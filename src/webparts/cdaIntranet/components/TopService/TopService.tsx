/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-no-target-blank */
import { Skeleton } from "antd";
import * as React from "react";
import styles from "./TopService.module.scss";

const TopService = ({ servicesData, lang, loading }: any): JSX.Element => {
  const langs = lang.startsWith("ar");
  const topServices: any[] = [...servicesData]
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  return (
    <div>
      {/* <!-- Top Services --> */}
      <div className="dds-card p-4">
        <h3 className="dds-section-title text-lg">
          <i className="fas fa-chart-line" />{" "}
          {langs ? "الأكثر استخداماً" : "Most Used"}
        </h3>
        <div id="top-services-list" className="space-y-3">
          {loading ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              {[1, 2, 3].map((_, index) => (
                <div key={index} className={styles.serviceItem}>
                  <div>
                    <Skeleton.Avatar active size="small" shape="circle" />
                  </div>
                  <div className="flex-grow">
                    <Skeleton.Input
                      active
                      size="small"
                      style={{ width: "90%" }}
                    />
                  </div>
                  <div className={styles.serviceViews}>
                    <Skeleton.Input
                      active
                      size="small"
                      style={{ width: "20px" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : topServices.length === 0 ? (
            <p
              style={{
                textAlign: "center",
                color: "#9ca3af",
                fontWeight: 500,
                padding: "1rem",
                fontSize: "0.875rem",
              }}
            >
              No services available.
            </p>
          ) : (
            topServices?.map((item, index) => {
              const isExternal =
                item.url?.startsWith("http") || item.url?.startsWith("//");

              return (
                <a
                  key={index}
                  href={item.url}
                  target={isExternal ? "_blank" : "_self"}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  className={styles.serviceItem}
                >
                  <div className={styles.serviceIndex}>{index + 1}</div>

                  <div className="flex-grow">
                    <p className={styles.serviceTitle}>
                      {langs ? item?.Title_Ar : item?.Title}
                    </p>
                  </div>

                  <div className={styles.serviceViews}>
                    {item?.views?.toLocaleString()}{" "}
                    <i className="fas fa-eye text-xs" />
                  </div>
                </a>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(TopService);
