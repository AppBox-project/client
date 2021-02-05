import React from "react";
import { AppContextType } from "../../Utils/Types";

const CollectionsDisplayObject: React.FC<{
  match: { isExact: boolean };
  context: AppContextType;
  action: string;
}> = ({ context, action, match: { isExact } }) => {
  // Vars

  // Lifecycle

  // Functions

  // UI
  return (
    <context.UI.Animations.Animation>
      <context.UI.Design.Card withBigMargin title="Test">
        {action}
      </context.UI.Design.Card>
    </context.UI.Animations.Animation>
  );
};

export default CollectionsDisplayObject;
