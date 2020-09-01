import React, { useEffect, useState, useGlobal } from "reactn";
import uniqid from "uniqid";
import Server from "../../Utils/Server";
import Loading from "../Loading";
import {
  Button,
  ListItem,
  List,
  ListItemText,
  Typography,
  Grid,
  Divider,
  Hidden,
} from "@material-ui/core";
import { FaAngleLeft, FaEdit, FaSave, FaBomb } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { ModelType, LayoutType, CustomFieldType } from "../../Utils/Types";
import ObjectLayoutItemGridContainer from "./LayoutItems/GridContainer";
import ObjectLayoutItemGridItem from "./LayoutItems/GridItem";
import ObjectLayoutItemPaper from "./LayoutItems/Paper";
import ObjectLayoutItemField from "./LayoutItems/Field";
import ObjectLayoutItemAnimationItem from "./LayoutItems/AnimationItem";
import ObjectLayoutItemAnimationContainer from "./LayoutItems/AnimationContainer";
import ObjectLayoutItemRelatedList from "./LayoutItems/RelatedList";
import { AppContextType } from "../../Utils/Types";
import { useHistory } from "react-router-dom";
import ObjectLayoutItemFieldGrid from "./LayoutItems/FieldGrid";
import Card from "../Design/Card";
import {
  AnimationContainer,
  AnimationItem,
} from "../Apps/Apps/AppUI/Animations";
import FieldDisplay from "./FieldDisplay";
import styles from "./styles.module.scss";
import { baseUrl as baseAppUrl } from "../../Utils/Utils";
import ObjectLayoutItemTabContainer from "./LayoutItems/TabContainer";

