import React from "react";

const AppAHViewApp: React.FC<{ match: { params: { appId } } }> = ({
  match: {
    params: { appId },
  },
}) => {
  return <>{appId}</>;
};

export default AppAHViewApp;
