import React from "react";
import { List, ListItem, ListItemText } from "@material-ui/core";
import orderBy from "lodash/orderBy";
import { useHistory } from "react-router-dom";

const RecentList: React.FC<{
  modelId: string;
  url?: string;
  onClose: () => void;
}> = ({ modelId, url, onClose }) => {
  // Vars
  let recents: string | [] = localStorage.getItem(`recents-${modelId}`);
  recents = recents ? JSON.parse(recents) : {};
  recents = orderBy(recents, ["lastAccessed"], ["desc"]);
  const history = useHistory();

  // UI
  return (
    <List disablePadding>
      {recents.length === 0 ? (
        <ListItem>
          <ListItemText style={{ textAlign: "center" }}>
            No recents
          </ListItemText>
        </ListItem>
      ) : (
        (recents as { primary: string; key: string }[]).map((recent) => (
          <ListItem
            key={recent.key}
            onClick={() => {
              history.push((url || "/o/") + recent.key);
              onClose();
            }}
            button
          >
            <ListItemText>{recent.primary}</ListItemText>
          </ListItem>
        ))
      )}
    </List>
  );
};

export default RecentList;
