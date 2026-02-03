/* eslint-disable @typescript-eslint/no-explicit-any */
import { Skeleton } from "antd";
import * as React from "react";

const DepartmentHeader = ({
  icon,
  title,
  subtitle,
  loading,
}: any): JSX.Element => {
  const SkeletonLoader = (): JSX.Element => {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px 0",
          gap: "12px", // spacing between avatar and inputs
          width: "100%", // take full width
          textAlign: "center", // center text skeletons,
          marginBottom: "20px",
        }}
      >
        <Skeleton.Avatar active size={34} shape="circle" />
        <Skeleton.Input style={{ width: 300 }} size="default" active />
        <Skeleton.Input style={{ width: 500 }} active size="small" />
      </div>
    );
  };
  return loading ? (
    SkeletonLoader()
  ) : (
    <section className="department-header">
      {icon && <img src={icon} alt={title} className="dept-icon" />}

      <h1
        className="dept-title"
        style={{
          textAlign: "center",
        }}
      >
        {title}
      </h1>

      {subtitle && <p className="dept-subtitle">{subtitle}</p>}
    </section>
  );
};

export default React.memo(DepartmentHeader);
