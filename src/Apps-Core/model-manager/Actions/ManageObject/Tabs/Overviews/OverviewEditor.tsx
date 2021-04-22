import React, { useEffect, useState } from "react";
import {
  AppContextType,
  ModelOverviewType,
  ModelFieldType,
  ModelType,
  UIType,
  ValueListItemType,
  ModelActionType,
} from "../../../../../../Utils/Types";
import {
  Table,
  TableHead,
  TableCell,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  ListItemAvatar,
  TableRow,
  Fab,
} from "@material-ui/core";
import {
  FaAngleUp,
  FaAngleDown,
  FaAngleLeft,
  FaAngleRight,
  FaSave,
} from "react-icons/fa";
import map from "lodash/map";
import filter from "lodash/filter";
import indexOf from "lodash/indexOf";

const AppActionManageObjectOverviewEditor: React.FC<{
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
  const [overview, setOverview] = useState<ModelOverviewType>();
  const [actionList, setActionList] = useState<ValueListItemType[]>([]);
  const [serverActions, setServerActions] = useState<ValueListItemType[]>([]);

  // Lifecycle
  useEffect(() => {
    const request = context.getObjects(
      "actions",
      { "data.active": true },
      (response) => {
        const nl: ValueListItemType[] = [];
        response.data.map((r) => {
          if (r.data?.data?.triggers?.manual?.model === model.key) {
            nl.push({
              label: r.data.name,
              value: r._id,
              args: { mode: "free" },
            });
            if (r.data.data.triggers.manual.varSingle) {
              nl.push({
                label: r.data.name,
                value: r._id,
                args: { mode: "single" },
              });
            }

            if (r.data.data.triggers.manual.varMany)
              nl.push({
                label: r.data.name,
                value: r._id,
                args: { mode: "multiple" },
              });
          }
        });

        setServerActions(nl);
      }
    );
    return () => request.stop();
  }, []);
  useEffect(() => {
    setOverview(model.overviews[detailId]);
  }, [detailId]);
  useEffect(() => {
    const nl: ValueListItemType[] = [
      { label: "Delete", value: "delete", args: { mode: "single" } },
      { label: "Delete", value: "delete", args: { mode: "multiple" } },
      { label: "Merge", value: "merge", args: { mode: "multiple" } },
      ...serverActions,
    ];
    map(model.actions, (action: ModelActionType, actionKey) =>
      nl.push({ label: action.label, value: actionKey, args: { ...action } })
    );

    setActionList(nl);
  }, [model, serverActions]);

  if (!overview) return <UI.Loading />;
  return (
    <div style={{ margin: 15 }}>
      <UI.Animations.AnimationContainer>
        <UI.Animations.AnimationItem>
          <div style={{ margin: "0 15px 15px 0" }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {overview.fields.map((fieldId) => {
                    const field: ModelFieldType = model.fields[fieldId];
                    if (!field)
                      return (
                        <TableCell key={fieldId}>
                          Field {fieldId} not found
                        </TableCell>
                      );
                    return <TableCell key={fieldId}>{field.name}</TableCell>;
                  })}
                </TableRow>
              </TableHead>
            </Table>
          </div>
        </UI.Animations.AnimationItem>
        <div style={{ marginTop: 15, height: 500 }}>
          <Grid container>
            <Grid item xs={12} md={6}>
              <UI.Animations.AnimationItem>
                <context.UI.Design.Card
                  withBigMargin
                  title="Available"
                  shadow="diffuse"
                >
                  <List>
                    {map(model.fields, (field, key: string) => {
                      if (!overview.fields.includes(key)) {
                        return (
                          <ListItem key={key}>
                            <ListItemText>{field.name}</ListItemText>
                            {overview.fields.length < 12 && (
                              <ListItemSecondaryAction>
                                <IconButton
                                  onClick={() => {
                                    const newFields = overview.fields;
                                    newFields.push(key);
                                    setOverview({
                                      ...overview,
                                      fields: newFields,
                                    });
                                  }}
                                >
                                  <FaAngleRight />
                                </IconButton>
                              </ListItemSecondaryAction>
                            )}
                          </ListItem>
                        );
                      }
                    })}
                  </List>
                </context.UI.Design.Card>
              </UI.Animations.AnimationItem>
            </Grid>
            <Grid item xs={12} md={6}>
              <UI.Animations.AnimationItem>
                <context.UI.Design.Card
                  withBigMargin
                  title="Selected"
                  shadow="diffuse"
                >
                  <List>
                    {overview.fields.map((fieldId) => {
                      const field: ModelFieldType = model.fields[fieldId];
                      if (!field)
                        return (
                          <TableCell key={fieldId}>
                            Field {fieldId} not found.
                          </TableCell>
                        );
                      return (
                        <ListItem key={fieldId}>
                          {overview.fields.length > 1 && (
                            <ListItemAvatar>
                              <IconButton
                                onClick={() => {
                                  setOverview({
                                    ...overview,
                                    fields: filter(overview.fields, (o) => {
                                      return o !== fieldId;
                                    }),
                                  });
                                }}
                              >
                                <FaAngleLeft />
                              </IconButton>
                            </ListItemAvatar>
                          )}
                          <ListItemText>{field.name}</ListItemText>
                          {overview.fields.length > 1 && (
                            <ListItemSecondaryAction>
                              <IconButton
                                disabled={fieldId === overview.fields[0]}
                                onClick={() => {
                                  const newFields = overview.fields;
                                  const i = indexOf(newFields, fieldId);
                                  newFields[i] = newFields[i - 1];
                                  newFields[i - 1] = fieldId;
                                  setOverview({
                                    ...overview,
                                    fields: newFields,
                                  });
                                }}
                              >
                                <FaAngleUp />
                              </IconButton>
                              <IconButton
                                disabled={
                                  fieldId ===
                                  overview.fields[overview.fields.length - 1]
                                }
                                onClick={() => {
                                  const newFields = overview.fields;
                                  const i = indexOf(newFields, fieldId);
                                  newFields[i] = newFields[i + 1];
                                  newFields[i + 1] = fieldId;
                                  setOverview({
                                    ...overview,
                                    fields: newFields,
                                  });
                                }}
                              >
                                <FaAngleDown />
                              </IconButton>
                            </ListItemSecondaryAction>
                          )}
                        </ListItem>
                      );
                    })}
                  </List>
                </context.UI.Design.Card>
              </UI.Animations.AnimationItem>
            </Grid>
            <Grid item xs={12}>
              <UI.Animations.AnimationItem>
                <context.UI.Design.Card
                  withBigMargin
                  title="Buttons"
                  shadow="diffuse"
                >
                  <Grid container spacing={3}>
                    <Grid item xs={4}>
                      <context.UI.Inputs.Select
                        multiple
                        label="Global buttons"
                        value={overview?.buttons?.global}
                        options={filter(
                          actionList,
                          (o) => o.args.mode === "free"
                        )}
                        onChange={(global) => {
                          setOverview({
                            ...overview,
                            buttons: { ...(overview.buttons || {}), global },
                          });
                        }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <context.UI.Inputs.Select
                        multiple
                        label="Single object buttons"
                        value={overview?.buttons?.single}
                        options={filter(
                          actionList,
                          (o) => o.args.mode === "single"
                        )}
                        onChange={(single) => {
                          setOverview({
                            ...overview,
                            buttons: { ...(overview.buttons || {}), single },
                          });
                        }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <context.UI.Inputs.Select
                        multiple
                        label="Multi-select buttons"
                        value={overview?.buttons?.multiple}
                        options={filter(
                          actionList,
                          (o) => o.args.mode === "multiple"
                        )}
                        onChange={(multiple) => {
                          setOverview({
                            ...overview,
                            buttons: { ...(overview.buttons || {}), multiple },
                          });
                        }}
                      />
                    </Grid>
                  </Grid>
                </context.UI.Design.Card>
              </UI.Animations.AnimationItem>
            </Grid>
          </Grid>
        </div>
      </UI.Animations.AnimationContainer>
      <Fab
        color="primary"
        style={{
          position: "absolute",
          right: 15,
          bottom: 75,
          zIndex: 55,
        }}
        onClick={() => {
          context.updateModel(
            model.key,
            {
              ...model,
              overviews: { ...model.overviews, [detailId]: overview },
            },
            model._id
          );
        }}
      >
        <FaSave />
      </Fab>
    </div>
  );
};

export default AppActionManageObjectOverviewEditor;
