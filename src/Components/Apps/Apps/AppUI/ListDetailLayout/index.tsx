import React, { useGlobal, useEffect } from "reactn";
import {
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Divider,
} from "@material-ui/core";
import { Link, Route } from "react-router-dom";
import { AnimationContainer, AnimationItem } from "../Animations";
import {
  AppContextType,
  TreeViewDataItem,
  ColumnWidth,
} from "../../../../../Utils/Types";
import { FaTrash, FaAngleLeft } from "react-icons/fa";
import { GrAdd } from "react-icons/gr";
import TreeViewUI from "../TreeView";
import styles from "./styles.module.scss";
import ListDetailLayoutSkeleton from "./LoadingSkeleton";
import { CSSProperties } from "@material-ui/core/styles/withStyles";

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
  addTitle?: string;
  deleteFunction?: (id) => void;
  navWidth?: ColumnWidth;
  navFixedIcon?: JSX.Element;
  title?;
  isLoading?: true | boolean;
  style?: CSSProperties;
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
  navFixedIcon,
  title,
  isLoading,
  addTitle,
  style,
}) => {
  // Vars
  let selectedItem = window.location.href.split(`${baseUrl}/`)[1];
  if ((selectedItem || "").match("/"))
    selectedItem = selectedItem.split("/")[0];

  const [isMobile] = useGlobal<any>("isMobile");
  const navigationWidth = navWidth ? navWidth : 3;
  //@ts-ignore
  const detailWidth: ColumnWidth = 12 - navigationWidth;
  const [navBar, setNavBar] = useGlobal<any>("navBar");
  const [defaultButton] = useGlobal<any>("defaultButton");

  // Lifecycle
  useEffect(() => {
    if (isMobile && window.location.href.match(baseUrl + "/")) {
      setNavBar({
        ...navBar,
        backButton: {
          ...navBar.backButton,
          icon: <FaAngleLeft />,
          url: baseUrl,
          function: undefined,
        },
      });
    }

    return () => {
      setNavBar({
        ...navBar,
        backButton: {
          ...defaultButton,
        },
        title: undefined,
      });
    };
  }, [window.location.href]);

  // UI

  return (
    <Grid container style={{ ...style, height: "100%" }}>
      {(!selectedItem || !isMobile) && (
        <Grid item xs={12} md={navigationWidth} style={{ height: "100%" }}>
          {!isLoading ? (
            customNavComponent ? (
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
                navFixedIcon={navFixedIcon}
                title={title}
                addTitle={addTitle}
              />
            )
          ) : (
            <ListDetailLayoutSkeleton title={title} />
          )}
        </Grid>
      )}
      {selectedItem && (
        <Grid item xs={12} md={detailWidth} style={{ height: "100%" }}>
          <Route
            path={`${baseUrl}/:detailId`}
            render={(props) => {
              return (
                <div style={{ overflowX: "auto", height: "100%" }}>
                  <DetailComponent
                    {...props}
                    {...detailComponentProps}
                    context={context}
                  />
                </div>
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
  navFixedIcon?;
  title?;
  addTitle?;
}> = ({
  addFunction,
  deleteFunction,
  baseUrl,
  selectedItem,
  list,
  navFixedIcon,
  title,
  addTitle,
}) => {
  return (
    <AnimationContainer>
      <AnimationItem>
        <div className={styles.root}>
          <List>
            {title && (
              <>
                <Typography
                  variant="h6"
                  color="primary"
                  style={{ textAlign: "center", margin: 13, cursor: "default" }}
                  gutterBottom
                >
                  {title}
                </Typography>
                <Divider />
              </>
            )}

            {addFunction && (
              <ListItem divider button onClick={addFunction}>
                <ListItemIcon style={{ minWidth: 25 }}>
                  <GrAdd style={{ width: 15, height: 15 }} />
                </ListItemIcon>

                <ListItemText>{addTitle || "Add new"}</ListItemText>
              </ListItem>
            )}
            {list.map((listItem) => {
              return (
                <ListItemObject
                  baseUrl={baseUrl}
                  listItem={listItem}
                  selectedItem={selectedItem}
                  navFixedIcon={navFixedIcon}
                  deleteFunction={deleteFunction}
                  key={listItem.id}
                  nestedLevel={0}
                />
              );
            })}
          </List>
        </div>
      </AnimationItem>
    </AnimationContainer>
  );
};

const ListItemObject: React.FC<{
  baseUrl;
  listItem;
  selectedItem;
  navFixedIcon;
  deleteFunction;
  key?;
  nestedLevel: number;
}> = ({
  baseUrl,
  listItem,
  selectedItem,
  navFixedIcon,
  deleteFunction,
  nestedLevel,
}) => (
  <Link to={`${baseUrl}/${listItem.id}`}>
    <ListItem button selected={selectedItem === listItem.id}>
      {navFixedIcon && <ListItemIcon>{navFixedIcon}</ListItemIcon>}
      {listItem.icon && (
        <ListItemIcon>
          <listItem.icon />
        </ListItemIcon>
      )}
      <ListItemText
        style={{
          paddingLeft: 15 * nestedLevel,
        }}
        color={selectedItem === listItem.id ? "primary" : "inherit"}
      >
        {listItem.label}
      </ListItemText>
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
    {listItem.subItems && (
      <List style={{ margin: 0, padding: 0 }}>
        {listItem.subItems.map((item) => (
          <ListItemObject
            baseUrl={baseUrl}
            listItem={item}
            selectedItem={selectedItem}
            navFixedIcon={navFixedIcon}
            deleteFunction={deleteFunction}
            key={item.id}
            nestedLevel={nestedLevel + 1}
          />
        ))}
      </List>
    )}
  </Link>
);
