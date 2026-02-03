// AboutSection.tsx
import { Skeleton } from "antd";
import * as React from "react";

interface AboutSectionProps {
  title: string;
  icon: string;
  loading?: boolean;
  content: string | string[]; // single paragraph or multiple paragraphs
}

const AboutSection: React.FC<AboutSectionProps> = ({
  title,
  icon,
  content,
  loading,
}) => {
  const paragraphs = Array.isArray(content) ? content : [content];

  const SkeletonLoader = (): JSX.Element => {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Skeleton.Input
          active
          size="small"
          style={{
            width: "100%",
            marginBottom: "10px",
          }}
        />
        <Skeleton.Input
          active
          size="small"
          style={{
            width: "100%",
            marginBottom: "10px",
          }}
        />
        <Skeleton.Input
          active
          size="small"
          style={{
            width: "100%",
          }}
        />
      </div>
    );
  };

  return (
    <section className="about-section">
      <h2 className=" dds-section-title section-title">
        <i className={icon} /> {title}
      </h2>
      <div className="about-content">
        {loading ? SkeletonLoader() : <p>{paragraphs}</p>}
      </div>
    </section>
  );
};

export default AboutSection;
