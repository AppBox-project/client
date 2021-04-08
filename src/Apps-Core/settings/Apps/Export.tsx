import {
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@material-ui/core";
import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useEffect } from "reactn";
import {
  AppContextType,
  AppType,
  ModelType,
  SelectOptionType,
} from "../../../Utils/Types";
import map from "lodash/map";
import find from "lodash/find";

const AppsDetailExport: React.FC<{
  app: AppType;
  context: AppContextType;
}> = ({ app, context }) => {
  // Vars
  const [exportData, setExportData] = useState<any>({});
  const [allModels, setAllModels] = useState<ModelType[]>();
  const [modelList, setModelList] = useState<SelectOptionType[]>();

  // Lifecycle
  useEffect(() => {
    context.getModels({}, (response) => {
      if (response.success) {
        const newList: SelectOptionType[] = [];
        response.data.map((model: ModelType) =>
          newList.push({ label: model.name_plural, value: model.key })
        );
        setModelList(newList);
        setAllModels(response.data);
      } else {
        console.log(response);
      }
    });
  }, []);
  useEffect(() => {
    setExportData(app.data);
  }, [app]);

  // UI
  if (!allModels) return <context.UI.Loading />;
  return (
    <context.UI.Animations.Animation>
      <context.UI.Design.Card withBigMargin title="Package collection">
        A distanct advantage of making collection apps is that they are very
        portable. They can be compressed into a simple text data collection that
        can easily be imported.
        <Grid container>
          <Grid item xs={6} style={{ padding: 15 }}>
            <Typography variant="h6">Models</Typography>
            <List>
              {map(
                exportData?.collection_data?.installScript?.data?.models || {},
                (model: ModelType) => (
                  <ListItem key={model.key}>
                    <ListItemText>{model.name_plural}</ListItemText>
                  </ListItem>
                )
              )}
              <ListItem
                button
                onClick={() => {
                  context.setDialog({
                    display: true,
                    title: "Add new model",
                    form: [
                      {
                        key: "model",
                        label: "Model",
                        type: "dropdown",
                        dropdownOptions: modelList,
                      },
                    ],
                    buttons: [
                      {
                        label: "Add",
                        onClick: (form) => {
                          setExportData({
                            ...exportData,
                            collection_data: {
                              ...exportData.collection_data,
                              installScript: {
                                ...exportData.collection_data.installScript,
                                script: [
                                  ...exportData.collection_data.installScript
                                    .script,
                                  { action: "createModel", model: form.model },
                                ],
                                data: {
                                  ...exportData.collection_data.installScript
                                    .data,
                                  models: {
                                    ...exportData.collection_data.installScript
                                      .data.models,
                                    [form.model]: find(
                                      allModels,
                                      (o) => o.key === form.model
                                    ),
                                  },
                                },
                              },
                            },
                          });
                        },
                      },
                    ],
                  });
                }}
              >
                <ListItemIcon>
                  <FaPlus />
                </ListItemIcon>
                <ListItemText>Add model</ListItemText>
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={6} style={{ padding: 15 }}>
            <Typography variant="h6">Objects</Typography>
            <List>
              <ListItem button>
                <ListItemIcon>
                  <FaPlus />
                </ListItemIcon>
                <ListItemText>Add object</ListItemText>
              </ListItem>
            </List>
          </Grid>
        </Grid>
        <Typography variant="h6" gutterBottom>
          Code
        </Typography>
        <Divider style={{ marginBottom: 15 }} />
        {JSON.stringify(exportData)}
      </context.UI.Design.Card>
    </context.UI.Animations.Animation>
  );
};

export default AppsDetailExport;
