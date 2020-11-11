import React, { useEffect, useState } from "react";
import {
  ModelType,
  UIType,
  AppContextType,
  ListItemType,
} from "../../../../../../Utils/Types";
import { map } from "lodash";
import FourOhFour from "../../../../../../Components/FourOhFour";
import Detail from "./Detail";

const AppActionManageObjectTabLists: React.FC<{
  model: ModelType;
  UI: UIType;
  context: AppContextType;
}> = ({ model, UI, context }) => {
  // Vars
  const [lists, setLists] = useState<ListItemType[]>();

  // Lifecycle
  useEffect(() => {
    const nl: ListItemType[] = [];
    map(model.lists, (list, key) => nl.push({ label: list.name, id: key }));
    setLists(nl);
  }, []);

  // UI
  return (
    <context.UI.Layouts.ListDetailLayout
      list={lists}
      context={context}
      baseUrl={`/model-manager/${model.key}/lists`}
      DetailComponent={Detail}
      detailComponentProps={{ model }}
      navWidth={2}
      title="Lists"
      addFunction={() => {
        context.setDialog({
          display: true,
          title: "Add list",
          form: [
            { key: "name", label: "Name" },
            { key: "key", label: "Key" },
          ],
          buttons: [
            {
              label: "Add",
              onClick: (form) => {
                console.log(
                  model.key,
                  {
                    ...model,
                    lists: {
                      ...(model.lists || {}),
                      [form.key]: { name: form.name, filter: [] },
                    },
                  },
                  model._id
                );

                context.updateModel(
                  model.key,
                  {
                    ...model,
                    lists: {
                      ...(model.lists || {}),
                      [form.key]: { name: form.name, filter: [] },
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

export default AppActionManageObjectTabLists;
