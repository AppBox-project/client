import React from "react";
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Grid,
  Button,
} from "@material-ui/core";
import { useState, useEffect } from "reactn";
import { map } from "lodash";
import { RiLayoutRowLine } from "react-icons/ri";
import { AiOutlineAppstoreAdd } from "react-icons/ai";
import { AppContextType, ModelType } from "../../../../../Utils/Types";

const ProcessEditorObjectEditor: React.FC<{
  object;
  model: ModelType;
  context: AppContextType;
  onSave: (value) => void;
}> = ({ object, model, context, onSave }) => {
  // Vars
  const [newObject, setNewObject] = useState<any>([]);
  const [fieldList, setFieldList] = useState<any>([]);

  // Lifecycle
  useEffect(() => {
    setNewObject(object || []);
    const fList = [];

    map(model.fields, (field, key) => {
      fList.push({ label: field.name, value: key });
    });
    setFieldList(fList);
  }, [object]);

  // UI
  return (
    <>
      <List>
        {newObject?.map((field, index) => {
          return (
            <ListItem key={field.key}>
              <ListItemIcon>
                <RiLayoutRowLine />
              </ListItemIcon>
              <ListItemText>
                <Grid container>
                  <Grid item xs={6}>
                    <context.UI.Inputs.SelectInput
                      label="Field"
                      value={field.key}
                      options={fieldList}
                      onChange={(newKey) => {
                        newObject[index].key = newKey;
                        setNewObject([...newObject]);
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    {field.key !== "newKey" && (
                      <context.UI.Field
                        field={model.fields[field.key]}
                        fieldId={field.key}
                        modelId={model.key}
                        value={newObject[index].value}
                        onChange={(newValue) => {
                          newObject[index].value = newValue;
                          setNewObject([...newObject]);
                        }}
                      />
                    )}
                  </Grid>
                </Grid>
              </ListItemText>
            </ListItem>
          );
        })}
        <ListItem
          button
          onClick={() => {
            newObject.push({ key: "newKey", value: undefined });
            setNewObject([...newObject]);
          }}
        >
          <ListItemIcon>
            <AiOutlineAppstoreAdd />
          </ListItemIcon>
          <ListItemText>Add</ListItemText>
        </ListItem>
      </List>
      <Button
        style={{ float: "right" }}
        color="primary"
        onClick={() => {
          onSave(newObject);
        }}
      >
        Save
      </Button>
    </>
  );
};

export default ProcessEditorObjectEditor;
