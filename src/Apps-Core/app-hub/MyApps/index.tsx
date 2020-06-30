import React, { useState, useEffect } from "react";
import { AppContextType } from "../../../Utils/Types";
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from "@material-ui/core";
import { FaCloudDownloadAlt } from "react-icons/fa";

const AppAHMyApps: React.FC<{
  match: { isExact: boolean };
  context: AppContextType;
  action: string;
}> = ({ context, action, match: { isExact } }) => {
  // Vars
  const [apps, setApps] = useState<any>([]);

  // Lifecycle
  useEffect(() => {
    context.getObjects("app", { "data.core": { $ne: true } }, (response) => {
      if (response.success) {
        setApps(response.data);
      } else {
        console.log(response);
      }
    });
  }, []);

  // UI
  if (!apps) return <context.UI.Loading />;
  return (
    <List>
      {apps ||
        [].map((app) => {
          return (
            <ListItem key={app._id}>
              <ListItemText>{app.data.name}</ListItemText>
              <ListItemSecondaryAction>
                <IconButton
                  color="primary"
                  onClick={() => {
                    console.log("Todo: update");
                  }}
                >
                  <FaCloudDownloadAlt />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          );
        })}
    </List>
  );
};

export default AppAHMyApps;
