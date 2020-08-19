import React, { useState, useEffect, useGlobal } from "reactn";
import Loading from "../../Loading";
import Server from "../../../Utils/Server";
import uniqid from "uniqid";
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import styles from "./styles.module.scss";
import { FaStream, FaGripLines } from "react-icons/fa";
import {
  Icon,
  IconButton,
  Typography,
  Divider,
  Tooltip,
  Popover,
} from "@material-ui/core";
import Card from "../../Design/Card";
import WidgetList from "./WidgetList";
import WidgetRenderer from "../Apps/WidgetRenderer";
import { WidgetType } from "../../../Utils/Types";

const StartPage: React.FC = () => {
  // Vars
  const [desktop, setDesktop] = useState<any>();
  const [isMobile] = useGlobal<any>("isMobile");
  const [widgetAnchor, setWidgetAnchor] = useState<any>();

  // Functions

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
              layout: desktop?.layout || [],
              widgets: desktop?.widgets || {},
            };
            const newId = uniqid();
            newDesktop.widgets[newId] = {
              appId: widget.app,
              widgetId: widget.key,
              title: widget.name,
            };
            newDesktop.layout.push({
              i: newId,
              x: 1,
              y: 1,
              w: widget.grid?.defaultX || 1,
              h: widget.grid?.defaultY || 1,
              minW: widget.grid?.minX,
              minH: widget.grid?.minY,
              maxW: widget.grid?.maxX,
              maxH: widget.grid?.maxY,
            });
            Server.emit("setUserSetting", {
              key: "desktop",
              value: newDesktop,
            });
          }}
        />
      </Popover>

      <GridLayout
        className="layout"
        cols={12}
        rowHeight={30}
        width={1200}
        draggableHandle=".draggable"
        onLayoutChange={(layout) => {
          let firstLoad = true; // React grid gives a false first callback. Seemingly identifiable by all 0's
          layout.map((item) => {
            if (item.w !== 1 || item.h !== 1) {
              firstLoad = false;
            }
          });
          if (!firstLoad) {
            // Validate callback (library isn't reliable)
            layout.map((li) => {
              if (!li.w) li.w = 1;
            });
            Server.emit("setUserSetting", {
              key: "desktop",
              value: { layout, widgets: desktop.widgets },
            });
          }
        }}
      >
        {(desktop?.layout || []).map((item, widgetIndex) => {
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
      </GridLayout>
    </div>
  );
};

export default StartPage;
