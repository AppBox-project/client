import React, { useState, useEffect } from "react";
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
  IconButton,
  MenuItem,
  Menu
} from "@material-ui/core";
import { TypeType } from "../../Utils/Types";
import uniqid from "uniqid";
import Server from "../../Utils/Server";
import Loading from "../Loading";
import { Link } from "react-router-dom";
import { IoIosAddCircleOutline, IoMdMore } from "react-icons/io";
import ViewObject from "../Object/index";

const Overview: React.FC<{
  layoutId: string;
  objectTypeId: string;
  appId: string;
}> = ({ layoutId, objectTypeId, appId }) => {
  const [objectType, setObjectType] = useState<TypeType>();
  const [layout, setLayout] = useState();
  const [objects, setObjects] = useState();
  const [dialogContent, setDialogContent] = useState();
  const [anchorEl, setAnchorEl] = useState();
  const [selected, setSelected] = useState();

  // Lifecycle
  useEffect(() => {
    // -> Object types
    const requestId = uniqid();
    Server.emit("listenForObjectTypes", {
      requestId,
      filter: { key: objectTypeId }
    });
    Server.on(`receive-${requestId}`, response => {
      setObjectType(response[0]);
      setLayout(response[0].overviews[layoutId]);
    });

    // Objects
    const dataRequestId = uniqid();
    Server.emit("listenForObjects", {
      requestId: dataRequestId,
      type: objectTypeId,
      filter: {}
    });
    Server.on(`receive-${dataRequestId}`, response => {
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

  // UI
  if (!objects || !objectType || !layout) return <Loading />;
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
            <Grid item xs={3} style={{ textAlign: "right", margin: 5 }}>
              {layout.buttons.map(buttonInfo => {
                if (objectType.buttons) {
                  if (objectType.buttons[buttonInfo]) {
                    const button = objectType.buttons[buttonInfo];
                    return (
                      <Button
                        key={buttonInfo}
                        variant="outlined"
                        onClick={() => {
                          setDialogContent(
                            <ViewObject
                              objectTypeId={objectType.key}
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
                        {button.label ? button.label : `New ${objectType.name}`}
                      </Button>
                    );
                  }
                }
              })}
            </Grid>
          </Grid>
          <Dialog
            open={dialogContent !== undefined}
            onClose={() => {
              setDialogContent(undefined);
            }}
            aria-labelledby="form-dialog-title"
          >
            <DialogContent>{dialogContent}</DialogContent>
          </Dialog>
        </>
      )}
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {layout.fields.map(overviewItem => {
              return (
                <TableCell key={overviewItem}>
                  {objectType.fields[overviewItem].name}
                </TableCell>
              );
            })}
            {layout.actions && layout.actions.length > 0 && (
              <TableCell>
                <div style={{ float: "right" }}>&nbsp;</div>
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {objects.map(object => {
            return (
              <TableRow key={object._id}>
                {layout.fields.map(overviewItem => {
                  return (
                    <TableCell key={overviewItem}>
                      <Link
                        to={`/${appId}/${objectTypeId}/${object._id}`}
                        className="no-link"
                        style={{ color: "black" }}
                      >
                        {object.data[overviewItem]}
                      </Link>
                    </TableCell>
                  );
                })}
                {layout.actions && layout.actions.length > 0 && (
                  <TableCell>
                    <div style={{ float: "right" }}>
                      <IconButton
                        onClick={event => {
                          setSelected(object._id);
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
          })}
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem
              onClick={() => {
                const requestId = uniqid();
                Server.emit("deleteObject", { objectId: selected, requestId });
                Server.on(`receive-${requestId}`, response => {
                  if (response.success) {
                    setAnchorEl(null);
                  } else {
                    console.log(response);
                  }
                });
              }}
            >
              Delete
            </MenuItem>
          </Menu>
        </TableBody>
      </Table>
    </>
  );
};

export default Overview;
