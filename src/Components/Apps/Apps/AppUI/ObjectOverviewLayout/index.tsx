import React from "react";
import { AppContextType } from "../../../../../Utils/Types";
import Overview from "../../../../Object/Overview";
import { Switch, Route } from "react-router-dom";

const AppComponentObjectOverviewLayout: React.FC<{
  context: AppContextType;
  modelId: string;
  overviewId?: string;
  detailId?: string;
  baseUrl: string;
  disableLists?: boolean;
  applyList?: string;
  alternativeTitle?: { single: string; plural: string };
}> = ({
  context,
  modelId,
  overviewId,
  detailId,
  baseUrl,
  disableLists,
  applyList,
  alternativeTitle,
}) => {
  return (
    <Switch>
      <Route
        path={`${baseUrl}/:objectId`}
        render={(props) => (
          <context.UI.Object.Detail
            modelId={modelId}
            layoutId={detailId || "default"}
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
          applyList={applyList}
          disableLists={disableLists}
          alternativeTitle={alternativeTitle}
        />
      </Route>
    </Switch>
  );
};

export default AppComponentObjectOverviewLayout;
