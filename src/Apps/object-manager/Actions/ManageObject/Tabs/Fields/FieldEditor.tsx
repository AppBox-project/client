import React, { useEffect, useState, ContextType } from "react";
import {
  UIType,
  ModelFieldType,
  AppContextType,
  TypeType
} from "../../../../../../Utils/Types";
import {
  Paper,
  Typography,
  Grid,
  Button,
  ListItem,
  List,
  ListItemText
} from "@material-ui/core";
import FormulaEditor from "../../../../../../Components/FormulaEditor";

const AppActionManageObjectTabFieldsEditor: React.FC<{
  match: { params: { object; fieldId } };
  setCurrentField: (field: string) => void;
  UI: UIType;
  context: AppContextType;
  fields: [ModelFieldType];
  model: TypeType;
}> = ({
  match: {
    params: { fieldId }
  },
  context,
  UI,
  fields,
  setCurrentField,
  model
}) => {
  // Global
  // States & Hooks
  const [field, setField] = useState();
  const [formulaDeps, setFormulaDeps] = useState();

  // Lifecycle
  useEffect(() => {
    setCurrentField(fieldId);
    setField(fields[fieldId]);
    return () => {
      setCurrentField(null);
    };
  }, [fieldId]);

  // UI
  if (!field) return <UI.Loading />;
  return (
    <UI.AnimationContainer>
      <Grid container style={{ width: "100%" }}>
        <Grid item xs={12}>
          <UI.AnimationItem>
            <Grid container style={{ marginBottom: 15 }}>
              <Grid item xs={10}>
                <Typography variant="h5">{field.name}</Typography>
              </Grid>
              <Grid item xs={2} style={{ textAlign: "right" }}>
                <Button
                  onClick={() => {
                    context.setDialog({
                      display: true,
                      title: "Change key",
                      content:
                        "Changing the key is usually not required, and requires you to update the layouts and overviews. Any data may be lost.",
                      form: [
                        { key: "newKey", label: "New key", value: fieldId }
                      ],
                      buttons: [
                        {
                          label: "Change",
                          onClick: response => {
                            if (response.newKey) {
                              console.log(response.newKey);
                            }
                          }
                        }
                      ]
                    });
                  }}
                >
                  Change key
                </Button>
              </Grid>
            </Grid>
          </UI.AnimationItem>
          <UI.AnimationItem>
            <Paper className="paper" style={{ margin: "0 0 15px 0" }}>
              <Typography variant="h6">Options</Typography>
              <Grid container>
                <Grid
                  item
                  xs={12}
                  className="form-row"
                  style={{ display: "table-cell" }}
                >
                  <UI.Forms.TextInput
                    label="Name"
                    value={field.name}
                    onChange={value => {
                      setField({ ...field, name: value });
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <UI.Forms.CheckmarkInput
                    label="Required"
                    value={field.required}
                    onChange={value => {
                      setField({ ...field, required: value });
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <UI.Forms.CheckmarkInput
                    label="Unique"
                    value={field.unique}
                    onChange={value => {
                      setField({ ...field, unique: value });
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>
          </UI.AnimationItem>
          <UI.AnimationItem>
            <Paper className="paper" style={{ margin: "0 0 15px 0" }}>
              <Typography variant="h6">Type</Typography>
              <Grid container>
                <Grid
                  item
                  xs={12}
                  className="form-row"
                  style={{ display: "table-cell" }}
                >
                  <UI.Forms.SelectInput
                    label="Field type"
                    value={field.type}
                    options={[
                      { value: "input", label: "Input" },
                      { value: "boolean", label: "Boolean" },
                      { value: "options", label: "Options" },
                      { value: "textinput", label: "Text input" },
                      { value: "formula", label: "Formula" },
                      { value: "relationship", label: "Relationship" }
                    ]}
                    onChange={value => {
                      setField({ ...field, type: value });
                    }}
                  />
                </Grid>
                {field.type === "input" && (
                  <Grid item xs={6}>
                    <UI.Forms.SelectInput
                      label="Input type"
                      value={field.typeArgs ? field.typeArgs.type : "text"}
                      options={[
                        { value: "text", label: "Text" },
                        { value: "password", label: "Password" },
                        { value: "email", label: "E-mail" },
                        { value: "number", label: "Number" }
                      ]}
                      onChange={value => {
                        setField({
                          ...field,
                          typeArgs: { ...field.typeArgs, type: value }
                        });
                      }}
                    />
                  </Grid>
                )}
                {field.type === "options" && (
                  <>
                    <Grid item xs={6}>
                      <UI.Forms.SelectInput
                        label="Display as"
                        value={
                          field.typeArgs ? field.typeArgs.display : "dropdown"
                        }
                        options={[
                          { value: "dropdown", label: "Dropdown" },
                          { value: "radio", label: "Radio buttons" },
                          { value: "checkmarks", label: "Checkmarks" }
                        ]}
                        onChange={value => {
                          setField({
                            ...field,
                            typeArgs: { ...field.typeArgs, display: value }
                          });
                        }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      {" "}
                    </Grid>
                    <Grid item xs={12}>
                      <UI.Forms.TextInput
                        label="Options"
                        multiline
                        value={field.typeArgs ? field.typeArgs.options : ""}
                        onChange={value => {
                          setField({ ...field, options: value });
                        }}
                      />
                    </Grid>
                  </>
                )}
                {field.type === "textinput" && (
                  <Grid item xs={6}>
                    <UI.Forms.CheckmarkInput
                      label="With markdown?"
                      value={field.typeArgs ? field.typeArgs.markdown : false}
                      onChange={value => {
                        setField({
                          ...field,
                          typeArgs: { ...field.typeArgs, markdown: value }
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
                          typeArgs: { ...field.typeArgs, formula }
                        });
                      }}
                      value={field.typeArgs ? field.typeArgs.formula : ""}
                    />
                  </Grid>
                )}

                {field.type === "relationship" && (
                  <Grid item xs={6}>
                    <ListObjectTypes
                      context={context}
                      UI={UI}
                      value={
                        field.typeArgs ? field.typeArgs.relationshipTo : ""
                      }
                      onChange={value => {
                        setField({
                          ...field,
                          typeArgs: { ...field.typeArgs, relationshipTo: value }
                        });
                      }}
                    />
                  </Grid>
                )}
              </Grid>
            </Paper>
          </UI.AnimationItem>
        </Grid>
        <Grid item xs={6}>
          <UI.AnimationItem>
            <ValidationsList
              validations={field.validations}
              context={context}
            />
          </UI.AnimationItem>
        </Grid>
        <Grid item xs={6}>
          <UI.AnimationItem>
            <TransformationsList
              transformations={field.transformations}
              context={context}
            />
          </UI.AnimationItem>
        </Grid>
        {field !== fields[fieldId] && (
          <Grid item xs={12}>
            <UI.AnimationItem>
              <Button
                style={{ marginTop: 15 }}
                fullWidth
                color="primary"
                onClick={() => {
                  context.updateModel(
                    model.key,
                    {
                      ...model,
                      fields: { ...model.fields, [fieldId]: field }
                    },
                    model._id
                  );

                  if (formulaDeps) {
                    context
                      .setFieldDependencies(model.key, formulaDeps, fieldId)
                      .then(
                        yes => {
                          console.log(yes);
                        },
                        no => {
                          console.log(no);
                        }
                      );
                  }
                }}
              >
                Save
              </Button>
            </UI.AnimationItem>
          </Grid>
        )}
      </Grid>
    </UI.AnimationContainer>
  );
};

const ValidationsList: React.FC<{
  validations: [string];
  context: AppContextType;
}> = ({ validations, context }) => {
  return (
    <Paper className="paper" style={{ margin: "0 7px 0 0" }}>
      <Typography variant="h5">Validations</Typography>
      <List>
        {validations ? (
          validations.map(validation => {
            return (
              <ListItem
                button
                onClick={() => {
                  context.setDialog({
                    display: true,
                    title: "Transformation"
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
  );
};

const TransformationsList: React.FC<{
  transformations: [string];
  context: AppContextType;
}> = ({ transformations }) => {
  return (
    <Paper className="paper" style={{ margin: "0 0 0 7px" }}>
      <Typography variant="h5">Transformations</Typography>
      <List>
        {transformations ? (
          transformations.map(transformation => {
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
    context.getTypes({}, response => {
      if (response.success) {
        const t = [];
        response.data.map(rd => {
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
    <UI.Forms.SelectInput
      label="Relationship to"
      value={value}
      options={objectTypes}
      onChange={onChange}
    />
  );
};
