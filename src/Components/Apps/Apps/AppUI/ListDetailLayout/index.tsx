import React, { useGlobal, useEffect } from "reactn";
import {
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListSubheader,
  ListItemSecondaryAction,
  IconButton,
  Typography,
} from "@material-ui/core";
import { Link, Route } from "react-router-dom";
import { AnimationContainer, AnimationItem } from "../Animations";
import {
  AppContextType,
  TreeViewDataItem,
  ColumnWidth,
} from "../../../../../Utils/Types";
import { FaPlus, FaTrash, FaAngleLeft } from "react-icons/fa";
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
  navFixedIcon?: JSX.Element;
  title?;
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
}) => {
  // Vars
  const selectedItem = window.location.href.split(`${baseUrl}/`)[1];
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
    <Grid container style={{ height: "100%" }}>
      {(!selectedItem || !isMobile) && (
        <Grid item xs={12} md={navigationWidth} style={{ height: "100%" }}>
          {customNavComponent ? (
            customNavComponent
          ) : mode === "tree" ? (
            <TreeViewUI items={treeList} linkTo={baseUrl} />
          ) : (
            <>
              <ListNav
                addFunction={addFunction}
                deleteFunction={deleteFunction}
                baseUrl={baseUrl}
                selectedItem={selectedItem}
                list={list}
                navFixedIcon={navFixedIcon}
                title={title}
              />
            </>
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
}> = ({
  addFunction,
  deleteFunction,
  baseUrl,
  selectedItem,
  list,
  navFixedIcon,
  title,
}) => {
  return (
    <div className={styles.root}>
      <List>
        <AnimationContainer>
          <AnimationItem>
            <Typography
              variant="h6"
              color="primary"
              style={{ textAlign: "center" }}
              gutterBottom
            >
              {title}
            </Typography>
          </AnimationItem>
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
                      <ListSubheader color="primary" style={{ marginTop: 10 }}>
                        <Typography variant="h6">{listItem.label}</Typography>
                      </ListSubheader>
                    </Link>
                    {listItem.subItems.map((subItem) => {
                      return (
                        <Link to={`${baseUrl}/${subItem.id}`} key={subItem.id}>
                          <ListItem
                            button
                            selected={selectedItem === subItem.id}
                          >
                            {navFixedIcon && (
                              <ListItemIcon>{navFixedIcon}</ListItemIcon>
                            )}
                            <ListItemText
                              color={
                                selectedItem === listItem.id
                                  ? "primary"
                                  : "inherit"
                              }
                            >
                              {subItem.label}
                            </ListItemText>
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
                      {navFixedIcon && (
                        <ListItemIcon>{navFixedIcon}</ListItemIcon>
                      )}
                      <ListItemText
                        color={
                          selectedItem === listItem.id ? "primary" : "inherit"
                        }
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
