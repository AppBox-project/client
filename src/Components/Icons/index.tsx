import { CSSProperties } from "@material-ui/styles";
import React from "react";

const FaIcon: React.FC<{
  icon: string;
  className?;
  style?: CSSProperties;
  size?:
    | "xs"
    | "sm"
    | "lg"
    | "2x"
    | "3x"
    | "4x"
    | "5x"
    | "6x"
    | "7x"
    | "8x"
    | "9x"
    | "10x";
}> = ({ icon, className, style, size }) => {
  return (
    <i
      className={`fas fa-${icon}${
        className !== undefined ? ` ${className}` : ""
      } ${size !== undefined && ` fa-${size}`}`}
      style={style}
    />
  );
};

export default FaIcon;
