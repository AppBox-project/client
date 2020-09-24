import React, { useState, useEffect } from "react";
import { List, ListItem, ListItemText, ListItemIcon } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import uniqid from "uniqid";
import Server from "../../../Utils/Server";
import { WidgetType } from "../../../Utils/Types";
import * as icons from "react-icons/fa";

const WidgetList: React.FC<{ onAdd: (widget: WidgetType) => void }> = ({
  onAdd,
}) => {
  // Vars
  const [widgets, setWidgets] = useState<any>();

  //Lifecycle
  useEffect(() => {
    const requestId = uniqid();
    Server.emit("listenForObjects", {
      requestId,
      type: "apps",
      filter: { "data.widgets": true },
    });
    Server.on(`receive-${requestId}`, (response) => {
      if (response.success) {
        const newWidgets = [];
        response.data.map((app) => {
          const manifest = require(`../../../Apps-${
            app.data.core ? "Core" : "User"
          }/${app.data.id}/manifest.json`);
          (manifest?.widgets || []).map((widget) => {
            newWidgets.push({
              ...widget,
              app: app.data.id,
              icon: icons[widget.icon],
              id: `${app.data.id}-${widget.key}`,
            });
          });
        });
        setWidgets(newWidgets);
      } else {
      }
    });

    return () => {
      Server.emit("unlistenForObjects", { requestId });
    };
  }, []);

  // UI

  return (
    <List style={{ width: 250 }}>
      {widgets ? (
        widgets.map((widget) => {
          return (
            <ListItem
              key={widget.key}
              style={{ cursor: "pointer" }}
              onClick={() => {
                onAdd(widget);
              }}
            >
              <ListItemIcon>
                <widget.icon />
              </ListItemIcon>
              <ListItemText
                style={{ cursor: "default" }}
                primary={widget.name}
                secondary={widget.description}
              />
            </ListItem>
          );
        })
      ) : (
        <ListItem>
          <Skeleton width={80} />
        </ListItem>
      )}
    </List>
  );
};

export default WidgetList;
