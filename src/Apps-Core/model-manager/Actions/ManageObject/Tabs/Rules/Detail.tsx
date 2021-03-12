import { Fab } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { FaSave } from "react-icons/fa";
import {
  AppContextType,
  ModelRuleType,
  ModelType,
} from "../../../../../../Utils/Types";

const AppActionManageObjectTabRulesDetail: React.FC<{
  match: { params: { detailId } };
  context: AppContextType;
  model: ModelType;
}> = ({
  match: {
    params: { detailId },
  },
  context,
  model,
}) => {
  // Vars
  const [rule, setRule] = useState<ModelRuleType>();

  // Lifecycle
  useEffect(() => {
    setRule(model.rules[detailId]);
  }, [model, detailId]);

  // UI
  if (!rule) return <context.UI.Loading />;
  return (
    <>
      {" "}
      <Fab
        style={{ position: "fixed", right: 15, bottom: 15 }}
        color="primary"
        onClick={() => {
          context.updateModel(
            model.key,
            { ...model, rules: { ...model.rules, [detailId]: rule } },
            model._id
          );
        }}
      >
        <FaSave />
      </Fab>
      <context.UI.Animations.AnimationContainer>
        <context.UI.Animations.AnimationItem>
          <context.UI.Design.Card
            withBigMargin
            title={rule.name}
            overflow="visible"
            titleDivider
          >
            <context.UI.Inputs.TextInput
              label="Name"
              value={rule.name}
              onChange={(value: string) => {
                setRule({ ...rule, name: value });
              }}
            />
            <context.UI.Inputs.Select
              label="Checked on"
              value={rule.checkedOn}
              options={[
                { label: "Always", value: "All" },
                { label: "Insert", value: "Insert" },
                { label: "Update", value: "Update" },
                { label: "Delete", value: "Delete" },
                { label: "Insert and update", value: "InsertAndUpdate" },
                { label: "Insert and delete", value: "InsertAndDelete" },
                { label: "Update and delete", value: "UpdateAndDelete" },
                { label: "Never", value: "Never" },
              ]}
            />
            <context.UI.Inputs.TextInput
              label="Message"
              value={rule.message}
              onChange={(value: string) => {
                setRule({ ...rule, message: value });
              }}
            />
          </context.UI.Design.Card>
        </context.UI.Animations.AnimationItem>
        <context.UI.Animations.AnimationItem>
          <context.UI.Design.Card title="Rule" withBigMargin>
            <context.UI.Inputs.TextInput
              label="Rule"
              value={rule.rule}
              onChange={(value: string) => {
                setRule({ ...rule, rule: value });
              }}
            />
          </context.UI.Design.Card>
        </context.UI.Animations.AnimationItem>
      </context.UI.Animations.AnimationContainer>
    </>
  );
};

export default AppActionManageObjectTabRulesDetail;
