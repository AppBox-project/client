import React, { useState, useEffect } from "react";
import { FaGripHorizontal, FaTimes, FaHome } from "react-icons/fa";
import uniqid from "uniqid";
import Server from "../../Utils/Server";
import Loading from "../../Components/Loading";
import * as icons from "react-icons/fa";
import { useHistory } from "react-router-dom";
import { Switch, Route } from "react-router-dom";
import StartPage from "../../Components/Apps/StartPage";
import AppRenderer from "../../Components/Apps/Apps/AppRenderer";
import FourOhFour from "../../Components/FourOhFour";
import { SpeedDial, SpeedDialAction } from "@material-ui/lab";
import SpeedDialIcon from "@material-ui/lab/SpeedDialIcon";

const MobileLayout: React.FC = () => {
  const [apps, setApps] = useState();
  const history = useHistory();
  const currentTab = window.location.href.split("/")[3]
    ? window.location.href.split("/")[3]
    : "home";
  const [fabOpen, setFabOpen] = useState(false);

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
      <SpeedDial
        ariaLabel="Apps"
        icon={
          <SpeedDialIcon icon={<FaGripHorizontal />} openIcon={<FaHome />} />
        }
        onClose={() => {
          setFabOpen(false);
        }}
        onOpen={() => {
          setFabOpen(true);
        }}
        open={fabOpen}
        direction="up"
        style={{ position: "absolute", bottom: 15, right: 15 }}
        FabProps={{
          size: "medium",
          onClick: () => {
            setFabOpen(false);
            history.push("/");
          },
        }}
      >
        {
          //@ts-ignore
          apps.map((app) => {
            const Icon = icons[app.data.icon];
            return (
              <SpeedDialAction
                key={app.data.id}
                icon={<Icon style={{ height: 25, width: 25 }} />}
                tooltipTitle={app.data.name}
                tooltipPlacement="left"
                FabProps={{
                  style: {
                    backgroundColor: `rgb(${app.data.color.r},${app.data.color.g},${app.data.color.b})`,
                    color: "white",
                  },
                }}
                onClick={() => {
                  setFabOpen(false);
                  history.push(`/${app.data.id}`);
                }}
              />
            );
          })
        }
      </SpeedDial>
    </>
  );
};

export default MobileLayout;
