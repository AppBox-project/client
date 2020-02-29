import React, { useState } from "react";
import {
  TypeType,
  UIType,
  AppContextType
} from "../../../../../../Utils/Types";
import { Grid, List, ListItem, ListItemText } from "@material-ui/core";
import { map } from "lodash";
import { Link, Switch, Route } from "react-router-dom";
import AppActionManageObjectOverviewEditor from "./OverviewEditor";

const AppActionManageObjectTabOverviews: React.FC<{
  model: TypeType;
  UI: UIType;
  context: AppContextType;
}> = ({ model, UI, context }) => {
  // States & Hooks
  const [currentOverview, setCurrentOverview] = useState();
  // UI
  return (
    <Grid container>
      <Grid item xs={2}>
        <UI.AnimationContainer>
          <List>
            {map(model.overviews, (overview, key) => {
              return (
                <UI.AnimationItem key={key}>
                  <Link to={`/object-manager/${model.key}/overviews/${key}`}>
                    <ListItem button selected={currentOverview === key}>
                      <ListItemText>{key}</ListItemText>
                    </ListItem>
                  </Link>
                </UI.AnimationItem>
              );
            })}
          </List>
        </UI.AnimationContainer>
      </Grid>
      <Grid item xs={10} style={{ padding: 15 }}>
        <Switch>
          <Route
            path="/object-manager/:object/overviews/:overviewId"
            render={props => {
              return (
                <AppActionManageObjectOverviewEditor
                  {...props}
                  UI={UI}
                  context={context}
                  setCurrentOverview={setCurrentOverview}
                  overviews={model.overviews}
                  fields={model.fields}
                  model={model}
                />
              );
            }}
          />
        </Switch>
      </Grid>
    </Grid>
  );
};

export default AppActionManageObjectTabOverviews;
