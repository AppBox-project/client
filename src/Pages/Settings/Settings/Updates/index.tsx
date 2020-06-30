import React, { useState } from "react";
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
} from "@material-ui/core";
import Loading from "../../../../Components/Loading";
import { FaArrowCircleDown } from "react-icons/fa";
import Server from "../../../../Utils/Server";
import uniqid from "uniqid";

const SettingUpdate: React.FC = () => {
  // Hooks
  const [isLoading, setIsLoading] = useState<any>(false);
  // Lifecycle

  // UI
  return (
    <>
      <h3>Updates</h3>
      <Button
        disabled={isLoading}
        variant="contained"
        color="primary"
        onClick={() => {
          setIsLoading(true);
          const requestId = uniqid();
          Server.emit("updateBox", { requestId });
        }}
      >
        Start upgrade
      </Button>
      <List>
        <ListItem>
          <ListItemIcon>
            {isLoading ? <Loading /> : <FaArrowCircleDown />}
          </ListItemIcon>
          <ListItemText>Client</ListItemText>
        </ListItem>
        <ListItem>
          <ListItemIcon>
            {isLoading ? <Loading /> : <FaArrowCircleDown />}
          </ListItemIcon>
          <ListItemText>Server</ListItemText>
        </ListItem>
        <ListItem>
          <ListItemIcon>
            {isLoading ? <Loading /> : <FaArrowCircleDown />}
          </ListItemIcon>
          <ListItemText>Supervisor</ListItemText>
        </ListItem>
      </List>
    </>
  );
};

export default SettingUpdate;
