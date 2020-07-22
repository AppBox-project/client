import React from "react";
import Card from "../../../Design/Card";

const ObjectLayoutItemPaper: React.FC<{
  children;
  title?: string;
  hoverable: boolean;
  withBigMargin: boolean;
  withSmallMargin: boolean;
  sideMarginOnly: boolean;
}> = ({
  children,
  title,
  hoverable,
  withBigMargin,
  withSmallMargin,
  sideMarginOnly,
}) => {
  return (
    <Card
      hoverable={hoverable}
      title={title}
      withBigMargin={withBigMargin}
      withSmallMargin={withSmallMargin}
      sideMarginOnly={sideMarginOnly}
    >
      {children}
    </Card>
  );
};

export default ObjectLayoutItemPaper;
