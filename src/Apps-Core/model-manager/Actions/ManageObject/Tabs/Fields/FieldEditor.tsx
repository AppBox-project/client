import React, { useEffect, useState } from "react";
import {
  UIType,
  AppContextType,
  ModelType,
} from "../../../../../../Utils/Types";
import {
  Typography,
  Grid,
  Button,
  ListItem,
  List,
  ListItemText,
  ListSubheader,
  ListItemSecondaryAction,
  IconButton,
  Tooltip,
  Fab,
} from "@material-ui/core";
import { FaPlus, FaTrashAlt, FaSave } from "react-icons/fa";

const AppActionManageObjectTabFieldsEditor: React.FC<{
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
  const UI: UIType = context.UI;

  // States & Hooks
  const [field, setField] = useState<any>();

  // Lifecycle
  useEffect(() => {
    //@ts-ignore
    setField(model.fields[detailId]);
  }, [detailId]);

  // UI
  if (!field) return <UI.Loading />;

  return (
    <UI.Animations.AnimationContainer>
      <Grid container style={{ width: "100%" }}>
        <Grid item xs={12}>
          <UI.Animations.AnimationItem>
            <Grid container style={{ marginBottom: 15 }}>
              <Grid item xs={12} style={{ textAlign: "right" }}>
                <Button
                  style={{ color: "white", border: "white", marginRight: 15 }}
                  onClick={() => {
                    context.setDialog({
                      display: true,
                      title: "Change key",
                      content:
                        "Changing the key is usually not required, and requires you to update the layouts and overviews. Any data may be lost.",
                      form: [
                        { key: "newKey", label: "New key", value: detailId },
                      ],
                      buttons: [
                        {
                          label: "Change",
                          onClick: (response) => {
                            if (response.newKey) {
                              console.log(response.newKey);
                            }
                          },
                        },
                      ],
                    });
                  }}
                >
                  Change key
                </Button>
              </Grid>
            </Grid>
          </UI.Animations.AnimationItem>
          <UI.Animations.AnimationItem>
            <context.UI.Design.Card title="About this field" withBigMargin>
              <Grid container>
                <Grid
                  item
                  xs={12}
                  className="form-row"
                  style={{ display: "table-cell" }}
                >
                  <UI.Inputs.TextInput
                    label="Name"
                    value={field.name}
                    onChange={(value) => {
                      setField({ ...field, name: value });
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <UI.Inputs.CheckmarkInput
                    label="Required"
                    value={field.required}
                    onChange={(value) => {
                      setField({ ...field, required: value });
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <UI.Inputs.CheckmarkInput
                    label="Unique"
                    value={field.unique}
                    onChange={(value) => {
                      setField({ ...field, unique: value });
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <UI.Inputs.CheckmarkInput
                    label="Read-only"
                    value={field.typeArgs?.readonly || false}
                    onChange={(value) => {
                      setField({
                        ...field,
                        typeArgs: { ...field.typeArgs, readonly: value },
                      });
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <UI.Inputs.TextInput
                    label="Default value"
                    value={field.default}
                    onChange={(value) => {
                      setField({ ...field, default: value });
                    }}
                  />
                </Grid>
              </Grid>
            </context.UI.Design.Card>
          </UI.Animations.AnimationItem>
          <UI.Animations.AnimationItem>
            <context.UI.Design.Card withBigMargin title="Data type">
              <Grid container>
                <Grid
                  item
                  xs={12}
                  className="form-row"
                  style={{ display: "table-cell" }}
                >
                  <UI.Inputs.SelectInput
                    label="Field type"
                    value={field.type}
                    options={[
                      { value: "input", label: "Input" },
                      { value: "auto_name", label: "Automatic name" },
                      { value: "boolean", label: "Boolean" },
                      { value: "color", label: "Color" },
                      { value: "date", label: "Date" },
                      { value: "address", label: "Address" },
                      { value: "options", label: "Options" },
                      { value: "richtext", label: "Rich text" },
                      { value: "formula", label: "Formula" },
                      { value: "relationship", label: "Relationship" },
                      {
                        value: "relationship_m",
                        label: "Relationship (Many-To-Many)",
                      },

                      { value: "file", label: "File" },
                      { value: "picture", label: "Picture" },
                      { value: "qr", label: "QR-code" },
                      { value: "data", label: "Free data" },
                      { value: "custom", label: "Custom" },
                    ]}
                    onChange={(value) => {
                      setField({ ...field, type: value });
                    }}
                  />
                </Grid>
                {field.type === "input" && (
                  <>
                    <Grid item xs={6}>
                      <UI.Inputs.SelectInput
                        label="Input type"
                        value={field.typeArgs ? field.typeArgs.type : "text"}
                        options={[
                          { value: "text", label: "Text" },
                          { value: "password", label: "Password" },
                          { value: "number", label: "Number" },
                          { value: "phone", label: "Phone" },
                          { value: "email", label: "E-mail" },
                          { value: "url", label: "URL" },
                        ]}
                        onChange={(value) => {
                          setField({
                            ...field,
                            typeArgs: { ...field.typeArgs, type: value },
                          });
                        }}
                      />
                    </Grid>
                    {field.typeArgs?.type === "number" && (
                      <Grid item xs={6}>
                        <UI.Inputs.SelectInput
                          label="Number type"
                          value={field.typeArgs?.numberType || "regular"}
                          options={[
                            { value: "regular", label: "Regular" },
                            { value: "currency", label: "Currency" },
                          ]}
                          onChange={(value) => {
                            setField({
                              ...field,
                              typeArgs: {
                                ...field.typeArgs,
                                numberType: value,
                              },
                            });
                          }}
                        />
                      </Grid>
                    )}
                  </>
                )}
                {field.type === "options" && (
                  <>
                    <Grid item xs={12}>
                      <UI.Inputs.SelectInput
                        label="Display as"
                        value={
                          field.typeArgs ? field.typeArgs.display : "dropdown"
                        }
                        options={[
                          { value: "dropdown", label: "Dropdown" },
                          { value: "radio", label: "Radio buttons" },
                          { value: "checkmarks", label: "Checkmarks" },
                        ]}
                        onChange={(value) => {
                          setField({
                            ...field,
                            typeArgs: { ...field.typeArgs, display: value },
                          });
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <List>
                        <ListSubheader>
                          <ListItemSecondaryAction>
                            <Tooltip placement="left" title="Add option">
                              <IconButton
                                onClick={() => {
                                  context.setDialog({
                                    display: true,
                                    title: "Add options",
                                    form: [
                                      {
                                        key: "newOptions",
                                        label: "New options (comma seperated)",
                                      },
                                    ],
                                    buttons: [
                                      {
                                        label: "Add",
                                        onClick: (response) => {
                                          const newOptions = field.typeArgs
                                            ? field.typeArgs.options
                                              ? field.typeArgs.options
                                              : []
                                            : [];
                                          response.newOptions
                                            .split(",")
                                            .map((newOption) => {
                                              newOptions.push({
                                                label: newOption.trim(),
                                                key: newOption.trim(),
                                              });
                                            });
                                          setField({
                                            ...field,
                                            typeArgs: {
                                              ...field.typeArgs,
                                              options: [...newOptions],
                                            },
                                          });
                                        },
                                      },
                                    ],
                                  });
                                }}
                              >
                                <FaPlus style={{ width: 14, height: 14 }} />
                              </IconButton>
                            </Tooltip>
                          </ListItemSecondaryAction>
                          Available options
                        </ListSubheader>
                        {field.typeArgs ? (
                          field.typeArgs.options ? (
                            field.typeArgs.options.map((option) => {
                              return (
                                <ListItem key={option.value}>
                                  <ListItemText>{option.label}</ListItemText>
                                  <ListItemSecondaryAction>
                                    <IconButton
                                      onClick={() => {
                                        context.setDialog({
                                          display: true,
                                          title: "Delete or archive?",
                                          content: (
                                            <>
                                              <p>
                                                Deleting is permanent and
                                                requires remapping of data.
                                              </p>
                                              <p>Archiving can be undone.</p>
                                            </>
                                          ),
                                          buttons: [
                                            {
                                              label: "Do nothing",
                                              onClick: () => {},
                                            },
                                            {
                                              label: (
                                                <span style={{ color: "red" }}>
                                                  Delete
                                                </span>
                                              ),
                                              onClick: () => {},
                                            },
                                            {
                                              label: "Archive",
                                              onClick: () => {},
                                            },
                                          ],
                                        });
                                      }}
                                    >
                                      <FaTrashAlt
                                        style={{ width: 14, height: 14 }}
                                      />
                                    </IconButton>
                                  </ListItemSecondaryAction>
                                </ListItem>
                              );
                            })
                          ) : (
                            <ListItem>
                              <ListItemText>No items</ListItemText>
                            </ListItem>
                          )
                        ) : (
                          <ListItem>
                            <ListItemText>No items</ListItemText>
                          </ListItem>
                        )}
                        <ListSubheader>Archived options</ListSubheader>
                      </List>
                    </Grid>
                  </>
                )}
                {field.type === "richtext" && (
                  <Grid item xs={6}>
                    <UI.Inputs.SelectInput
                      label="Type"
                      value={field.typeArgs ? field.typeArgs.type : "regular"}
                      options={[
                        { value: "regular", label: "Regular" },
                        { value: "drafting", label: "Drafting" },
                      ]}
                      onChange={(value) => {
                        setField({
                          ...field,
                          typeArgs: { ...field.typeArgs, type: value },
                        });
                      }}
                    />
                  </Grid>
                )}
                {field.type === "formula" && (
                  <Grid item xs={12}>
                    <UI.Inputs.SelectInput
                      label="Output type"
                      value={field.typeArgs ? field.typeArgs.type : "text"}
                      options={[
                        { value: "text", label: "Text" },
                        { value: "number", label: "Number" },
                        { value: "boolean", label: "Boolean" },
                        { value: "picture", label: "Picture" },
                      ]}
                      onChange={(value) => {
                        setField({
                          ...field,
                          typeArgs: { ...field.typeArgs, type: value },
                        });
                      }}
                    />
                    <context.UI.Inputs.TextInput
                      label="Formula"
                      value={field.typeArgs?.formula || ""}
                      onChange={(value) => {
                        setField({
                          ...field,
                          typeArgs: { ...field.typeArgs, formula: value },
                        });
                      }}
                    />
                  </Grid>
                )}
                {field.type === "date" && (
                  <Grid item xs={6}>
                    <UI.Inputs.SelectInput
                      label="Type"
                      value={field.typeArgs ? field.typeArgs.type : "date"}
                      options={[
                        { value: "date", label: "Date" },
                        { value: "datetime", label: "Date/Time" },
                        { value: "time", label: "Time" },
                      ]}
                      onChange={(value) => {
                        setField({
                          ...field,
                          typeArgs: { ...field.typeArgs, type: value },
                        });
                      }}
                    />
                  </Grid>
                )}
                {(field.type === "relationship" ||
                  field.type === "relationship_m") && (
                  <Grid item xs={6}>
                    <ListObjectTypes
                      context={context}
                      UI={UI}
                      value={
                        field.typeArgs ? field.typeArgs.relationshipTo : ""
                      }
                      onChange={(value) => {
                        setField({
                          ...field,
                          typeArgs: {
                            ...field.typeArgs,
                            relationshipTo: value,
                          },
                        });
                      }}
                    />
                  </Grid>
                )}
                {field.type === "auto_name" && (
                  <Grid item xs={6}>
                    <UI.Inputs.Select
                      label="Mode"
                      value={field?.typeArgs?.mode}
                      options={[
                        { label: "Automatic numbering", value: "increment" },
                        { label: "Random", value: "random" },
                      ]}
                      onChange={(mode) => {
                        setField({
                          ...field,
                          typeArgs: { ...field.typeArgs, mode: mode.value },
                        });
                      }}
                    />
                    <UI.Inputs.TextInput
                      label="Prefix"
                      value={field?.typeArgs?.prefix}
                      onChange={(prefix) => {
                        setField({
                          ...field,
                          typeArgs: { ...field.typeArgs, prefix },
                        });
                      }}
                    />
                  </Grid>
                )}
                {field.type === "picture" && (
                  <UI.Inputs.CheckmarkInput
                    label="Set as banner"
                    value={field?.typeArgs?.asBanner}
                    onChange={(asBanner) => {
                      setField({
                        ...field,
                        typeArgs: { ...field.typeArgs, asBanner },
                      });
                    }}
                  />
                )}
                {field.type === "custom" && (
                  <Grid item xs={6}>
                    <UI.Inputs.TextInput
                      label="Custom key"
                      value={field?.typeArgs?.key || ""}
                      onChange={(key) => {
                        setField({
                          ...field,
                          typeArgs: { ...field.typeArgs, key },
                        });
                      }}
                    />
                  </Grid>
                )}
                {field.type === "color" && (
                  <UI.Inputs.CheckmarkInput
                    label="Set as object color"
                    value={field?.typeArgs?.asColor}
                    onChange={(asColor) => {
                      setField({
                        ...field,
                        typeArgs: { ...field.typeArgs, asColor },
                      });
                    }}
                  />
                )}
              </Grid>
            </context.UI.Design.Card>
          </UI.Animations.AnimationItem>
        </Grid>
        <Grid item xs={6}>
          <UI.Animations.AnimationItem>
            <context.UI.Design.Card withBigMargin>
              <Tooltip placement="left" title="Add validation">
                <IconButton
                  style={{ float: "right" }}
                  onClick={() => {
                    context.setDialog({
                      display: true,
                      title: "Add validation",
                      form: [{ label: "Validation", key: "validation" }],
                      buttons: [
                        {
                          label: "Add",
                          onClick: (response) => {
                            const validations = field.validations
                              ? field.validations
                              : [];
                            validations.push(response.validation);
                            setField({
                              ...field,
                              validations,
                            });
                          },
                        },
                      ],
                    });
                  }}
                >
                  <FaPlus style={{ height: 15, width: 15 }} />
                </IconButton>
              </Tooltip>
              <Typography variant="h5">Validations</Typography>
              <Typography variant="body2">
                Validations are rules that the data is tested to.
              </Typography>

              <List>
                {field.validations ? (
                  field.validations.map((validation) => {
                    return (
                      <ListItem
                        button
                        onClick={() => {
                          context.setDialog({
                            display: true,
                            title: "Transformation",
                          });
                        }}
                      >
                        <ListItemText>{validation}</ListItemText>
                      </ListItem>
                    );
                  })
                ) : (
                  <ListItem>No validations</ListItem>
                )}
              </List>
            </context.UI.Design.Card>
          </UI.Animations.AnimationItem>
        </Grid>
        <Grid item xs={6}>
          <UI.Animations.AnimationItem>
            <context.UI.Design.Card withBigMargin>
              <Tooltip placement="left" title="Add transformation">
                <IconButton
                  style={{ float: "right" }}
                  onClick={() => {
                    context.setDialog({
                      display: true,
                      title: "Add transformation",
                      form: [
                        { label: "Transformation", key: "transformation" },
                      ],
                      buttons: [
                        {
                          label: "Add",
                          onClick: (response) => {
                            const transformations = field.transformations
                              ? field.transformations
                              : [];
                            transformations.push(response.transformation);
                            setField({
                              ...field,
                              transformations,
                            });
                          },
                        },
                      ],
                    });
                  }}
                >
                  <FaPlus style={{ height: 15, width: 15 }} />
                </IconButton>
              </Tooltip>
              <Typography variant="h5">Transformators</Typography>
              <Typography variant="body2">
                Transformators transform the data <em>after</em> validating it
                and <em>before</em> saving it.
              </Typography>

              <List>
                {field.transformations ? (
                  field.transformations.map((transformation) => {
                    return (
                      <ListItem>
                        <ListItemText>{transformation}</ListItemText>
                      </ListItem>
                    );
                  })
                ) : (
                  <ListItem>No transformations</ListItem>
                )}
              </List>
            </context.UI.Design.Card>
          </UI.Animations.AnimationItem>
        </Grid>
        <Grid item xs={12}>
          <context.UI.Animations.AnimationItem>
            <context.UI.Design.Card withBigMargin title="Conditional display">
              <Typography variant="body2">
                Only display this field when the current object matches the
                following criteria.
              </Typography>
              <context.UI.Layouts.Specialized.ConditionDesigner
                model={model}
                value={field.conditions || []}
                onChange={(conditions) => {
                  setField({
                    ...field,
                    conditions,
                  });
                }}
              />
            </context.UI.Design.Card>
          </context.UI.Animations.AnimationItem>
        </Grid>
        {field !== model.fields[detailId] && (
          <Grid item xs={12}>
            <UI.Animations.AnimationItem>
              <Fab
                style={{ position: "fixed", bottom: 15, right: 15, zIndex: 30 }}
                color="primary"
                onClick={() => {
                  context.updateModel(
                    model.key,
                    {
                      ...model,
                      fields: { ...model.fields, [detailId]: field },
                    },
                    model._id
                  );
                }}
              >
                <FaSave style={{ width: 18, height: 18 }} />
              </Fab>
            </UI.Animations.AnimationItem>
          </Grid>
        )}
      </Grid>
    </UI.Animations.AnimationContainer>
  );
};

export default AppActionManageObjectTabFieldsEditor;

const ListObjectTypes: React.FC<{
  context: AppContextType;
  UI: UIType;
  value: string;
  onChange: (id: string) => void;
}> = ({ context, UI, value, onChange }) => {
  // States & hooks
  const [objectTypes, setObjectTypes] = useState<any[]>([]);

  // Lifecycle
  useEffect(() => {
    context.getModels({}, (response) => {
      if (response.success) {
        const t = [];
        response.data.map((rd) => {
          t.push({ value: rd.key, label: rd.name });
        });
        setObjectTypes(t);
      } else {
        console.log(response.reason);
      }
    });
  }, []);

  // UI
  if (!objectTypes) return <UI.Loading />;

  return (
    <UI.Inputs.SelectInput
      label="Relationship to"
      value={value}
      options={objectTypes}
      onChange={onChange}
    />
  );
};
