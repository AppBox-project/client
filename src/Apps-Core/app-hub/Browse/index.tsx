import React, { useState, useEffect } from "react";
import { AppContextType } from "../../../Utils/Types";
import axios from "axios";

const AppAHBrowse: React.FC<{
  match: { isExact: boolean };
  context: AppContextType;
  action: string;
}> = ({ context, action, match: { isExact } }) => {
  // Vars
  const [apps, setApps] = useState(0);

  // Lifecycle
  useEffect(() => {
    axios
      .get("https://appbox.vicvan.co/api/appbox-app/read")
      .then((response) => {
        console.log(response);
      });
  }, []);
  // UI
  if (!apps) return <context.UI.Loading />;
  return <>Browse</>;
};

export default AppAHBrowse;
