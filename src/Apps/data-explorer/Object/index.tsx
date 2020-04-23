import React, { useState, useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import Overview from "../../../Components/Object/Overview";
import ViewObject from "../../../Components/Object";

const AppActionObject: React.FC<{ action }> = ({ action }) => {
  return (
    <div style={{ padding: 15 }}>
      <Switch>
        <Route
          path={`/data-explorer/${action}/:id`}
          render={(props) => {
            return <DetailModule {...props} object={action} />;
          }}
        />
        <Route
          path={`/data-explorer/${action}`}
          render={(props) => {
            return <OverviewModule {...props} object={action} />;
          }}
        />
      </Switch>
    </div>
  );
};

const OverviewModule: React.FC<{ object: string }> = ({ object }) => {
  return <Overview objectTypeId={object} appId="data-explorer" />;
};

const DetailModule: React.FC<{ object: string; match: { params: { id } } }> = ({
  object,
  match: {
    params: { id },
  },
}) => {
  return (
    <ViewObject objectTypeId={object} appId="data-explorer" objectId={id} />
  );
};

export default AppActionObject;
