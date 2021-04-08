import {
  Button,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Tab,
  Tabs,
  Typography,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { useGlobal } from "reactn";
import {
  AppContextType,
  ValueListItemType,
  ModelType,
  InterfaceType,
  LayoutType,
  CustomFormInputType,
} from "../../../Utils/Types";
import map from "lodash/map";
import filter from "lodash/filter";
import find from "lodash/find";
import findIndex from "lodash/findIndex";
import union from "lodash/union";
import {
  FaAlignLeft,
  FaCode,
  FaCogs,
  FaColumns,
  FaKeyboard,
  FaList,
  FaListAlt,
  FaListUl,
  FaMouse,
  FaObjectGroup,
  FaObjectUngroup,
  FaPlus,
  FaRandom,
  FaSpinner,
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
import LayoutItemListDetailLayout from "./Interface/LayoutItemWrappers/ListDetailLayout";

const AppSettingsInterfaceUI: React.FC<{
  newInterface: InterfaceType;
  context: AppContextType;
  setNewInterface: (newInterface) => void;
  models: ModelType[];
  modelList: ValueListItemType[];
  selectedInterface: string;
  setSelectedInterface;
  Components?;
}> = ({
  newInterface,
  context,
  selectedInterface,
  setNewInterface,
  setSelectedInterface,
  Components,
  models,
}) => {
  // Vars
  const [varList, setVarList] = useState<ValueListItemType[]>([]);
  const [actionList, setActionList] = useState<ValueListItemType[]>([]);
  const [isMobile] = useGlobal<any>("isMobile");

  const componentList = {
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
      popup: (
        component,
        layoutItem,
        respond,
        deleteItem,
        contextVarList,
        contextActionList
      ) => {
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
                <Typography style={{ color: "red" }} variant="button">
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
      popup: (
        component,
        layoutItem,
        respond,
        deleteItem,
        contextVarList,
        contextActionList
      ) => {
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
              label: (
                <Typography style={{ color: "red" }} variant="button">
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
    card: {
      label: (
        <>
          <BsBoundingBoxCircles style={{ marginRight: 15 }} />
          Card
        </>
      ),
      droppable: true,
      popup: (
        component,
        layoutItem,
        respond,
        deleteItem,
        contextVarList,
        contextActionList
      ) => {
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
            {
              type: "boolean",
              label: "Without padding",
              value: layoutItem?.withoutPadding,
              key: "withoutPadding",
            },
          ],
          buttons: [
            {
              label: (
                <Typography style={{ color: "red" }} variant="button">
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
    animation_group: {
      label: (
        <>
          <FaObjectGroup style={{ marginRight: 15 }} />
          Animation (container)
        </>
      ),
      droppable: true,
      popup: (
        component,
        layoutItem,
        respond,
        deleteItem,
        contextVarList,
        contextActionList
      ) => (component, layoutItem, respond, deleteItem) => {
        context.setDialog({
          display: true,
          title: "Edit Animation Group",
          buttons: [
            {
              label: (
                <Typography style={{ color: "red" }} variant="button">
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
    animation_item: {
      label: (
        <>
          <FaObjectUngroup style={{ marginRight: 15 }} />
          Animation (item)
        </>
      ),
      droppable: true,
      popup: (
        component,
        layoutItem,
        respond,
        deleteItem,
        contextVarList,
        contextActionList
      ) => (component, layoutItem, respond, deleteItem) => {
        context.setDialog({
          display: true,
          title: "Edit Animation Item",
          form: [],
          buttons: [
            {
              label: (
                <Typography style={{ color: "red" }} variant="button">
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
    animation_single: {
      label: (
        <>
          <FaSquare style={{ marginRight: 15 }} />
          Animation (single)
        </>
      ),
      droppable: true,
      popup: (
        component,
        layoutItem,
        respond,
        deleteItem,
        contextVarList,
        contextActionList
      ) => (component, layoutItem, respond, deleteItem) => {
        context.setDialog({
          display: true,
          title: "Edit single animation",
          buttons: [
            {
              label: (
                <Typography style={{ color: "red" }} variant="button">
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
      popup: (
        component,
        layoutItem,
        respond,
        deleteItem,
        contextVarList,
        contextActionList
      ) => {
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
                <Typography style={{ color: "red" }} variant="button">
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
    fieldDisplay: {
      label: (
        <>
          <FaSpinner style={{ marginRight: 15 }} />
          Field display
        </>
      ),
      popup: (
        component,
        layoutItem,
        respond,
        deleteItem,
        contextVarList,
        contextActionList
      ) =>
        context.setDialog({
          display: true,
          title: "Edit field display",
          form: [
            {
              type: "custom",
              label: "fieldDisplay",
              value: layoutItem?.fieldDisplay,
              key: "fieldDisplay",
              customInput: CustomInputFieldDisplay,
              customInputProps: {
                varList: filter(
                  contextVarList,
                  (o) => o.args.type === "object"
                ),
                models,
                interfaceObject: newInterface,
              },
            },
          ],
          buttons: [
            {
              label: (
                <Typography style={{ color: "red" }} variant="button">
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
        }),
    },
    input: {
      label: (
        <>
          <FaKeyboard style={{ marginRight: 15 }} />
          Input
        </>
      ),
      popup: (
        component,
        layoutItem,
        respond,
        deleteItem,
        contextVarList,
        contextActionList
      ) => {
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
                <Typography style={{ color: "red" }} variant="button">
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
      popup: (
        component,
        layoutItem,
        respond,
        deleteItem,
        contextVarList,
        contextActionList
      ) =>
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
              label: (
                <Typography style={{ color: "red" }} variant="button">
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
        }),
    },
    button: {
      label: (
        <>
          <FaMouse style={{ marginRight: 15 }} />
          Button
        </>
      ),
      popup: (
        component,
        layoutItem,
        respond,
        deleteItem,
        contextVarList,
        contextActionList
      ) => {
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
                <Typography style={{ color: "red" }} variant="button">
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
      popup: (
        component,
        layoutItem,
        respond,
        deleteItem,
        contextVarList,
        contextActionList
      ) => {
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
                <Typography style={{ color: "red" }} variant="button">
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
      popup: (
        component,
        layoutItem,
        respond,
        deleteItem,
        contextVarList,
        contextActionList
      ) => {
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
                <Typography style={{ color: "red" }} variant="button">
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
    switch: {
      label: (
        <>
          <FaCode style={{ marginRight: 15 }} />
          Condition
        </>
      ),
      wrapper: LayoutItemConditionalRendering,
      popup: (
        component,
        layoutItem,
        respond,
        deleteItem,
        contextVarList,
        contextActionList
      ) => {
        context.setDialog({
          display: true,
          title: "Edit conditional lay-out",
          form: [],
          buttons: [
            {
              label: (
                <Typography style={{ color: "red" }} variant="button">
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
    listDetail: {
      label: (
        <>
          <FaListAlt style={{ marginRight: 15 }} />
          List-Detail lay-out
        </>
      ),
      droppable: true,
      wrapper: LayoutItemListDetailLayout,
      popup: (
        component,
        layoutItem,
        respond,
        deleteItem,
        contextVarList,
        contextActionList
      ) => {
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
                <Typography style={{ color: "red" }} variant="button">
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
  };

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
  if (!selectedInterface && isMobile)
    return (
      <List>
        {map(newInterface.data.data.interfaces, (value, key) => (
          <ListItem key={key} button onClick={() => setSelectedInterface(key)}>
            <ListItemText>{value.label}</ListItemText>
          </ListItem>
        ))}
      </List>
    );
  if (!selectedInterface) return <>Please select an interface on the right</>;
  const interf = newInterface.data.data.interfaces[selectedInterface];
  return (
    <>
      <Typography variant="h6">{interf.label}</Typography>
      <DropTarget
        Wrapper={EmptyWrapper}
        context={context}
        root
        varList={varList}
        contextVariables={[]}
        updateContextVariables={() => {}}
        actionList={actionList}
        interfaceObject={newInterface}
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
        layout={interf}
        path=""
        renderChildren={(contextVariables) => (
          <>
            {interf.content.map((layoutItem, key) => {
              return (
                <LayoutItem
                  interfaceObject={newInterface}
                  context={context}
                  key={key}
                  layoutItem={layoutItem}
                  varList={varList}
                  actionList={actionList}
                  componentList={componentList}
                  parentContextVariables={[]}
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
          </>
        )}
      />
      {Components}
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
      <Component id="text">
        <ListItem>
          <ListItemIcon style={{ minWidth: 32 }}>
            <FaAlignLeft />
          </ListItemIcon>
          <ListItemText>Text</ListItemText>
        </ListItem>
      </Component>
      <Component id="fieldDisplay">
        <ListItem>
          <ListItemIcon style={{ minWidth: 32 }}>
            <FaSpinner />
          </ListItemIcon>
          <ListItemText>Field display</ListItemText>
        </ListItem>
      </Component>
      <Component id="input">
        <ListItem>
          <ListItemIcon style={{ minWidth: 32 }}>
            <FaKeyboard />
          </ListItemIcon>
          <ListItemText>Input</ListItemText>
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
      <ListSubheader>Lay-outs</ListSubheader>
      <Component id="listDetail">
        <ListItem>
          <ListItemIcon style={{ minWidth: 32 }}>
            <FaListAlt />
          </ListItemIcon>
          <ListItemText>List-detail lay-out</ListItemText>
        </ListItem>
      </Component>
      <ListSubheader>Logic</ListSubheader>
      <Component id="switch">
        <ListItem>
          <ListItemIcon style={{ minWidth: 32 }}>
            <FaRandom />
          </ListItemIcon>
          <ListItemText>Switch rendering</ListItemText>
        </ListItem>
      </Component>
      <Component id="condition">
        <ListItem>
          <ListItemIcon style={{ minWidth: 32 }}>
            <FaCode />
          </ListItemIcon>
          <ListItemText>Condition</ListItemText>
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
  context: AppContextType;
  varList;
  actionList;
  parentContextVariables: ValueListItemType[];
  interfaceObject;
}> = ({
  key,
  layoutItem,
  componentList,
  onDrop,
  layout,
  path,
  context,
  varList,
  actionList,
  parentContextVariables,
  interfaceObject,
}) => {
  const Wrapper =
    ((componentList || {})[layoutItem.type] || {}).wrapper || EmptyWrapper;
  const [contextVariables, setContextVariables] = useState<ValueListItemType[]>(
    parentContextVariables
  );
  return (
    <DropTarget
      key={key}
      Wrapper={Wrapper}
      context={context}
      componentList={componentList}
      layoutItem={layoutItem}
      varList={varList}
      interfaceObject={interfaceObject}
      actionList={actionList}
      contextVariables={union(contextVariables, parentContextVariables)}
      onDelete={() => {
        remove(layout, layoutItem.id);
      }}
      onChangeProps={(result) => {
        map(result, (change, key) => {
          layoutItem[key] = change;
        });

        updateById(layout, layoutItem);
        onDrop(layout);
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
        onDrop(layout);
      }}
      layout={layout}
      path={path}
      updateContextVariables={(key, value) => {
        const currentIndex = findIndex(
          contextVariables,
          (o) => o.value === key
        );
        const localContextVars = [...contextVariables];
        if (currentIndex > -1) {
          localContextVars[currentIndex] = value;
        } else {
          localContextVars.push(value);
        }

        setContextVariables([...localContextVars]);
      }}
      renderChildren={(localContextVariables) => (
        <>
          {layoutItem.items &&
            layoutItem.items.map((layoutItem, key) => {
              return (
                <LayoutItem
                  key={key}
                  layoutItem={layoutItem}
                  componentList={componentList}
                  onDrop={onDrop}
                  layout={layout}
                  context={context}
                  varList={varList}
                  actionList={actionList}
                  path={path + layoutItem.id}
                  interfaceObject={interfaceObject}
                  parentContextVariables={union(
                    localContextVariables,
                    parentContextVariables
                  )}
                />
              );
            })}
        </>
      )}
    />
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
    <Grid container spacing={3}>
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

const LayoutItemConditionalRendering: React.FC<{
  conditions;
  defaultCondition;
  onChange: (props: {}) => void;
  componentList;
  layout;
  path;
  context: AppContextType;
  varList;
  actionList;
  interfaceObject;
}> = ({
  conditions,
  defaultCondition,
  onChange,
  componentList,
  layout,
  path,
  context,
  varList,
  actionList,
  interfaceObject,
}) => {
  // Vars
  const [selectedCase, setSelectedCase] = useState<number | "default" | "add">(
    "default"
  );

  // Lifecycle

  // UI

  return (
    <>
      <Typography variant="h6">Switch rendering</Typography>
      <Tabs
        value={selectedCase}
        onChange={(event, newValue) => {
          setSelectedCase(newValue);
        }}
        aria-label="Cases"
        centered
        indicatorColor="primary"
        textColor="primary"
      >
        {(conditions || []).map((condition, conditionIndex) => (
          <Tab
            label={condition.label}
            value={conditionIndex}
            key={conditionIndex}
          />
        ))}
        <Tab label={<FaPlus />} value="add" />
        <Tab label="Default" value="default" />
      </Tabs>
      {selectedCase === "add" && (
        <>
          <Button
            onClick={() => {
              onChange({
                conditions: [...(conditions || []), { label: "New" }],
              });
              setSelectedCase((conditions || []).length);
            }}
          >
            Add
          </Button>
        </>
      )}
      {selectedCase !== "add" && selectedCase !== "default" && (
        <>
          <Typography variant="h6">
            <IconButton
              onClick={() =>
                context.setDialog({
                  display: true,
                  title: "Edit case",
                  form: [
                    {
                      key: "label",
                      value: conditions[selectedCase].label,
                      label: "Label",
                    },
                    {
                      key: "criteria",
                      value: conditions[selectedCase].criteria,
                      label: "Criteria",
                      type: "text",
                    },
                  ],
                  buttons: [
                    {
                      label: (
                        <Typography style={{ color: "red" }}>
                          Delete case
                        </Typography>
                      ),
                      onClick: () => console.log("todo"),
                    },
                    {
                      label: "Update case",
                      onClick: (form) => {
                        const newConditions = conditions;
                        newConditions[selectedCase].label = form.label;
                        newConditions[selectedCase].criteria = form.criteria;
                        onChange({ conditions: newConditions });
                      },
                    },
                  ],
                })
              }
            >
              <FaCogs />
            </IconButton>
            {((conditions || {})[selectedCase] || {}).label}
          </Typography>
          <DropTarget
            Wrapper={EmptyWrapper}
            root
            context={context}
            layout={((conditions || {})[selectedCase] || {}).items}
            path={path}
            varList={varList}
            interfaceObject={interfaceObject}
            actionList={actionList}
            onChange={(response) => {
              // If there is a migration, delete the old entry first
              if (response.migration) {
                remove(layout.content, response.migration.id);
              }
              const newConditions = conditions;
              newConditions[selectedCase].items = [
                ...(newConditions[selectedCase].items || []),
                {
                  type: response.id,
                  id: uniqid(),
                  ...response.migration, // migrate any old data to here
                },
              ];
              onChange({ conditions: newConditions });
            }}
            updateContextVariables={(key, value) => {}}
            renderChildren={(contextVariables) => (
              <>
                {(((conditions || {})[selectedCase] || {}).items || []).map(
                  (layoutItem, key) => {
                    return (
                      <LayoutItem
                        key={key}
                        interfaceObject={interfaceObject}
                        layoutItem={layoutItem}
                        context={context}
                        varList={varList}
                        actionList={actionList}
                        layout={
                          ((conditions || {})[selectedCase] || {}).items || []
                        }
                        componentList={componentList}
                        onDrop={(newContent) => {
                          onChange(newContent);
                        }}
                        path={path + layoutItem.id}
                        parentContextVariables={[]}
                      />
                    );
                  }
                )}
              </>
            )}
          />
        </>
      )}
      {selectedCase === "default" && (
        <>
          <Typography variant="h6">Default case</Typography>
          <DropTarget
            Wrapper={EmptyWrapper}
            root
            layout={layout}
            path={path}
            varList={varList}
            actionList={actionList}
            context={context}
            interfaceObject={interfaceObject}
            onChange={(response) => {
              // If there is a migration, delete the old entry first
              if (response.migration) {
                remove(layout.content, response.migration.id);
              }
              const newDefaultCondition = [
                ...(defaultCondition || []),
                {
                  type: response.id,
                  id: uniqid(),
                  ...response.migration, // migrate any old data to here
                },
              ];
              onChange({ defaultCondition: newDefaultCondition });
            }}
            updateContextVariables={() => {}}
            renderChildren={(contextVariables) => (
              <>
                {(defaultCondition || []).map((layoutItem, key) => {
                  return (
                    <LayoutItem
                      key={key}
                      varList={varList}
                      actionList={actionList}
                      layoutItem={layoutItem}
                      componentList={componentList}
                      context={context}
                      interfaceObject={interfaceObject}
                      onDrop={(newContent) => {
                        onChange(newContent);
                      }}
                      layout={layout?.defaultCondition || []}
                      path={path + layoutItem.id}
                      parentContextVariables={[]}
                    />
                  );
                })}
              </>
            )}
          ></DropTarget>
        </>
      )}
    </>
  );
};

const CustomInputFieldDisplay: React.FC<CustomFormInputType> = ({
  label,
  context,
  varList,
  value,
  onChange,
  inputType,
  models,
  interfaceObject,
}) => {
  // Vars
  const [fieldOptions, setFieldOptions] = useState<ValueListItemType[]>([]);

  // Lifecycle
  useEffect(() => {
    const varRefersTo = value?.var
      .substr(7, value?.var.length - 11)
      .toLowerCase();

    const modelKey = (interfaceObject as InterfaceType).data.data.variables[
      varRefersTo
    ]?.model;
    const model: ModelType = find(
      models as ModelType[],
      (o) => o.key === modelKey
    );
    const nl: ValueListItemType[] = [];
    map(model?.fields || [], (field, key) =>
      nl.push({ label: field.name, value: key })
    );
    setFieldOptions(nl);
  }, [value?.var]);

  // UI
  return (
    <>
      <context.UI.Inputs.Select
        label="Variable"
        options={varList}
        value={value?.var}
        onChange={(newVal) => {
          onChange({ ...value, var: newVal });
        }}
      />
      {value?.var && (
        <context.UI.Inputs.Select
          label="Field"
          options={fieldOptions}
          value={value?.field}
          onChange={(newVal) => {
            onChange({ ...value, field: newVal });
          }}
        />
      )}
    </>
  );
};
