import React, { useState, useEffect } from "react";
import { BottomNavigation, BottomNavigationAction } from "@material-ui/core";
import { FaGripHorizontal, FaHome } from "react-icons/fa";
import uniqid from "uniqid";
import Server from "../../Utils/Server";
import Loading from "../../Components/Loading";
import * as icons from "react-icons/fa";
import { useHistory } from "react-router-dom";
import { Switch, Route } from "react-router-dom";
import StartPage from "../../Components/Apps/StartPage";
import AppRenderer from "../../Components/Apps/Apps/AppRenderer";
import FourOhFour from "../../Components/FourOhFour";

const MobileLayout: React.FC = () => {
  const [apps, setApps] = useState();
  const history = useHistory();
  const currentTab = window.location.href.split("/")[3]
    ? window.location.href.split("/")[3]
    : "home";

  // Lifecycle
  useEffect(() => {
    const requestId = uniqid();
    Server.emit("listenForObjects", { requestId, type: "app", filter: {} });
    Server.on(`receive-${requestId}`, (response) => {
      if (response.success) {
        setApps(response.data);
      } else {
        console.log(response);
      }
    });
    return () => {
      Server.emit("unlistenForObjects", { requestId });
    };
  }, []);

  if (!apps) return <Loading />;
  return (
    <>
      <Switch>
        <Route path="/" exact component={StartPage} />
        <Route path="/apps" exact component={StartPage} />
        <Route path="/home" exact component={StartPage} />
        <Route
          path="/:appId"
          render={(params) => {
            return <AppRenderer {...params} setCurrentApp={() => {}} />;
          }}
        />
        <Route component={FourOhFour} />
      </Switch>
      <BottomNavigation
        style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}
        value={currentTab}
        showLabels
        onChange={(event, value) => {
          history.push(`/${value}`);
        }}
      >
        <BottomNavigationAction
          label="Home"
          value="home"
          icon={<FaHome style={{ height: 25, width: 25 }} />}
        />

        {apps.map((app) => {
          const Icon = icons[app.data.icon];
          return (
            <BottomNavigationAction
              label={app.data.name}
              value={app.data.id}
              icon={<Icon style={{ height: 25, width: 25 }} />}
            />
          );
        })}

        <BottomNavigationAction
          label="All apps"
          value="apps"
          icon={<FaGripHorizontal style={{ height: 25, width: 25 }} />}
        />
      </BottomNavigation>
    </>
  );
};

export default MobileLayout;
