import React, { useEffect, useState } from "react";
import {
  UIType,
  AppContextType,
  ModelType,
} from "../../../../../../Utils/Types";
import {
  Paper,
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
} from "@material-ui/core";
import FormulaEditor from "../../../../../../Components/FormulaEditor";
import { FaPlus, FaTrashAlt } from "react-icons/fa";

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
  const [formulaDeps, setFormulaDeps] = useState();

  // Lifecycle
  useEffect(() => {
    //@ts-ignore
    setField(model.fields[detailId]);
  }, [detailId]);

  // UI
  if (!field) return <UI.Loading />;

  return (
    <UI.Animations.AnimationContainer>
      <Grid container style={{ width: "100%", padding: 15 }}>
        <Grid item xs={12}>
          <UI.Animations.AnimationItem>
            <Grid container style={{ marginBottom: 15 }}>
              <Grid item xs={12} style={{ textAlign: "right" }}>
                <Button
                  variant="outlined"
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
            <Paper className="paper" style={{ margin: "0 0 15px 0" }}>
              <Typography variant="h6">Options</Typography>
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
                <Grid item xs={12} md={6}>
                  <UI.Inputs.CheckmarkInput
                    label="Required"
                    value={field.required}
                    onChange={(value) => {
                      setField({ ...field, required: value });
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <UI.Inputs.CheckmarkInput
                    label="Unique"
                    value={field.unique}
                    onChange={(value) => {
                      setField({ ...field, unique: value });
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
            </Paper>
          </UI.Animations.AnimationItem>
          <UI.Animations.AnimationItem>
            <Paper className="paper" style={{ margin: "0 0 15px 0" }}>
              <Typography variant="h6">Type</Typography>
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
                      { value: "boolean", label: "Boolean" },
                      { value: "color", label: "Color" },
                      { value: "date", label: "Date" },
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
                      { value: "data", label: "Free data" },
                    ]}
                    onChange={(value) => {
                      setField({ ...field, type: value });
                    }}
                  />
                </Grid>
                {field.type === "input" && (
                  <Grid item xs={6}>
                    <UI.Inputs.SelectInput
                      label="Input type"
                      value={field.typeArgs ? field.typeArgs.type : "text"}
                      options={[
                        { value: "text", label: "Text" },
                        { value: "password", label: "Password" },
                        { value: "email", label: "E-mail" },
                        { value: "number", label: "Number" },
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
                    richtext
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
                    <FormulaEditor
                      formulaContext={model.key}
                      onChange={(formula, deps) => {
                        setFormulaDeps(deps);

                        setField({
                          ...field,
                          typeArgs: {
                            ...field.typeArgs,
                            formula,
                            dependencies: formulaDeps,
                          },
                        });
                      }}
                      value={field.typeArgs ? field.typeArgs.formula : ""}
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
              </Grid>
            </Paper>
          </UI.Animations.AnimationItem>
        </Grid>
        <Grid item xs={6}>
          <UI.Animations.AnimationItem>
            <Paper className="paper" style={{ margin: "0 7px 0 0" }}>
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
            </Paper>
          </UI.Animations.AnimationItem>
        </Grid>
        <Grid item xs={6}>
          <UI.Animations.AnimationItem>
            <Paper className="paper" style={{ margin: "0 0 0 7px" }}>
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
              <Typography variant="h5">Transformations</Typography>
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
            </Paper>
          </UI.Animations.AnimationItem>
        </Grid>
        {field !== model.fields[detailId] && (
          <Grid item xs={12}>
            <UI.Animations.AnimationItem>
              <Button
                style={{ marginTop: 15 }}
                fullWidth
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

                  if (formulaDeps) {
                    context
                      .setFieldDependencies(model.key, formulaDeps, detailId)
                      .then(
                        (yes) => {
                          console.log(yes);
                        },
                        (no) => {
                          console.log(no);
                        }
                      );
                  }
                }}
              >
                Save
              </Button>
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
  const [objectTypes, setObjectTypes] = useState();

  // Lifecycle
  useEffect(() => {
    context.getTypes({}, (response) => {
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
