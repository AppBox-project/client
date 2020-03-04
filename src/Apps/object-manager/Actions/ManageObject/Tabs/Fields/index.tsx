import React, { useState } from "react";
import {
  TypeType,
  UIType,
  AppContextType
} from "../../../../../../Utils/Types";
import {
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from "@material-ui/core";
import { map } from "lodash";
import { Link, Switch, Route } from "react-router-dom";
import AppActionManageObjectTabFieldsEditor from "./FieldEditor";
import { FaPlus } from "react-icons/fa";

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
      <Grid item xs={2}>
        <UI.AnimationContainer>
          <List>
            <UI.AnimationItem>
              <ListItem
                button
                onClick={() => {
                  context.setDialog({
                    display: true,
                    title: "New field",
                    form: [
                      { key: "key", label: "Field key" },
                      { key: "name", label: "Field name" }
                    ],
                    buttons: [
                      {
                        label: "Add",
                        onClick: response => {
                          context.updateModel(
                            model.key,
                            {
                              ...model,
                              fields: {
                                ...model.fields,
                                [response.key]: { name: response.name }
                              }
                            },
                            model._id
                          );
                        }
                      }
                    ]
                  });
                }}
              >
                <ListItemIcon>
                  <FaPlus />
                </ListItemIcon>
                <ListItemText>New field</ListItemText>
              </ListItem>
            </UI.AnimationItem>
            {map(model.fields, (field, key) => {
              return (
                <UI.AnimationItem key={key}>
                  <Link to={`/object-manager/${model.key}/fields/${key}`}>
                    <ListItem button selected={currentField === key}>
                      <ListItemText>{field.name}</ListItemText>
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
            path="/object-manager/:object/fields/:fieldId"
            render={props => {
              return (
                <AppActionManageObjectTabFieldsEditor
                  {...props}
                  UI={UI}
                  context={context}
                  setCurrentField={setCurrentField}
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

export default AppActionManageObjectTabFields;
