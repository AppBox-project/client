import React from "react";
import { AppContextType, ModelType } from "../../../../../../Utils/Types";
import { Paper, Typography } from "@material-ui/core";

const typeInfo = {
  read: {
    title: "Object read API",
    description:
      "The object read API allows it's user to list, browse and search the object",
  },
  create: {
    title: "Object creation API",
    description:
      "The object creation API allows it's user to create new objects.",
  },
  modifyOwn: {
    title: "Modify own objects API",
    description:
      "The modify own objects API allows it's user to modify objects owned by itself. Identification is always required.",
  },
  write: {
    title: "Object write API",
    description:
      "The object write API allows it's user full write access to the object.",
  },
  deleteOwn: {
    title: "Delete own objects API",
    description:
      "The delete own objects API allows it's user to delete objects that they own. Identification is always required.",
  },
  delete: {
    title: "Object deletion API",
    description: "The object deletion API allows full deletion access.",
  },
};

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
        <div style={{ float: "right" }}>
          <context.UI.Inputs.Switch />
        </div>
        <Typography variant="h4" style={{ marginBottom: 15 }}>
          {typeInfo[detailId].title}
        </Typography>
        <Typography variant="body1">
          {typeInfo[detailId].description}
        </Typography>
      </context.UI.Animations.AnimationItem>
      <context.UI.Animations.AnimationItem>
        <Paper className="paper" style={{ margin: "15px 0" }}>
          <Typography variant="h6">Settings</Typography>
        </Paper>
      </context.UI.Animations.AnimationItem>
    </context.UI.Animations.AnimationContainer>
  );
};

export default AppActionManageObjectTabAPIDetail;
