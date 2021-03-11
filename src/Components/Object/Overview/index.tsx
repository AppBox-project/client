import React, { useState, useEffect, useGlobal } from "reactn";
import {
  Dialog,
  DialogContent,
  TableContainer,
  IconButton,
  Menu,
  MenuItem,
  Drawer,
  Toolbar,
  Typography,
  Tooltip,
  Popover,
  List,
  ListItem,
  ListItemText,
  Button,
  ListItemIcon,
} from "@material-ui/core";
import { AppContextType, ModelType } from "../../../Utils/Types";
import uniqid from "uniqid";
import Server from "../../../Utils/Server";
import { IoIosAddCircleOutline } from "react-icons/io";
import ViewObject from "../../Object/index";
import { useHistory } from "react-router-dom";
import {
  FaBomb,
  FaFilter,
  FaCaretDown,
  FaStream,
  FaTimes,
  FaTrash,
} from "react-icons/fa";
import ReactVirtualizedTable from "./VirtualizedTable";
import RegularTable from "./Table";
import Skeleton from "./Skeleton";
import Card from "../../Design/Card";
import {
  AnimationContainer,
  AnimationItem,
} from "../../Apps/Apps/AppUI/Animations";
import ObjectOverviewFilter from "./Filter";
import { map, find, filter as filterLodash } from "lodash";
import RenderInterface from "../../RenderInterface";
import FaIcon from "../../Icons";

