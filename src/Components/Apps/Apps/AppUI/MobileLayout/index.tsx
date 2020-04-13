import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { AppContextType } from "../../../../../Utils/Types";

const AppUIMobile: React.FC<{ appContext: AppContextType; currentPage }> = ({
  appContext,
  currentPage,
}) => {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            {appContext.app.data.name}
          </Typography>
          <IconButton>
            <MoreVertIcon style={{ color: "white" }} />
          </IconButton>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default AppUIMobile;
