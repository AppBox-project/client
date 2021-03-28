import React, { useState } from "react";
import { AppContextType, ListDetailItemType } from "../../../Utils/Types";
import { ActionType } from "../Types";
import { useEffect } from "reactn";
import SettingsActionsDetail from "./Detail";

const AppSettingsActions: React.FC<{
  match: { isExact: boolean };
  context: AppContextType;
  action: string;
}> = ({ context, action, match: { isExact } }) => {
  // Vars
  const [actions, setActions] = useState<ActionType[]>();
  const [actionList, setActionList] = useState<ListDetailItemType[]>();

  // Lifecycle
  useEffect(() => {
    const request = context.getObjects("actions", {}, (response) => {
      const nl: ListDetailItemType[] = [];
      response.data.map((action: ActionType) =>
        nl.push({ label: action.data.name, id: action.data.key })
      );
      setActionList(nl);
      setActions(response.data);
    });
  }, []);
  // Functions

  // UI

  return (
    <context.UI.Layouts.ListDetailLayout
      context={context}
      DetailComponent={SettingsActionsDetail}
      detailComponentProps={{ actions }}
      list={actionList}
      baseUrl="/settings/actions"
      title="Actions"
      navWidth={2}
      emptyMessage="No actions yet."
      addFunction={() => {
        context.setDialog({
          display: true,
          title: "Create new action",
          form: [
            { label: "Name", key: "name" },
            { label: "Key", key: "key" },
          ],
          buttons: [
            {
              label: "Create",
              onClick: (form) => {
                context.addObject(
                  "actions",
                  { name: form.name, key: form.key },
                  (response) => {}
                );
              },
            },
          ],
        });
      }}
    />
  );
};
export default AppSettingsActions;
