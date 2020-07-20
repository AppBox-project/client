import React, { useState, useEffect } from "react";
import { AppContextType, ModelType } from "../../../../../../Utils/Types";
import { Fab, Grid } from "@material-ui/core";
import LayoutDesigner from "../../../../../../Components/LayoutDesigner";
import { FaSave } from "react-icons/fa";
import { map, find } from "lodash";
import {
  AnimationContainer,
  AnimationItem,
} from "../../../../../../Components/Apps/Apps/AppUI/Animations";
import Card from "../../../../../../Components/Design/Card";
import { useHistory } from "react-router-dom";
import AppObjectLayoutFieldGridEditor from "./FieldGridEditor";

interface WrapperPropsType {
  title?: string;
  children;
  ref;
}

const WrapperPaper: React.FC = (Props: WrapperPropsType) => {
  return <Card {...Props}>{Props.children}</Card>;
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

const WrapperRelatedList: React.FC = (Props) => {
  return (
    <div style={{ backgroundColor: "red" }} {...Props}>
      {Props.children}
    </div>
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
  const [hasChanged, setHasChanged] = useState<any>(false);
  const [fieldList, setFieldList] = useState<any>([]);
  const [layout, setLayout] = useState<any>();
  const history = useHistory();

  // Lifecycle
  useEffect(() => {
    if ((model.layouts || {})[detailId]) {
      const newFieldList = [];
      map(model.fields, (field, key) => {
        newFieldList.push({ value: key, label: field.name });
      });
      setFieldList(newFieldList);
      setLayout(model.layouts[detailId]);
    } else {
      history.replace(`/object-manager/${model.key}/layouts`); // Redirect back to overview if there is no such layout
    }
  }, [model, detailId]);

  // UI
  if (!fieldList || !layout) return <context.UI.Loading />;

  // Tell react-select what values are selected
  const buttonOptions = [
    { label: "Delete", value: "delete" },
    { label: "Clone", value: "clone" },
  ];
  const selectedButtons = [];
  (layout.buttons || []).map((b) => {
    selectedButtons.push(
      find(buttonOptions, (o) => {
        return o.value === b;
      })
    );
  });

  return (
    <>
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
            label: "Card",
            wrapper: WrapperPaper,
            droppable: true,
            popup: (component, layoutItem, respond, deleteItem) => {
              // Show tweak UI
              context.setDialog({
                display: true,
                title: component.label,
                form: [
                  { label: "Title", key: "title", value: layoutItem.title },
                  {
                    label: "Hover effect",
                    key: "hoverable",
                    value: layoutItem.hoverable,
                    type: "boolean",
                  },
                  {
                    label: "With margin",
                    key: "withMargin",
                    value: layoutItem.withMargin,
                    type: "boolean",
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
          FieldGrid: {
            label: "Field grid",
            dynamicLabel: "title",
            popup: (component, layoutItem, respond, deleteItem) => {
              // Show tweak UI
              context.setDialog({
                display: true,
                size: "lg",
                title: component.label,
                form: [
                  {
                    key: "title",
                    label: "Title",
                    value: layoutItem.title || "",
                  },
                  {
                    key: "layout",
                    type: "custom",
                    label: "Layout",
                    value: layoutItem.layout || [],
                    customInput: AppObjectLayoutFieldGridEditor,
                    customInputProps: { model },
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
          RelatedList: {
            label: "Related List",
            Wrapper: WrapperRelatedList,
            popup: (component, layoutItem, respond, deleteItem) => {
              // Show tweak UI
              context.setDialog({
                display: true,
                title: component.label,
                form: [
                  {
                    key: "title",
                    label: "Title",
                    value: layoutItem.title ? layoutItem.title : "",
                    type: "text",
                  },
                  {
                    key: "object",
                    label: "Object",
                    value: layoutItem.object ? layoutItem.object : "",
                    type: "text",
                  },
                  {
                    key: "field",
                    label: "Field",
                    value: layoutItem.field ? layoutItem.field : "",
                    type: "text",
                  },
                  {
                    key: "displayfields",
                    label: "Display fields (comma seperated)",
                    value: layoutItem.displayfields || "",
                    type: "text",
                  },
                  {
                    key: "onlyVisibleWithResults",
                    label: "Only visible with results",
                    value: layoutItem.onlyVisibleWithResults || false,
                    type: "boolean",
                  },
                  {
                    key: "displayCard",
                    label: "Wrap in card",
                    value: layoutItem.displayCard || false,
                    type: "boolean",
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
          setLayout({ ...newLayout }); // Spread operator is required to force react to redraw
          setHasChanged(true);
        }}
      />
      {hasChanged && (
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
      )}
    </>
  );
};

export default AppActionManageObjectTabLayoutsDetail;
