import {
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Typography,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import {
  AppContextType,
  ValueListItemType,
  ModelType,
  InterfaceType,
  LayoutType,
  CustomFormInputType,
} from "../../../Utils/Types";
import { map, filter, find } from "lodash";
import {
  FaAlignLeft,
  FaColumns,
  FaKeyboard,
  FaList,
  FaListUl,
  FaMouse,
  FaObjectGroup,
  FaObjectUngroup,
  FaSquare,
  FaTh,
  FaThLarge,
  FaToggleOn,
} from "react-icons/fa";
import DropTarget from "./InterfaceDesigner/DropTarget";
import Component from "./InterfaceDesigner/Component";
import { BsBoundingBoxCircles } from "react-icons/bs";
import { remove, updateById } from "../../../Utils/Functions/General";
import uniqid from "uniqid";

const AppSettingsInterfaceUI: React.FC<{
  newInterface: InterfaceType;
  context: AppContextType;
  setNewInterface: (newInterface) => void;
  models: ModelType[];
  modelList: ValueListItemType[];
  selectedInterface: string;
}> = ({ newInterface, context, selectedInterface, setNewInterface }) => {
  // Vars
  const [varList, setVarList] = useState<ValueListItemType[]>([]);
  const [actionList, setActionList] = useState<ValueListItemType[]>([]);

  // Lifecycle
  useEffect(() => {
    const nl: ValueListItemType[] = [];
    map(newInterface.data.data.variables, (nv, nk) => {
      nl.push({ label: nv.label, value: nk, args: { ...nv } });
    });
    setVarList(nl);

    const na: ValueListItemType[] = [];
    map(newInterface.data.data.actions, (nv, nk) => {
      na.push({ label: nv.label, value: nk, args: { ...nv } });
    });
    setActionList(na);
  }, [newInterface]);

  // UI
  if (!selectedInterface) return <>Please select an interface on the right</>;
  const interf = newInterface.data.data.interfaces[selectedInterface];
  return (
    <>
      <Typography variant="h6">{interf.label}</Typography>
      <DropTarget
        Wrapper={EmptyWrapper}
        root
        onChange={(response) => {
          // If there is a migration, delete the old entry first
          if (response.migration) {
            remove(interf.content, response.migration.id);
          }

          setNewInterface({
            ...newInterface,
            data: {
              ...newInterface.data,
              data: {
                ...newInterface.data.data,
                interfaces: {
                  ...newInterface.data.data.interfaces,
                  [selectedInterface]: {
                    ...interf,
                    content: [
                      ...interf.content,
                      {
                        type: response.id,
                        id: uniqid(),
                        ...response.migration, // migrate any old data to here
                      },
                    ],
                  },
                },
              },
            },
          });
        }}
      >
        {interf.content.map((layoutItem, key) => {
          return (
            <LayoutItem
              key={key}
              layoutItem={layoutItem}
              componentList={{
                grid_container: {
                  label: (
                    <>
                      <FaTh style={{ marginRight: 15 }} />
                      Grid (container)
                    </>
                  ),
                  wrapper: (Props) => {
                    return (
                      <Grid container {...Props}>
                        {Props.children}
                      </Grid>
                    );
                  },
                  droppable: true,
                  popup: (component, layoutItem, respond, deleteItem) => {
                    context.setDialog({
                      display: true,
                      title: "Edit grid container",
                      form: [
                        {
                          type: "number",
                          label: "Spacing",
                          value: layoutItem?.spacing,
                          key: "spacing",
                        },
                      ],
                      buttons: [
                        {
                          label: (
                            <Typography
                              style={{ color: "red" }}
                              variant="button"
                            >
                              Delete
                            </Typography>
                          ),
                          onClick: () => deleteItem(),
                        },
                        {
                          label: "Update",
                          onClick: (form) => respond(form),
                        },
                      ],
                    });
                  },
                },
                grid_item: {
                  label: (
                    <>
                      <FaSquare style={{ marginRight: 15 }} />
                      Grid (item)
                    </>
                  ),
                  droppable: true,
                  wrapper: (Props) => {
                    return (
                      <Grid item {...Props}>
                        {Props.children}
                      </Grid>
                    );
                  },
                  popup: (component, layoutItem, respond, deleteItem) => {
                    context.setDialog({
                      display: true,
                      title: "Edit grid item",
                      form: [
                        {
                          type: "number",
                          label: "Extra small screens",
                          value: layoutItem?.xs,
                          key: "xs",
                        },
                        {
                          type: "number",
                          label: "Small screens",
                          value: layoutItem?.sm,
                          key: "sm",
                        },
                        {
                          type: "number",
                          label: "Medium screens",
                          value: layoutItem?.md,
                          key: "md",
                        },
                        {
                          type: "number",
                          label: "Large screens",
                          value: layoutItem?.lg,
                          key: "lg",
                        },
                        {
                          type: "number",
                          label: "Extra large screens",
                          value: layoutItem?.xl,
                          key: "xl",
                        },
                      ],
                      buttons: [
                        {
                          label: "Update",
                          onClick: (form) => respond(form),
                        },
                      ],
                    });
                  },
                },
                card: {
                  label: (
                    <>
                      <BsBoundingBoxCircles style={{ marginRight: 15 }} />
                      Card
                    </>
                  ),
                  droppable: true,
                  popup: (component, layoutItem, respond, deleteItem) => {
                    context.setDialog({
                      display: true,
                      title: "Edit card",
                      form: [
                        {
                          type: "text",
                          label: "Title",
                          value: layoutItem?.title,
                          key: "title",
                        },
                        {
                          type: "boolean",
                          label: "With margin",
                          value: layoutItem?.withBigMargin,
                          key: "withBigMargin",
                        },
                      ],
                      buttons: [
                        {
                          label: "Update",
                          onClick: (form) => respond(form),
                        },
                      ],
                    });
                  },
                },
                animation_group: {
                  label: (
                    <>
                      <FaObjectGroup style={{ marginRight: 15 }} />
                      Animation (container)
                    </>
                  ),
                  droppable: true,
                  popup: (component, layoutItem, respond, deleteItem) => {},
                },
                animation_item: {
                  label: (
                    <>
                      <FaObjectUngroup style={{ marginRight: 15 }} />
                      Animation (item)
                    </>
                  ),
                  droppable: true,
                  popup: (component, layoutItem, respond, deleteItem) => {},
                },
                animation_single: {
                  label: (
                    <>
                      <FaSquare style={{ marginRight: 15 }} />
                      Animation (single)
                    </>
                  ),
                  droppable: true,
                  popup: (component, layoutItem, respond, deleteItem) => {},
                },
                input: {
                  label: (
                    <>
                      <FaKeyboard style={{ marginRight: 15 }} />
                      Input
                    </>
                  ),
                  popup: (component, layoutItem, respond, deleteItem) => {
                    context.setDialog({
                      display: true,
                      title: "Edit input",
                      form: [
                        {
                          type: "text",
                          label: "Label",
                          value: layoutItem?.label,
                          key: "label",
                        },
                        {
                          key: "inputType",
                          value: layoutItem?.inputType,
                          label: "Type",
                          type: "dropdown",
                          dropdownOptions: [
                            { label: "Text", value: "text" },
                            { label: "Number", value: "number" },
                            { label: "Email", value: "email" },
                            { label: "Password", value: "password" },
                          ],
                        },
                        {
                          key: "attachToVariable",
                          value: layoutItem?.attachToVariable,
                          label: "Attach to variable",
                          type: "custom",
                          customInput: AttachInputToVariable,
                          customInputProps: {
                            varList,
                            inputType: "text",
                          },
                          onlyDisplayWhen: { inputType: "text" },
                        },
                        {
                          key: "attachToVariable",
                          value: layoutItem?.attachToVariable,
                          label: "Attach to variable",
                          type: "custom",
                          customInput: AttachInputToVariable,
                          customInputProps: {
                            varList,
                            inputType: "email",
                          },
                          onlyDisplayWhen: { inputType: "email" },
                        },
                        {
                          key: "attachToVariable",
                          value: layoutItem?.attachToVariable,
                          label: "Attach to variable",
                          type: "custom",
                          customInput: AttachInputToVariable,
                          customInputProps: {
                            varList,
                            inputType: "number",
                          },
                          onlyDisplayWhen: { inputType: "number" },
                        },
                        {
                          key: "attachToVariable",
                          value: layoutItem?.attachToVariable,
                          label: "Attach to variable",
                          type: "custom",
                          customInput: AttachInputToVariable,
                          customInputProps: {
                            varList,
                            inputType: "password",
                          },
                          onlyDisplayWhen: { inputType: "password" },
                        },
                      ],
                      buttons: [
                        {
                          label: (
                            <Typography
                              style={{ color: "red" }}
                              variant="button"
                            >
                              Delete
                            </Typography>
                          ),
                          onClick: () => deleteItem(),
                        },
                        {
                          label: "Update",
                          onClick: (form) => respond(form),
                        },
                      ],
                    });
                  },
                },
                text: {
                  label: (
                    <>
                      <FaAlignLeft style={{ marginRight: 15 }} />
                      Text
                    </>
                  ),
                  popup: (component, layoutItem, respond, deleteItem) => {
                    context.setDialog({
                      display: true,
                      title: "Edit text",
                      form: [
                        {
                          type: "text",
                          label: "Text",
                          value: layoutItem?.text,
                          key: "text",
                        },
                      ],
                      buttons: [
                        {
                          label: (
                            <Typography
                              style={{ color: "red" }}
                              variant="button"
                            >
                              Delete
                            </Typography>
                          ),
                          onClick: () => deleteItem(),
                        },
                        {
                          label: "Update",
                          onClick: (form) => respond(form),
                        },
                      ],
                    });
                  },
                },
                list: {
                  label: (
                    <>
                      <FaList style={{ marginRight: 15 }} />
                      List
                    </>
                  ),
                  popup: (component, layoutItem, respond, deleteItem) =>
                    context.setDialog({
                      display: true,
                      title: "Edit list",
                      form: [
                        {
                          type: "dropdown",
                          label: "Show variable",
                          value: layoutItem?.varName,
                          key: "varName",
                          dropdownOptions: filter(
                            varList,
                            (o) => o.args.type === "objects"
                          ),
                        },
                        {
                          type: "text",
                          label: "Title",
                          value: layoutItem?.title,
                          key: "title",
                        },
                        {
                          type: "text",
                          label: "Primary text",
                          value: layoutItem?.primary,
                          key: "primary",
                        },
                        {
                          type: "text",
                          label: "Secondary text",
                          value: layoutItem?.secondary,
                          key: "secondary",
                        },
                        {
                          type: "text",
                          label: "Link to",
                          value: layoutItem?.linkTo,
                          key: "linkTo",
                        },
                      ],
                      buttons: [
                        {
                          label: "Update",
                          onClick: (form) => respond(form),
                        },
                      ],
                    }),
                },
                button: {
                  label: (
                    <>
                      <FaMouse style={{ marginRight: 15 }} />
                      Button
                    </>
                  ),
                  popup: (component, layoutItem, respond, deleteItem) => {
                    context.setDialog({
                      display: true,
                      form: [
                        {
                          label: "Label",
                          value: layoutItem.label,
                          key: "label",
                        },
                        {
                          label: "Action",
                          key: "action",
                          value: layoutItem.action,
                          type: "dropdown",
                          dropdownOptions: actionList,
                        },
                        {
                          label: "Variant",
                          key: "variant",
                          value: layoutItem.variant,
                          type: "dropdown",
                          dropdownOptions: [
                            { label: "Text", value: "text" },
                            { label: "Contained", value: "contained" },
                            { label: "Outlined", value: "outlined" },
                          ],
                        },
                        {
                          label: "Colored",
                          key: "colored",
                          value: layoutItem.colored,
                          type: "boolean",
                        },
                        {
                          label: "Full width",
                          key: "fullWidth",
                          value: layoutItem.fullWidth,
                          type: "boolean",
                        },
                      ],
                      buttons: [
                        {
                          label: (
                            <Typography
                              style={{ color: "red" }}
                              variant="button"
                            >
                              Delete
                            </Typography>
                          ),
                          onClick: () => deleteItem(),
                        },
                        {
                          label: "Update",
                          onClick: (form) => respond(form),
                        },
                      ],
                    });
                  },
                },
                toggle: {
                  label: (
                    <>
                      <FaToggleOn style={{ marginRight: 15 }} />
                      Toggle
                    </>
                  ),
                  popup: (component, layoutItem, respond, deleteItem) => {
                    context.setDialog({
                      display: true,
                      title: "Edit toggle",
                      form: [
                        {
                          type: "dropdown",
                          label: "Attach to variable",
                          value: layoutItem?.varName,
                          key: "varName",
                          dropdownOptions: filter(
                            varList,
                            (o) => o.args.type === "boolean"
                          ),
                        },
                        {
                          key: "labelWhenTrue",
                          label: "Label when true",
                          value: layoutItem?.labelWhenTrue,
                          type: "text",
                        },
                        {
                          key: "labelWhenFalse",
                          label: "Label when false",
                          value: layoutItem?.labelWhenFalse,
                          type: "text",
                        },
                      ],
                      buttons: [
                        {
                          label: (
                            <Typography
                              style={{ color: "red" }}
                              variant="button"
                            >
                              Delete
                            </Typography>
                          ),
                          onClick: () => deleteItem(),
                        },
                        {
                          label: "Update",
                          onClick: (form) => respond(form),
                        },
                      ],
                    });
                  },
                },
                options: {
                  label: (
                    <>
                      <FaListUl style={{ marginRight: 15 }} />
                      Options
                    </>
                  ),
                  popup: (component, layoutItem, respond, deleteItem) => {
                    context.setDialog({
                      display: true,
                      title: "Edit options",
                      form: [
                        {
                          type: "dropdown",
                          label: "Attach to variable",
                          value: layoutItem?.varName,
                          key: "varName",
                          dropdownOptions: filter(
                            varList,
                            (o) => o.args.type === "options"
                          ),
                        },
                        {
                          type: "dropdown",
                          label: "Display as",
                          value: layoutItem?.displayAs,
                          key: "displayAs",
                          dropdownOptions: [
                            { label: "Dropdown", value: "dropdown" },
                            { label: "Buttons", value: "buttons" },
                            { label: "Radio", value: "radio" },
                          ],
                        },
                      ],
                      buttons: [
                        {
                          label: (
                            <Typography
                              style={{ color: "red" }}
                              variant="button"
                            >
                              Delete
                            </Typography>
                          ),
                          onClick: () => deleteItem(),
                        },
                        {
                          label: "Update",
                          onClick: (form) => respond(form),
                        },
                      ],
                    });
                  },
                },
              }}
              onDrop={(newContent) => {
                setNewInterface({
                  ...newInterface,
                  data: {
                    ...newInterface.data,
                    data: {
                      ...newInterface.data.data,
                      interfaces: {
                        ...newInterface.data.data.interfaces,
                        [selectedInterface]: {
                          ...interf,
                          content: newContent,
                        },
                      },
                    },
                  },
                });
              }}
              layout={interf.content}
              path=""
            />
          );
        })}
      </DropTarget>
    </>
  );
};

export default AppSettingsInterfaceUI;

export const AppSettingsInterfaceUIOverview: React.FC<{
  newInterface: InterfaceType;
  context: AppContextType;
  setNewInterface: (newInterface) => void;
  setSelectedInterface;
  setRightUITab;
}> = ({ newInterface, setSelectedInterface, setRightUITab }) => (
  <List>
    {map(newInterface.data.data.interfaces, (interf, key) => (
      <ListItem
        key={key}
        button
        onClick={() => {
          setSelectedInterface(key);
          setRightUITab("Components");
        }}
      >
        <ListItemIcon style={{ minWidth: 32 }}>
          <FaColumns />
        </ListItemIcon>
        <ListItemText>{interf.label}</ListItemText>
      </ListItem>
    ))}
  </List>
);

const EmptyWrapper: React.FC = (Props) => (
  <div {...Props}>{Props.children}</div>
);

export const InterfaceComponentsList: React.FC<{
  newInterface: InterfaceType;
  context: AppContextType;
  setNewInterface: (newInterface) => void;
  setSelectedInterface;
  setRightUITab;
}> = ({ context }) => (
  <>
    <List>
      <ListSubheader>Layout</ListSubheader>
      <Component id="grid_container">
        <ListItem>
          <ListItemIcon style={{ minWidth: 32 }}>
            <FaThLarge />
          </ListItemIcon>
          <ListItemText>Grid (container)</ListItemText>
        </ListItem>
      </Component>
      <Component id="grid_item">
        <ListItem>
          <ListItemIcon style={{ minWidth: 32 }}>
            <FaSquare />
          </ListItemIcon>
          <ListItemText>Grid (item)</ListItemText>
        </ListItem>
      </Component>
      <Component id="card">
        <ListItem>
          <ListItemIcon style={{ minWidth: 32 }}>
            <BsBoundingBoxCircles />
          </ListItemIcon>
          <ListItemText>Card</ListItemText>
        </ListItem>
      </Component>
      <ListSubheader>Animation</ListSubheader>
      <Component id="animation_group">
        <ListItem>
          <ListItemIcon style={{ minWidth: 32 }}>
            <FaObjectGroup />
          </ListItemIcon>
          <ListItemText>Animation (container)</ListItemText>
        </ListItem>
      </Component>
      <Component id="animation_item">
        <ListItem>
          <ListItemIcon style={{ minWidth: 32 }}>
            <FaObjectUngroup />
          </ListItemIcon>
          <ListItemText>Animation (item)</ListItemText>
        </ListItem>
      </Component>
      <Component id="animation_single">
        <ListItem>
          <ListItemIcon style={{ minWidth: 32 }}>
            <FaSquare />
          </ListItemIcon>
          <ListItemText>Animation (single)</ListItemText>
        </ListItem>
      </Component>
      <ListSubheader>Components</ListSubheader>
      <Component id="input">
        <ListItem>
          <ListItemIcon style={{ minWidth: 32 }}>
            <FaKeyboard />
          </ListItemIcon>
          <ListItemText>Input</ListItemText>
        </ListItem>
      </Component>
      <Component id="text">
        <ListItem>
          <ListItemIcon style={{ minWidth: 32 }}>
            <FaAlignLeft />
          </ListItemIcon>
          <ListItemText>Text</ListItemText>
        </ListItem>
      </Component>
      <Component id="list">
        <ListItem>
          <ListItemIcon style={{ minWidth: 32 }}>
            <FaList />
          </ListItemIcon>
          <ListItemText>List</ListItemText>
        </ListItem>
      </Component>
      <Component id="button">
        <ListItem>
          <ListItemIcon style={{ minWidth: 32 }}>
            <FaMouse />
          </ListItemIcon>
          <ListItemText>Button</ListItemText>
        </ListItem>
      </Component>
      <Component id="toggle">
        <ListItem>
          <ListItemIcon style={{ minWidth: 32 }}>
            <FaToggleOn />
          </ListItemIcon>
          <ListItemText>Toggle</ListItemText>
        </ListItem>
      </Component>
      <Component id="options">
        <ListItem>
          <ListItemIcon style={{ minWidth: 32 }}>
            <FaListUl />
          </ListItemIcon>
          <ListItemText>Options</ListItemText>
        </ListItem>
      </Component>
    </List>
  </>
);

const LayoutItem: React.FC<{
  key;
  layoutItem;
  componentList;
  onDrop;
  layout: LayoutType;
  path;
}> = ({ key, layoutItem, componentList, onDrop, layout, path }) => {
  const Wrapper = componentList[layoutItem.type].wrapper
    ? componentList[layoutItem.type].wrapper
    : EmptyWrapper;

  return (
    <DropTarget
      key={key}
      Wrapper={Wrapper}
      componentList={componentList}
      layoutItem={layoutItem}
      onDelete={() => {
        remove(layout, layoutItem.id);
      }}
      onChangeProps={(result) => {
        map(result, (change, key) => {
          layoutItem[key] = change;
        });
        updateById(layout, layoutItem);
      }}
      onChange={(response) => {
        if (response.migration) {
          remove(layout, response.migration.id);
        }
        if (!layoutItem?.items) layoutItem.items = [];
        layoutItem.items.push({
          type: response.id,
          id: uniqid(),
          ...response.migration,
        });
        updateById(layout, layoutItem);
        onDrop(layout);
      }}
    >
      {layoutItem.items &&
        layoutItem.items.map((layoutItem, key) => {
          return (
            <LayoutItem
              key={key}
              layoutItem={layoutItem}
              componentList={componentList}
              onDrop={onDrop}
              layout={layout}
              path={path + layoutItem.id}
            />
          );
        })}
    </DropTarget>
  );
};

const AttachInputToVariable: React.FC<CustomFormInputType> = ({
  label,
  context,
  varList,
  value,
  onChange,
  inputType,
}) => {
  // Vars
  const currentVariableIsObject =
    value?.var &&
    find(varList, (o) => o.value === value.var).args.type === "object";
  const [model, setModel] = useState<ModelType>();
  const [fieldOptions, setFieldOptions] = useState<ValueListItemType[]>([]);

  // Lifecycle
  useEffect(() => {
    if (currentVariableIsObject) {
      const modelKey = find(varList, (o) => o.value === value.var).args.model;
      const request = context.getModel(modelKey, (response) => {
        setModel(response.data);
        const nl: ValueListItemType[] = [];

        map(
          response.data.fields,
          (field, fieldKey) =>
            field.type === "input" &&
            (field.typeArgs?.type === inputType ||
              (inputType === "text" && !field.typeArgs?.type)) &&
            nl.push({ label: field.name, value: fieldKey })
        );
        setFieldOptions(nl);
      });
    }
  }, [currentVariableIsObject, value]);
  // UI

  return (
    <Grid container>
      <Grid item xs={6}>
        <context.UI.Inputs.Select
          label={label}
          value={value?.var}
          onChange={(newVal) => {
            onChange({ ...(value || {}), var: newVal });
          }}
          options={filter(
            varList,
            (o) => o.args.type === "object" || o.args.type === "text"
          )}
        />
      </Grid>
      {currentVariableIsObject && model && (
        <Grid item xs={6}>
          <context.UI.Inputs.Select
            label={`${model.name} fields`}
            value={value?.field}
            onChange={(newVal) => {
              onChange({ ...(value || {}), field: newVal });
            }}
            options={fieldOptions}
          />
        </Grid>
      )}
    </Grid>
  );
};
