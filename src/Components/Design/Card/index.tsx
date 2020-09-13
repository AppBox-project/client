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
  titleInPrimaryColor?: true | boolean;
  sideMarginOnly?: true | boolean;
  className?: string;
  disablePadding?: boolean;
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
  titleInPrimaryColor,
  disablePadding,
}) => {
  const margins = {
    ...(withBigMargin
      ? {
          marginLeft: 15,
          margingRight: 15,
          ...(sideMarginOnly ? {} : { marginTop: 15, marginBottom: 15 }),
        }
      : withSmallMargin
      ? {
          marginLeft: 5,
          margingRight: 5,
          ...(sideMarginOnly ? {} : { marginTop: 5, marginBottom: 5 }),
        }
      : {}),
  };

  return (
    <div
      className={`test ${styles.root} ${
        hoverable && styles.hoverable
      } ${className} ${className}`}
      style={{
        ...margins,
        ...style,
        padding: disablePadding && 0,
        marginRight: withBigMargin ? 15 : withSmallMargin ? 5 : 0, // Unsure why this is required
      }}
    >
      {title && (
        <>
          <Typography
            variant="h6"
            color={titleInPrimaryColor ? "primary" : "initial"}
            style={{
              textAlign: centerTitle ? "center" : "left",
            }}
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
