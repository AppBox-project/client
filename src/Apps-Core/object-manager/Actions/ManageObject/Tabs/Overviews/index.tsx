import React from "react";
import {
  ModelType,
  UIType,
  AppContextType,
} from "../../../../../../Utils/Types";
import { map } from "lodash";
import AppActionManageObjectOverviewEditor from "./OverviewEditor";

const AppActionManageObjectTabOverviews: React.FC<{
  model: ModelType;
  UI: UIType;
  context: AppContextType;
}> = ({ model, UI, context }) => {
  // States & Hooks
  const list = [];
  map(model.overviews, (overview, key) => {
    list.push({ label: key, id: key, url: key });
  });

  // UI
  return (
    <UI.Layouts.ListDetailLayout
      list={list}
      baseUrl={`/object-manager/${model.key}/overviews`}
      DetailComponent={AppActionManageObjectOverviewEditor}
      context={context}
      detailComponentProps={{ model }}
    />
  );
};

export default AppActionManageObjectTabOverviews;
