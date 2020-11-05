import React from "react";
import { AppContextType } from "../../Utils/Types";

const Install: React.FC<{ context: AppContextType; choices: {} }> = ({
  context,
  choices,
}) => {
  console.log(choices);

  // UI
  return <>Install</>;
};

export default Install;
