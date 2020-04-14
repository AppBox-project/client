import React, { useState, useEffect } from "react";
import { AppContextType, UIType, TypeType } from "../../../../Utils/Types";
import { AppBar, Tabs, Tab } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import AppActionManageObjectTabObject from "./Tabs/Object";
import AppActionManageObjectTabFields from "./Tabs/Fields";
import AppActionManageObjectTabOverviews from "./Tabs/Overviews";
import AppActionManageObjectTabPermissions from "./Tabs/Permissions";

const AppActionManageObject: React.FC<{
  context: AppContextType;
  action: string;
  match: { isExact: boolean };
}> = ({ context, action, match: { isExact } }) => {
  // Global
  const UI: UIType = context.UI;
  const currentTab = isExact
    ? "object"
    : window.location.href.split(`object-manager/${action}/`)[1].match("/")
    ? window.location.href.split(`object-manager/${action}/`)[1].split("/")[0]
    : window.location.href.split(`object-manager/${action}/`)[1];

  // States & hooks
  const [model, setModel] = useState<TypeType | void>();
  const history = useHistory();

  // Lifecycle
  useEffect(() => {
    context.getTypes({ key: action }, (response) => {
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
    <>
      <Tabs
        value={currentTab}
        onChange={(event, value) => {
          history.push(`/object-manager/${action}/${value}`);
        }}
        centered
        indicatorColor="primary"
        textColor="primary"
        aria-label="simple tabs example"
      >
        <Tab label="Object" value="object" />
        <Tab label="Fields" value="fields" />
        <Tab label="Lay-outs" value="layouts" />
        <Tab label="Overviews" value="overviews" />
        <Tab label="Permissions" value="permissions" />
      </Tabs>
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
      {currentTab === "layouts" && "layouts"}
      {currentTab === "overviews" && (
        <AppActionManageObjectTabOverviews
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
    </>
  );
};

export default AppActionManageObject;
