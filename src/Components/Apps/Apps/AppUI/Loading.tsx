import React from "react";
import { CircularProgress } from "@material-ui/core";

const Loading: React.FC = () => {
  return (
    <div className="center">
      <CircularProgress />
    </div>
  );
};

export default Loading;
