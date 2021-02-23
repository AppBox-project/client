import { Grid } from "@material-ui/core";
import React from "react";
import Card from "../../Design/Card";

const RenderInterfaceCard: React.FC<{
  children;
  title?: string;
  withBigMargin?: true;
}> = ({ children, title, withBigMargin }) => {
  return (
    <Card title={title} withBigMargin={withBigMargin}>
      {children}
    </Card>
  );
};

export default RenderInterfaceCard;
