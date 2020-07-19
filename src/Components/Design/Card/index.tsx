import React from "react";
import styles from "./styles.module.scss";
import { Typography, Divider } from "@material-ui/core";

const Card: React.FC<{
  children;
  hoverable?: true;
  title?: string;
  style?;
  centerTitle?: true;
  titleDivider?: true;
  withMargin?: true;
  className?;
}> = ({
  children,
  hoverable,
  title,
  style,
  centerTitle,
  titleDivider,
  withMargin,
  className,
}) => {
  const addMargin = withMargin ? { margin: 15 } : {};

  return (
    <div
      className={`${styles.root} ${hoverable && styles.hoverable} ${className}`}
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
