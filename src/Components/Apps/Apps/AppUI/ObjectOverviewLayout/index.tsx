import React from "react";
import { AppContextType } from "../../../../../Utils/Types";
import Overview from "../../../../Object/Overview";
import { Switch, Route } from "react-router-dom";

const AppComponentObjectOverviewLayout: React.FC<{
  context: AppContextType;
  modelId: string;
  overviewId?: string;
  baseUrl: string;
}> = ({ context, modelId, overviewId, baseUrl }) => {
  return (
    <Switch>
      <Route
        path={`${baseUrl}/:objectId`}
        render={(props) => (
          <context.UI.Object.Detail
            modelId={modelId}
            layoutId={overviewId || "default"}
            context={context}
            objectId={props.match.params.objectId}
            baseUrl={baseUrl}
          />
        )}
      ></Route>

      <Route path={`${baseUrl}`}>
        <Overview
          layoutId={overviewId || "default"}
          modelId={modelId}
          context={context}
          baseUrl={baseUrl}
        />
      </Route>
    </Switch>
  );
};

export default AppComponentObjectOverviewLayout;
