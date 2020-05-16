import React, { useState, useEffect } from "react";
import {
  Typography,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";
import uniqid from "uniqid";
import Server from "../../../../Utils/Server";
import { useHistory } from "react-router-dom";

const ObjectLayoutItemRelatedList: React.FC<{ layoutItem; objectId }> = ({
  layoutItem,
  objectId,
}) => {
  // Vars
  const [relatedItems, setRelatedItems] = useState();
  const [relatedModel, setRelatedModel] = useState();
  const history = useHistory();

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
  }, [objectId]);

  // UI
  return (
    <>
      <Typography variant="h6">{layoutItem.title}</Typography>
      {relatedItems && relatedModel ? (
        relatedItems.length > 0 ? (
          <TableContainer component={Paper}>
            <TableHead>
              <TableRow>
                {layoutItem.displayfields.split(",").map((field) => {
                  return <TableCell>{field}</TableCell>;
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {relatedItems.map((item) => {
                return (
                  <TableRow
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      history.push(
                        `/data-explorer/${layoutItem.object}/${item._id}`
                      );
                    }}
                  >
                    {layoutItem.displayfields.split(",").map((field) => {
                      return (
                        <TableCell>
                          {item.data[field] ? item.data[field] : " "}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </TableContainer>
        ) : (
          <Typography variant="body2" style={{ textAlign: "center" }}>
            No related {relatedModel.name_plural}
          </Typography>
        )
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
