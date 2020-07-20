import React from "react";
import {
  ModelType,
  UIType,
  AppContextType,
} from "../../../../../../Utils/Types";
import { map } from "lodash";
import AppActionManageObjectTabLayoutsDetail from "./Detail";

const AppActionManageObjectTabLayouts: React.FC<{
  model: ModelType;
  UI: UIType;
  context: AppContextType;
}> = ({ model, UI, context }) => {
  // Vars
  const list = [];
  map(model.layouts, (field, key) => {
    list.push({ label: key, id: key, url: key });
  });

  // Lifecycle
  // UI
  return (
    <context.UI.Layouts.ListDetailLayout
      list={list}
      baseUrl={`/object-manager/${model.key}/layouts`}
      DetailComponent={AppActionManageObjectTabLayoutsDetail}
      detailComponentProps={{ model }}
      context={context}
      navWidth={2}
      deleteFunction={(id) => {
        context.setDialog({
          display: true,
          title: "Delete layout",
          content: <>Are you sure?</>,
          buttons: [
            {
              label: "Yes",
              onClick: (response) => {
                delete model.layouts[id];

                context.updateModel(
                  model.key,
                  {
                    ...model,
                  },
                  model._id
                );
              },
            },
            {
              label: "No",
              onClick: () => {},
            },
          ],
        });
      }}
      addFunction={() => {
        context.setDialog({
          display: true,
          title: "Create new layout",
          form: [{ key: "key", label: "Layout key" }],
          buttons: [
            {
              label: "Add",
              onClick: (response) => {
                context.updateModel(
                  model.key,
                  {
                    ...model,
                    layouts: {
                      ...model.layouts,
                      [response.key]: { layout: [], buttons: [] },
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

export default AppActionManageObjectTabLayouts;
