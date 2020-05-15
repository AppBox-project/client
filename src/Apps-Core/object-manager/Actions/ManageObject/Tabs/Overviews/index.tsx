import React from "react";
import {
  ModelType,
  UIType,
  AppContextType,
} from "../../../../../../Utils/Types";
import { map } from "lodash";
import AppActionManageObjectOverviewEditor from "./OverviewEditor";

const AppActionManageObjectTabOverviews: React.FC<{
  model: ModelType;
  UI: UIType;
  context: AppContextType;
}> = ({ model, UI, context }) => {
  // States & Hooks
  const list = [];
  map(model.overviews, (overview, key) => {
    list.push({ label: key, id: key, url: key });
  });

  // UI
  return (
    <UI.Layouts.ListDetailLayout
      list={list}
      baseUrl={`/object-manager/${model.key}/overviews`}
      DetailComponent={AppActionManageObjectOverviewEditor}
      context={context}
      detailComponentProps={{ model }}
      addFunction={() => {
        context.setDialog({
          display: true,
          title: "New overview",
          form: [{ key: "key", label: "Overview key" }],
          buttons: [
            {
              label: "Add",
              onClick: (response) => {
                context.updateModel(
                  model.key,
                  {
                    ...model,
                    overviews: {
                      ...model.overviews,
                      [response.key]: {
                        fields: [],
                        buttons: [],
                        actions: ["delete"],
                      },
                    },
                  },
                  model._id
                );
              },
            },
          ],
        });
      }}
    />
  );
};

export default AppActionManageObjectTabOverviews;
