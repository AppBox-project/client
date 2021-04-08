import React from "react";
import {
  ModelType,
  UIType,
  AppContextType,
  ListDetailItemType,
  ObjectType,
} from "../../../../../../Utils/Types";
import { useState, useEffect } from "reactn";
import AppActionManageObjectTabExtensionIDetail from "./Detail";
import map from "lodash/map";
import { List, ListItemText, ListItem } from "@material-ui/core";

const AppActionManageObjectTabExtensions: React.FC<{
  model: ModelType;
  UI: UIType;
  context: AppContextType;
}> = ({ model, UI, context }) => {
  // Vars
  const [extensionList, setExtensionList] = useState<ListDetailItemType[]>([]);
  const [availableExtensions, setAvailableExtensions] = useState<ObjectType[]>(
    []
  );

  // Lifecycle
  useEffect(() => {
    const nl: ListDetailItemType[] = [];
    map(model.extensions || {}, (extension, extensionId) =>
      nl.push({ label: extension.name, id: extensionId })
    );
    setExtensionList(nl);

    const extensionRequest = context.getObjects(
      "object-extensions",
      {},
      (response) => {
        if (response.success) {
          setAvailableExtensions(response.data);
        } else {
          console.log(response);
        }
      }
    );

    return () => extensionRequest.stop();
  }, []);

  // UI
  return (
    <context.UI.Layouts.ListDetailLayout
      baseUrl={`/model-manager/${model.key}/extensions`}
      list={extensionList}
      DetailComponent={AppActionManageObjectTabExtensionIDetail}
      detailComponentProps={{ model, availableExtensions }}
      context={context}
      title="Object extensions"
      addFunction={() =>
        context.setDialog({
          display: true,
          title: "Add extension",
          content: (
            <List>
              {availableExtensions.map((ext) => (
                <ListItem
                  button
                  key={ext._id}
                  onClick={() => {
                    context.updateModel(
                      model.key,
                      {
                        extensions: {
                          ...model.extensions,
                          [ext.data.key]: { name: ext.data.name },
                        },
                      },
                      model.key
                    );
                    context.setDialog({ display: false });
                  }}
                >
                  <ListItemText>{ext.data.name}</ListItemText>
                </ListItem>
              ))}
            </List>
          ),
        })
      }
    />
  );
};

export default AppActionManageObjectTabExtensions;
