import React from "react";
import Card from "../../../Design/Card";

const ObjectLayoutItemPaper: React.FC<{
  children;
  title?: string;
  hoverable: boolean;
  withMargin: boolean;
}> = ({ children, title, hoverable, withMargin }) => {
  return (
    <Card hoverable={hoverable} title={title} withMargin={withMargin}>
      {children}
    </Card>
  );
};

export default ObjectLayoutItemPaper;
