import { List, ListItem } from "@material-ui/core";
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
      `../../Apps-${app.data.core ? "Core" : "User"}/${app.data.id}/index.tsx`
    ).then((appCode) => {
      const context = new AppContext(
        app.data.id,
        () => {},
        [],
        () => {},
        gUser,
        (key, value) => {},
        (title, properties) => {}
      );
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
  }, [app]);

  // UI
  return (
    <Card withBigMargin title={app.data.name} centerTitle titleDivider>
      <List>
        {list ? (
          list.length > 0 ? (
            list.map((item, index) => (
              <ListItem
                key={index}
                button
                onClick={() => {
                  history.push(item.link);
                  onClose();
                }}
              >
                {item.label}
              </ListItem>
            ))
          ) : (
            <ListItem>No actions!</ListItem>
          )
        ) : (
          <Skeleton />
        )}
      </List>
    </Card>
  );
};

export default AppContextMenu;
