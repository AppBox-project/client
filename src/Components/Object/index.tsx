import React, { useEffect, useState, createRef } from "react";
import uniqid from "uniqid";
import Server from "../../Utils/Server";
import Loading from "../Loading";
import {
  Typography,
  IconButton,
  Grid,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Button,
  Paper,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import { FaAngleLeft, FaAngleDown, FaEdit, FaSave } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import styles from "./styles.module.scss";
import { TypeType } from "../../Utils/Types";
import { Alert, AlertTitle } from "@material-ui/lab";
import FieldTypeInput from "./FieldTypes/Input";
import FieldTypeRelationship from "./FieldTypes/Relationship";
import FieldTypeBoolean from "./FieldTypes/Boolean";
import FieldTypeFormula from "./FieldTypes/Formula";

const ViewObject: React.FC<{
  objectTypeId: string;
  layoutId?: string;
  appId: string;
  objectId?: string;
  onSuccess?: () => void;
}> = ({ objectTypeId, layoutId, appId, objectId, onSuccess }) => {
  const [objectType, setObjectType] = useState<TypeType>();
  const [object, setObject] = useState();
  const [mode, setMode] = useState<"view" | "edit">(objectId ? "view" : "edit");
  const [toChange, setToChange] = useState({});
  const [feedback, setFeedback] = useState();

  const save = () => {
    if (toChange !== {}) {
      if (objectId) {
        const requestId = uniqid();
        Server.emit("updateObject", {
          requestId,
          objectId: object._id,
          type: objectType.key,
          toChange,
        });
        Server.on(`receive-${requestId}`, (response) => {
          if (response.success) {
            setMode("view");
            setToChange({});
            setFeedback(null);
            if (onSuccess) onSuccess();
          } else {
            setFeedback(response.feedback);
          }
        });
      } else {
        const requestId = uniqid();
        Server.emit("insertObject", {
          requestId,
          type: objectType.key,
          object: toChange,
        });
        Server.on(`receive-${requestId}`, (response) => {
          console.log(response);
          if (response.success) {
            if (onSuccess) onSuccess();
          } else {
            setFeedback(response.feedback);
          }
        });
      }
    } else {
      console.log("Nothing to save");
    }
  };

  // Lifecycle
  useEffect(() => {
    // -> Object types
    const requestId = uniqid();
    Server.emit("listenForObjectTypes", {
      requestId,
      filter: { key: objectTypeId },
    });
    Server.on(`receive-${requestId}`, (response) => {
      setObjectType(response[0]);
    });

    // Objects
    const dataRequestId = uniqid();
    if (objectId) {
      Server.emit("listenForObjects", {
        requestId: dataRequestId,
        type: objectTypeId,
        filter: { _id: objectId },
      });
      Server.on(`receive-${dataRequestId}`, (response) => {
        if (response.success) {
          setObject(response.data[0]);
        } else {
          console.log(response);
        }
      });
    }
    return () => {
      Server.emit("unlistenForObjectTypes", { requestId });
      if (objectId) {
        Server.emit("unlistenForObjects", { requestId: dataRequestId });
      }
    };
  }, [objectTypeId]);

  // UI
  if (!objectType || (!object && objectId)) return <Loading />;

  return (
    <div
      onKeyDown={(event) => {
        if (
          mode === "edit" &&
          event.ctrlKey &&
          String.fromCharCode(event.which).toLowerCase() === "s"
        ) {
          event.preventDefault();
          save();
        } else if (event.which === 27) {
          setMode("view");
          setToChange({});
        }
      }}
    >
      {objectId && (
        <Grid container>
          <Grid item xs={8}>
            <Typography variant="h5">
              {mode === "view" ? (
                <Link to={`/${appId}/${objectTypeId}`}>
                  <IconButton>
                    <FaAngleLeft />
                  </IconButton>
                </Link>
              ) : (
                <IconButton
                  onClick={() => {
                    setMode("view");
                  }}
                >
                  <IoMdClose />
                </IconButton>
              )}

              {object.data[objectType.primary]}
            </Typography>
          </Grid>
          <Grid item xs={4} style={{ textAlign: "right" }}>
            <div style={{ textAlign: "right", width: "100%" }}>
              {mode === "edit" && (
                <Button
                  startIcon={<IoMdClose />}
                  onClick={() => {
                    setMode("view");
                    setToChange({});
                  }}
                >
                  Cancel
                </Button>
              )}
              <Button
                startIcon={mode === "view" ? <FaEdit /> : <FaSave />}
                variant={mode === "view" ? "outlined" : "contained"}
                color="primary"
                onClick={() => {
                  if (mode === "view") {
                    setMode("edit");
                  } else {
                    save();
                  }
                }}
              >
                {mode === "view" ? "Edit" : "Save"}
              </Button>
            </div>
          </Grid>
        </Grid>
      )}
      {objectType.layouts[layoutId ? layoutId : "default"] ? (
        objectType.layouts[layoutId ? layoutId : "default"].map(
          (layoutItem, id) => {
            return (
              <LayoutItem
                key={id}
                layoutItem={layoutItem}
                objectType={objectType}
                mode={mode}
                setMode={setMode}
                setToChange={setToChange}
                toChange={toChange}
                object={object}
              />
            );
          }
        )
      ) : (
        <>Layout {layoutId} not found </>
      )}
      {feedback && (
        <Alert severity="error">
          <AlertTitle>Errors!</AlertTitle>
          <ul>
            {feedback.map((fb) => {
              let reason = "Unknown error";
              switch (fb.reason) {
                case "missing-required":
                  reason = `${
                    objectType.fields[fb.field].name
                  } can't be empty.`;
                  break;
                case "not-unique":
                  reason = `${
                    objectType.fields[fb.field].name
                  } needs to be unique, but isn't.`;
                  break;
                case "no-email":
                  reason = `${
                    objectType.fields[fb.field].name
                  } isn't a valid e-mailadress.`;
                  break;
                case "too-short":
                  reason = `${
                    objectType.fields[fb.field].name
                  } should be over ${fb.minLength}  characters.`;
                  break;
                default:
                  reason = "huh";
                  break;
              }
              return <li key={`${fb.reason}-${fb.field}`}>{reason}</li>;
            })}
          </ul>
        </Alert>
      )}
      {!objectId && (
        <div style={{ float: "right" }}>
          <Button
            color="primary"
            onClick={() => {
              save();
            }}
          >
            Save
          </Button>
        </div>
      )}
    </div>
  );
};

const LayoutItem: React.FC<{
  layoutItem: any;
  objectType: TypeType;
  mode: "view" | "edit";
  toChange: any;
  setToChange: (any) => void;
  setMode: (string) => void;
  object: any;
}> = ({
  layoutItem,
  objectType,
  mode,
  toChange,
  setMode,
  object,
  setToChange,
}) => {
  switch (layoutItem.type) {
    case "GridContainer":
      return (
        <Grid container>
          {layoutItem.items.map((layoutItem, id) => {
            return (
              <LayoutItem
                key={id}
                layoutItem={layoutItem}
                objectType={objectType}
                mode={mode}
                setMode={setMode}
                setToChange={setToChange}
                toChange={toChange}
                object={object}
              />
            );
          })}
        </Grid>
      );
    case "GridItem":
      return (
        <Grid
          item
          xs={layoutItem.xs}
          sm={layoutItem.sm}
          md={layoutItem.md}
          lg={layoutItem.lg}
          xl={layoutItem.xl}
        >
          {layoutItem.items.map((layoutItem, id) => {
            return (
              <LayoutItem
                key={id}
                layoutItem={layoutItem}
                objectType={objectType}
                mode={mode}
                setMode={setMode}
                setToChange={setToChange}
                toChange={toChange}
                object={object}
              />
            );
          })}
        </Grid>
      );
    case "Paper":
      return (
        <Paper className="paper">
          {layoutItem.items.map((layoutItem, id) => {
            return (
              <LayoutItem
                key={layoutItem}
                layoutItem={layoutItem}
                objectType={objectType}
                mode={mode}
                setMode={setMode}
                setToChange={setToChange}
                toChange={toChange}
                object={object}
              />
            );
          })}
        </Paper>
      );
    case "HTML":
      return <div dangerouslySetInnerHTML={{ __html: layoutItem.content }} />;
    case "Group":
      return (
        <ExpansionPanel key={layoutItem.id} defaultExpanded={true}>
          <ExpansionPanelSummary
            expandIcon={<FaAngleDown />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <Typography variant="h6">General settings</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Grid container>
              {layoutItem.items.map((layoutItem, id) => {
                return (
                  <LayoutItem
                    key={id}
                    layoutItem={layoutItem}
                    objectType={objectType}
                    mode={mode}
                    setMode={setMode}
                    setToChange={setToChange}
                    toChange={toChange}
                    object={object}
                  />
                );
              })}
            </Grid>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      );
    case "Field":
      const field = objectType.fields[layoutItem.field];
      return (
        <Grid
          item
          xs={layoutItem.xs}
          sm={layoutItem.sm}
          md={layoutItem.md}
          lg={layoutItem.lg}
          xl={layoutItem.xl}
          key={layoutItem.field}
          className={
            object &&
            layoutItem.field in toChange &&
            toChange[layoutItem.field] !== null &&
            styles.changed
          }
          style={{ padding: mode === "edit" ? "0 5px" : 0 }}
        >
          {field.type === "input" && (
            <FieldTypeInput
              mode={mode}
              field={field}
              object={object}
              fieldKey={layoutItem.field}
              setMode={setMode}
              onChange={(value) => {
                setToChange({
                  ...toChange,
                  [layoutItem.field]: value,
                });
              }}
            />
          )}
          {field.type === "boolean" && (
            <FieldTypeBoolean
              mode={mode}
              field={field}
              object={object}
              fieldKey={layoutItem.field}
              setMode={setMode}
              onChange={(value) => {
                setToChange({
                  ...toChange,
                  [layoutItem.field]: value,
                });
              }}
            />
          )}
          {field.type === "relationship" && (
            <FieldTypeRelationship
              mode={mode}
              field={field}
              object={object}
              fieldKey={layoutItem.field}
              setMode={setMode}
              onChange={(value) => {
                setToChange({
                  ...toChange,
                  [layoutItem.field]: value,
                });
              }}
            />
          )}
          {field.type === "formula" && (
            <FieldTypeFormula
              mode={mode}
              field={field}
              object={object}
              fieldKey={layoutItem.field}
              setMode={setMode}
              onChange={(value) => {
                setToChange({
                  ...toChange,
                  [layoutItem.field]: value,
                });
              }}
            />
          )}
        </Grid>
      );
    default:
      return <>Unknown layoutItem type:{layoutItem.type}</>;
  }
};

export default ViewObject;
