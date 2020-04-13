import React, { useState } from "react";
import {
  TypeType,
  UIType,
  AppContextType,
} from "../../../../../../Utils/Types";
import { Grid, List, ListItem, ListItemText } from "@material-ui/core";
import { map } from "lodash";
import { Link, Switch, Route } from "react-router-dom";
import AppActionManageObjectOverviewEditor from "./OverviewEditor";

const AppActionManageObjectTabOverviews: React.FC<{
  model: TypeType;
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
    <>
      <UI.ListDetailLayout
        list={list}
        baseUrl={`/object-manager/${model.key}/overviews`}
        DetailComponent={AppActionManageObjectOverviewEditor}
        context={context}
        detailComponentProps={{ model }}
      />
    </>
  );
};

export default AppActionManageObjectTabOverviews;
