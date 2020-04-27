import React from "react";
import { CircularProgress, Typography } from "@material-ui/core";

const Loading: React.FC<{ label?: string }> = ({ label }) => {
  return (
    <div className="center" style={{ textAlign: "center", cursor: "wait" }}>
      <CircularProgress />
      {label && (
        <>
          <br />
          <Typography variant="body2">{label}</Typography>
        </>
      )}
    </div>
  );
};

export default Loading;
