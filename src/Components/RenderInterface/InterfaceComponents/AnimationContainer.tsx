import React from "react";
import { AnimationContainer } from "../../Apps/Apps/AppUI/Animations";

const RenderInterfaceAnimationContainer: React.FC<{ children }> = ({
  children,
}) => <AnimationContainer>{children}</AnimationContainer>;

export default RenderInterfaceAnimationContainer;
