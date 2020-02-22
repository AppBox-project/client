import React from "react";
import {
  TypeType,
  UIType,
  AppContextType
} from "../../../../../../Utils/Types";
import { Grid, List, ListItem, ListItemText } from "@material-ui/core";
import { map } from "lodash";
import { Link } from "react-router-dom";

const AppActionManageObjectTabFields: React.FC<{
  model: TypeType;
  UI: UIType;
  context: AppContextType;
}> = ({ model, UI, context }) => {
  return (
    <Grid container>
      <Grid item xs={3}>
        <UI.AnimationContainer>
          <List>
            {map(model.fields, (field, key) => {
              return (
                <UI.AnimationItem>
                  <Link to={`/object-manager/${model.key}/fields/${key}`}>
                    <ListItem button>
                      <ListItemText>{field.name}</ListItemText>
                    </ListItem>
                  </Link>
                </UI.AnimationItem>
              );
            })}
          </List>
        </UI.AnimationContainer>
      </Grid>
      <Grid item xs={9} style={{ padding: 15 }}>
        Right
      </Grid>
    </Grid>
  );
};

export default AppActionManageObjectTabFields;
