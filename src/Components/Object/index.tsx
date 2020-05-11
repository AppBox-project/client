import React, { useEffect, useState, createRef, useGlobal } from "reactn";
import uniqid from "uniqid";
import Server from "../../Utils/Server";
import Loading from "../Loading";
import { Typography, IconButton, Grid, Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import { FaAngleLeft, FaAngleDown, FaEdit, FaSave } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { ModelType } from "../../Utils/Types";
import { Alert, AlertTitle } from "@material-ui/lab";
import ObjectLayoutItemGridContainer from "./LayoutItems/GridContainer";
import ObjectLayoutItemGridItem from "./LayoutItems/GridItem";
import ObjectLayoutItemPaper from "./LayoutItems/Paper";
import ObjectLayoutItemField from "./LayoutItems/Field";
import ObjectLayoutItemAnimationItem from "./LayoutItems/AnimationItem";
import ObjectLayoutItemAnimationContainer from "./LayoutItems/AnimationContainer";

const ViewObject: React.FC<{
  objectTypeId: string;
  layoutId?: string;
  appId: string;
  objectId?: string;
  onSuccess?: () => void;
}> = ({ objectTypeId, layoutId, appId, objectId, onSuccess }) => {
  const [objectType, setObjectType] = useState<ModelType>();
  const [object, setObject] = useState();
  const [mode, setMode] = useState<"view" | "edit">(objectId ? "view" : "edit");
  const [toChange, setToChange] = useState({});
  const [feedback, setFeedback] = useState();
  const [toUpload, setToUpload] = useState([]);
  const [navBar, setNavBar] = useGlobal<any>("navBar");

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
  useEffect(() => {
    if (mode === "view") {
      setNavBar({
        ...navBar,
        backButton: { icon: <FaAngleLeft />, url: `/${appId}/${objectTypeId}` },
      });
    } else {
      setNavBar({
        ...navBar,
        backButton: {
          icon: <IoMdClose />,
          function: () => {
            setMode("view");
          },
        },
      });
    }

    return () => {
      setNavBar({
        ...navBar,
        backButton: { icon: undefined, url: undefined, function: undefined },
      });
    };
  }, [objectTypeId, appId, mode]);

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
                setToUpload={setToUpload}
                toUpload={toUpload}
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
  objectType: ModelType;
  mode: "view" | "edit";
  toChange: any;
  setToChange: (any) => void;
  setMode: (string) => void;
  object: any;
  setToUpload;
  toUpload;
}> = ({
  layoutItem,
  objectType,
  mode,
  toChange,
  setMode,
  object,
  setToChange,
  setToUpload,
  toUpload,
}) => {
  switch (layoutItem.type) {
    case "GridContainer":
      return (
        <ObjectLayoutItemGridContainer>
          {layoutItem.items &&
            layoutItem.items.map((item) => {
              return (
                <LayoutItem
                  key={item.id}
                  layoutItem={item}
                  setToUpload={setToUpload}
                  toUpload={toUpload}
                  objectType={objectType}
                  mode={mode}
                  setMode={setMode}
                  setToChange={setToChange}
                  toChange={toChange}
                  object={object}
                />
              );
            })}
        </ObjectLayoutItemGridContainer>
      );
    case "GridItem":
      return (
        <ObjectLayoutItemGridItem
          xs={layoutItem.xs}
          sm={layoutItem.sm}
          md={layoutItem.md}
          lg={layoutItem.lg}
          xl={layoutItem.xl}
        >
          {layoutItem.items &&
            layoutItem.items.map((item) => {
              return (
                <LayoutItem
                  key={item.id}
                  layoutItem={item}
                  objectType={objectType}
                  setToUpload={setToUpload}
                  toUpload={toUpload}
                  mode={mode}
                  setMode={setMode}
                  setToChange={setToChange}
                  toChange={toChange}
                  object={object}
                />
              );
            })}
        </ObjectLayoutItemGridItem>
      );

    case "AnimationContainer":
      return (
        <ObjectLayoutItemAnimationContainer>
          {layoutItem.items &&
            layoutItem.items.map((item) => {
              return (
                <LayoutItem
                  key={item.id}
                  layoutItem={item}
                  setToUpload={setToUpload}
                  toUpload={toUpload}
                  objectType={objectType}
                  mode={mode}
                  setMode={setMode}
                  setToChange={setToChange}
                  toChange={toChange}
                  object={object}
                />
              );
            })}
        </ObjectLayoutItemAnimationContainer>
      );
    case "AnimationItem":
      return (
        <ObjectLayoutItemAnimationItem>
          {layoutItem.items &&
            layoutItem.items.map((item) => {
              return (
                <LayoutItem
                  key={item.id}
                  layoutItem={item}
                  setToUpload={setToUpload}
                  toUpload={toUpload}
                  objectType={objectType}
                  mode={mode}
                  setMode={setMode}
                  setToChange={setToChange}
                  toChange={toChange}
                  object={object}
                />
              );
            })}
        </ObjectLayoutItemAnimationItem>
      );
    case "Paper":
      return (
        <ObjectLayoutItemPaper>
          {layoutItem.items &&
            layoutItem.items.map((item) => {
              return (
                <LayoutItem
                  key={item.id}
                  setToUpload={setToUpload}
                  toUpload={toUpload}
                  layoutItem={item}
                  objectType={objectType}
                  mode={mode}
                  setMode={setMode}
                  setToChange={setToChange}
                  toChange={toChange}
                  object={object}
                />
              );
            })}
        </ObjectLayoutItemPaper>
      );
    case "Field":
      return (
        <ObjectLayoutItemField
          layoutItem={layoutItem}
          object={object}
          mode={mode}
          setMode={setMode}
          model={objectType}
          toChange={toChange}
          onChange={(value) => {
            setToChange({ ...toChange, [layoutItem.field]: value });
          }}
        />
      );
    default:
      return <>Unknown layoutItem type:{layoutItem.type}</>;
  }
};

export default ViewObject;
