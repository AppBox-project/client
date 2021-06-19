import React, { useState, useEffect } from "react";
import { AppContextType, UIType, ModelType } from "../../../../Utils/Types";
import { Tabs, Tab, makeStyles } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import AppActionManageObjectTabObject from "./Tabs/Object";
import AppActionManageObjectTabFields from "./Tabs/Fields";
import AppActionManageObjectTabOverviews from "./Tabs/Overviews";
import AppActionManageObjectTabPermissions from "./Tabs/Permissions";
import AppActionManageObjectTabAPI from "./Tabs/API";
import AppActionManageObjectTabLayouts from "./Tabs/Layouts";
import AppActionManageObjectTabActions from "./Tabs/Actions";
import AppActionManageObjectTabPreview from "./Tabs/Preview";
import AppActionManageObjectTabExtensions from "./Tabs/Extensions";
import AppActionManageObjectTabLists from "./Tabs/Lists";
import AppActionManageObjectTabRules from "./Tabs/Rules";
import AppActionManageObjectTabDuplicateRules from "./Tabs/DuplicateRules";

const useStyles = makeStyles((theme) => ({
  customTabRoot: {
    color: "white",
  },
  customTabIndicator: {
    backgroundColor: "white",
  },
}));

const AppActionManageObject: React.FC<{
  context: AppContextType;
  action: string;
  match: { isExact: boolean };
}> = ({ context, action, match: { isExact } }) => {
  // Global
  const UI: UIType = context.UI;
  const currentTab = isExact
    ? "object"
    : window.location.href.split(`model-manager/${action}/`)[1].match("/")
    ? window.location.href.split(`model-manager/${action}/`)[1].split("/")[0]
    : window.location.href.split(`model-manager/${action}/`)[1];

  // States & hooks
  const [model, setModel] = useState<ModelType | void>();
  const history = useHistory();
  const classes = useStyles();

  // Lifecycle
  useEffect(() => {
    context.getModels({ key: action }, (response) => {
      if (response.success) {
        setModel(response.data[0]);
      } else {
        console.log(response.reason);
      }
    });
  }, [action]);

  // UI
  if (!model) return <UI.Loading />;
  return (
    <div
      style={{
        display: "flex",
        flexFlow: "column",
        height: "100%",
      }}
    >
      <Tabs
        value={currentTab}
        onChange={(event, value) => {
          history.push(`/model-manager/${action}/${value}`);
        }}
        aria-label="Object aspects navigation"
        variant="scrollable"
        classes={{
          root: classes.customTabRoot,
          indicator: classes.customTabIndicator,
        }}
      >
        <Tab label="Object" value="object" />
        <Tab label="Fields" value="fields" />
        <Tab label="Actions" value="actions" />
        <Tab label="Overviews" value="overviews" />
        <Tab label="Lists" value="lists" />
        <Tab label="Lay-outs" value="layouts" />
        <Tab label="Preview" value="preview" />
        <Tab label="API access" value="api" />
        <Tab label="Permissions" value="permissions" />
        <Tab label="Rules" value="rules" />
        <Tab label="Duplicate rules" value="duplicate_rules" />
        <Tab label="Extensions" value="extensions" />
      </Tabs>
      <div
        style={{
          flexGrow: 1,
          overflow: "auto",
        }}
      >
        {currentTab === "object" && (
          <AppActionManageObjectTabObject
            model={model}
            UI={UI}
            context={context}
          />
        )}
        {currentTab === "fields" && (
          <AppActionManageObjectTabFields
            model={model}
            UI={UI}
            context={context}
          />
        )}
        {currentTab === "layouts" && (
          <AppActionManageObjectTabLayouts
            model={model}
            UI={UI}
            context={context}
          />
        )}
        {currentTab === "overviews" && (
          <AppActionManageObjectTabOverviews
            model={model}
            UI={UI}
            context={context}
          />
        )}
        {currentTab === "rules" && (
          <AppActionManageObjectTabRules
            model={model}
            UI={UI}
            context={context}
          />
        )}
        {currentTab === "duplicate_rules" && (
          <AppActionManageObjectTabDuplicateRules
            model={model}
            UI={UI}
            context={context}
          />
        )}
        {currentTab === "lists" && (
          <AppActionManageObjectTabLists
            model={model}
            UI={UI}
            context={context}
          />
        )}
        {currentTab === "permissions" && (
          <AppActionManageObjectTabPermissions
            model={model}
            UI={UI}
            context={context}
          />
        )}
        {currentTab === "preview" && (
          <AppActionManageObjectTabPreview
            model={model}
            UI={UI}
            context={context}
          />
        )}
        {currentTab === "actions" && (
          <AppActionManageObjectTabActions
            model={model}
            UI={UI}
            context={context}
          />
        )}
        {currentTab === "api" && (
          <AppActionManageObjectTabAPI
            model={model}
            UI={UI}
            context={context}
          />
        )}
        {currentTab === "extensions" && (
          <AppActionManageObjectTabExtensions
            model={model}
            UI={UI}
            context={context}
          />
        )}
      </div>
    </div>
  );
};

export default AppActionManageObject;
