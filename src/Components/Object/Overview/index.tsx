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
} from "@material-ui/core";
import { AppContextType, ModelType } from "../../../Utils/Types";
import uniqid from "uniqid";
import Server from "../../../Utils/Server";
import { IoIosAddCircleOutline } from "react-icons/io";
import ViewObject from "../../Object/index";
import { useHistory } from "react-router-dom";
import { FaBomb, FaFilter, FaEdit } from "react-icons/fa";
import ReactVirtualizedTable from "./VirtualizedTable";
import RegularTable from "./Table";
import Skeleton from "./Skeleton";
import Card from "../../Design/Card";
import {
  AnimationContainer,
  AnimationItem,
} from "../../Apps/Apps/AppUI/Animations";
import ObjectOverviewFilter from "./Filter";

const Overview: React.FC<{
  layoutId?: string;
  modelId: string;
  context: AppContextType;
  baseUrl?: string;
}> = ({ layoutId, modelId, context, baseUrl }) => {
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

    // Objects
    const dataRequestId = uniqid();
    Server.emit("listenForObjects", {
      requestId: dataRequestId,
      type: modelId,
      filter: { ...objectFilter },
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
  }, [filter]);

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
      model.fields[field].type === "relationship" ||
      model.fields[field].type === "relationship_m"
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
        onClose={() => {
          setDialogContent(undefined);
        }}
        aria-labelledby="form-dialog-title"
      >
        <DialogContent>{dialogContent}</DialogContent>
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
                  {selected.length === objects.length ? "All" : selected.length}{" "}
                  {selected.length === 1
                    ? model.name.toLowerCase()
                    : model.name_plural.toLowerCase()}{" "}
                  selected
                </Typography>
              ) : (
                <Typography
                  variant="h6"
                  id="tableTitle"
                  component="div"
                  style={{ flex: 1 }}
                >
                  {model.name_plural}
                </Typography>
              )}

              {selected.length > 0 ? (
                <Tooltip title="Apply to selection" placement="left">
                  <IconButton
                    style={{ float: "right" }}
                    onClick={(event) => {
                      setAnchorEl(event.currentTarget);
                    }}
                  >
                    <FaEdit style={{ width: 18, height: 18 }} />
                  </IconButton>
                </Tooltip>
              ) : (
                <>
                  {layout.buttons.map((buttonInfo) => {
                    if (model.actions[buttonInfo]) {
                      const button = model.actions[buttonInfo];
                      return (
                        <Tooltip
                          title={
                            button.label ? button.label : `New ${model.name}`
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
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            selected.map((deleteId) => {
              const requestId = uniqid();
              Server.emit("deleteObject", { objectId: deleteId, requestId });
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
            });
            setSelected([]);
          }}
        >
          Delete
        </MenuItem>
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
    <Card withBigMargin style={{ overflowX: "auto" }}>
      {children}
    </Card>
  );
};

export default Overview;
