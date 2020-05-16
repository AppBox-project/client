import React, { useState, useEffect } from "react";
import { AppContextType, ModelType } from "../../../../../../Utils/Types";
import { Typography, Paper, Divider, Fab, Grid } from "@material-ui/core";
import LayoutDesigner from "../../../../../../Components/LayoutDesigner";
import { FaSave } from "react-icons/fa";
import { map } from "lodash";
import {
  AnimationContainer,
  AnimationItem,
} from "../../../../../../Components/Apps/Apps/AppUI/Animations";

const WrapperPaper: React.FC = (Props) => {
  return <Paper {...Props}>{Props.children}</Paper>;
};

const WrapperGridContainer: React.FC = (Props) => {
  return (
    <Grid container {...Props}>
      {Props.children}
    </Grid>
  );
};

const WrapperGridItem: React.FC = (Props) => {
  return (
    <Grid item {...Props}>
      {Props.children}
    </Grid>
  );
};

const WrapperAnimationContainer: React.FC = (Props) => {
  return <AnimationContainer {...Props}>{Props.children}</AnimationContainer>;
};

const WrapperAnimationItem: React.FC = (Props) => {
  return <AnimationItem {...Props}>{Props.children}</AnimationItem>;
};

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
                wrapper: WrapperGridContainer,
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
                wrapper: WrapperGridItem,
                popup: (component, layoutItem, respond, deleteItem) => {
                  // Show tweak UI
                  context.setDialog({
                    display: true,
                    title: component.label,
                    form: [
                      {
                        key: "xs",
                        label: "Extra small screens (and up)",
                        value: layoutItem.xs ? layoutItem.xs : 12,
                        type: "number",
                      },
                      {
                        key: "sm",
                        label: "Small screens (and up)",
                        value: layoutItem.sm,
                        type: "number",
                      },
                      {
                        key: "md",
                        label: "Medium screens (and up)",
                        value: layoutItem.md,
                        type: "number",
                      },
                      {
                        key: "lg",
                        label: "Large screens (and up)",
                        value: layoutItem.lg,
                        type: "number",
                      },
                      {
                        key: "xl",
                        label: "Extra large screens (and up)",
                        value: layoutItem.xl,
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
              AnimationContainer: {
                label: "Animation container",
                droppable: true,
                wrapper: WrapperAnimationContainer,
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
                wrapper: WrapperAnimationItem,
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
                wrapper: WrapperPaper,
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
