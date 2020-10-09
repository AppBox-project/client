import React from "react";
import { AppContextType, ModelType } from "../../../Utils/Types";
import AppSettingsAutomationEditor from "./AutomationEditor";

const AppSettingsProcessDetail: React.FC<{
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
  return detailId === "create" ? (
    <context.UI.Design.Card withBigMargin title="New automation" titleDivider>
      <context.UI.Object.Detail
        modelId="automations"
        layoutId="create"
        context={context}
        popup
      />
    </context.UI.Design.Card>
  ) : (
    <AppSettingsAutomationEditor context={context} detailId={detailId} />
  );
};

export default AppSettingsProcessDetail;
