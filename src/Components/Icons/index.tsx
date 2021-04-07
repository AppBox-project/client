import { CSSProperties } from "@material-ui/styles";
import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";

const FaIcon: React.FC<{ icon: string; className?; style?: CSSProperties }> = ({
  icon,
  className,
  style,
}) => {
  const Icon = require(`react-icons/fa/index`);
  return Icon ? (
    <Icon className={className} style={style} />
  ) : (
    <FaExclamationTriangle className={className} style={style} />
  );
};

export default FaIcon;
