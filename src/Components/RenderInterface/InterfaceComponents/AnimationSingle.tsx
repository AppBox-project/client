import React from "react";
import { Animation } from "../../Apps/Apps/AppUI/Animations";

const RenderInterfaceAnimationSingle: React.FC<{ children }> = ({
  children,
}) => {
  return <Animation>{children}</Animation>;
};

export default RenderInterfaceAnimationSingle;
