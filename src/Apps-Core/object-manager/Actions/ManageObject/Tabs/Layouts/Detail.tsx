import React, { useState, useEffect } from "react";
import { AppContextType, ModelType } from "../../../../../../Utils/Types";
import { Typography, Paper, Divider, Fab } from "@material-ui/core";
import LayoutDesigner from "../../../../../../Components/LayoutDesigner";
import { FaSave } from "react-icons/fa";
import { map } from "lodash";

const AppActionManageObjectTabLayoutsDetail: React.FC<{
  match: { params: { detailId } };
  context: AppContextType;
  model: ModelType;
}> = ({
  match: {
    params: { detailId },
  },
  context,
  model,
}) => {
  // Global
  const [hasChanged, setHasChanged] = useState(false);
  const [fieldList, setFieldList] = useState([]);
  const [layout, setLayout] = useState();

  // Lifecycle
  useEffect(() => {
    const newFieldList = [];
    map(model.fields, (field, key) => {
      newFieldList.push({ value: key, label: field.name });
    });
    setFieldList(newFieldList);
    setLayout(model.layouts[detailId]);
  }, [model, detailId]);

  // UI
  if (!fieldList || !layout) return <context.UI.Loading />;
  return (
    <context.UI.Animations.AnimationContainer>
      <context.UI.Animations.AnimationItem>
        <Typography variant="h6">
          Layout <i>{detailId}</i>
        </Typography>
      </context.UI.Animations.AnimationItem>
      <context.UI.Animations.AnimationItem>
        <Paper className="paper" style={{ marginTop: 15 }}>
          <LayoutDesigner
            componentList={{
              GridContainer: {
                label: "Grid container",
                droppable: true,
                popup: (component, layoutItem, respond, deleteItem) => {
                  // Show tweak UI
                  context.setDialog({
                    display: true,
                    title: component.label,
                    form: [],
                    buttons: [
                      {
                        label: <div style={{ color: "red" }}>Delete</div>,
                        onClick: (response) => {
                          deleteItem();
                        },
                      },
                      {
                        label: "Update",
                        onClick: (response) => {
                          respond(response);
                          setHasChanged(true);
                        },
                      },
                    ],
                  });
                },
              },
              GridItem: {
                label: "Grid item",
                droppable: true,
                popup: (component, layoutItem, respond, deleteItem) => {
                  // Show tweak UI
                  context.setDialog({
                    display: true,
                    title: component.label,
                    form: [],
                    buttons: [
                      {
                        label: <div style={{ color: "red" }}>Delete</div>,
                        onClick: (response) => {
                          deleteItem();
                        },
                      },
                      {
                        label: "Update",
                        onClick: (response) => {
                          respond(response);
                          setHasChanged(true);
                        },
                      },
                    ],
                  });
                },
              },
              AnimationContainer: {
                label: "Animation container",
                droppable: true,
                popup: (component, layoutItem, respond, deleteItem) => {
                  // Show tweak UI
                  context.setDialog({
                    display: true,
                    title: component.label,
                    form: [],
                    buttons: [
                      {
                        label: <div style={{ color: "red" }}>Delete</div>,
                        onClick: (response) => {
                          deleteItem();
                        },
                      },
                      {
                        label: "Update",
                        onClick: (response) => {
                          respond(response);
                          setHasChanged(true);
                        },
                      },
                    ],
                  });
                },
              },
              AnimationItem: {
                label: "Animation Item",
                droppable: true,
                popup: (component, layoutItem, respond, deleteItem) => {
                  // Show tweak UI
                  context.setDialog({
                    display: true,
                    title: component.label,
                    form: [],
                    buttons: [
                      {
                        label: <div style={{ color: "red" }}>Delete</div>,
                        onClick: (response) => {
                          deleteItem();
                        },
                      },
                      {
                        label: "Update",
                        onClick: (response) => {
                          respond(response);
                          setHasChanged(true);
                        },
                      },
                    ],
                  });
                },
              },
              Paper: {
                label: "Paper",
                droppable: true,
                popup: (component, layoutItem, respond, deleteItem) => {
                  // Show tweak UI
                  context.setDialog({
                    display: true,
                    title: component.label,
                    form: [],
                    buttons: [
                      {
                        label: <div style={{ color: "red" }}>Delete</div>,
                        onClick: (response) => {
                          deleteItem();
                        },
                      },
                      {
                        label: "Update",
                        onClick: (response) => {
                          respond(response);
                          setHasChanged(true);
                        },
                      },
                    ],
                  });
                },
              },
              Group: {
                label: "Group",
                droppable: true,
                popup: (component, layoutItem, respond, deleteItem) => {
                  // Show tweak UI
                  context.setDialog({
                    display: true,
                    title: component.label,
                    form: [],
                    buttons: [
                      {
                        label: <div style={{ color: "red" }}>Delete</div>,
                        onClick: (response) => {
                          deleteItem();
                        },
                      },
                      {
                        label: "Update",
                        onClick: (response) => {
                          respond(response);
                          setHasChanged(true);
                        },
                      },
                    ],
                  });
                },
              },
              Field: {
                label: "Field",
                dynamicLabel: "field",
                popup: (component, layoutItem, respond, deleteItem) => {
                  // Show tweak UI
                  context.setDialog({
                    display: true,
                    title: component.label,
                    form: [
                      {
                        key: "field",
                        label: "Field",
                        value: layoutItem.field ? layoutItem.field : "",
                        type: "dropdown",
                        dropdownOptions: fieldList,
                      },
                      {
                        key: "xs",
                        label: "XS",
                        value: layoutItem.xs ? layoutItem.xs : 12,
                        type: "number",
                      },
                    ],
                    buttons: [
                      {
                        label: <div style={{ color: "red" }}>Delete</div>,
                        onClick: (response) => {
                          deleteItem();
                        },
                      },
                      {
                        label: "Update",
                        onClick: (response) => {
                          respond(response);
                          setHasChanged(true);
                        },
                      },
                    ],
                  });
                },
              },
              Html: {
                label: "HTML",
                popup: (component, layoutItem, respond, deleteItem) => {
                  // Show tweak UI
                  context.setDialog({
                    display: true,
                    title: component.label,
                    form: [],
                    buttons: [
                      {
                        label: <div style={{ color: "red" }}>Delete</div>,
                        onClick: (response) => {
                          deleteItem();
                        },
                      },
                      {
                        label: "Update",
                        onClick: (response) => {
                          respond(response);
                          setHasChanged(true);
                        },
                      },
                    ],
                  });
                },
              },
            }}
            layout={layout}
            onChange={(newLayout) => {
              console.log([...newLayout]);

              setLayout([...newLayout]); // Spread operator is required to force react to redraw
              setHasChanged(true);
            }}
          />
        </Paper>
      </context.UI.Animations.AnimationItem>
      {hasChanged && (
        <context.UI.Animations.AnimationContainer>
          <context.UI.Animations.AnimationItem>
            <Fab
              color="primary"
              style={{ position: "fixed", bottom: 15, right: 15 }}
              onClick={() => {
                context.updateModel(
                  model.key,
                  {
                    ...model,
                    layouts: { ...model.layouts, [detailId]: layout },
                  },
                  model._id
                );
                setHasChanged(false);
              }}
            >
              <FaSave />
            </Fab>
          </context.UI.Animations.AnimationItem>
        </context.UI.Animations.AnimationContainer>
      )}
    </context.UI.Animations.AnimationContainer>
  );
};

export default AppActionManageObjectTabLayoutsDetail;
