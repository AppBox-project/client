import React, { useState, useEffect } from "react";
import { AppContextType, AppType } from "../../../Utils/Types";
import { find } from "lodash";
import AppsDetailGeneral from "./General";
import { FaDatabase, FaStream, FaTools, FaUpload } from "react-icons/fa";
import AppsDetailActions from "./Actions";
import Todo from "../../../Components/Todo";
import AppsDetailExport from "./Export";

const AppsDetail: React.FC<{
  match: { params: { detailId } };
  context: AppContextType;
  apps: AppType[];
}> = ({
  context,
  match: {
    params: { detailId },
  },
  apps,
}) => {
  // Vars
  const [app, setApp] = useState<AppType>();

  // Lifecycle
  useEffect(() => {
    setApp(find(apps, (o: AppType) => o.data.id === detailId));
  }, [apps, detailId]);

  // UI
  if (!app) return <context.UI.Loading />;
  return (
    <context.UI.Layouts.ListDetailLayout
      context={context}
      baseUrl={`/settings/apps/${detailId}`}
      title={app.data.name}
      list={[
        { label: "Basic settings", id: "general", icon: FaTools },
        { label: "Actions", id: "actions", icon: FaStream },
        { label: "Package", id: "package", icon: FaUpload },
      ]}
      DetailComponent={DetailPage}
      detailComponentProps={{ app }}
    />
  );
};

export default AppsDetail;

const DetailPage: React.FC<{
  app: AppType;
  context;
  match: {
    params: { detailId };
  };
}> = ({
  app,
  context,
  match: {
    params: { detailId },
  },
}) => (
  <>
    {detailId === "general" ? (
      <AppsDetailGeneral context={context} app={app} />
    ) : detailId === "actions" ? (
      <AppsDetailActions context={context} app={app} />
    ) : detailId === "package" ? (
      <AppsDetailExport context={context} app={app} />
    ) : (
      <Todo withCard title={detailId} />
    )}
  </>
);
