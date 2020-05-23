import React, { useState, useEffect, useGlobal } from "reactn";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Grid,
  Button,
  Dialog,
  DialogContent,
  Paper,
  Checkbox,
  TableSortLabel,
  TableContainer,
  IconButton,
  Menu,
  MenuItem,
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
  const [dialogContent, setDialogContent] = useState();
  const [anchorEl, setAnchorEl] = useState<any>();
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState();
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const history = useHistory();
  const [actions, setActions] = useGlobal<any>("actions");

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

    // Objects
    const dataRequestId = uniqid();
    Server.emit("listenForObjects", {
      requestId: dataRequestId,
      type: objectTypeId,
      filter: {},
    });
    Server.on(`receive-${dataRequestId}`, (response) => {
      if (response.success) {
        setObjects(response.data);
      } else {
        console.log(response);
      }
    });
    return () => {
      Server.emit("unlistenForObjectTypes", { requestId });
      Server.emit("unlistenForObjects", { requestId: dataRequestId });
      setLayout(false);
    };
  }, [objectTypeId]);

  // Filter buttons
  useEffect(() => {
    setActions({
      ...actions,
      objectFilter: { label: "test" },
    });

    return () => {
      setActions({ ...actions, objectFilter: undefined });
    };
  }, []);

  // UI
  if (!objects || !model || !layout) return <Loading />;

  return (
    <>
      {layout.buttons && (
        <>
          <Grid
            container
            direction="row"
            justify="flex-end"
            alignItems="center"
          >
            <Grid item xs={12} md={3} style={{ textAlign: "right", margin: 5 }}>
              {layout.buttons.map((buttonInfo) => {
                if (model.actions) {
                  if (model.actions[buttonInfo]) {
                    const button = model.actions[buttonInfo];
                    return (
                      <Button
                        key={buttonInfo}
                        variant="outlined"
                        fullWidth
                        onClick={() => {
                          setDialogContent(
                            <ViewObject
                              objectTypeId={model.key}
                              layoutId={button.layout}
                              appId={appId}
                              onSuccess={() => {
                                setDialogContent(undefined);
                              }}
                            />
                          );
                        }}
                        startIcon={
                          button.type === "create" && <IoIosAddCircleOutline />
                        }
                      >
                        {button.label ? button.label : `New ${model.name}`}
                      </Button>
                    );
                  }
                }
              })}
            </Grid>
          </Grid>
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
        </>
      )}
      <Paper className="paper">
        <TableContainer>
          <Table aria-labelledby="tableTitle" aria-label="Object overview">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    inputProps={{ "aria-label": "Select all" }}
                    onChange={(event) => {
                      if (event.target.checked) {
                        const newSelecteds = objects.map((n) => n._id);
                        setSelected(newSelecteds);
                        return;
                      }
                      setSelected([]);
                    }}
                    checked={
                      size(objects) > 0 && selected.length === size(objects)
                    }
                    indeterminate={
                      selected.length > 0 && selected.length < size(objects)
                    }
                  />
                </TableCell>
                {layout.fields.map((field) => (
                  <TableCell key={field}>
                    <TableSortLabel
                      active={orderBy === field}
                      direction={orderBy === field ? order : "asc"}
                    >
                      {model.fields[field].name}
                    </TableSortLabel>
                  </TableCell>
                ))}
                {layout.actions && layout.actions.length > 0 && (
                  <TableCell>
                    <div style={{ float: "right" }}>
                      <IconButton
                        onClick={(event) => {
                          setAnchorEl(event.currentTarget);
                        }}
                      >
                        <IoMdMore />
                      </IconButton>
                    </div>{" "}
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {stableSort(objects, getComparator(order, orderBy)).map(
                (object, index) => {
                  const isItemSelected = isSelected(object._id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={object._id}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          onChange={() => {
                            if (selected.includes(object._id)) {
                              setSelected(
                                filter(selected, (o) => {
                                  return o !== object._id;
                                })
                              );
                            } else {
                              setSelected([...selected, object._id]);
                            }
                          }}
                          inputProps={{ "aria-labelledby": labelId }}
                        />
                      </TableCell>
                      {layout.fields.map((field) => {
                        return (
                          <TableCell
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              history.push(
                                `/${appId}/${objectTypeId}/${object._id}`
                              );
                            }}
                          >
                            <FieldDisplay
                              modelField={model.fields[field]}
                              objectField={object.data[field]}
                            />
                          </TableCell>
                        );
                      })}
                      {layout.actions && layout.actions.length > 0 && (
                        <TableCell>
                          <div style={{ float: "right" }}>
                            <IconButton
                              onClick={(event) => {
                                const newSelected = [];
                                newSelected.push(object._id);
                                setSelected(newSelected);
                                setAnchorEl(event.currentTarget);
                              }}
                            >
                              <IoMdMore />
                            </IconButton>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                }
              )}
            </TableBody>
          </Table>
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
              });
              setSelected([]);
            }}
          >
            Delete
          </MenuItem>
        </Menu>
      </Paper>
    </>
  );
};

export default Overview;
