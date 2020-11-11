import React from "react";
import {
  Typography,
  List,
  ListItem,
  ListSubheader,
  ListItemText,
  ListItemSecondaryAction,
  ListItemIcon,
  IconButton,
  Divider,
  Grid,
} from "@material-ui/core";
import { AppContextType, ModelType } from "../../../../../../Utils/Types";
import uniqid from "uniqid";
import { MdBorderTop, MdBorderClear, MdDeleteForever } from "react-icons/md";
import { BsChevronBarContract, BsChevronBarExpand } from "react-icons/bs";
import { map, pickBy } from "lodash";
import { FaPlus, FaCaretUp, FaCaretDown } from "react-icons/fa";

const AppObjectLayoutFieldGridEditor: React.FC<{
  value: {
    id: string;
    name: string;
    columns: 1 | 2 | 3 | 4;
    items: string[];
    showTitle: boolean;
    defaultExpanded: boolean;
  }[];
  onChange: (value) => void;
  context: AppContextType;
  model: ModelType;
}> = ({ value, onChange, context, model }) => {
  // Vars
  const itemList = [];
  const selectedFields = [];
  value.map((val) => selectedFields.push(...(val.items || [])));

  map(
    pickBy(model.fields, (value, key) => !selectedFields.includes(key)),
    (field, key) => {
      itemList.push({ label: field.name, value: key });
    }
  );
  // Lifecycle
  // UI
  return (
    <context.UI.Design.Card title="Layout" withBigMargin>
      <Divider />
      <List>
        {value.map((group, index) => (
          <>
            <ListSubheader key={group.id}>
              <ListItemIcon>
                <IconButton
                  onClick={() => {
                    const newGroups = value;
                    newGroups.splice(index, 1);
                    onChange(newGroups);
                  }}
                >
                  <MdDeleteForever style={{ width: 18, height: 18 }} />
                </IconButton>
              </ListItemIcon>
              <context.UI.Inputs.TextInput
                style={{ display: "inline", width: "80%" }}
                value={group.name}
                onChange={(newValue) => {
                  const newGroups = value;
                  newGroups[index].name = newValue;
                  onChange(newGroups);
                }}
              />
              <ListItemSecondaryAction>
                <IconButton
                  onClick={() => {
                    const newGroups = value;
                    newGroups[index].columns++;
                    if (newGroups[index].columns > 4)
                      newGroups[index].columns = 1;
                    onChange(newGroups);
                  }}
                >
                  <Typography variant="body2">{group.columns}</Typography>
                </IconButton>
                <IconButton
                  onClick={() => {
                    const newGroups = value;
                    newGroups[index].showTitle = !group.showTitle;
                    onChange(newGroups);
                  }}
                >
                  {group.showTitle ? <MdBorderTop /> : <MdBorderClear />}
                </IconButton>
                <IconButton
                  onClick={() => {
                    const newGroups = value;
                    newGroups[index].defaultExpanded = !group.defaultExpanded;
                    onChange(newGroups);
                  }}
                >
                  {group.defaultExpanded ? (
                    <BsChevronBarExpand />
                  ) : (
                    <BsChevronBarContract />
                  )}
                </IconButton>
              </ListItemSecondaryAction>
            </ListSubheader>
            <Grid container spacing={1} style={{ margin: 10 }}>
              {(group.items || []).map((item, itemIndex) => (
                <Grid
                  item
                  //@ts-ignore
                  xs={12 / group.columns}
                  key={item}
                >
                  <div
                    style={{
                      boxSizing: "border-box",
                      border: "1px solid #efefef",
                      borderRadius: 5,
                      overflow: "hidden",
                      padding: 10,
                      textAlign: "center",
                    }}
                  >
                    <span style={{ float: "right" }}>
                      <IconButton
                        disabled={itemIndex === 0}
                        style={{ padding: 3 }}
                        onClick={() => {
                          const newValue = value;
                          let cutOut = newValue[index].items.splice(
                            itemIndex,
                            1
                          )[0];
                          newValue[index].items.splice(
                            itemIndex - 1,
                            0,
                            cutOut
                          );
                          console.log(newValue);

                          onChange(newValue);
                        }}
                      >
                        <FaCaretUp />
                      </IconButton>
                      <IconButton
                        disabled={itemIndex === group.items.length - 1}
                        style={{ padding: 3 }}
                        onClick={() => {
                          const newValue = value;
                          let cutOut = newValue[index].items.splice(
                            itemIndex,
                            1
                          )[0]; // cut the element at index 'from'
                          newValue[index].items.splice(
                            itemIndex + 1,
                            0,
                            cutOut
                          ); // insert it at index 'to'
                          onChange(newValue);
                        }}
                      >
                        <FaCaretDown />
                      </IconButton>
                      <IconButton
                        style={{ padding: 3 }}
                        onClick={() => {
                          const newValue = value;
                          newValue[index].items.splice(itemIndex, 1);
                          onChange(newValue);
                        }}
                      >
                        <MdDeleteForever />
                      </IconButton>
                    </span>
                    {model.fields[item].name}
                  </div>
                </Grid>
              ))}
            </Grid>
            {itemList.length > 0 && (
              <ListItem>
                <ListItemIcon>
                  <FaPlus />
                </ListItemIcon>
                <context.UI.Inputs.Select
                  label="Add field"
                  options={itemList}
                  onChange={(selected) => {
                    const newGroups = value;
                    if (!newGroups[index].items) newGroups[index].items = [];
                    newGroups[index].items.push(selected);
                    onChange(newGroups);
                  }}
                />
              </ListItem>
            )}
            <Divider />
          </>
        ))}
        <ListItem
          button
          onClick={() => {
            onChange([
              ...value,
              {
                id: uniqid(),
                name: "New group",
                columns: 2,
                showTitle: true,
                defaultExpanded: true,
              },
            ]);
          }}
        >
          <ListItemText>Add group</ListItemText>
        </ListItem>
      </List>
    </context.UI.Design.Card>
  );
};

export default AppObjectLayoutFieldGridEditor;
