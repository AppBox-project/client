import {
  Button,
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { FaCaretDown, FaCaretUp, FaPlus } from "react-icons/fa";
import FaIcon from "../../../Components/Icons";

import {
  AppContextType,
  AppType,
  ValueListItemType,
} from "../../../Utils/Types";

const AppsDetailActions: React.FC<{
  app: AppType;
  context: AppContextType;
}> = ({ app, context }) => {
  // Vars
  const [items, setItems] = useState([]);
  const [originalItems, setOriginalItems] = useState<string>();
  const [interfaceList, setInterfaceList] = useState<ValueListItemType[]>([]);

  // Lifecycle
  useEffect(() => {
    const newItems = [];
    app.data.collection_data.actions.map((item) =>
      newItems.push({ label: item.label, id: item.key, icon: item.icon, item })
    );
    setItems(newItems);
    setOriginalItems(JSON.stringify(newItems));
    const interfaceRequest = context.getObjects(
      "interfaces",
      {},
      (response) => {
        const nl: ValueListItemType[] = [];
        response.data.map((i) => nl.push({ label: i.data.name, value: i._id }));
        setInterfaceList(nl);
      }
    );

    return () => interfaceRequest.stop();
  }, [app]);

  // UI

  return (
    <context.UI.Animations.Animation>
      <context.UI.Design.Card withBigMargin title="Actions">
        <List>
          <context.UI.Layouts.SortableList
            items={items}
            onChange={(newItems) => {
              setItems(newItems);
            }}
            renderItem={(item, index) => (
              <SortableItem
                item={item}
                context={context}
                interfaceList={interfaceList}
                key={item.key}
                onChange={(newItem) => {
                  const newItems = items;
                  newItems[index] = newItem;
                  setItems([...newItems]);
                }}
              />
            )}
          />
          <ListItem
            button
            onClick={() => {
              setItems([
                ...items,
                {
                  label: "New action",
                  id: "new",
                  icon: "FaKiwiBird",
                  item: {
                    label: "New action",
                    key: "new",
                    icon: "FaKiwiBird",
                    page: { type: "model", model: "users" },
                  },
                },
              ]);
            }}
          >
            <ListItemIcon>
              <FaPlus />
            </ListItemIcon>
            <ListItemText>Add</ListItemText>
          </ListItem>
        </List>
        {originalItems !== JSON.stringify(items) && (
          <Button
            fullWidth
            color="primary"
            onClick={() => {
              const newApp = app;
              const newActions = [];
              items.map((item) => newActions.push(item.item));
              newApp.data.collection_data.actions = newActions;
              context.updateObject("apps", newApp.data, newApp._id);
            }}
            variant="contained"
          >
            Save
          </Button>
        )}
      </context.UI.Design.Card>
    </context.UI.Animations.Animation>
  );
};

export default AppsDetailActions;

const SortableItem: React.FC<{
  item;
  context: AppContextType;
  onChange: (newItem) => void;
  interfaceList: ValueListItemType[];
}> = ({ item, context, onChange, interfaceList }) => {
  // Vars
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Lifecycle

  // UI
  return (
    <>
      <ListItem>
        <ListItemIcon>
          <FaIcon icon={item.icon} />
        </ListItemIcon>
        <ListItemText>{item.label}</ListItemText>
        <ListItemSecondaryAction onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? <FaCaretUp /> : <FaCaretDown />}
        </ListItemSecondaryAction>
      </ListItem>
      <Collapse
        in={isExpanded}
        timeout="auto"
        unmountOnExit
        style={{ marginLeft: 24 }}
      >
        <context.UI.Inputs.TextInput
          label="Key"
          value={item.item.key}
          onChange={(newValue) => {
            const newItem = item;
            item.item.key = newValue;
            item.id = newValue;
            onChange(newItem);
          }}
        />
        <context.UI.Inputs.TextInput
          label="Label"
          value={item.item.label}
          onChange={(newValue) => {
            const newItem = item;
            item.item.label = newValue;
            item.label = newValue;
            onChange(newItem);
          }}
        />
        <context.UI.Inputs.TextInput
          label="Icon"
          value={item.item.icon}
          onChange={(newValue) => {
            const newItem = item;
            item.item.icon = newValue;
            item.icon = newValue;
            onChange(newItem);
          }}
        />
        <context.UI.Inputs.Select
          value={item.item.page.type}
          label="Type"
          options={[
            { label: "Model", value: "model" },
            { label: "Custom interface", value: "interface" },
          ]}
          onChange={(newType) => {
            const newItem = item;
            newItem.item.page.type = newType;
            onChange(newItem);
          }}
        />
        {item.item.page.type === "model" && (
          <context.UI.Inputs.TextInput
            label="Model"
            value={item.item.page.model}
            onChange={(newValue) => {
              const newItem = item;
              newItem.item.page.model = newValue;
              onChange(newItem);
            }}
          />
        )}
        {item.item.page.type === "interface" && (
          <context.UI.Inputs.Select
            label="Interface to render"
            value={item.item.page.interface}
            options={interfaceList}
            onChange={(newValue) => {
              const newItem = item;
              newItem.item.page.interface = newValue;
              onChange(newItem);
            }}
          />
        )}
      </Collapse>
    </>
  );
};
