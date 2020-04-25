import React from "react";
import {
  ModelType,
  UIType,
  AppContextType,
} from "../../../../../../Utils/Types";
import AppActionManageObjectTabAPIDetail from "./APIDetailComponent";

const AppActionManageObjectTabAPI: React.FC<{
  model: ModelType;
  UI: UIType;
  context: AppContextType;
}> = ({ model, UI, context }) => {
  return (
    <context.UI.Layouts.ListDetailLayout
      list={[
        { label: "Read", id: "read", url: "read" },
        { label: "Create", id: "create", url: "create" },
        { label: "Modify own", id: "modify-own", url: "modify-own" },
        { label: "Write", id: "write", url: "write" },
        { label: "Delete own", id: "delete-own", url: "delete-own" },
        { label: "Delete", id: "delete", url: "delete" },
      ]}
      navWidth={2}
      baseUrl={`/object-manager/${model.key}/api`}
      context={context}
      DetailComponent={AppActionManageObjectTabAPIDetail}
    />
  );
};

export default AppActionManageObjectTabAPI;
