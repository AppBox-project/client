import React from "react";
import { AnimationItem } from "../../Apps/Apps/AppUI/Animations";

const RenderInterfaceAnimationItem: React.FC<{ children }> = ({ children }) => (
  <AnimationItem>{children}</AnimationItem>
);
export default RenderInterfaceAnimationItem;
