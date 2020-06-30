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
              <div
                key={desktopItem.i}
                className={styles.widget}
                data-grid={desktopItem}
                style={{ overflow: "hidden" }}
              >
                <Widget widgetMeta={desktop.widgets[desktopItem.i]} />
              </div>
            );
          })}
      </ResponsiveGridLayout>
    </div>
  );
};

export default StartPage;
