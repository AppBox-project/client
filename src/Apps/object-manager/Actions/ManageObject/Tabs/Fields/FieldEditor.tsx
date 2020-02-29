import React, { useEffect, useState } from "react";
import {
  UIType,
  ModelFieldType,
  AppContextType
} from "../../../../../../Utils/Types";
import {
  Paper,
  Typography,
  Grid,
  Button,
  ListItem,
  List,
  ListItemText
} from "@material-ui/core";

const AppActionManageObjectTabFieldsEditor: React.FC<{
  match: { params: { object; fieldId } };
  setCurrentField: (field: string) => void;
  UI: UIType;
  context: AppContextType;
  fields: [ModelFieldType];
}> = ({
  match: {
    params: { fieldId }
  },
  context,
  UI,
  fields,
  setCurrentField
}) => {
  // Global
  const field: ModelFieldType = fields[fieldId];
  // States & Hooks
  const [newField, setNewField] = useState();

  // Lifecycle
  useEffect(() => {
    setCurrentField(fieldId);
    return () => {
      setCurrentField(null);
    };
  }, [fieldId]);

  // UI
  return (
    <UI.AnimationContainer>
      <Grid container style={{ width: "100%" }}>
        <Grid item xs={12}>
          <UI.AnimationItem>
            <Paper className="paper" style={{ margin: "0 0 15px 0" }}>
              <Typography variant="h5">{field.name}</Typography>
              <Grid container>
                <Grid
                  item
                  xs={12}
                  className="form-row"
                  style={{ display: "table-cell" }}
                >
                  <UI.Forms.TextInput
                    label="Name"
                    value={field.name}
                    onChange={value => {
                      setNewField({ ...newField, name: value });
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <UI.Forms.CheckmarkInput
                    label="Required"
                    value={field.required}
                    onChange={value => {
                      setNewField({ ...newField, required: value });
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <UI.Forms.CheckmarkInput
                    label="Unique"
                    value={field.unique}
                    onChange={value => {
                      setNewField({ ...newField, unique: value });
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>
          </UI.AnimationItem>
        </Grid>
        <Grid item xs={6}>
          <UI.AnimationItem>
            <ValidationsList
              validations={field.validations}
              context={context}
            />
          </UI.AnimationItem>
        </Grid>
        <Grid item xs={6}>
          <UI.AnimationItem>
            <TransformationsList
              transformations={field.transformations}
              context={context}
            />
          </UI.AnimationItem>
        </Grid>
        {newField && (
          <Grid item xs={12}>
            <UI.AnimationItem>
              <Button
                fullWidth
                color="primary"
                onClick={() => {
                  console.log(newField);
                }}
              >
                Save
              </Button>
            </UI.AnimationItem>
          </Grid>
        )}
      </Grid>
    </UI.AnimationContainer>
  );
};

const ValidationsList: React.FC<{
  validations: [string];
  context: AppContextType;
}> = ({ validations, context }) => {
  return (
    <Paper className="paper" style={{ margin: "0 7px 0 0" }}>
      <Typography variant="h5">Validations</Typography>
      <List>
        {validations ? (
          validations.map(validation => {
            return (
              <ListItem
                button
                onClick={() => {
                  context.setDialog({
                    display: true,
                    title: "Transformation"
                  });
                }}
              >
                <ListItemText>{validation}</ListItemText>
              </ListItem>
            );
          })
        ) : (
          <ListItem>No validations</ListItem>
        )}
      </List>
    </Paper>
  );
};

const TransformationsList: React.FC<{
  transformations: [string];
  context: AppContextType;
}> = ({ transformations }) => {
  return (
    <Paper className="paper" style={{ margin: "0 0 0 7px" }}>
      <Typography variant="h5">Transformations</Typography>
      <List>
        {transformations ? (
          transformations.map(transformation => {
            return (
              <ListItem>
                <ListItemText>{transformation}</ListItemText>
              </ListItem>
            );
          })
        ) : (
          <ListItem>No transformations</ListItem>
        )}
      </List>
    </Paper>
  );
};

export default AppActionManageObjectTabFieldsEditor;
