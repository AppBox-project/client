import React, { useState } from "react";
import styles from "./styles.module.scss";
import { Grid, Paper, Typography, Button } from "@material-ui/core";
import { TypeType, UIType } from "../../../../../../Utils/Types";

const AppActionManageObjectTabObject: React.FC<{
  model: TypeType;
  UI: UIType;
}> = ({ model, UI }) => {
  // States & Hooks
  const [newModel, setNewModel] = useState();

  // UI
  return (
    <div className={styles.root}>
      <Paper className="paper">
        <Typography variant="h5" className="cursor">
          {model.name}
        </Typography>
        <Grid container>
          <Grid item xs={6}>
            <UI.Forms.TextInput
              label="Name"
              value={model.name}
              onChange={value => {
                setNewModel({ ...newModel, name: value });
              }}
            />
          </Grid>{" "}
          <Grid item xs={6}>
            <UI.Forms.TextInput
              label="Name (Plural)"
              value={model.name_plural}
              onChange={value => {
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
              console.log(newModel);
            }}
          >
            Save
          </Button>
        )}
      </Paper>
    </div>
  );
};

export default AppActionManageObjectTabObject;
