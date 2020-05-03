import React, { useGlobal } from "reactn";
import {
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListSubheader,
  ListItemSecondaryAction,
  IconButton,
} from "@material-ui/core";
import { Link, Route } from "react-router-dom";
import { AnimationContainer, AnimationItem } from "../Animations";
import {
  AppContextType,
  TreeViewDataItem,
  ColumnWidth,
} from "../../../../../Utils/Types";
import ActionBar from "../../../../ActionBar";
import { FaPlus, FaTrash } from "react-icons/fa";
import TreeViewUI from "../TreeView";
import styles from "./styles.module.scss";

/*
 * This UI element provides a lay-out that consists of a list of items and a detail component.
 * On desktop these will be displayed next to one another. On mobile only one of the two will show up.
 */
interface ListItem {
  label: string;
  id: string;
  subItems?: ListItem[];
}

const ListDetailLayout: React.FC<{
  mode?: "normal" | "tree";
  list?: ListItem[];
  treeList?: TreeViewDataItem[];
  baseUrl: string;
  customNavComponent?;
  DetailComponent: React.FC;
  detailComponentProps?: {};
  context: AppContextType;
  addFunction?: () => void;
  deleteFunction?: (id) => void;
  navWidth?: ColumnWidth;
}> = ({
  list,
  customNavComponent,
  baseUrl,
  DetailComponent,
  detailComponentProps,
  context,
  addFunction,
  deleteFunction,
  mode,
  treeList,
  navWidth,
}) => {
  // Vars
  const selectedItem = window.location.href.split(`${baseUrl}/`)[1];
  const [isMobile] = useGlobal<any>("isMobile");
  const navigationWidth = navWidth ? navWidth : 3;
  //@ts-ignore
  const detailWidth: ColumnWidth = 12 - navigationWidth;

  // Lifecycle
  // UI
  return (
    <Grid container>
      {(!selectedItem || !isMobile) && (
        <Grid item xs={12} md={navigationWidth}>
          {customNavComponent ? (
            customNavComponent
          ) : mode === "tree" ? (
            <TreeViewUI items={treeList} linkTo={baseUrl} />
          ) : (
            <ListNav
              addFunction={addFunction}
              deleteFunction={deleteFunction}
              baseUrl={baseUrl}
              selectedItem={selectedItem}
              list={list}
            />
          )}
        </Grid>
      )}
      {selectedItem && (
        <Grid item xs={12} md={detailWidth} style={{ padding: 15 }}>
          <Route
            path={`${baseUrl}/:detailId`}
            render={(props) => {
              return (
                <>
                  {isMobile && <ActionBar backUrl={baseUrl} />}
                  <DetailComponent
                    {...props}
                    {...detailComponentProps}
                    context={context}
                  />
                </>
              );
            }}
          />
        </Grid>
      )}
    </Grid>
  );
};

export default ListDetailLayout;

const ListNav: React.FC<{
  addFunction;
  deleteFunction;
  baseUrl;
  selectedItem;
  list;
}> = ({ addFunction, deleteFunction, baseUrl, selectedItem, list }) => {
  return (
    <div className={styles.root}>
      <List>
        <AnimationContainer>
          {addFunction && (
            <AnimationItem>
              <ListItem button onClick={addFunction}>
                <ListItemIcon>
                  <FaPlus />
                </ListItemIcon>
                <ListItemText>Add new</ListItemText>
              </ListItem>
            </AnimationItem>
          )}
          {list.map((listItem) => {
            return (
              <AnimationItem key={listItem.id}>
                {listItem.subItems ? (
                  <>
                    <Link to={`${baseUrl}/${listItem.id}`}>
                      <ListSubheader>{listItem.label}</ListSubheader>
                    </Link>
                    {listItem.subItems.map((subItem) => {
                      return (
                        <Link to={`${baseUrl}/${subItem.id}`} key={subItem.id}>
                          <ListItem
                            button
                            selected={selectedItem === subItem.id}
                          >
                            <ListItemText>{subItem.label}</ListItemText>
                            {deleteFunction && (
                              <ListItemSecondaryAction>
                                <IconButton
                                  onClick={() => {
                                    deleteFunction(subItem.id);
                                  }}
                                  color="primary"
                                >
                                  <FaTrash style={{ width: 18, height: 18 }} />
                                </IconButton>
                              </ListItemSecondaryAction>
                            )}
                          </ListItem>
                        </Link>
                      );
                    })}
                  </>
                ) : (
                  <Link to={`${baseUrl}/${listItem.id}`}>
                    <ListItem button selected={selectedItem === listItem.id}>
                      <ListItemText>{listItem.label}</ListItemText>
                      {deleteFunction && (
                        <ListItemSecondaryAction>
                          <IconButton
                            onClick={() => {
                              deleteFunction(listItem.id);
                            }}
                            color="primary"
                          >
                            <FaTrash style={{ width: 18, height: 18 }} />
                          </IconButton>
                        </ListItemSecondaryAction>
                      )}
                    </ListItem>
                  </Link>
                )}
              </AnimationItem>
            );
          })}
        </AnimationContainer>
      </List>
    </div>
  );
};
