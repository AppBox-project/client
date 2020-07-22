import React from "react";
import {
  ModelType,
  UIType,
  AppContextType,
} from "../../../../../../Utils/Types";
import { map } from "lodash";
import AppActionManageObjectActionsDetail from "./Detail";

const AppActionManageObjectTabActions: React.FC<{
  model: ModelType;
  UI: UIType;
  context: AppContextType;
}> = ({ model, UI, context }) => {
  // States & Hooks
  const list = [];
  map(model.actions, (overview, key) => {
    list.push({ label: key, id: key, url: key });
  });

  // UI
  return (
    <UI.Layouts.ListDetailLayout
      list={list}
      title="All actions"
      baseUrl={`/object-manager/${model.key}/actions`}
      DetailComponent={AppActionManageObjectActionsDetail}
      context={context}
      detailComponentProps={{ model }}
      navWidth={2}
      addFunction={() => {
        context.setDialog({
          display: true,
          title: "New action",
          form: [{ key: "key", label: "Action key" }],
          buttons: [
            {
              label: "Add",
              onClick: (response) => {
                console.log(response);

                context.updateModel(
                  model.key,
                  {
                    ...model,
                    actions: {
                      ...model.actions,
                      [response.key]: { layout: "create" },
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

export default AppActionManageObjectTabActions;
