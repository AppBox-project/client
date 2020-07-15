import React from "react";
import Card from "../../../Design/Card";

const ObjectLayoutItemPaper: React.FC<{ children; title?: string }> = ({
  children,
  title,
}) => {
  return (
    <Card hoverable title={title}>
      {children}
    </Card>
  );
};

export default ObjectLayoutItemPaper;
