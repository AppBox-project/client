import React from "react";
import { AppContextType } from "../../../Utils/Types";
import { AutomationType } from "../Types";
import { find } from "lodash";
import ProcessEditor from "./ProcessEditor";
import { Divider, Typography } from "@material-ui/core";

const AutomationsDetail: React.FC<{
  match: { params: { detailId } };
  context: AppContextType;
  automationList: AutomationType[];
}> = ({
  context,
  match: {
    params: { detailId },
  },
  automationList,
}) => {
  const automation: AutomationType =
    automationList &&
    find(automationList, (o: AutomationType) => o._id === detailId);

  // UI
  if (!automationList) return <context.UI.Loading />;
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <context.UI.Object.Detail
        layoutId="app"
        modelId="system-automations"
        object={automation}
        objectId={automation._id}
        context={context}
        baseUrl="/settings/automations"
      />
      <Typography variant="h6" gutterBottom style={{ margin: "0 15px" }}>
        {automation.data.type} designer <Divider />
      </Typography>
      <div
        style={{
          flex: 1,
          overflow: "auto",
          margin: 15,
          height: "100%",
        }}
      >
        {automation.data.type === "Automation" ? (
          <>Todo: autom0ation</>
        ) : (
          <ProcessEditor context={context} automation={automation} />
        )}
      </div>
    </div>
  );
};

export default AutomationsDetail;
