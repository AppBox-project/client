import { List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import React, { useEffect, useState } from "react";
import { useGlobal } from "reactn";
import Card from "../../Components/Design/Card";
import { AppType } from "../../Utils/Types";
import { AppContext } from "../../Components/Apps/Apps/AppContext";
import { useHistory } from "react-router-dom";

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
  const history = useHistory();

  // lifecycle
  useEffect(() => {
    import(
      `../../Apps-${
        app.data.core || app.data.type === "collection" ? "Core" : "User"
      }/${
        app.data.type === "collection" ? "collections" : app.data.id
      }/index.tsx`
    ).then((appCode) => {
      const context: AppContext = new AppContext(
        app.data.id,
        () => {},
        [],
        () => {},
        gUser,
        (key, value) => {},
        (title, properties) => {}
      );
      context.isReady.then(() => {
        const AppCode = new appCode.default(context);
        if (AppCode.getContextMenu) {
          console.log(appCode);
        } else {
          if (AppCode.getActions) {
            AppCode.getActions().then((actions) => {
              if (typeof actions === "object") {
                const nl = [];
                actions.slice(0, 5).map((action) =>
                  nl.push({
                    label: action.label,
                    link: `/${app.data.id}/${action.key}`,
                    icon: action.icon && action.icon,
                  })
                );
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
  return (
    <Card withBigMargin title={app.data.name} centerTitle titleDivider>
      <List style={{ padding: 0 }}>
        {list ? (
          list.length > 0 ? (
            list.map((item, index) => {
              const Icon = item.icon;
              return (
                <ListItem
                  key={index}
                  button
                  onClick={() => {
                    history.push(item.link);
                    onClose();
                  }}
                >
                  {Icon && (
                    <ListItemIcon style={{ minWidth: 32 }}>
                      <Icon />
                    </ListItemIcon>
                  )}
                  <ListItemText>{item.label}</ListItemText>
                </ListItem>
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
  );
};

export default AppContextMenu;
