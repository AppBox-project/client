import React, { useState, useGlobal } from "reactn";
import {
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@material-ui/core";
import { Link, Route } from "react-router-dom";
import { AnimationContainer, AnimationItem } from "../Animations";
import {
  AppContextType,
  TreeViewDataItem,
  ColumnWidth,
} from "../../../../../Utils/Types";
import ActionBar from "../../../../ActionBar";
import { FaPlus } from "react-icons/fa";
import TreeViewUI from "../TreeView";
import styles from "./styles.module.scss";

/*
 * This UI element provides a lay-out that consists of a list of items and a detail component.
 * On desktop these will be displayed next to one another. On mobile only one of the two will show up.
 */

const ListDetailLayout: React.FC<{
  mode?: "normal" | "tree";
  list?: { label: string; id: string; url?: string }[];
  treeList?: TreeViewDataItem[];
  baseUrl: string;
  customNavComponent?;
  DetailComponent: React.FC;
  detailComponentProps?: {};
  context: AppContextType;
  addFunction?: () => void;
  navWidth?: ColumnWidth;
}> = ({
  list,
  customNavComponent,
  baseUrl,
  DetailComponent,
  detailComponentProps,
  context,
  addFunction,
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

const ListNav: React.FC<{ addFunction; baseUrl; selectedItem; list }> = ({
  addFunction,
  baseUrl,
  selectedItem,
  list,
}) => {
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
            return listItem.url ? (
              <AnimationItem key={listItem.id}>
                <Link to={`${baseUrl}/${listItem.url}`}>
                  <ListItem button selected={selectedItem === listItem.id}>
                    <ListItemText>{listItem.label}</ListItemText>
                  </ListItem>
                </Link>
              </AnimationItem>
            ) : (
              <ListItem button>
                <ListItemText>{listItem.label}</ListItemText>
              </ListItem>
            );
          })}
        </AnimationContainer>
      </List>
    </div>
  );
};
