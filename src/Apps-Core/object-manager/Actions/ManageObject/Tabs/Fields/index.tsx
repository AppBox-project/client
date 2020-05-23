import React, { useState } from "react";
import {
  ModelType,
  UIType,
  AppContextType,
} from "../../../../../../Utils/Types";
import { map } from "lodash";
import AppActionManageObjectTabFieldsEditor from "./FieldEditor";

const AppActionManageObjectTabFields: React.FC<{
  model: ModelType;
  UI: UIType;
  context: AppContextType;
}> = ({ model, UI, context }) => {
  // States & Hooks

  // States & Hooks
  const list = [];
  map(model.fields, (field, key) => {
    list.push({ label: field.name, id: key, url: key });
  });

  // UI
  return (
    <UI.Layouts.ListDetailLayout
      list={list}
      baseUrl={`/object-manager/${model.key}/fields`}
      DetailComponent={AppActionManageObjectTabFieldsEditor}
      context={context}
      detailComponentProps={{ model }}
      navWidth={2}
      addFunction={() => {
        context.setDialog({
          display: true,
          title: "New field",
          form: [
            { key: "key", label: "Field key" },
            { key: "name", label: "Field name" },
          ],
          buttons: [
            {
              label: "Add",
              onClick: (response) => {
                context.updateModel(
                  model.key,
                  {
                    ...model,
                    fields: {
                      ...model.fields,
                      [response.key]: { name: response.name },
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

export default AppActionManageObjectTabFields;
