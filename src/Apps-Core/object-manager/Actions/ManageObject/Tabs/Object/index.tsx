import React, { useState } from "react";
import styles from "./styles.module.scss";
import { Grid, Paper, Typography, Button } from "@material-ui/core";
import {
  ModelType,
  UIType,
  AppContextType,
} from "../../../../../../Utils/Types";

const AppActionManageObjectTabObject: React.FC<{
  model: ModelType;
  UI: UIType;
  context: AppContextType;
}> = ({ model, UI, context }) => {
  // States & Hooks
  const [newModel, setNewModel] = useState<any>();

  // UI
  return (
    <div className={styles.root}>
      <UI.Animations.AnimationContainer>
        <UI.Animations.AnimationItem>
          <Paper className="paper">
            <Typography variant="h5" className="cursor">
              {model.name}
            </Typography>
            <Grid container>
              <Grid item xs={6}>
                <UI.Inputs.TextInput
                  label="Name"
                  value={model.name}
                  onChange={(value) => {
                    setNewModel({ ...newModel, name: value });
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <UI.Inputs.TextInput
                  label="Name (Plural)"
                  value={model.name_plural}
                  onChange={(value) => {
                    setNewModel({ ...newModel, name_plural: value });
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <UI.Inputs.TextInput
                  label="Primary field"
                  value={model.primary}
                  onChange={(value) => {
                    setNewModel({ ...newModel, primary: value });
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <UI.Inputs.TextInput
                  label="Icon"
                  value={model.icon}
                  onChange={(value) => {
                    setNewModel({ ...newModel, icon: value });
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <UI.Inputs.TextInput
                  label="App"
                  value={model.app}
                  onChange={(value) => {
                    setNewModel({ ...newModel, app: value });
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <context.UI.Inputs.CheckmarkInput
                  label="Indexed"
                  value={model.indexed}
                  onChange={(value) => {
                    setNewModel({ ...newModel, indexed: value });
                  }}
                />
                {(newModel?.indexed || model.indexed) && (
                  <UI.Inputs.TextInput
                    label="Indexed fields"
                    value={model.indexed_fields}
                    onChange={(value) => {
                      setNewModel({ ...newModel, indexed_fields: value });
                    }}
                  />
                )}
              </Grid>
            </Grid>
            {newModel && (
              <Button
                fullWidth
                color="primary"
                onClick={() => {
                  context.updateModel(model.key, newModel, model._id);
                  setNewModel(undefined);
                }}
              >
                Save
              </Button>
            )}
          </Paper>
        </UI.Animations.AnimationItem>
      </UI.Animations.AnimationContainer>
    </div>
  );
};

export default AppActionManageObjectTabObject;
