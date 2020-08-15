import React, { useState, useEffect, useGlobal } from "reactn";
import Loading from "../../Loading";
import Server from "../../../Utils/Server";
import uniqid from "uniqid";
import { Responsive as ResponsiveGridLayout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import styles from "./styles.module.scss";
import { debounce } from "lodash";
import Widget from "../../Widgets";
import { FaPlus } from "react-icons/fa";
import { Icon, IconButton } from "@material-ui/core";
import Card from "../../Design/Card";

const StartPage: React.FC = () => {
  // Vars
  const [desktop, setDesktop] = useState<any>();
  const [isMobile] = useGlobal<any>("isMobile");

  // Functions
  const handleLayoutChange = debounce((layout) => {
    let firstLoad = true; // React grid gives a false first callback. Seemingly identifiable by all 0's
    layout.map((item) => {
      if (item.w !== 1 || item.h !== 1) {
        firstLoad = false;
      }
    });
    if (!firstLoad) {
      Server.emit("setUserSetting", {
        key: "desktop",
        value: { layout, widgets: desktop.widgets },
      });
    }
  }, 2500);

  // Lifecycle
  useEffect(() => {
    const requestId = uniqid();
    Server.emit("getUserSetting", { requestId, key: "desktop" });
    Server.on(`receive-${requestId}`, (response) => {
      if (response.success) {
        setDesktop(response.data.value);
      } else {
        console.log(response);
        setDesktop([]);
      }
    });

    return () => {
      Server.emit("stopGettingUserSetting", { requestId });
    };
  }, []);

  // UI
  if (!desktop) return <Loading />;
  return (
    <div style={{ margin: 15, marginTop: isMobile ? 15 : 79 }}>
      <IconButton
        style={{ float: "right", position: "absolute", right: 15, zIndex: 505 }}
        onClick={() => {
          const newDesktop = desktop.layout || [];
          newDesktop.push({
            i: uniqid(),
            x: 1,
            y: 1,
            w: 2,
            h: 3,
          });
          Server.emit("setUserSetting", {
            key: "desktop",
            value: { ...desktop, layout: newDesktop },
          });
        }}
      >
        <Icon style={{ color: "white" }}>
          <FaPlus />
        </Icon>
      </IconButton>
      <ResponsiveGridLayout
        className="layout"
        onLayoutChange={handleLayoutChange}
        rowHeight={30}
        layout={desktop.layout}
        width={1200}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
      >
        {desktop.layout &&
          desktop.layout.map((desktopItem) => {
            return (
              <Card
                withBigMargin
                key={desktopItem.i}
                className={styles.widget}
                data-grid={desktopItem}
                style={{ overflow: "hidden" }}
                title="Testwidget"
                centerTitle
                titleDivider
              >
                Testwidget
              </Card>
            );
          })}
      </ResponsiveGridLayout>
    </div>
  );
};

export default StartPage;
