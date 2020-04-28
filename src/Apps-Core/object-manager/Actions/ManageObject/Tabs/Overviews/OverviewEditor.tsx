import React, { useEffect, useState } from "react";
import {
  AppContextType,
  ModelOverviewType,
  ModelFieldType,
  ModelType,
  UIType,
} from "../../../../../../Utils/Types";
import {
  Paper,
  Typography,
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
import { map, filter, indexOf } from "lodash";

const AppActionManageObjectOverviewEditor: React.FC<{
  match: { params: { detailId } };
  context: AppContextType;
  fields: [ModelFieldType];
  model: ModelType;
}> = ({
  match: {
    params: { detailId },
  },
  context,
  fields,
  model,
}) => {
  // Global
  const UI: UIType = context.UI;

  // States & Hooks
  const [overview, setOverview] = useState<ModelOverviewType>();

  // Lifecycle
  useEffect(() => {
    setOverview(model.overviews[detailId]);
  }, [detailId]);

  if (!overview) return <UI.Loading />;

  return (
    <>
      <UI.Animations.AnimationContainer>
        <UI.Animations.AnimationItem>
          <div style={{ margin: "0 15px 15px 0" }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {overview.fields.map((fieldId) => {
                    const field: ModelFieldType = model.fields[fieldId];
                    return <TableCell key={fieldId}>{field.name}</TableCell>;
                  })}
                </TableRow>
              </TableHead>
            </Table>
          </div>
        </UI.Animations.AnimationItem>
        <div style={{ marginTop: 15, height: 500 }}>
          <Grid container>
            <Grid item xs={12} md={5} style={{ marginTop: 15 }}>
              <UI.Animations.AnimationItem>
                <Paper className="paper">
                  <Typography variant="h6">Available</Typography>
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
                </Paper>
              </UI.Animations.AnimationItem>
            </Grid>
            <Grid xs={12} md={1}></Grid>
            <Grid item xs={12} md={5} style={{ marginTop: 15 }}>
              <UI.Animations.AnimationItem>
                <Paper className="paper">
                  <Typography variant="h6">Selected</Typography>
                  <List>
                    {overview.fields.map((fieldId) => {
                      const field: ModelFieldType = model.fields[fieldId];
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
                </Paper>
              </UI.Animations.AnimationItem>
            </Grid>
          </Grid>
        </div>
      </UI.Animations.AnimationContainer>
      {model.overviews[detailId] !== overview && (
        <div style={{ position: "absolute", right: 15, bottom: 15 }}>
          <UI.Animations.AnimationContainer>
            <Fab
              color="primary"
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
          </UI.Animations.AnimationContainer>
        </div>
      )}
    </>
  );
};

export default AppActionManageObjectOverviewEditor;