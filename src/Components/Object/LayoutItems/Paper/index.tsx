import React from "react";
import Card from "../../../Design/Card";

const ObjectLayoutItemPaper: React.FC<{ children; title?: string }> = ({
  children,
  title,
}) => {
  return (
    <Card hoverable title={title} withMargin>
      {children}
    </Card>
  );
};

export default ObjectLayoutItemPaper;
