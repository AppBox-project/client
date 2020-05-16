import React, { useState, useEffect } from "react";
import { Typography, List, ListItem, ListItemText } from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";
import uniqid from "uniqid";
import Server from "../../../../Utils/Server";

const ObjectLayoutItemRelatedList: React.FC<{ layoutItem; objectId }> = ({
  layoutItem,
  objectId,
}) => {
  // Vars
  const [relatedItems, setRelatedItems] = useState();
  const [relatedModel, setRelatedModel] = useState();

  // Lifecycle
  useEffect(() => {
    const requestId = uniqid();
    Server.emit("listenForObjects", {
      requestId,
      type: layoutItem.object,
      filter: { [`data.${layoutItem.field}`]: objectId },
    });
    Server.on(`receive-${requestId}`, (response) => {
      if (response.success) {
        setRelatedItems(response.data);
      } else {
        console.log(response);
      }
    });

    const modelRequestId = uniqid();
    Server.emit("listenForObjectTypes", {
      requestId: modelRequestId,
      filter: { key: layoutItem.object },
    });

    Server.on(`receive-${modelRequestId}`, (response) => {
      setRelatedModel(response[0]);
    });

    return () => {
      Server.emit("unlistenForObjects", { requestId });
      Server.emit("unlistenForObjectTypes", { requestId: modelRequestId });
    };
  }, []);
  // UI

  return (
    <>
      <Typography variant="h6">{layoutItem.title}</Typography>
      {relatedItems && relatedModel ? (
        <List>
          {relatedItems.map((item) => {
            return (
              <ListItem button>
                <ListItemText>{item.data[relatedModel.primary]}</ListItemText>
              </ListItem>
            );
          })}
        </List>
      ) : (
        <>
          <Skeleton variant="text" height={25} />
          <Skeleton variant="text" height={25} width={250} />
          <Skeleton variant="text" height={25} />
        </>
      )}
    </>
  );
};

export default ObjectLayoutItemRelatedList;
