import React, { useState } from "react";
import {
  TypeType,
  UIType,
  AppContextType
} from "../../../../../../Utils/Types";
import { Grid, List, ListItem, ListItemText } from "@material-ui/core";
import { map } from "lodash";
import { Link, Switch, Route } from "react-router-dom";
import AppActionManageObjectTabFieldsEditor from "./FieldEditor";

const AppActionManageObjectTabFields: React.FC<{
  model: TypeType;
  UI: UIType;
  context: AppContextType;
}> = ({ model, UI, context }) => {
  // States & Hooks
  const [currentField, setCurrentField] = useState();
  // UI
  return (
    <Grid container>
      <Grid item xs={3}>
        <UI.AnimationContainer>
          <List>
            {map(model.fields, (field, key) => {
              return (
                <UI.AnimationItem key={key}>
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
        <Switch>
          <Route
            path="/object-manager/:object/fields/:field"
            component={AppActionManageObjectTabFieldsEditor}
          />
        </Switch>
      </Grid>
    </Grid>
  );
};

export default AppActionManageObjectTabFields;
