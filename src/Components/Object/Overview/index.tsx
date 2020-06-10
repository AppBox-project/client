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
import { ModelType } from "../../../Utils/Types";
import uniqid from "uniqid";
import Server from "../../../Utils/Server";
import Loading from "../../Loading";
import { IoIosAddCircleOutline } from "react-icons/io";
import ViewObject from "../../Object/index";
import { useHistory } from "react-router-dom";
import { FaBomb, FaPencilRuler, FaEdit } from "react-icons/fa";
import OverviewFilter from "./Filter";
import ReactVirtualizedTable from "./VirtualizedTable";
import RegularTable from "./Table";

const Overview: React.FC<{
  layoutId?: string;
  objectTypeId: string;
  appId: string;
}> = ({ layoutId, objectTypeId, appId }) => {
  const [model, setModel] = useState<ModelType>();
  const [layout, setLayout] = useState();
  const [objects, setObjects] = useState();
  const [dialogContent, setDialogContent] = useState<any>();
  const [anchorEl, setAnchorEl] = useState<any>();
  const [selected, setSelected] = useState([]);
  const history = useHistory();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [overviewFilter, setOverviewFilter] = useState([]);
  const [snackbar, setSnackbar] = useGlobal<any>("snackbar");

  // Lifecycle
  useEffect(() => {
    // -> Object types
    const requestId = uniqid();
    Server.emit("listenForObjectTypes", {
      requestId,
      filter: { key: objectTypeId },
    });
    Server.on(`receive-${requestId}`, (response) => {
      setModel(response[0]);
      setLayout(response[0].overviews[layoutId ? layoutId : "default"]);
    });

    return () => {
      Server.emit("unlistenForObjectTypes", { requestId });
      setLayout(false);
    };
  }, [objectTypeId]);

  // effect on filter change
  useEffect(() => {
    const objectFilter = {};
    overviewFilter.map((f) => {
      objectFilter[`data.${f.field.value}`] = f.value;
    });

    // Objects
    const dataRequestId = uniqid();
    Server.emit("listenForObjects", {
      requestId: dataRequestId,
      type: objectTypeId,
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
  }, [overviewFilter]);

  // UI
  if (!objects || !model || !layout) return <Loading />;
  // Calculate heaviness. A heavy overview is virtualized.
  let heavyness = 1;
  layout.fields.map((field) => {
    if (
      model.fields[field].type === "relationship" ||
      model.fields[field].type === "relationship_m"
    ) {
      heavyness++;
    }
  });
  const heavynessScore = objects.length * heavyness;

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

      <TableContainer component="div" style={{ height: "100%", width: "100%" }}>
        <Toolbar style={{ display: "flex" }}>
          {selected.length > 0 ? (
            <Typography variant="subtitle1" component="div" style={{ flex: 1 }}>
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
                      title={button.label ? button.label : `New ${model.name}`}
                      placement="left"
                    >
                      <IconButton
                        onClick={() => {
                          setDialogContent(
                            <ViewObject
                              objectTypeId={model.key}
                              layoutId={button.layout}
                              popup={true}
                              appId={appId}
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
                  <FaPencilRuler style={{ width: 18, height: 18 }} />
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
            baseUrl={`/${appId}/${objectTypeId}`}
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
            baseUrl={`/${appId}/${objectTypeId}`}
            history={history}
            setSelected={setSelected}
            selected={selected}
            setAnchorEl={setAnchorEl}
          />
        )}
      </TableContainer>

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
      >
        <OverviewFilter
          model={model}
          onSave={(response) => {
            setOverviewFilter(response);
            setDrawerOpen(false);
          }}
        />
      </Drawer>
    </>
  );
};

export default Overview;