const Overview: React.FC<{
  layoutId?: string;
  modelId: string;
  context: AppContextType;
  baseUrl?: string;
  disableLists?: boolean;
  applyList?: string;
  alternativeTitle?: { single: string; plural: string };
}> = ({
  layoutId,
  modelId,
  context,
  baseUrl,
  disableLists,
  applyList,
  alternativeTitle,
}) => {
  const [model, setModel] = useState<ModelType>();
  const [layout, setLayout] = useState<any>();
  const [objects, setObjects] = useState<any>();
  const [dialogContent, setDialogContent] = useState<any>();
  const [anchorEl, setAnchorEl] = useState<any>();
  const [selected, setSelected] = useState<any>([]);
  const history = useHistory();
  const [drawerOpen, setDrawerOpen] = useState<any>(false);
  const [filter, setFilter] = useState<any>([]);
  const [snackbar, setSnackbar] = useGlobal<any>("snackbar");
  const [selectedList, setSelectedList] = useState<string>();
  const [listPopupElement, setListPopupElement] = useState<any>();

  // Lifecycle
  useEffect(() => {
    // -> Object types
    const requestId = uniqid();
    Server.emit("listenForObjectTypes", {
      requestId,
      filter: { key: modelId },
    });
    Server.on(`receive-${requestId}`, (response) => {
      setModel(response[0]);
      setLayout(response[0].overviews[layoutId ? layoutId : "default"]);
    });

    return () => {
      Server.emit("unlistenForObjectTypes", { requestId });
      setLayout(false);
    };
  }, [modelId]);

  // effect on filter change
  useEffect(() => {
    const objectFilter = {};
    filter.map((f) => {
      switch (f.operator) {
        case "equals":
          objectFilter[`data.${f.key}`] = f.value;
          break;
        case "not_equals":
          objectFilter[`data.${f.key}`] = { $ne: f.value };
          break;
        default:
          console.log(`Unknown operator ${f.operator}`);
          break;
      }
    });

    if (!(applyList || window.location.hash) || (selectedList && model)) {
      // Only continue if there is no applyList and no hash, OR a list already selected (prevents duplicate calls)
      ((selectedList && model?.lists[selectedList]?.filter) || []).map((f) => {
        switch (f.operator) {
          case "equals":
            objectFilter[`data.${f.key}`] = f.value;
            break;
          case "not_equals":
            objectFilter[`data.${f.key}`] = { $ne: f.value };
            break;
          default:
            console.log(`Unknown operator ${f.operator}`);
            break;
        }
      });
      // Objects
      const dataRequestId = uniqid();
      Server.emit("listenForObjects", {
        requestId: dataRequestId,
        type: modelId,
        filter: {
          ...objectFilter,
        },
      });
      Server.on(`receive-${dataRequestId}`, (response) => {
        if (response.success) {
          setObjects(response.data);
        } else {
          console.log(response);
        }
      });
      return () => {
        Server.emit("unlistenForObjects", { requestId: dataRequestId });
      };
    }
  }, [filter, selectedList, model]);

  // When the hash changes
  useEffect(() => {
    if (applyList) {
      setSelectedList(applyList);
    } else {
      setSelectedList(window.location.hash.substr(1));
    }
  }, [window.location.hash, applyList]);

  // UI
  if (!objects || !model || !layout)
    return (
      <AnimationContainer>
        <AnimationItem>
          <Skeleton />
        </AnimationItem>
      </AnimationContainer>
    );
  // Calculate heaviness. A heavy overview is virtualized.
  let heaviness = 1;
  layout.fields.map((field) => {
    if (
      model?.fields[field]?.type === "relationship" ||
      model?.fields[field]?.type === "relationship_m"
    ) {
      heaviness++;
    }
  });
  const heavynessScore = objects.length * heaviness;

  return (
    <>
      <Dialog
        open={dialogContent !== undefined}
        maxWidth="lg"
        fullWidth
        PaperComponent={Card}
        PaperProps={{
          title: `New ${(
            alternativeTitle?.single || model.name
          ).toLocaleLowerCase()}`,
          style: {
            margin: 0,
          },
        }}
        onClose={() => {
          setDialogContent(undefined);
        }}
        aria-labelledby="form-dialog-title"
      >
        <DialogContent
          style={{
            padding: 0,
            paddingTop: 8,
          }}
        >
          {dialogContent}
        </DialogContent>
      </Dialog>
      <AnimationContainer>
        <AnimationItem>
          <TableContainer
            component={CardWithMargin}
            style={{ height: "100%", width: "100%" }}
          >
            <Toolbar style={{ display: "flex" }}>
              {selected.length > 0 ? (
                <Typography
                  variant="subtitle1"
                  component="div"
                  style={{ flex: 1 }}
                >
                  <Tooltip title="Clear selection" placement="right">
                    <IconButton
                      onClick={() => {
                        setSelected([]);
                      }}
                    >
                      <FaTimes style={{ width: 18, height: 18 }} />
                    </IconButton>
                  </Tooltip>
                  {selected.length === objects.length ? "All" : selected.length}{" "}
                  {selected.length === 1
                    ? (alternativeTitle?.single || model.name).toLowerCase()
                    : (
                        alternativeTitle?.plural || model.name_plural
                      ).toLowerCase()}{" "}
                  selected
                </Typography>
              ) : (
                <div style={{ flex: 1 }}>
                  <Typography variant="h6" id="tableTitle" component="div">
                    {alternativeTitle?.plural || model.name_plural}
                  </Typography>
                  {model.lists && !disableLists && (
                    <>
                      <Typography
                        variant="subtitle2"
                        style={{ cursor: "pointer" }}
                        onClick={(event) => {
                          setListPopupElement(event.currentTarget);
                        }}
                      >
                        {selectedList
                          ? model.lists[selectedList].name
                          : `All ${model.name_plural}`}{" "}
                        <FaCaretDown />
                      </Typography>
                      <Popover
                        id="list-popover"
                        open={Boolean(listPopupElement)}
                        anchorEl={listPopupElement}
                        onClose={() => {
                          setListPopupElement(null);
                        }}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "left",
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "left",
                        }}
                      >
                        <List>
                          <ListItem
                            selected={!selectedList}
                            button
                            onClick={() => {
                              history.push(
                                `${baseUrl || `/explorer/${model.key}`}`
                              );
                              setListPopupElement(null);
                            }}
                          >
                            <ListItemText>All {model.name_plural}</ListItemText>
                          </ListItem>
                          {map(model.lists, (list, key) => (
                            <ListItem
                              selected={selectedList === key}
                              key={key}
                              button
                              onClick={() => {
                                history.push(
                                  `${
                                    baseUrl || `/explorer/${model.key}`
                                  }#${key}`
                                );
                                setListPopupElement(null);
                              }}
                            >
                              <ListItemText primary={list.name} />
                            </ListItem>
                          ))}
                        </List>
                      </Popover>
                    </>
                  )}
                </div>
              )}

              {selected.length > 0 ? (
                <Tooltip title="Apply to selection" placement="left">
                  <IconButton
                    style={{ float: "right" }}
                    onClick={(event) => {
                      setAnchorEl(event.currentTarget);
                    }}
                  >
                    <FaStream style={{ width: 18, height: 18 }} />
                  </IconButton>
                </Tooltip>
              ) : (
                <>
                  {(layout?.buttons?.global || []).map((buttonInfo) => {
                    if (model.actions[buttonInfo]) {
                      const button = model.actions[buttonInfo];
                      return button.type === "create" ? (
                        <Tooltip
                          title={
                            button?.label ||
                            `New ${(
                              alternativeTitle?.single || model.name
                            ).toLocaleLowerCase()}`
                          }
                          placement="left"
                        >
                          <IconButton
                            onClick={() => {
                              setDialogContent(
                                <ViewObject
                                  modelId={model.key}
                                  layoutId={button.layout}
                                  popup={true}
                                  context={context}
                                  appId={context.appId}
                                  onSuccess={() => {
                                    setDialogContent(undefined);
                                  }}
                                />
                              );
                            }}
                          >
                            <IoIosAddCircleOutline />
                          </IconButton>
                        </Tooltip>
                      ) : button.type === "interface" ? (
                        button.icon ? (
                          <Tooltip title={button.label} placement="left">
                            <IconButton
                              onClick={() =>
                                context.setDialog({
                                  display: true,
                                  title: button.label,
                                  content: (
                                    <RenderInterface
                                      context={context}
                                      interfaceId={button.interface}
                                    />
                                  ),
                                })
                              }
                            >
                              <FaIcon icon={button.icon} />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <Button
                            color="primary"
                            onClick={() =>
                              context.setDialog({
                                display: true,
                                title: button.label,
                                content: (
                                  <RenderInterface
                                    context={context}
                                    interfaceId={button.interface}
                                  />
                                ),
                              })
                            }
                          >
                            {button.label}
                          </Button>
                        )
                      ) : (
                        <>Unknown button type {button.type}</>
                      );
                    }
                  })}
                  <Tooltip title="Filter and tweak list" placement="left">
                    <IconButton
                      aria-label="filter list"
                      onClick={() => {
                        setDrawerOpen(true);
                      }}
                    >
                      <FaFilter style={{ width: 18, height: 18 }} />
                    </IconButton>
                  </Tooltip>
                </>
              )}
            </Toolbar>
            {heavynessScore > 500 ? (
              <ReactVirtualizedTable
                data={objects}
                columns={layout.fields}
                model={model}
                baseUrl={baseUrl || `/${context.appId}/${modelId}`}
                history={history}
                setSelected={setSelected}
                selected={selected}
                setAnchorEl={setAnchorEl}
              />
            ) : (
              <RegularTable
                data={objects}
                layout={layout}
                model={model}
                baseUrl={baseUrl || `/${context.appId}/${modelId}`}
                history={history}
                setSelected={setSelected}
                selected={selected}
                setAnchorEl={setAnchorEl}
              />
            )}
          </TableContainer>
        </AnimationItem>
      </AnimationContainer>

      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => {
          setAnchorEl(null);
          setSelected([]);
        }}
      >
        {selected.length === 1
          ? layout.buttons.single.map((singleButton) => {
              const action = (model.actions || {})[singleButton];
              return singleButton === "delete" ? (
                <MenuItem
                  onClick={() => {
                    setAnchorEl(null);
                    const requestId = uniqid();
                    Server.emit("deleteObject", {
                      objectId: selected[0],
                      requestId,
                    });
                    Server.on(`receive-${requestId}`, (response) => {
                      if (!response.success) {
                        setSnackbar({
                          display: true,
                          message: response.reason,
                          type: "error",
                          icon: <FaBomb />,
                          duration: 2500,
                          position: { horizontal: "right" },
                        });
                      }
                    });
                    setSelected([]);
                  }}
                >
                  <ListItemIcon style={{ minWidth: 32 }}>
                    <FaTrash />
                  </ListItemIcon>
                  Delete
                </MenuItem>
              ) : (
                <MenuItem
                  onClick={() => {
                    switch (action.type) {
                      case "interface":
                        setAnchorEl(undefined);
                        context.setDialog({
                          display: true,
                          title: action.label,
                          content: (
                            <RenderInterface
                              context={context}
                              interfaceId={action.interface}
                              premappedVariables={{
                                [action.passContextTo]: find(
                                  objects,
                                  (o) => o._id === selected[0]
                                ),
                              }}
                            />
                          ),
                        });
                        setSelected([]);
                        break;
                      default:
                        console.log(`Unknown action type ${action.type}`);
                        break;
                    }
                  }}
                >
                  <ListItemIcon style={{ minWidth: 32 }}>
                    <FaIcon icon={action.icon} />
                  </ListItemIcon>
                  {action.label}
                </MenuItem>
              );
            })
          : layout.buttons.multiple.map((multiButton) => {
              const action = (model.actions || {})[multiButton];
              return multiButton === "delete" ? (
                <MenuItem
                  onClick={() => {
                    setAnchorEl(null);
                    const requestId = uniqid();
                    Server.emit("deleteObjects", {
                      objectId: selected,
                      requestId,
                    });
                    Server.on(`receive-${requestId}`, (response) => {
                      if (!response.success) {
                        setSnackbar({
                          display: true,
                          message: response.reason,
                          type: "error",
                          icon: <FaBomb />,
                          duration: 2500,
                          position: { horizontal: "right" },
                        });
                      }
                    });
                    setSelected([]);
                  }}
                >
                  <ListItemIcon style={{ minWidth: 32 }}>
                    <FaTrash />
                  </ListItemIcon>
                  Delete
                </MenuItem>
              ) : (
                <MenuItem
                  onClick={() => {
                    switch (action.type) {
                      case "interface":
                        setAnchorEl(undefined);
                        context.setDialog({
                          display: true,
                          title: action.label,
                          content: (
                            <RenderInterface
                              context={context}
                              interfaceId={action.interface}
                              premappedVariables={{
                                [action.passContextTo]: filterLodash(
                                  objects,
                                  (o) => selected.includes(o._id)
                                ),
                              }}
                            />
                          ),
                        });
                        setSelected([]);
                        break;
                      default:
                        console.log(`Unknown action type ${action.type}`);
                        break;
                    }
                  }}
                >
                  <ListItemIcon style={{ minWidth: 32 }}>
                    <FaIcon icon={action.icon} />
                  </ListItemIcon>
                  {action.label}
                </MenuItem>
              );
            })}
      </Menu>
      <Drawer
        anchor="bottom"
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
        }}
        style={{ overflow: "auto" }}
      >
        <ObjectOverviewFilter
          context={context}
          model={model}
          modelId={modelId}
          onChange={(filter) => {
            setFilter([...filter]);
            setDrawerOpen(false);
          }}
        />
      </Drawer>
    </>
  );
};

const CardWithMargin: React.FC = ({ children }) => {
  return (
    <Card withBigMargin withoutPadding style={{ overflowX: "auto" }}>
      {children}
    </Card>
  );
};

export default Overview;
