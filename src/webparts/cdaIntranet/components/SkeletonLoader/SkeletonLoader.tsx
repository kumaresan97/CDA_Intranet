import { Skeleton } from "antd";
import * as React from "react";

const App: React.FC = () => {
  return (
    <div className="skeleton-grid">
      {[1, 2, 3].map((item) => (
        <div className="skeleton-card" key={item}>
          <Skeleton active avatar paragraph={{ rows: 0 }} />
        </div>
      ))}
    </div>
  );
};

export default App;
