import React from "react";
import { useGlobal } from "reactn";
import styles from "./styles.module.scss";
import {
  Typography,
  Divider,
  Button,
  Tooltip,
  IconButton,
} from "@material-ui/core";
export interface CardProps {
  children;
  hoverable?: true | boolean;
  title?: string | any;
  style?;
  centerTitle?: true;
  titleDivider?: true;
  withBigMargin?: true | boolean;
  withSmallMargin?: true | boolean;
  titleInPrimaryColor?: true | boolean;
  sideMarginOnly?: true | boolean;
  className?: string;
  withoutPadding?: boolean;
  buttons?: button[];
  image?: string;
  onClick?: () => void;
  overflow?: "none" | "auto" | "visible";
  shadow?: "default" | "sharp" | "diffuse" | "dreamy" | "short" | "long";
}
interface button {
  label: string;
  icon?;
  compact?: boolean;
  onClick: () => void;
}
const Card: React.FC<CardProps> = ({
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
  withoutPadding,
  buttons,
  onClick,
  image,
  overflow,
  shadow,
}) => {
  const [gTheme] = useGlobal<any>("theme");

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
      className={`Card ${styles.root} ${
        hoverable && styles.hoverable
      } ${className} ${
        shadow !== undefined && shadow !== "default" && styles[shadow]
      }`}
      onClick={onClick}
      style={{
        ...margins,
        ...style,
        overflow: overflow ? overflow : !image && "auto",
        padding: withoutPadding && 0,
        marginRight: withBigMargin ? 15 : withSmallMargin ? 5 : 0, // Unsure why this is required
        ...(onClick && { cursor: "pointer" }),
      }}
    >
      {image && (
        <div
          className={styles.image}
          style={{ backgroundImage: `url(${image})` }}
        />
      )}
      <div style={{ padding: !withoutPadding && 15 }}>
        {title ? (
          <>
            {buttons && (
              <div style={{ float: "right" }}>
                {buttons.map((button, index) =>
                  button.compact ? (
                    <Tooltip title={button.label} placement="left">
                      <IconButton
                        onClick={button.onClick}
                        color={
                          gTheme.palette.type === "light"
                            ? "primary"
                            : "default"
                        }
                      >
                        <button.icon style={{ width: 18, height: 18 }} />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Button onClick={button.onClick} key={index}>
                      {button.label}
                    </Button>
                  )
                )}
              </div>
            )}
            <Typography
              variant="h6"
              color={
                gTheme.palette.type === "light" && titleInPrimaryColor
                  ? "primary"
                  : "initial"
              }
              style={{
                textAlign: centerTitle ? "center" : "left",
                margin: withoutPadding && 10,
              }}
            >
              {title}
            </Typography>
            {titleDivider && (
              <Divider style={{ marginBottom: 10, marginTop: 5 }} />
            )}
          </>
        ) : (
          buttons && <>Buttons</>
        )}
        {children}
      </div>
    </div>
  );
};

export default Card;
