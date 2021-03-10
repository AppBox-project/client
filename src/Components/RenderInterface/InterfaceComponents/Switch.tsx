import React, { ReactNode, useState } from "react";
import { useEffect } from "reactn";
import { AppContextType } from "../../../Utils/Types";
import { get } from "lodash";

const RenderInterfaceSwitch: React.FC<{
  context: AppContextType;
  layoutItem;
  vars;
  renderChildren: (items) => ReactNode;
}> = ({ context, layoutItem, vars, renderChildren }) => {
  // Vars
  const [layout, setLayout] = useState<{}>();

  // Lifecycle
  useEffect(() => {
    let conditionHasBeenApplied = false;

    layoutItem.conditions.map((condition) => {
      if (!conditionHasBeenApplied) {
        const criteria = JSON.parse(condition.criteria);
        let thisConditionIsAMatch = true;
        criteria.map((crit) => {
          if (get(vars, crit.field) !== crit.value) {
            thisConditionIsAMatch = false;
          }
        });

        if (thisConditionIsAMatch) {
          conditionHasBeenApplied = true;
          setLayout(condition.items);
        }
      }
    });

    if (!conditionHasBeenApplied) {
      setLayout(layoutItem.defaultCondition);
    }
  }, [vars, layoutItem]);

  // UI
  if (!layout) return <context.UI.Loading />;
  return <>{renderChildren(layout)}</>;
};
export default RenderInterfaceSwitch;
