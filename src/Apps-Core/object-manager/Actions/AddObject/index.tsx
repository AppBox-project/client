import React, { useState, useEffect } from "react";
import { AppContextType, UIType, ModelType } from "../../../../Utils/Types";
import { Paper, Typography, Divider, Button, Grid } from "@material-ui/core";

const AppActionAddObject: React.FC<{
  context: AppContextType;
  action: string;
  match: { isExact: boolean };
}> = ({ context, action, match: { isExact } }) => {
  // Vars
  const [newObject, setNewObject] = useState<any>({
    key: null,
    name: null,
    name_plural: null,
  });
  // Lifecycle
  // UI
  return (
    <context.UI.Margin>
      <context.UI.Animations.AnimationContainer>
        <context.UI.Animations.AnimationItem>
          <Paper className="paper">
            <Typography variant="h6">Create new model</Typography>
            <Divider style={{ marginTop: 5 }} />
            <Grid container>
              <Grid item xs={12}>
                <context.UI.Inputs.TextInput
                  label="Key"
                  value={newObject.key}
                  onChange={(value) => {
                    setNewObject({ ...newObject, key: value });
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <context.UI.Inputs.TextInput
                  label="Name"
                  value={newObject.name}
                  onChange={(value) => {
                    setNewObject({ ...newObject, name: value });
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <context.UI.Inputs.TextInput
                  label="Name (plural)"
                  value={newObject.name_plural}
                  onChange={(value) => {
                    setNewObject({ ...newObject, name_plural: value });
                  }}
                />
              </Grid>
            </Grid>
            <Button
              fullWidth
              color="primary"
              onClick={() => {
                context.createModel(newObject, (response) => {
                  console.log(response);
                });
              }}
            >
              Save
            </Button>
          </Paper>
        </context.UI.Animations.AnimationItem>
      </context.UI.Animations.AnimationContainer>
    </context.UI.Margin>
  );
};

export default AppActionAddObject;
