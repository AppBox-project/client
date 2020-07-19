import React, { useState, useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import Overview from "../../../Components/Object/Overview";
import ViewObject from "../../../Components/Object";
import { AppContextType } from "../../../Utils/Types";

const AppActionObject: React.FC<{ action; context: AppContextType }> = ({
  action,
  context,
}) => {
  return (
    <Switch>
      <Route
        path={`/data-explorer/${action}/:id`}
        render={(props) => {
          return <DetailModule context={context} {...props} object={action} />;
        }}
      />
      <Route
        path={`/data-explorer/${action}`}
        render={(props) => {
          return <OverviewModule {...props} object={action} />;
        }}
      />
    </Switch>
  );
};

const OverviewModule: React.FC<{ object: string }> = ({ object }) => {
  return <Overview objectTypeId={object} appId="data-explorer" />;
};

const DetailModule: React.FC<{
  object: string;
  match: { params: { id } };
  context: AppContextType;
}> = ({
  object,
  match: {
    params: { id },
  },
  context,
}) => {
  return <ViewObject modelId={object} appId="data-explorer" objectId={id} />;
};

export default AppActionObject;
