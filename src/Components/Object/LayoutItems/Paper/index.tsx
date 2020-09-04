import React from "react";
import Card from "../../../Design/Card";
import { ObjectType } from "../../../../Utils/Types";

const ObjectLayoutItemPaper: React.FC<{
  children;
  title?: string;
  hoverable: boolean;
  withBigMargin: boolean;
  withSmallMargin: boolean;
  sideMarginOnly: boolean;
  object?: ObjectType;
}> = ({
  children,
  title,
  hoverable,
  withBigMargin,
  withSmallMargin,
  sideMarginOnly,
  object,
}) => {
  let newTitle = title || "";
  if (newTitle.match(/{([a-zA-Z_]+)}/)) {
    var regex = new RegExp(/{([a-zA-Z_]+)}/g),
      result;
    while ((result = regex.exec(newTitle))) {
      newTitle = newTitle.replace(
        `{${result[1]}}`,
        object?.data[result[1]] || "Error"
      );
    }
  }

  return (
    <Card
      hoverable={hoverable}
      title={newTitle}
      withBigMargin={withBigMargin}
      withSmallMargin={withSmallMargin}
      sideMarginOnly={sideMarginOnly}
    >
      {children}
    </Card>
  );
};

export default ObjectLayoutItemPaper;
