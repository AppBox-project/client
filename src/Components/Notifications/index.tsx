import {
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { useGlobal } from "reactn";
import { NotificationType } from "../../Utils/Types";
import Server from "../../Utils/Server";
import uniqid from "uniqid";
import { FaBell } from "react-icons/fa";
import { useHistory } from "react-router-dom";

const RecentNotifications: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  // Vars
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [app] = useGlobal<any>("app");
  const history = useHistory();

  // Lifecycle
  useEffect(() => {
    const requestId = uniqid();
    Server.emit("listenForObjects", {
      requestId,
      type: "notifications",
      filter: {},
    });
    Server.on(`receive-${requestId}`, (response) => {
      if (response.success) {
        setNotifications(response.data);
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
    <List style={{ paddingTop: 0 }}>
      <ListSubheader style={{ textAlign: "center" }}>
        Notifications
      </ListSubheader>
      <Divider />
      {notifications.length > 0 ? (
        notifications.map((notification) => (
          <ListItem
            key={notification._id}
            button
            onClick={() => {
              history.push(notification.data.target);
              onClose();
            }}
          >
            <ListItemIcon>
              <IconButton
                style={{
                  backgroundColor: `rgba(${app?.data?.color?.r},${app?.data?.color?.g},${app?.data?.color?.b},1)`,
                }}
                size="medium"
              >
                <FaBell style={{ color: "white", width: 18, height: 18 }} />
              </IconButton>
            </ListItemIcon>
            <ListItemText
              primary={notification.data.title}
              secondary={notification.data.content}
            />
          </ListItem>
        ))
      ) : (
        <ListItem>
          <ListItemText>No notifications</ListItemText>
        </ListItem>
      )}
      <Divider />
    </List>
  );
};

export default RecentNotifications;
