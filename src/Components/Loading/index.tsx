import React from "react";
import { CircularProgress } from "@material-ui/core";

const Loading: React.FC = () => {
  return (
    <div className="center" style={{ width: "100%", height: "100%" }}>
      <CircularProgress />
    </div>
  );
};

export default Loading;
