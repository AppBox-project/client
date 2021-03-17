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
import { FaBell, FaBellSlash } from "react-icons/fa";
import { useHistory } from "react-router-dom";
import styles from "./styles.module.scss";

const RecentNotifications: React.FC<{
  onClose: () => void;
  notifications: NotificationType[];
}> = ({ onClose, notifications }) => {
  // Vars
  const [app] = useGlobal<any>("app");
  const history = useHistory();

  // Lifecycle

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
              const requestId = uniqid();
              Server.emit("updateObject", {
                requestId,
                type: "notifications",
                objectId: notification._id,
                toChange: { read: true },
              });
              history.push(notification.data.target);
              onClose();
            }}
            className={!notification?.data?.read && styles.unread}
          >
            <ListItemIcon>
              <IconButton
                style={{
                  backgroundColor: `rgba(${app?.data?.color?.r || 3},${
                    app?.data?.color?.g || 71
                  },${app?.data?.color?.b || 161},1)`,
                }}
                size="medium"
              >
                {notification?.data?.read ? (
                  <FaBellSlash
                    style={{ color: "white", width: 18, height: 18 }}
                  />
                ) : (
                  <FaBell style={{ color: "white", width: 18, height: 18 }} />
                )}
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
