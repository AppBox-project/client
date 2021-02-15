import React from "react";
import { AppContextType, AppType } from "../../../Utils/Types";

const AppsDetailActions: React.FC<{
  app: AppType;
  context: AppContextType;
}> = ({ app, context }) => {
  // Vars
  // Lifecycle
  // UI

  return (
    <context.UI.Animations.Animation>
      <context.UI.Design.Card withBigMargin title="Actions">
        <context.UI.Layouts.SortableList
          items={[
            { label: "Test 1", id: "test1" },
            { label: "Test 2", id: "test2" },
          ]}
          onChange={(items) => {
            console.log(items);
          }}
        />
      </context.UI.Design.Card>
    </context.UI.Animations.Animation>
  );
};

export default AppsDetailActions;
