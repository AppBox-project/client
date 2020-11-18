import React, { useEffect, useState } from "react";
import { AppContextType, ModelType } from "../../../../../../Utils/Types";
import { Button, Fab } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { FaSave } from "react-icons/fa";

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
    const [hasChanged, setHasChanged] = useState<boolean>(false);

    // Lifecycle
    useEffect(() => {
      setAction(model.actions[detailId]);
    }, [detailId]);

    // UI
    return (
      <context.UI.Animations.AnimationContainer>
        <context.UI.Animations.AnimationItem>
          <context.UI.Design.Card withBigMargin title="Action">
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
                      setHasChanged(true);
                    }}
                  />{" "}
                  <context.UI.Inputs.Select
                    label="Type"
                    options={[{ value: "create", label: "create" }]}
                    value={action.type}
                    onChange={(value) => {
                      setAction({ ...action, type: value });
                      setHasChanged(true);
                    }}
                  />
                </>
              )}
          </context.UI.Design.Card>
        </context.UI.Animations.AnimationItem>
        <context.UI.Animations.AnimationItem>
          {hasChanged && (
            <Fab style={{ position: 'fixed', bottom: 15, right: 15 }}
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
              <FaSave />
            </Fab>
          )}
        </context.UI.Animations.AnimationItem>
      </context.UI.Animations.AnimationContainer>
    );
  };

export default AppActionManageObjectActionsDetail;
