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
  const [newModel, setNewModel] = useState();

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
                <UI.Forms.TextInput
                  label="Name"
                  value={model.name}
                  onChange={(value) => {
                    setNewModel({ ...newModel, name: value });
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <UI.Forms.TextInput
                  label="Name (Plural)"
                  value={model.name_plural}
                  onChange={(value) => {
                    setNewModel({ ...newModel, name_plural: value });
                  }}
                />
              </Grid>
            </Grid>
            {newModel && (
              <Button
                fullWidth
                color="primary"
                onClick={() => {
                  context.updateModel(model.key, newModel, model._id);
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
