import React from "react";
import { AppContextType, ModelType } from "../../../../../../Utils/Types";
import { Paper, Typography } from "@material-ui/core";

const AppActionManageObjectTabAPIDetail: React.FC<{
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
  const isActive = model.api
    ? model.api[detailId]
      ? model.api[detailId].active
      : false
    : false;

  // UI
  return (
    <context.UI.Animations.AnimationContainer>
      <context.UI.Animations.AnimationItem>
        <div style={{ float: "right" }}>{isActive ? "Yes" : "No"}</div>
        <Typography variant="h4" style={{ marginBottom: 15 }}>
          {detailId} API
        </Typography>
      </context.UI.Animations.AnimationItem>
      <context.UI.Animations.AnimationItem>
        <Paper className="paper">
          <Typography variant="h6">Settings</Typography>
        </Paper>
      </context.UI.Animations.AnimationItem>
    </context.UI.Animations.AnimationContainer>
  );
};

export default AppActionManageObjectTabAPIDetail;
