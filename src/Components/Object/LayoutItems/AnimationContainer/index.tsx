import React from "react";
import { AnimationContainer } from "../../../Apps/Apps/AppUI/Animations";

const ObjectLayoutItemAnimationContainer: React.FC<{ children }> = ({
  children,
}) => {
  return <AnimationContainer>{children}</AnimationContainer>;
};

export default ObjectLayoutItemAnimationContainer;
