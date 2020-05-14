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
  map(model.buttons, (overview, key) => {
    list.push({ label: key, id: key, url: key });
  });

  // UI
  return (
    <UI.Layouts.ListDetailLayout
      list={list}
      baseUrl={`/object-manager/${model.key}/actions`}
      DetailComponent={AppActionManageObjectActionsDetail}
      context={context}
      detailComponentProps={{ model }}
      addFunction={() => {
        context.setDialog({
          display: true,
          title: "New action",
          form: [{ key: "key", label: "Action key" }],
          buttons: [
            {
              label: "Add",
              onClick: (response) => {
                context.updateModel(
                  model.key,
                  {
                    ...model,
                    actions: {
                      ...model.buttons,
                      [response.key]: {},
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
