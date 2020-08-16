import React, { useState, useEffect } from "react";
import { List, ListItem, ListItemText, ListItemIcon } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import uniqid from "uniqid";
import Server from "../../../Utils/Server";
import { ObjectType } from "../../../Utils/Types";
import * as icons from "react-icons/fa";

const WidgetList: React.FC<{ onAdd: (widgetId) => void }> = ({ onAdd }) => {
  // Vars
  const [widgets, setWidgets] = useState<ObjectType[]>();

  //Lifecycle
  useEffect(() => {
    const requestId = uniqid();
    Server.emit("listenForObjects", { requestId, type: "widgets", filter: {} });
    Server.on(`receive-${requestId}`, (response) => {
      if (response.success) {
        setWidgets(response.data);
      } else {
        console.log(response);
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
          const Icon = icons[widget.data.icon];
          return (
            <ListItem
              key={widget._id}
              style={{ cursor: "pointer" }}
              onClick={() => {
                onAdd(widget._id);
              }}
            >
              <ListItemIcon>
                <Icon />
              </ListItemIcon>
              <ListItemText style={{ cursor: "default" }}>
                {widget.data.name}
              </ListItemText>
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
