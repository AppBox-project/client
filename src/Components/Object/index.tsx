import React, { useEffect, useState, useGlobal } from "reactn";
import uniqid from "uniqid";
import Server from "../../Utils/Server";
import Loading from "../Loading";
import { Button, ListItem, List, ListItemText } from "@material-ui/core";
import { FaAngleLeft, FaEdit, FaSave, FaBomb } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { ModelType } from "../../Utils/Types";
import ObjectLayoutItemGridContainer from "./LayoutItems/GridContainer";
import ObjectLayoutItemGridItem from "./LayoutItems/GridItem";
import ObjectLayoutItemPaper from "./LayoutItems/Paper";
import ObjectLayoutItemField from "./LayoutItems/Field";
import ObjectLayoutItemAnimationItem from "./LayoutItems/AnimationItem";
import ObjectLayoutItemAnimationContainer from "./LayoutItems/AnimationContainer";
import ObjectLayoutItemRelatedList from "./LayoutItems/RelatedList";

const ViewObject: React.FC<{
  objectTypeId: string;
  layoutId?: string;
  appId: string;
  objectId?: string;
  onSuccess?: () => void;
  popup?: true;
  defaults?: { [key: string]: string };
}> = ({
  objectTypeId,
  layoutId,
  appId,
  objectId,
  onSuccess,
  popup,
  defaults,
}) => {
  const [objectType, setObjectType] = useState<ModelType>();
  const [object, setObject] = useState();
  const [mode, setMode] = useState<"view" | "edit">(objectId ? "view" : "edit");
  const [toChange, setToChange] = useState({ ...defaults });
  const [feedback, setFeedback] = useState();
  const [toUpload, setToUpload] = useState([]);
  const [navBar, setNavBar] = useGlobal<any>("navBar");
  const [actions, setActions] = useGlobal<any>("actions");
  const [defaultButton] = useGlobal<any>("defaultButton");
  const [pageTitle, setPageTitle] = useState(undefined);
  const [snackbar, setSnackbar] = useGlobal<any>("snackbar");

  const getFeedback = (feedback) => {
    return (
      <List>
        {feedback.map((fb, index) => {
          let reason = "Unknown error";
          switch (fb.reason) {
            case "missing-required":
              reason = `<em>${
                objectType.fields[fb.field].name
              }</em> can't be empty.`;
              break;
            case "not-unique":
              reason = `<em>${
                objectType.fields[fb.field].name
              }</em> needs to be unique, but isn't.`;
              break;
            case "no-email":
              reason = `<em>${
                objectType.fields[fb.field].name
              }</em> isn't a valid e-mailadress.`;
              break;
            case "too-short":
              reason = `<em>${
                objectType.fields[fb.field].name
              }</em> should be over ${fb.minLength}  characters.`;
              break;
            default:
              reason = "huh";
              break;
          }
          return (
            <ListItem
              style={{ cursor: "default" }}
              key={`${fb.reason}-${fb.field}`}
            >
              <ListItemText>
                <div dangerouslySetInnerHTML={{ __html: reason }} />
              </ListItemText>
            </ListItem>
          );
        })}
      </List>
    );
  };

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
            if (response.feedback) {
              setFeedback(response.feedback);
              setSnackbar({
                display: true,
                type: "error",
                icon: <FaBomb />,
                duration: 2500,
                position: { horizontal: "right" },

                message: getFeedback(response.feedback),
              });
            } else {
              setSnackbar({
                display: true,
                message: response.reason,
                type: "error",
                icon: <FaBomb />,
                duration: 2500,
                position: { horizontal: "right" },
              });
            }
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
            if (response.feedback) {
              setFeedback(response.feedback);
              setSnackbar({
                display: true,
                type: "error",
                icon: <FaBomb />,
                duration: 2500,
                position: { horizontal: "right" },

                message: getFeedback(response.feedback),
              });
            } else {
              setSnackbar({
                display: true,
                message: response.reason,
                type: "error",
                icon: <FaBomb />,
                duration: 2500,
                position: { horizontal: "right" },
              });
            }
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
  }, [objectTypeId, objectId]);
  useEffect(() => {
    if (mode === "view") {
      if (!popup) {
        setActions({
          ...actions,
          objectFilter: undefined,
          objectToggle: {
            label: "Edit",
            icon: <FaEdit />,
            function: () => {
              setMode("edit");
            },
          },
        });
        setNavBar({
          ...navBar,
          backButton: {
            ...navBar.backButton,
            icon: <FaAngleLeft />,
            url: `/${appId}/${objectTypeId}`,
            function: undefined,
          },
          title: pageTitle ? pageTitle : undefined,
        });
      }
    } else {
      if (!popup) {
        setActions({
          ...actions,
          objectToggle: {
            label: "Save",
            variant: "contained",
            icon: <FaSave />,
            function: () => {
              save();
            },
          },
        });
        setNavBar({
          ...navBar,
          backButton: {
            ...navBar.backButton,
            icon: <IoMdClose />,
            url: undefined,
            function: () => {
              setMode("view");
            },
          },
          title: pageTitle ? pageTitle : undefined,
        });
      }
    }

    return () => {
      if (!popup) {
        setActions({ ...actions, objectToggle: undefined });
        setNavBar({
          ...navBar,
          backButton: {
            ...defaultButton,
          },
          title: undefined,
        });
      }
    };
  }, [objectTypeId, appId, mode, pageTitle, toChange]);

  useEffect(() => {
    if (object) {
      setPageTitle(object.data[objectType.primary]);
    }
  }, [object, objectType]);

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

      {(!objectId || popup) && (
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
    case "RelatedList":
      return (
        <ObjectLayoutItemRelatedList
          layoutItem={layoutItem}
          objectId={object._id}
        />
      );

      break;
    default:
      return <>Unknown layoutItem type:{layoutItem.type}</>;
  }
};

export default ViewObject;
