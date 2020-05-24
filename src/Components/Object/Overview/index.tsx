import React, { useState, useEffect, useGlobal } from "reactn";
import {
  Dialog,
  DialogContent,
  Paper,
  TableContainer,
  IconButton,
  Menu,
  MenuItem,
  Drawer,
  Toolbar,
  Typography,
  Tooltip,
  TableCell,
  TableSortLabel,
} from "@material-ui/core";
import { ModelType } from "../../../Utils/Types";
import uniqid from "uniqid";
import Server from "../../../Utils/Server";
import Loading from "../../Loading";
import { IoIosAddCircleOutline, IoMdMore } from "react-icons/io";
import ViewObject from "../../Object/index";
import { useHistory } from "react-router-dom";
import FieldDisplay from "../FieldDisplay";
import { filter, size } from "lodash";
import { FaBomb, FaPencilRuler, FaEdit } from "react-icons/fa";
import OverviewFilter from "./Filter";
import { AutoSizer, Column, Table } from "react-virtualized";
import ReactVirtualizedTable from "./VirtualizedTable";

const stableSort = (array, comparator) => {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
};
const descendingComparator = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
};
const getComparator = (order, orderBy) => {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
};

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
  const [orderBy, setOrderBy] = useState();
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const history = useHistory();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [overviewFilter, setOverviewFilter] = useState([]);
  const [snackbar, setSnackbar] = useGlobal<any>("snackbar");
  const [fieldDisplayModelCache, setFieldDisplayModelCache] = useState({});

  const isSelected = (name) =>
    selected ? selected.indexOf(name) !== -1 : false;

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

      <TableContainer component={Paper}>
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
        <ReactVirtualizedTable
          data={objects}
          columns={layout.fields}
          model={model}
        />
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
