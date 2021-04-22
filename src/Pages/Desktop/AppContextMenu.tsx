import { List, ListItem, Popover } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import React, { useEffect, useState } from "react";
import { useGlobal } from "reactn";
import Card from "../../Components/Design/Card";
import { AppType } from "../../Utils/Types";
import { AppContext } from "../../Components/Apps/Apps/AppContext";
import { Action } from "../../Components/Apps/Apps/AppUI/DesktopLayout";
import Loading from "../../Components/Loading";
import RecentList from "../../Components/RecentList";
import orderBy from "lodash/orderBy";

interface Action {
  label: string;
  link: string;
  icon?;
}

const AppContextMenu: React.FC<{ app: AppType; onClose: () => void }> = ({
  app,
  onClose,
}) => {
  // Vars
  const [list, setList] = useState<Action[]>();
  const [gUser] = useGlobal<any>("user");
  const [context, setContext] = useState<AppContext>();
  const [gTheme] = useGlobal<any>("theme");
  const [historyMenuEl, setHistoryMenuEl] = React.useState(null);
  const [shortcuts, setShortcuts] = useState<{
    title: string;
    shortcuts: string | [];
    model?: string;
    url?: string;
  }>();

  // lifecycle
  useEffect(() => {
    import(
      `../../Apps-${
        app.data.core || app.data.type === "collection" ? "Core" : "User"
      }/${
        app.data.type === "collection" ? "collections" : app.data.id
      }/index.tsx`
    ).then((appCode) => {
      const appContext: AppContext = new AppContext(
        app.data.id,
        () => {},
        [],
        () => {},
        gUser,
        (key, value) => {},
        (title, properties) => {}
      );
      appContext.isReady.then(() => {
        const AppCode = new appCode.default(appContext);
        setContext(appContext);
        if (AppCode.getContextMenu) {
          console.log(appCode);
        } else {
          if (AppCode.getActions) {
            AppCode.getActions().then((actions) => {
              if (typeof actions === "object") {
                const nl = [];
                const contextSortBy =
                  AppCode.appConfig?.actions?.context?.sortBy;
                if (!contextSortBy) {
                  // Don't sort - use first five
                  actions.slice(0, 5).map((action) => nl.push(action));
                } else {
                  // Sort by frequency used and return first five entries
                  if (
                    localStorage.getItem(`app-action-frequency-${app.data.id}`)
                  ) {
                    const frequency = JSON.parse(
                      localStorage.getItem(
                        `app-action-frequency-${app.data.id}`
                      )
                    );
                    actions.map((a) => (a.frequency = frequency[a.key] || 0));
                    orderBy(actions, ["frequency"], ["desc"])
                      .slice(0, 5)
                      .map((action) => nl.push(action));
                  } else {
                    // No frquency data available, use first 5 entries
                    actions.slice(0, 5).map((action) => nl.push(action));
                  }
                }

                setList(nl);
              } else {
                onClose();
              }
            });
          } else {
            setList([]);
          }
        }
      });
    });
  }, [app]);

  // UI
  if (!context) return <Loading />;
  return (
    <>
      <Popover
        id="recents-context"
        open={Boolean(historyMenuEl)}
        anchorEl={historyMenuEl}
        onClose={(event) => {
          setHistoryMenuEl(null);
        }}
        anchorOrigin={{
          vertical: "center",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "left",
        }}
        PaperProps={{ elevation: 0, style: { backgroundColor: "transparent" } }}
      >
        <Card
          title={shortcuts?.title}
          withBigMargin
          centerTitle
          titleDivider
          titleInPrimaryColor
          withoutPadding
        >
          {shortcuts?.model ? (
            <RecentList
              modelId={shortcuts?.model}
              url={shortcuts?.url}
              onClose={() => {
                setHistoryMenuEl(null);
                onClose();
              }}
            />
          ) : (
            "Todo: custom recents"
          )}
        </Card>
      </Popover>
      <Card
        title={app.data.name}
        withBigMargin
        centerTitle
        titleDivider
        titleInPrimaryColor
        withoutPadding
      >
        <List disablePadding>
          {list ? (
            list.length > 0 ? (
              list.map((item, index) => {
                return (
                  <Action
                    context={context}
                    action={item}
                    key={index}
                    currentPage=""
                    gTheme={gTheme}
                    item={item}
                    setHistoryMenuEl={setHistoryMenuEl}
                    setShortcuts={setShortcuts}
                    onActionSelect={onClose}
                  />
                );
              })
            ) : (
              <ListItem>No actions!</ListItem>
            )
          ) : (
            <>
              <Skeleton />
              <Skeleton />
              <Skeleton />
            </>
          )}
        </List>
      </Card>
    </>
  );
};

export default AppContextMenu;
