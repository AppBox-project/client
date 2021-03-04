import React, { useState, useEffect } from "react";
import {
  AppContextType,
  ModelType,
  LayoutType,
  ValueListItemType,
  InterfaceType,
  CustomFormInputType,
} from "../../../../../../Utils/Types";
import { Fab, Grid, Divider, Typography } from "@material-ui/core";
import LayoutDesigner from "../../../../../../Components/LayoutDesigner";
import { FaSave } from "react-icons/fa";
import { map, find, filter } from "lodash";
import {
  AnimationContainer,
  AnimationItem,
} from "../../../../../../Components/Apps/Apps/AppUI/Animations";
import Card from "../../../../../../Components/Design/Card";
import { useHistory } from "react-router-dom";
import AppObjectLayoutFieldGridEditor from "./FieldGridEditor";
import InputSelect from "../../../../../../Components/Inputs/Select";

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
  const [layout, setLayout] = useState<LayoutType>();
  const history = useHistory();
  const [customButtons, setCustomButtons] = useState<ValueListItemType[]>([]);
  const [interfaceList, setInterfaceList] = useState<ValueListItemType[]>([]);

  // Lifecycle
  useEffect(() => {
    // Interfaces
    const nl: ValueListItemType[] = [];
    const interfaceRequest = context.getObjects(
      "interfaces",
      {},
      (response) => {
        response.data.map((intObject: InterfaceType) =>
          nl.push({
            label: intObject.data.name,
            value: intObject._id,
            args: intObject,
          })
        );
        setInterfaceList(nl);
      }
    );

    // Other
    if ((model.layouts || {})[detailId]) {
      const newFieldList = [];
      map(model.fields, (field, key) => {
        newFieldList.push({ value: key, label: field.name });
      });
      setFieldList(newFieldList);
      setLayout(model.layouts[detailId]);
    } else {
      history.replace(`/model-manager/${model.key}/layouts`); // Redirect back to overview if there is no such layout
    }

    // Custom buttons
    map(model?.extensions || {}, (value, key) => {
      if (value.active) {
        import(
          `../../../../../../Components/Object/Extensions/${key}/index.tsx`
        ).then(async (info) => {
          const getInfo = info.default;
          const extension = await getInfo(model.extensions[key], context);
          map(extension.provides?.buttons, (button, buttonKey) => {
            setCustomButtons([
              ...customButtons,
              { value: `${key}-${buttonKey}`, label: button.label },
            ]);
          });
        });
      }
    });

    return () => {};
  }, [model, detailId]);

  // UI
  if (!fieldList || !layout) return <context.UI.Loading />;

  const buttonOptions = [
    { label: "Delete", value: "delete" },
    { label: "Clone", value: "clone" },
    { label: "Archive", value: "archive" },
    ...customButtons,
  ];

  return (
    <context.UI.Design.Card withBigMargin withoutPadding>
      <Grid container spacing={3} style={{ padding: 15 }}>
        <Grid item xs={12} md={6}>
          <Typography variant="body1">Actions</Typography>
          <InputSelect
            label="Actions"
            multiple
            options={buttonOptions}
            value={layout.buttons}
            onChange={(value) => {
              setLayout({ ...layout, buttons: value }); // Spread operator is required to force react to redraw
              setHasChanged(true);
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="body1">Facts bar</Typography>
          <InputSelect
            label="Facts bar"
            multiple
            options={fieldList}
            value={layout.factsBar}
            onChange={(value) => {
              setLayout({ ...layout, factsBar: value }); // Spread operator is required to force react to redraw
              setHasChanged(true);
            }}
          />
        </Grid>
      </Grid>
      <Divider style={{ margin: 15 }} />
      <LayoutDesigner
        componentList={{
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
                    value: layoutItem.field || "",
                    type: "dropdown",
                    dropdownOptions: fieldList,
                  },
                  {
                    label: "Hide while viewing",
                    key: "hideView",
                    type: "boolean",
                  },
                  {
                    label: "Hide while editing",
                    key: "hideEdit",
                    type: "boolean",
                  },
                  {
                    label: "Remove label",
                    key: "noLabel",
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
                  {
                    key: "scrollIndependently",
                    label: "Scroll independently",
                    value: layoutItem.scrollIndependently,
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
          TabContainer: {
            label: "Tab container",
            droppable: true,
            popup: (component, layoutItem, respond, deleteItem) => {
              // Show tweak UI
              context.setDialog({
                display: true,
                title: component.label,
                form: [
                  {
                    label: "Tabs identifier",
                    key: "identifier",
                    value: layoutItem.identifier,
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
          TabItem: {
            label: "Tab Item",
            droppable: true,
            dynamicLabel: "title",
            popup: (component, layoutItem, respond, deleteItem) => {
              // Show tweak UI
              context.setDialog({
                display: true,
                title: component.label,
                form: [
                  { label: "Title", key: "title", value: layoutItem.title },
                  {
                    label: "Identifier",
                    key: "identifier",
                    value: layoutItem.identifier,
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
                    label: "With big margin",
                    key: "withBigMargin",
                    value: layoutItem.withBigMargin,
                    type: "boolean",
                  },
                  {
                    label: "With small margin",
                    key: "withSmallMargin",
                    value: layoutItem.withSmallMargin,
                    type: "boolean",
                  },
                  {
                    label: "Only apply margins to the sides",
                    key: "sideMarginOnly",
                    value: layoutItem.sideMarginOnly,
                    type: "boolean",
                  },
                  {
                    label: "Hide while viewing",
                    key: "hideView",
                    type: "boolean",
                  },
                  {
                    label: "Hide while editing",
                    key: "hideEdit",
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
          Interface: {
            label: "Custom interface",
            dynamicLabel: "interface",
            popup: (component, layoutItem, respond, deleteItem) => {
              // Show tweak UI
              context.setDialog({
                display: true,
                title: "Display custom interface",
                content:
                  "Custom interfaces can be designed from settings and displayed within the context of the current lay-out.",
                form: [
                  {
                    key: "interface",
                    label: "Interface",
                    value: layoutItem.interface,
                    type: "dropdown",
                    dropdownOptions: interfaceList,
                  },
                  {
                    key: "setVariables",
                    value: layoutItem.setVariables,
                    label: "Set variables from context",
                    type: "custom",
                    customInput: CustomInputInterfaceSetVariablesFromContext,
                    customInputProps: {
                      model,
                      test: { layoutItem, interfaceList },
                      interfaceObject: (
                        find(
                          interfaceList,
                          (o) => o.args._id === layoutItem.interface
                        ) || { args: {} }
                      ).args,
                    },
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
          Attachments: {
            label: "Attachments",

            popup: (component, layoutItem, respond, deleteItem) => {
              // Show tweak UI
              context.setDialog({
                display: true,
                title: component.label,
                form: [
                  {
                    key: "key",
                    label: "Key",
                    value: layoutItem.key || "",
                    type: "text",
                  },
                  {
                    key: "allowUpload",
                    label: "Allow uploading",
                    value: layoutItem.allowUpload,
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
          FactsBar: {
            label: "Facts bar",

            popup: (component, layoutItem, respond, deleteItem) => {
              // Show tweak UI
              context.setDialog({
                display: true,
                title: component.label,
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
            dynamicLabel: "title",

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
                    key: "valueCopyFields",
                    label: "Linkedfields (target=source, comma seperated)",
                    value: layoutItem.valueCopyFields || "",
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
                  {
                    label: "With big margin",
                    key: "withBigMargin",
                    value: layoutItem.withBigMargin,
                    type: "boolean",
                  },
                  {
                    label: "With small margin",
                    key: "withSmallMargin",
                    value: layoutItem.withSmallMargin,
                    type: "boolean",
                  },
                  {
                    label: "Only apply margins to the sides",
                    key: "sideMarginOnly",
                    value: layoutItem.sideMarginOnly,
                    type: "boolean",
                  },
                  {
                    label: "Include add button",
                    key: "addButton",
                    value: layoutItem.addButton,
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
          DetailedRelatedList: {
            label: "Detailed related list",
            Wrapper: WrapperRelatedList,
            dynamicLabel: "title",

            popup: (component, layoutItem, respond, deleteItem) => {
              // Show tweak UI
              context.setDialog({
                display: true,
                title: component.label,
                form: [
                  {
                    key: "title",
                    label: "Title",
                    value: layoutItem.title || "",
                    type: "text",
                  },
                  {
                    key: "model",
                    label: "Model",
                    value: layoutItem.model || "",
                    type: "text",
                  },
                  {
                    key: "field",
                    label: "Field",
                    value: layoutItem.field || "",
                    type: "text",
                  },
                  {
                    key: "layoutId",
                    label: "Lay-out ID",
                    value: layoutItem.layoutId || "",
                    type: "text",
                  },
                  {
                    key: "emptyMessage",
                    label: "Empty message",
                    value: layoutItem.emptyMessage || "",
                    type: "text",
                  },
                  {
                    key: "createNew",
                    label: "Enable creation",
                    value: layoutItem.createNew,
                    type: "boolean",
                  },
                  {
                    key: "addLayout",
                    label: "Create new layout",
                    value: layoutItem.addLayout || "",
                    type: "text",
                    onlyDisplayWhen: { createNew: true },
                  },
                  {
                    key: "valueCopyFields",
                    label: "Value copy fields (target=source), comma seperated",
                    value: layoutItem.valueCopyFields || "",
                    type: "text",
                    onlyDisplayWhen: { createNew: true },
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
                      console.log(response);

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
          AppProvided: {
            label: "App provided",
            popup: (component, layoutItem, respond, deleteItem) => {
              // Show tweak UI
              context.setDialog({
                display: true,
                title: component.label,
                form: [
                  {
                    label: "Identifier",
                    key: "identifier",
                    value: layoutItem.identifier,
                    type: "text",
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
          style={{ position: "fixed", bottom: 15, right: 15, zIndex: 55 }}
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
    </context.UI.Design.Card>
  );
};

export default AppActionManageObjectTabLayoutsDetail;

const CustomInputInterfaceSetVariablesFromContext: React.FC<CustomFormInputType> = ({
  label,
  interfaceObject,
  context,
  onChange,
  value,
}) => {
  //Vars
  const [options, setOptions] = useState<ValueListItemType[]>([]);
  const [hasVariables, setHasVariables] = useState<Boolean>();

  // Lifecycle
  useEffect(() => {
    const nl: ValueListItemType[] = [];
    map(
      (interfaceObject as InterfaceType).data?.data?.variables,
      (value, key) => {
        if (value.input_var) {
          nl.push({ label: value.label, value: key, args: value });
        }
      }
    );
    setOptions(nl);
    nl.length > 0 ? setHasVariables(true) : setHasVariables(false);
  }, [interfaceObject]);

  // UI
  return (
    <>
      <Typography variant="body1">{label}</Typography>
      {hasVariables === false &&
        "This interface has no variables available for input."}
      {hasVariables && (
        <>
          <context.UI.Inputs.Select
            label="Assign object to"
            options={filter(options, (o) => o.args.type === "object")}
            value={value?.object}
            onChange={(object) => {
              onChange({ ...value, object });
            }}
          />
          <context.UI.Inputs.Select
            label="Assign objectId to"
            options={filter(options, (o) => o.args.type === "string")}
            value={value?.id}
            onChange={(id) => {
              onChange({ ...value, id });
            }}
          />
        </>
      )}
    </>
  );
};
