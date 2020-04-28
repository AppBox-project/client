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
    />
  );
};

export default AppActionManageObjectTabLayouts;
