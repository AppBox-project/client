import { List, ListItem } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import React, { useState, useEffect } from "react";
import Server from "../../../../Utils/Server";
import { AppContextType, ObjectType } from "../../../../Utils/Types";
import uniqid from "uniqid";

const ObjectLayoutItemAttachments: React.FC<{
  layoutItem;
  context: AppContextType;
  object: ObjectType;
}> = ({ layoutItem, context, object }) => {
  // Variables
  const [attachments, setAttachments] = useState<any>();

  // Lifecycle
  useEffect(() => {
    const requestId = uniqid();
    Server.emit("listenForAttachments", { requestId, objectId: object._id });
    Server.on(`receive-${requestId}`, (response) => {
      if (response.success) {
        setAttachments(response.data);
      } else {
        console.log(response);
      }
    });

    return () => {
      Server.emit("unlistenForAttachments", {
        requestId,
      });
    };
  }, []);

  // UI
  return attachments ? (
    <List>
      {attachments.length > 0 ? (
        attachments.map((attachment) => (
          <a
            target="_blank"
            href={`/object-storage/${object.objectId}/${object._id}/${attachment.name}`}
            key={attachment._id}
          >
            <ListItem>{attachment.name}</ListItem>
          </a>
        ))
      ) : (
        <ListItem>No attachments</ListItem>
      )}
    </List>
  ) : (
    <List>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <ListItem key={i}>
          <Skeleton style={{ width: "100%" }} />
        </ListItem>
      ))}
    </List>
  );
};

export default ObjectLayoutItemAttachments;
