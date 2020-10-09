import React from "react";
import { AppContextType } from "../../../Utils/Types";

const AppSystemUser: React.FC<{
  match: { isExact: boolean };
  context: AppContextType;
  action: string;
}> = ({ context, action, match: { isExact } }) => {
  return (
    <context.UI.Object.Detail
      objectId={context.user._id}
      layoutId="system"
      modelId="users"
      context={context}
      baseUrl="/system/user"
    />
  );
};
export default AppSystemUser;
