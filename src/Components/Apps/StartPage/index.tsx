import React, { useState, useEffect, useGlobal } from "reactn";
import Loading from "../../Loading";
import Server from "../../../Utils/Server";
import uniqid from "uniqid";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import styles from "./styles.module.scss";
import { FaStream, FaGripLines } from "react-icons/fa";
import { Icon, IconButton, Tooltip, Popover } from "@material-ui/core";
import Card from "../../Design/Card";
import WidgetList from "./WidgetList";
import WidgetRenderer from "../Apps/WidgetRenderer";
import { WidgetType } from "../../../Utils/Types";
import { debounce } from "lodash";

const StartPage: React.FC = () => {
  // Vars
  const [desktop, setDesktop] = useState<any>();
  const [isMobile] = useGlobal<any>("isMobile");
  const [widgetAnchor, setWidgetAnchor] = useState<any>();
  const ResponsiveGridLayout = WidthProvider(Responsive);
  const [width, setWidth] = useState<string>(
    window.innerWidth > 1200
      ? "lg"
      : window.innerWidth < 768
      ? window.innerWidth < 480
        ? "xs"
        : "sm"
      : "md"
  );

  // Functions
  const saveLayout = debounce((layout, currentWidth) => {
    const hasChanged =
      JSON.stringify(desktop.layouts[currentWidth]) !== JSON.stringify(layout);
    if (hasChanged) {
      console.log("Updating layout", currentWidth);

      const newDesktop = desktop;
      desktop.layouts[currentWidth] = layout;
      Server.emit("setUserSetting", {
        key: "desktop",
        value: newDesktop,
      });
    }
  }, 1500);
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
      <Tooltip placement="left" title="Add widget">
        <IconButton
          style={{
            float: "right",
            position: "absolute",
            right: 15,
            top: 35,
            zIndex: 505,
          }}
          onClick={(event) => {
            setWidgetAnchor(event.currentTarget);
          }}
        >
          <Icon style={{ color: "white" }}>
            {widgetAnchor ? (
              <FaGripLines style={{ height: 18, width: 18 }} />
            ) : (
              <FaStream style={{ height: 18, width: 18 }} />
            )}
          </Icon>
        </IconButton>
      </Tooltip>
      <Popover
        id="widget-list"
        open={Boolean(widgetAnchor)}
        anchorEl={widgetAnchor}
        onClose={() => {
          setWidgetAnchor(null);
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <WidgetList
          onAdd={(widget: WidgetType) => {
            const newDesktop = {
              layouts: desktop?.layouts || {},
              widgets: desktop?.widgets || {},
            };
            const newId = uniqid();
            newDesktop.widgets[newId] = {
              appId: widget.app,
              widgetId: widget.key,
              title: widget.name,
            };
            const newItem = {
              i: newId,
              x: 1,
              y: 1,
              w: widget.grid?.defaultX || 1,
              h: widget.grid?.defaultY || 1,
              minW: widget.grid?.minX,
              minH: widget.grid?.minY,
              maxW: widget.grid?.maxX,
              maxH: widget.grid?.maxY,
            };
            ["xxs", "xs", "sm", "md", "lg"].map((size) => {
              newDesktop.layouts[size] = newDesktop.layouts[size] || [];
              newDesktop.layouts[size].push(newItem);
            });
            Server.emit("setUserSetting", {
              key: "desktop",
              value: newDesktop,
            });
          }}
        />
      </Popover>

      <ResponsiveGridLayout
        className={styles.layout}
        rowHeight={30}
        width={1200}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        draggableHandle=".draggable"
        onBreakpointChange={(breakpoint) => {
          setWidth(breakpoint);
          console.log(`Width is now ${breakpoint}`);
        }}
        onLayoutChange={(layout, allLayouts) => {
          saveLayout(layout, width);
        }}
      >
        {((desktop?.layouts || {})[width] || []).map((item) => {
          const widget = desktop.widgets[item.i];
          return (
            <div
              key={item.i}
              data-grid={{ x: item.x, y: item.y, w: item.w, h: item.h }}
            >
              <Card className={styles.WidgetCard} hoverable>
                <WidgetRenderer
                  appId={widget.appId}
                  widgetId={widget.widgetId}
                  config={widget}
                  onSettingsChange={(newSettings) => {
                    const newWidgets = desktop.widgets;
                    Server.emit("setUserSetting", {
                      key: "desktop",
                      value: {
                        ...desktop,
                        widgets: {
                          ...newWidgets,
                          [item.i]: {
                            ...newWidgets[item.i],
                            ...newSettings,
                          },
                        },
                      },
                    });
                  }}
                />
              </Card>
            </div>
          );
        })}
      </ResponsiveGridLayout>
    </div>
  );
};

export default StartPage;
