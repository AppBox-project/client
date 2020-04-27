import React, { useState, useEffect } from "react";
import Loading from "../../Loading";
import Server from "../../../Utils/Server";
import uniqid from "uniqid";
import { List, ListItem } from "@material-ui/core";

const StartPage: React.FC = () => {
  // Vars
  const [desktop, setDesktop] = useState();
  // Lifecycle
  useEffect(() => {
    const requestId = uniqid();
    Server.emit("getUserSetting", { requestId, key: "desktop" });
    Server.on(`receive-${requestId}`, (response) => {
      console.log(response);

      if (response.success) {
        setDesktop(response.data.value);
      } else {
        console.log(response);
      }
    });
  }, []);

  // UI
  if (!desktop) return <Loading />;
  return (
    <List>
      {
        //@ts-ignore
        desktop.map((desktopItem) => {
          return <ListItem>{desktopItem.label}</ListItem>;
        })
      }
    </List>
  );
};

export default StartPage;
