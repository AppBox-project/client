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
import uniqid from "uniqid";

const AppAHMyApps: React.FC<{
  match: { isExact: boolean };
  context: AppContextType;
  action: string;
}> = ({ context, action, match: { isExact } }) => {
  // Vars
  const [apps, setApps] = useState<any>([]);
  const [updating, setUpdating] = useState<{}>({});

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
      {(apps || []).map((app) => {
        return (
          <ListItem key={app._id}>
            <ListItemText style={{ color: "white", cursor: "default" }}>
              {app.data.name}
            </ListItemText>
            <ListItemSecondaryAction>
              <IconButton
                style={{ color: "white" }}
                onClick={() => {
                  context.addObject(
                    "system-task",
                    {
                      name: `Update ${app.data.id}`,
                      type: "App update",
                      description: `Triggered manually`,
                      when: "asap",
                      action: "app-update",
                      done: false,
                      progress: 0,
                      arguments: { appId: app.data.id },
                    },
                    (response) => {
                      const requestId = uniqid();
                      context.getObjects(
                        "system-task",
                        { _id: response.data._id },
                        (response) => {
                          console.log("o", response);

                          setUpdating({
                            ...updating,
                            [app.data.id]: response.data[0],
                          });
                        }
                      );
                    }
                  );
                }}
              >
                {updating[app.data.id] ? (
                  <context.UI.Loading
                    label={updating[app.data.id].data.progress}
                  />
                ) : (
                  <FaCloudDownloadAlt />
                )}
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        );
      })}
    </List>
  );
};

export default AppAHMyApps;
