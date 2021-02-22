import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@material-ui/core";
import React from "react";
import {
  AppContextType,
  ValueListItemType,
  ModelType,
  InterfaceType,
} from "../../../Utils/Types";
import { map } from "lodash";
import { FaColumns } from "react-icons/fa";
import DropTarget from "./InterfaceDesigner/DropTarget";

const AppSettingsInterfaceUI: React.FC<{
  newInterface: InterfaceType;
  context: AppContextType;
  setNewInterface: (newInterface) => void;
  models: ModelType[];
  modelList: ValueListItemType[];
  selectedInterface: string;
}> = ({ newInterface, context, selectedInterface }) => {
  // Vars

  // Lifecycle

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
          console.log(response);
        }}
      >
        Test
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
    <DropTarget
      key="Test"
      Wrapper={EmptyWrapper}
      componentList={{
        Field: {
          label: "Field",
          dynamicLabel: "field",
          popup: (component, layoutItem, respond, deleteItem) => {
            // Show tweak UI
            context.setDialog({
              display: true,
              title: component.label,
              form: [],
              buttons: [],
            });
          },
        },
      }}
      layoutItem={{ type: "Field" }}
      onDelete={() => {
        //remove(layout.layout, layoutItem.id);
      }}
      onChangeProps={(result) => {
        console.log(result);
      }}
      onChange={(response) => {
        console.log(response);
      }}
    ></DropTarget>
  </>
);
