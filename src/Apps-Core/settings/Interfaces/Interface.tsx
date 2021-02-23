import {
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
} from "../../../Utils/Types";
import { map, filter } from "lodash";
import {
  FaAlignLeft,
  FaColumns,
  FaKeyboard,
  FaList,
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

  // Lifecycle
  useEffect(() => {
    const nl: ValueListItemType[] = [];
    map(newInterface.data.data.variables, (nv, nk) => {
      nl.push({ label: nv.label, value: nk, args: { ...nv } });
    });
    setVarList(nl);
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
                  droppable: true,
                  popup: (component, layoutItem, respond, deleteItem) => {},
                },
                grid_item: {
                  label: (
                    <>
                      <FaSquare style={{ marginRight: 15 }} />
                      Grid (item)
                    </>
                  ),
                  droppable: true,
                  popup: (component, layoutItem, respond, deleteItem) => {},
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
                  popup: (component, layoutItem, respond, deleteItem) => {},
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
                          label: "primary",
                          value: layoutItem?.primary,
                          key: "primary",
                        },
                        {
                          type: "text",
                          label: "secondary",
                          value: layoutItem?.secondary,
                          key: "secondary",
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
