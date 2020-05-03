import React from "react";
import { AnimationItem } from "../../../Apps/Apps/AppUI/Animations";

const ObjectLayoutItemAnimationItem: React.FC<{ children }> = ({
  children,
}) => {
  return <AnimationItem>{children}</AnimationItem>;
};

export default ObjectLayoutItemAnimationItem;
