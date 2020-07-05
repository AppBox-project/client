import React from "react";
import styles from "./styles.module.scss";
import { Typography, Divider } from "@material-ui/core";

const Card: React.FC<{
  children;
  hoverable?: true;
  title?: string;
  style?;
}> = ({ children, hoverable, title, style }) => {
  return (
    <div
      className={`${styles.root} ${hoverable && styles.hoverable}`}
      style={style}
    >
      {title && (
        <>
          <Typography variant="h6" style={{ textAlign: "center" }}>
            {title}
          </Typography>
          <Divider style={{ marginBottom: 10, marginTop: 5 }} />
        </>
      )}
      {children}
    </div>
  );
};

export default Card;
