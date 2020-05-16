import React, { useEffect, useState } from "react";
import {
  AppContextType,
  ModelFieldType,
  ModelType,
  UIType,
} from "../../../../../../Utils/Types";
import { Paper, Button } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

const AppActionManageObjectActionsDetail: React.FC<{
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
  const [action, setAction] = useState<any>();

  // Lifecycle
  useEffect(() => {
    setAction(model.actions[detailId]);
  }, [detailId]);

  // UI
  return (
    <context.UI.Animations.AnimationContainer>
      <context.UI.Animations.AnimationItem>
        <Paper className="paper" style={{ margin: 15 }}>
          {!action ? (
            <>
              <Skeleton variant="text" />
            </>
          ) : (
            <>
              <context.UI.Inputs.TextInput
                label="Lay-out"
                value={action.layout}
                onChange={(value) => {
                  setAction({ ...action, layout: value });
                }}
              />
            </>
          )}
        </Paper>
      </context.UI.Animations.AnimationItem>
      <context.UI.Animations.AnimationItem>
        {action !== model.actions[detailId] && (
          <Button
            fullWidth
            color="primary"
            onClick={() => {
              context.updateModel(
                model.key,
                {
                  ...model,
                  actions: { ...model.actions, [detailId]: action },
                },
                model._id
              );
            }}
          >
            Save
          </Button>
        )}
      </context.UI.Animations.AnimationItem>
    </context.UI.Animations.AnimationContainer>
  );
};

export default AppActionManageObjectActionsDetail;
