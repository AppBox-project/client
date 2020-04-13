import React from "react";
import { AppContextType } from "../../../Utils/Types";

const AppQSActionNotes: React.FC<{
  match: { isExact: boolean };
  context: AppContextType;
  action: string;
}> = ({ context, action, match: { isExact } }) => {
  return <>Notes</>;
};

export default AppQSActionNotes;
