import React from "react";
import * as icons from "react-icons/fa";

const FaIcon: React.FC<{ icon: string }> = ({ icon }) => {
  const Icon = icons[icon];
  return <Icon />;
};

export default FaIcon;
