import React, { useState, useEffect } from "react";
import { AppContextType, ModelType } from "../../../../../../Utils/Types";
import { Typography, Grid, Button } from "@material-ui/core";

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
  const [newModel, setNewModel] = useState<any>(model);
  const [modelInfo, setModelInfo] = useState<any>();
  const isActive = model.api
    ? model.api[detailId]
      ? model.api[detailId].active
      : false
    : false;
  const [hasChanged, setHasChanged] = useState<any>(false);

  // Lifecycle
  useEffect(() => {
    if (typeInfo[detailId]) {
      setModelInfo(typeInfo[detailId]);
    } else {
      setModelInfo("error");
    }
  }, [detailId]);
  useEffect(() => {
    setNewModel(model);
  }, [model]);

  // UI
  if (!modelInfo) return <context.UI.Loading />;
  if (modelInfo === "error") return <>Unknown API type</>;
  return (
    <>
      <context.UI.Animations.AnimationContainer>
        <context.UI.Animations.AnimationItem>
          <context.UI.Design.Card>
            <div style={{ float: "right" }}>
              <context.UI.Inputs.Switch
                label="Active"
                value={isActive}
                onChange={(active) => {
                  context.updateModel(
                    model.key,
                    {
                      ...newModel,
                      api: {
                        ...(newModel.api || {}),
                        [detailId]: {
                          ...(newModel?.api ? [detailId] || {} : {}),
                          active,
                        },
                      },
                    },
                    model._id
                  );
                }}
              />
            </div>
            <Typography variant="h4" style={{ marginBottom: 15 }}>
              {modelInfo.title}
            </Typography>
            <Typography variant="body1">{modelInfo.description}</Typography>
          </context.UI.Design.Card>
        </context.UI.Animations.AnimationItem>
      </context.UI.Animations.AnimationContainer>
      {isActive && (
        <context.UI.Animations.AnimationContainer>
          <Grid container>
            <Grid item xs={12}>
              <context.UI.Animations.AnimationItem>
                <context.UI.Design.Card
                  hoverable
                  withBigMargin
                  title="Settings"
                >
                  <Grid container>
                    <Grid item xs={6}>
                      <context.UI.Inputs.SelectInput
                        label="Access type"
                        options={[
                          { label: "Public access", value: "none" },
                          { label: "User authentication", value: "user" },
                        ]}
                        value={
                          model.api
                            ? model.api[detailId]
                              ? model.api[detailId].authentication
                                ? model.api[detailId].authentication
                                : "user"
                              : "user"
                            : "user"
                        }
                        onChange={(authentication) => {
                          setHasChanged(true);
                          setNewModel({
                            ...newModel,
                            api: {
                              ...newModel.api,
                              [detailId]: {
                                ...newModel.api[detailId],
                                authentication,
                              },
                            },
                          });
                        }}
                      />
                    </Grid>
                  </Grid>
                </context.UI.Design.Card>
              </context.UI.Animations.AnimationItem>
            </Grid>
            <Grid item xs={12} md={6}>
              <context.UI.Animations.AnimationItem>
                <context.UI.Design.Card hoverable withBigMargin title="Log">
                  {" "}
                </context.UI.Design.Card>
              </context.UI.Animations.AnimationItem>
            </Grid>
            <Grid item xs={12} md={6}>
              <context.UI.Animations.AnimationItem>
                <context.UI.Design.Card hoverable withBigMargin title="Stats">
                  {" "}
                </context.UI.Design.Card>
              </context.UI.Animations.AnimationItem>
            </Grid>
          </Grid>
        </context.UI.Animations.AnimationContainer>
      )}
      {hasChanged && (
        <context.UI.Animations.AnimationContainer>
          <context.UI.Animations.AnimationItem>
            <Button
              fullWidth
              color="primary"
              onClick={() => {
                context.updateModel(model.key, newModel, model._id);
                setHasChanged(false);
              }}
            >
              Save
            </Button>
          </context.UI.Animations.AnimationItem>
        </context.UI.Animations.AnimationContainer>
      )}
    </>
  );
};

export default AppActionManageObjectTabAPIDetail;
