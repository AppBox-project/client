import { List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import React from "react";
import { AppContextType, ValueListItemType } from "../../../Utils/Types";
import { ActionType } from "../Types";
import { map } from "lodash";
import {
  FaAlignJustify,
  FaList,
  FaPlus,
  FaSortNumericDown,
  FaToggleOn,
  FaUser,
  FaUsers,
} from "react-icons/fa";

const SettingsActionsVars: React.FC<{
  context: AppContextType;
  action: ActionType;
  setAction;
  modelList: ValueListItemType[];
}> = ({ context, action, setAction, modelList }) => (
  <List disablePadding>
    {map(action?.data?.data?.vars, (value, key) => (
      <ListItem
        key={key}
        button
        onClick={() =>
          context.setDialog({
            display: true,
            title: "Edit variable",
            form: [
              { label: "Key", key: "key", type: "text", value: key },
              {
                label: "Label",
                key: "label",
                type: "text",
                value: value.label,
              },
              {
                label: "Description (optional)",
                key: "description",
                type: "text",
                value: value.description,
              },
              {
                label: "Type",
                key: "type",
                type: "dropdown",
                value: value.type,
                dropdownOptions: [
                  { label: "Text", value: "text" },
                  { label: "Number", value: "number" },
                  { label: "Boolean", value: "boolean" },
                  { label: "Options", value: "options" },
                  { label: "Object", value: "object" },
                  { label: "Objects", value: "objects" },
                ],
              },
              {
                label: "Model",
                key: "model",
                type: "dropdown",
                value: value.model,
                dropdownOptions: modelList,
                onlyDisplayWhen: { type: "object" },
              },
              {
                label: "Model",
                key: "model",
                type: "dropdown",
                value: value.model,
                dropdownOptions: modelList,
                onlyDisplayWhen: { type: "objects" },
              },
              {
                label: "Default value",
                key: "default",
                type: "boolean",
                value: value.default,
                onlyDisplayWhen: { type: "boolean" },
              },
              {
                label: "Options (comma seperated)",
                key: "options",
                type: "text",
                value: value.options,
                onlyDisplayWhen: { type: "options" },
              },
              {
                label: "Default value",
                key: "default",
                type: "text",
                value: value.default,
                onlyDisplayWhen: { type: "options" },
              },
              {
                label: "Default value",
                key: "default",
                type: "number",
                value: value.default,
                onlyDisplayWhen: { type: "number" },
              },
            ],
            buttons: [
              {
                label: "Save",
                onClick: (form) => {
                  const vars = action.data.data.vars;
                  delete vars[form.key];
                  vars[form.key] = form;
                  setAction({
                    ...action,
                    data: {
                      ...action.data,
                      data: {
                        ...action.data.data,
                        vars,
                      },
                    },
                  });
                },
              },
            ],
          })
        }
      >
        <ListItemIcon style={{ minWidth: 32 }}>
          {value.type === "objects" && <FaUsers />}
          {value.type === "object" && <FaUser />}
          {value.type === "text" && <FaAlignJustify />}
          {value.type === "boolean" && <FaToggleOn />}
          {value.type === "options" && <FaList />}
          {value.type === "number" && <FaSortNumericDown />}
        </ListItemIcon>
        <ListItemText>{value.label}</ListItemText>
      </ListItem>
    ))}
    <ListItem
      button
      onClick={() =>
        setAction({
          ...action,
          data: {
            ...action.data,
            data: {
              ...action.data.data,
              vars: {
                ...action?.data?.data?.vars,
                new: { label: "New variable", type: "text" },
              },
            },
          },
        })
      }
    >
      <ListItemIcon style={{ minWidth: 32 }}>
        <FaPlus />
      </ListItemIcon>
      <ListItemText>Create new variable</ListItemText>
    </ListItem>
  </List>
);

export default SettingsActionsVars;
