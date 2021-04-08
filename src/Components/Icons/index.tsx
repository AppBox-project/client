import { CSSProperties } from "@material-ui/styles";
import React from "react";

const FaIcon: React.FC<{ icon: string; className?; style?: CSSProperties }> = ({
  icon,
  className,
  style,
}) => {
  return <i className={`fas fa-${icon}`} />;
};

export default FaIcon;
