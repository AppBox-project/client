import React from "react";
import {
  TypeType,
  UIType,
  AppContextType
} from "../../../../../../Utils/Types";
import { Grid, List, ListItem, ListItemText } from "@material-ui/core";
import { map } from "lodash";

const AppActionManageObjectTabFields: React.FC<{
  model: TypeType;
  UI: UIType;
  context: AppContextType;
}> = ({ model, UI, context }) => {
  return (
    <Grid container>
      <Grid item xs={3}>
        <List>
          {map(model.fields, field => {
            return (
              <ListItem button>
                <ListItemText>{field.name}</ListItemText>
              </ListItem>
            );
          })}
        </List>
      </Grid>
      <Grid item xs={9} style={{ padding: 15 }}>
        Right
      </Grid>
    </Grid>
  );
};

export default AppActionManageObjectTabFields;
