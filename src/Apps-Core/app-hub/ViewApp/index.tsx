import React, { useState, useEffect } from "react";
import { AppContextType } from "../../../Utils/Types";
const axios = require("axios");
const AppAHViewApp: React.FC<{
  context: AppContextType;
  match: { params: { appId } };
}> = ({
  match: {
    params: { appId },
  },
  context,
}) => {
  // Vars
  const [app, setApp] = useState();

  // Lifecycle
  useEffect(() => {
    axios
      .get(`https://appbox.vicvan.co/api/appbox-app/read/?key=${appId}`)
      .then((response) => {
        console.log(response);
        setApp(response.data[0]);
      });
  }, []);

  // UI
  if (!app) return <context.UI.Loading />;
  return <>{app.data.name}</>;
};

export default AppAHViewApp;
