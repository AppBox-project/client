import React from "react";
import { CircularProgress } from "@material-ui/core";

const Loading: React.FC<{ label?: string }> = ({ label }) => {
  return (
    <div className="center" style={{ width: "100%", height: "100%" }}>
      <CircularProgress />
      {label && (
        <>
          <br />
          {label}
        </>
      )}
    </div>
  );
};

export default Loading;
