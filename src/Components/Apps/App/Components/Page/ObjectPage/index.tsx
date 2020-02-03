import React, { useState, useEffect } from "react";
import Overview from "../../../../../Overview";
import { Switch, Route } from "react-router-dom";
import ViewObject from "../../../../../Object";

const ObjectPage: React.FC = ({}) => {
  // UI
  return (
    <Switch>
      <Route path="/:appId/:typeId/:objectId" exact component={DetailPage} />
      <Route path="/:appId/:typeId/" exact component={OverviewPage} />
    </Switch>
  );
};

const OverviewPage: React.FC<{ match: { params: { appId; typeId } } }> = ({
  match: {
    params: { typeId, appId }
  }
}) => {
  return <Overview objectTypeId={typeId} layoutId="default" appId={appId} />;
};

const DetailPage: React.FC<{
  match: { params: { appId; typeId; objectId } };
}> = ({
  match: {
    params: { typeId, appId, objectId }
  }
}) => {
  return (
    <ViewObject
      objectTypeId={typeId}
      layoutId="default"
      appId={appId}
      objectId={objectId}
    />
  );
};

export default ObjectPage;
