import React from "react";
import {
  ModelType,
  UIType,
  AppContextType,
} from "../../../../../../Utils/Types";
import AppActionManageObjectTabAPIDetail from "./Detail";

const AppActionManageObjectTabAPI: React.FC<{
  model: ModelType;
  UI: UIType;
  context: AppContextType;
}> = ({ model, UI, context }) => {
  return (
    <context.UI.Layouts.ListDetailLayout
      title="API's"
      list={[
        { label: "Read", id: "read" },
        { label: "Create", id: "create" },
        { label: "Modify own", id: "modifyOwn" },
        { label: "Write", id: "write" },
        { label: "Delete own", id: "deleteOwn" },
        { label: "Delete", id: "delete" },
      ]}
      navWidth={2}
      baseUrl={`/model-manager/${model.key}/api`}
      context={context}
      DetailComponent={AppActionManageObjectTabAPIDetail}
      detailComponentProps={{ model }}
    />
  );
};

export default AppActionManageObjectTabAPI;
