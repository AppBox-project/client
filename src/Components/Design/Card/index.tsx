import React from "react";
import styles from "./styles.module.scss";
import { Typography, Divider } from "@material-ui/core";

const Card: React.FC<{
  children;
  hoverable?: true | boolean;
  title?: string;
  style?;
  centerTitle?: true;
  titleDivider?: true;
  withBigMargin?: true | boolean;
  withSmallMargin?: true | boolean;
  sideMarginOnly?: true | boolean;
  className?: string;
}> = ({
  children,
  hoverable,
  title,
  style,
  centerTitle,
  titleDivider,
  className,
  withBigMargin,
  withSmallMargin,
  sideMarginOnly,
}) => {
  const addMargin = {
    marginLeft: withBigMargin ? 15 : withSmallMargin ? 5 : 0,
    marginRight: withBigMargin ? 15 : withSmallMargin ? 5 : 0,
    marginTop: !sideMarginOnly
      ? withBigMargin
        ? 15
        : withSmallMargin
        ? 5
        : 0
      : 0,
    marginBottom: !sideMarginOnly
      ? withBigMargin
        ? 15
        : withSmallMargin
        ? 5
        : 0
      : 0,
  };

  return (
    <div
      className={`${styles.root} ${
        hoverable && styles.hoverable
      } ${className} ${className}`}
      style={{ ...style, ...addMargin }}
    >
      {title && (
        <>
          <Typography
            variant="h6"
            style={{ textAlign: centerTitle ? "center" : "left" }}
          >
            {title}
          </Typography>
          {titleDivider && (
            <Divider style={{ marginBottom: 10, marginTop: 5 }} />
          )}
        </>
      )}
      {children}
    </div>
  );
};

export default Card;
