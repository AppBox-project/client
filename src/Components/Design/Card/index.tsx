import React from "react";
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
  buttons?: button[];
  image?: string;
  onClick?: () => void;
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
  disablePadding,
  buttons,
  onClick,
  image,
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
      className={`Card ${styles.root} ${
        hoverable && styles.hoverable
      } ${className} `}
      onClick={onClick}
      style={{
        ...margins,
        ...style,
        overflow: !image && "auto",
        padding: disablePadding && 0,
        marginRight: withBigMargin ? 15 : withSmallMargin ? 5 : 0, // Unsure why this is required
      }}
    >
      {image && (
        <div
          className={styles.image}
          style={{ backgroundImage: `url(${image})` }}
        />
      )}
      <div style={{ padding: 15 }}>
        {title ? (
          <>
            {buttons && (
              <div style={{ float: "right" }}>
                {buttons.map((button, index) =>
                  button.compact ? (
                    <Tooltip title={button.label} placement="left">
                      <IconButton onClick={button.onClick} color="primary">
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
        ) : (
          buttons && <>Buttons</>
        )}
        {children}
      </div>
    </div>
  );
};

export default Card;
