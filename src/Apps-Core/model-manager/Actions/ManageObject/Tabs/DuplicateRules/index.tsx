import React, { useEffect, useState } from "react";
import {
  ModelType,
  UIType,
  AppContextType,
  ListDetailItemType,
  ValueListItemType,
} from "../../../../../../Utils/Types";
import map from "lodash/map";
import AppActionManageObjectTabDuplicateRulesDetail from "./Details";

const AppActionManageObjectTabDuplicateRules: React.FC<{
  model: ModelType;
  UI: UIType;
  context: AppContextType;
}> = ({ model, UI, context }) => {
  // Vars
  const [ruleList, setRuleList] = useState<ValueListItemType[]>();
  // Lifecycle
  useEffect(() => {
    const nrl: ValueListItemType[] = [];
    (model.duplicate_rules || []).map((item, itemIndex) =>
      nrl.push({ label: item.label, value: `rule-${itemIndex}`, args: item })
    );
    setRuleList(nrl);
  }, []);

  // UI
  if (!ruleList) return <context.UI.Loading />;
  return (
    <context.UI.Layouts.ListDetailLayout
      title="Duplicate rules"
      addTitle="Add rule"
      addFunction={() =>
        context.setDialog({
          display: true,
          title: "New duplicate rule",
          form: [{ key: "label", label: "Label" }],
          buttons: [
            {
              label: "Add",
              onClick: (form) => {
                context.updateModel(
                  model.key,
                  {
                    duplicate_rules: [
                      ...(model.duplicate_rules || []),
                      { label: form.label },
                    ],
                  },
                  model._id
                );
              },
            },
          ],
        })
      }
      context={context}
      baseUrl={`model-manager/${model.key}/duplicate_rules`}
      DetailComponent={AppActionManageObjectTabDuplicateRulesDetail}
    />
  );
};

export default AppActionManageObjectTabDuplicateRules;
