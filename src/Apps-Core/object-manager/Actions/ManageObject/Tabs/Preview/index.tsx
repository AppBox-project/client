import React, { useState } from "react";
import {
  ModelType,
  UIType,
  AppContextType,
} from "../../../../../../Utils/Types";
import {
  Grid,
  Typography,
  List,
  ListItemText,
  ListItem,
  ListItemIcon,
  IconButton,
  Button,
} from "@material-ui/core";
import { useEffect } from "reactn";
import { map, pickBy, filter } from "lodash";
import { FaCaretRight, FaCaretLeft } from "react-icons/fa";

const AppActionManageObjectTabPreview: React.FC<{
  model: ModelType;
  UI: UIType;
  context: AppContextType;
}> = ({ model, UI, context }) => {
  // States & Hooks
  const [newModel, setNewModel] = useState<any>();
  const [pictureOptions, setPictureOptions] = useState<
    { label: string; value: string }[]
  >([]);

  useEffect(() => {
    setNewModel(model);
    const npo = [];
    map(model.fields, (field, key) => {
      if (field.type === "picture") {
        npo.push({ label: field.name, value: key });
      }
    });
    setPictureOptions(npo);
  }, [model]);

  // UI
  return (
    <div style={{ height: "100%" }}>
      <context.UI.Animations.AnimationContainer>
        <Grid container>
          <Grid item xs={9}>
            <context.UI.Animations.AnimationItem>
              <context.UI.Design.Card withMargin title="Design">
                <Grid container>
                  <Grid item xs={12}>
                    <context.UI.Inputs.SelectInput
                      label="Picture"
                      value={newModel?.preview?.picture || "modelicon"}
                      onChange={(value) => {
                        setNewModel({
                          ...newModel,
                          preview: { ...newModel.preview, picture: value },
                        });
                      }}
                      options={[
                        { label: `Icon (${model.icon})`, value: "modelicon" },
                        ...pictureOptions,
                      ]}
                    />
                  </Grid>
                  <Grid item xs={6} style={{ marginTop: 15 }}>
                    <Typography variant="h6">Available fields</Typography>
                    <List>
                      {map(
                        pickBy(
                          newModel?.fields || [],
                          (value, key) =>
                            !(newModel.preview?.fields || []).includes(key)
                        ),
                        (field, key) => (
                          <ListItem>
                            <ListItemText>{field.name}</ListItemText>
                            <ListItemIcon>
                              <IconButton
                                onClick={() => {
                                  setNewModel({
                                    ...newModel,
                                    preview: {
                                      ...newModel?.preview,
                                      fields: [
                                        ...(newModel?.preview?.fields || []),
                                        key,
                                      ],
                                    },
                                  });
                                }}
                              >
                                <FaCaretRight />
                              </IconButton>
                            </ListItemIcon>
                          </ListItem>
                        )
                      )}
                    </List>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="h6">Selected</Typography>
                    <List>
                      {(newModel?.preview?.fields || []).map((key) => {
                        const field = newModel.fields[key];
                        return (
                          <ListItem>
                            <ListItemIcon>
                              <IconButton
                                onClick={() => {
                                  setNewModel({
                                    ...newModel,
                                    preview: {
                                      ...newModel?.preview,
                                      fields: filter(
                                        newModel.preview.fields,
                                        (o) => o !== key
                                      ),
                                    },
                                  });
                                }}
                              >
                                <FaCaretLeft />
                              </IconButton>
                            </ListItemIcon>
                            <ListItemText>{field.name}</ListItemText>
                          </ListItem>
                        );
                      })}
                    </List>
                  </Grid>
                </Grid>
              </context.UI.Design.Card>
            </context.UI.Animations.AnimationItem>
          </Grid>
          <Grid item xs={3}>
            {JSON.stringify(newModel) !== JSON.stringify(model) && (
              <Button
                style={{ margin: 15 }}
                fullWidth
                color="primary"
                variant="contained"
                onClick={() => {
                  context.updateModel(model.key, newModel, model._id);
                }}
              >
                Save
              </Button>
            )}

            <context.UI.Animations.AnimationItem>
              <context.UI.Design.Card withMargin title="Preview">
                Test
              </context.UI.Design.Card>
            </context.UI.Animations.AnimationItem>
          </Grid>
        </Grid>
      </context.UI.Animations.AnimationContainer>
    </div>
  );
};

export default AppActionManageObjectTabPreview;
