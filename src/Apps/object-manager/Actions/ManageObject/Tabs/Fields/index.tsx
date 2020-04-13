import React, { useState } from "react";
import {
  TypeType,
  UIType,
  AppContextType,
} from "../../../../../../Utils/Types";
import {
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@material-ui/core";
import { map } from "lodash";
import { Link, Switch, Route } from "react-router-dom";
import AppActionManageObjectTabFieldsEditor from "./FieldEditor";
import { FaPlus } from "react-icons/fa";

const AppActionManageObjectTabFields: React.FC<{
  model: TypeType;
  UI: UIType;
  context: AppContextType;
}> = ({ model, UI, context }) => {
  // States & Hooks
  const [currentField, setCurrentField] = useState();

  // States & Hooks
  const list = [];
  map(model.fields, (overview, key) => {
    list.push({ label: key, id: key, url: key });
  });

  // UI
  return (
    <UI.ListDetailLayout
      list={list}
      baseUrl={`/object-manager/${model.key}/fields`}
      DetailComponent={AppActionManageObjectTabFieldsEditor}
      context={context}
      detailComponentProps={{ model }}
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
