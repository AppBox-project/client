import React, { useEffect, useState } from "react";
import {
  AppContextType,
  ModelType,
  ValueListItemType,
} from "../../../../Utils/Types";
import { Typography, Divider, Button, Grid } from "@material-ui/core";

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
    api: {},
  });
  const [models, setModels] = useState<ValueListItemType[]>();

  // Lifecycle
  useEffect(() => {
    const request = context.getTypes({}, (response) => {
      if (response.success) {
        const nm: ValueListItemType[] = [];
        response.data.map((o: ModelType) =>
          nm.push({ label: o.name, value: o.key })
        );
        setModels(nm);
      } else {
        console.log(response);
      }
    });

    return () => request.stop();
  }, []);
  // UI
  return (
    <context.UI.Margin>
      <context.UI.Animations.AnimationContainer>
        <context.UI.Animations.AnimationItem>
          <context.UI.Design.Card hoverable>
            <Typography variant="h6">Create new model</Typography>
            <Divider style={{ marginTop: 5 }} />
            <Grid container spacing={3}>
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
              <Grid item xs={12}>
                <context.UI.Inputs.CheckmarkInput
                  label="Linked model"
                  value={newObject.linked}
                  onChange={(value) => {
                    setNewObject({ ...newObject, linked: value });
                  }}
                />
                {newObject.linked && (
                  <context.UI.Inputs.Select
                    label="Objects"
                    multiple
                    options={models}
                    isLoading={!Boolean(models)}
                    value={newObject.linkedModels}
                    onChange={(value) => {
                      setNewObject({ ...newObject, linkedModels: value });
                    }}
                  />
                )}
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
          </context.UI.Design.Card>
        </context.UI.Animations.AnimationItem>
      </context.UI.Animations.AnimationContainer>
    </context.UI.Margin>
  );
};

export default AppActionAddObject;