const ViewObject: React.FC<{
  modelId: string;
  layoutId?: string;
  appId: string;
  objectId?: string;
  onSuccess?: () => void;
  popup?: true;
  defaults?: { [key: string]: string };
  context?: AppContextType;
  baseUrl?: string;
  onObjectDisappears?: (history) => void;
  mode?: "view" | "edit";
  provideCustomFields?: { [key: string]: React.FC<CustomFieldType> };
}> = ({
  modelId,
  layoutId,
  appId,
  objectId,
  onSuccess,
  popup,
  defaults,
  context,
  baseUrl,
  onObjectDisappears,
  mode,
  provideCustomFields,
}) => {
  const [model, setmodel] = useState<ModelType>();
  const [object, setObject] = useState<any>();
  const [editMode, setMode] = useState<"view" | "edit">(
    objectId ? (mode ? mode : "view") : "edit"
  );
  const [toChange, setToChange] = useState<any>({ ...defaults });
  const [feedback, setFeedback] = useState<any>();
  const [toUpload, setToUpload] = useState<any>([]);
  const [navBar, setNavBar] = useGlobal<any>("navBar");
  const [actions, setActions] = useGlobal<any>("actions");
  const [defaultButton] = useGlobal<any>("defaultButton");
  const [pageTitle, setPageTitle] = useState<any>(undefined);
  const [snackbar, setSnackbar] = useGlobal<any>("snackbar");
  const history = useHistory();

  const getFeedback = (feedback) => {
    return (
      <List>
        {feedback.map((fb, index) => {
          let reason = "Unknown error";
          switch (fb.reason) {
            case "missing-required":
              reason = `<em>${
                model.fields[fb.field].name
              }</em> can't be empty.`;
              break;
            case "not-unique":
              reason = `<em>${
                model.fields[fb.field].name
              }</em> needs to be unique, but isn't.`;
              break;
            case "no-email":
              reason = `<em>${
                model.fields[fb.field].name
              }</em> isn't a valid e-mailadress.`;
              break;
            case "too-short":
              reason = `<em>${
                model.fields[fb.field].name
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
          type: model.key,
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
          type: model.key,
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
      filter: { key: modelId },
    });
    Server.on(`receive-${requestId}`, (response) => {
      setmodel(response[0]);
    });

    // Objects
    const dataRequestId = uniqid();
    if (objectId) {
      Server.emit("listenForObjects", {
        requestId: dataRequestId,
        type: modelId,
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
      Server.emit("unlistenFormodels", { requestId });
      if (objectId) {
        Server.emit("unlistenForObjects", { requestId: dataRequestId });
      }
    };
  }, [modelId, objectId]);
  useEffect(() => {
    if (editMode === "view") {
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
            url: baseUrl || `/${appId}/${modelId}`,
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
  }, [modelId, appId, editMode, pageTitle, toChange]);

  useEffect(() => {
    if (object && model) {
      setPageTitle(object.data[model.primary]);
    }
  }, [object, model]);

  // UI
  if (!model || (!object && objectId)) return <Loading />;
  const layout: LayoutType = model.layouts[layoutId || "default"];

  // Factsbar
  let factsBarPicture;
  let factsBarTitle;
  let factsBar;
  if (layout.factsBar && !popup) {
    if (
      model.fields[layout.factsBar[0]].type === "picture" ||
      (model.fields[layout.factsBar[0]].type === "formula" &&
        model.fields[layout.factsBar[0]].typeArgs.type === "picture")
    ) {
      factsBarPicture = object.data[layout.factsBar[0]];
      factsBarTitle = object.data[layout.factsBar[1]];
      factsBar = layout.factsBar.slice(2);
    } else if (object.data[layout.factsBar[0]]) {
      factsBarTitle = object.data[layout.factsBar[0]];
      factsBar = layout.factsBar.slice(1);
    } else {
      factsBarTitle = object.data[model.primary] || "???";
    }
  }

  // Buttons
  const buttons = (layout.buttons || []).map((button) => {
    const buttonInfo = {
      clone: {
        variant: "text",
        label: "Clone",
        onClick: () => {
          context.setDialog({
            display: true,
            title: "Feature in progress",
            content: "Sadly, I did not build this yet.",
          });
        },
      },
      delete: {
        variant: "outlined",
        label: "Delete",
        onClick: () => {
          context.setDialog({
            display: true,
            title: "Delete?",
            content: "Are you sure? For now, this can't be reverted!",
            buttons: [
              {
                label: "No",
                onClick: () => {
                  context.setDialog({ display: false });
                },
              },
              {
                label: <span style={{ color: "red" }}>Yes, delete</span>,
                onClick: () => {
                  const requestId = uniqid();
                  Server.emit("deleteObject", {
                    requestId,
                    objectId,
                  });
                  Server.on(`receive-${requestId}`, () => {
                    onObjectDisappears
                      ? onObjectDisappears(history)
                      : history.replace(`/${appId}/${modelId}`);
                  });
                },
              },
            ],
          });
        },
      },
      archive: {
        varian: "text",
        label: "Archive",
        onClick: () => {
          context.setDialog({
            display: true,
            title: "Are you sure?",
            content: `When you archive this ${model.name.toLocaleLowerCase()} it will be removed, but can be restored if need be. `,
            buttons: [
              {
                label: "Cancel",
                onClick: () => {
                  context.setDialog({ display: false });
                },
              },
              {
                label: (
                  <Typography style={{ color: "red" }}>Archive</Typography>
                ),
                onClick: () => {
                  context.archiveObject(modelId, objectId).then(() => {
                    onObjectDisappears
                      ? onObjectDisappears(history)
                      : history.replace(`/${appId}/${modelId}`);
                  });
                },
              },
            ],
          });
        },
      },
    }[button];
    return (
      <Button
        color="primary"
        variant={buttonInfo.variant}
        onClick={buttonInfo.onClick}
        style={{
          margin: 5,
          color: layout?.factsBar
            ? `rgb(${context?.app?.data?.color?.r},${context?.app?.data?.color?.g},${context?.app?.data?.color?.b})`
            : "white",
        }}
      >
        {buttonInfo.label}
      </Button>
    );
  });

  return (
    <div
      style={{ height: "100%" }}
      onKeyDown={(event) => {
        if (
          editMode === "edit" &&
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
      <AnimationContainer>
        {factsBar && !popup && (
          <AnimationItem>
            <Card withBigMargin hoverable className={styles.factsBar}>
              <div style={{ display: "flex" }}>
                {factsBarPicture && (
                  <Hidden xsDown>
                    <div
                      style={{
                        backgroundImage: `url(${baseAppUrl + factsBarPicture}`,
                      }}
                      className={styles.factsBarImage}
                    />
                  </Hidden>
                )}
                <div style={{ flex: 1, width: "100%" }}>
                  <Hidden xsDown>
                    <div style={{ float: "right", marginTop: -5 }}>
                      {buttons}
                    </div>
                    <Typography variant="h5" style={{ textAlign: "center" }}>
                      {factsBarTitle}
                    </Typography>
                  </Hidden>
                  <Hidden smUp>
                    <div style={{ display: "flex" }}>
                      {factsBarPicture && (
                        <div
                          style={{
                            backgroundImage: `url(${
                              baseAppUrl + factsBarPicture
                            }`,
                          }}
                          className={styles.factsBarImageSmall}
                        />
                      )}
                      <div style={{ textAlign: "center", flex: 1 }}>
                        <Typography variant="h6">{factsBarTitle}</Typography>
                        {buttons}
                      </div>
                    </div>
                  </Hidden>
                  <Divider style={{ margin: "15px 0" }} />
                  <Grid container spacing={3}>
                    {factsBar.map((fact) => {
                      const field = model.fields[fact];
                      type ColType =
                        | 1
                        | 2
                        | 3
                        | 4
                        | 5
                        | 6
                        | 7
                        | 8
                        | 9
                        | 10
                        | 11
                        | 12;

                      //@ts-ignore
                      const colsSmall: ColType = (12 / factsBar.length) * 2;
                      //@ts-ignore
                      const colsExtraSmall: ColType =
                        (12 / factsBar.length) * 3;
                      //@ts-ignore
                      const cols: ColType = 12 / factsBar.length;
                      return (
                        <Grid
                          item
                          xs={colsSmall}
                          md={cols}
                          key={fact}
                          style={{
                            textAlign: "center",
                          }}
                        >
                          <Typography
                            variant="body1"
                            style={{
                              fontWeight: "bold",
                            }}
                          >
                            {field.name}
                          </Typography>
                          <Typography variant="body2" noWrap>
                            <FieldDisplay
                              objectField={object.data[fact]}
                              modelField={field}
                            />
                          </Typography>
                        </Grid>
                      );
                    })}
                  </Grid>
                </div>
              </div>
            </Card>
          </AnimationItem>
        )}
        {layout.buttons && !layout.factsBar && (
          /* Button layout without factsbar*/ <div
            style={{ textAlign: "right", margin: "0 20px" }}
          >
            {buttons}
          </div>
        )}

        {model.layouts[layoutId || "default"].layout ? (
          layout.layout.map((layoutItem, id) => {
            return (
              <LayoutItem
                key={id}
                layoutItem={layoutItem}
                setToUpload={setToUpload}
                toUpload={toUpload}
                model={model}
                mode={editMode}
                setMode={setMode}
                setToChange={setToChange}
                toChange={toChange}
                object={object}
                baseUrl={baseUrl}
                customFieldTypes={provideCustomFields}
              />
            );
          })
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
      </AnimationContainer>
    </div>
  );
};

const LayoutItem: React.FC<{
  layoutItem: any;
  model: ModelType;
  mode: "view" | "edit";
  toChange: any;
  setToChange: (any) => void;
  setMode: (string) => void;
  object: any;
  setToUpload;
  toUpload;
  baseUrl: string;
  customFieldTypes: { [key: string]: React.FC };
}> = ({
  layoutItem,
  model,
  mode,
  toChange,
  setMode,
  object,
  setToChange,
  setToUpload,
  toUpload,
  baseUrl,
  customFieldTypes,
}) => {
  switch (layoutItem.type) {
    case "GridContainer":
      return (
        <ObjectLayoutItemGridContainer>
          {(layoutItem.items || []).map((item) => {
            return (
              <LayoutItem
                key={item.id}
                layoutItem={item}
                setToUpload={setToUpload}
                toUpload={toUpload}
                model={model}
                mode={mode}
                setMode={setMode}
                setToChange={setToChange}
                toChange={toChange}
                object={object}
                baseUrl={baseUrl}
                customFieldTypes={customFieldTypes}
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
                  model={model}
                  setToUpload={setToUpload}
                  toUpload={toUpload}
                  mode={mode}
                  setMode={setMode}
                  setToChange={setToChange}
                  toChange={toChange}
                  object={object}
                  baseUrl={baseUrl}
                  customFieldTypes={customFieldTypes}
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
                  model={model}
                  mode={mode}
                  setMode={setMode}
                  setToChange={setToChange}
                  toChange={toChange}
                  object={object}
                  baseUrl={baseUrl}
                  customFieldTypes={customFieldTypes}
                />
              );
            })}
        </ObjectLayoutItemAnimationContainer>
      );
    case "AnimationItem":
      return (
        <ObjectLayoutItemAnimationItem>
          {(layoutItem?.items || []).map((item) => {
            return (
              <LayoutItem
                key={item.id}
                layoutItem={item}
                setToUpload={setToUpload}
                toUpload={toUpload}
                model={model}
                mode={mode}
                setMode={setMode}
                setToChange={setToChange}
                toChange={toChange}
                object={object}
                baseUrl={baseUrl}
                customFieldTypes={customFieldTypes}
              />
            );
          })}
        </ObjectLayoutItemAnimationItem>
      );
    case "FieldGrid":
      return (
        <ObjectLayoutItemFieldGrid
          layoutItem={layoutItem}
          model={model}
          object={object}
          setToChange={setToChange}
          toChange={toChange}
          mode={mode}
          setMode={setMode}
        />
      );
    case "Paper":
      return (layoutItem.hideEdit && mode === "edit") ||
        (layoutItem.hideView && mode === "view") ? (
        <></>
      ) : (
        <ObjectLayoutItemPaper
          hoverable={layoutItem.hoverable}
          withBigMargin={layoutItem.withBigMargin}
          withSmallMargin={layoutItem.withSmallMargin}
          sideMarginOnly={layoutItem.sideMarginOnly}
          title={layoutItem.title}
        >
          {(layoutItem?.items || []).map((item) => {
            return (
              <LayoutItem
                key={item.id}
                setToUpload={setToUpload}
                toUpload={toUpload}
                layoutItem={item}
                model={model}
                mode={mode}
                setMode={setMode}
                setToChange={setToChange}
                toChange={toChange}
                object={object}
                baseUrl={baseUrl}
                customFieldTypes={customFieldTypes}
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
          model={model}
          toChange={toChange}
          onChange={(value) => {
            setToChange({ ...toChange, [layoutItem.field]: value });
          }}
          customFieldTypes={customFieldTypes}
        />
      );
    case "RelatedList":
      return (
        <ObjectLayoutItemRelatedList
          layoutItem={layoutItem}
          objectId={object._id}
        />
      );

    case "TabContainer":
      const items = {};
      (layoutItem.items || []).map((TabItem) => {
        const subItems = [];
        (TabItem.items || []).map((subItem) => {
          subItems.push(
            <LayoutItem
              key={subItem.id}
              setToUpload={setToUpload}
              toUpload={toUpload}
              layoutItem={subItem}
              model={model}
              mode={mode}
              setMode={setMode}
              setToChange={setToChange}
              toChange={toChange}
              object={object}
              baseUrl={baseUrl}
              customFieldTypes={customFieldTypes}
            />
          );
        });
        items[TabItem.identifier] = subItems;
      });

      return (
        <ObjectLayoutItemTabContainer
          layoutItem={layoutItem}
          tabs={layoutItem?.items}
          baseUrl={baseUrl}
          items={items}
        />
      );
    default:
      return <>Unknown layoutItem type:{layoutItem.type}</>;
  }
};

export default ViewObject;
