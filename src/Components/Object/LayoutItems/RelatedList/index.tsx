import React, { useState, useEffect } from "react";
import {
  Typography,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Collapse,
  Table,
} from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";
import uniqid from "uniqid";
import Server from "../../../../Utils/Server";
import { useHistory } from "react-router-dom";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import Card from "../../../Design/Card";

const ObjectLayoutItemRelatedList: React.FC<{ layoutItem; objectId }> = ({
  layoutItem,
  objectId,
}) => {
  // Vars
  const [relatedItems, setRelatedItems] = useState<any>();
  const [relatedModel, setRelatedModel] = useState<any>();
  const history = useHistory();
  const [showMore, setShowMore] = useState<any>(false);

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

  const hideElement =
    layoutItem.onlyVisibleWithResults && (relatedItems || [1]).length === 0; // It needs to be hidden when both these things are true

  // UI
  return hideElement ? (
    <></>
  ) : (
    <MaybeCard card={layoutItem.displayCard} title={layoutItem.title}>
      {!layoutItem.displayCard && (
        <Typography variant="h6" style={{ textAlign: "center" }}>
          {layoutItem.title}
        </Typography>
      )}
      {relatedItems && relatedModel ? (
        relatedItems.length > 0 ? (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {layoutItem.displayfields.split(",").map((field) => {
                    return (
                      <TableCell style={{ textAlign: "center" }} key={field}>
                        {relatedModel.fields[field].name}
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {relatedItems.slice(0, 3).map((item, index) => {
                  return (
                    <TableRow
                      hover
                      key={item._id}
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        history.push(`/o/${item._id}`);
                      }}
                    >
                      {layoutItem.displayfields.split(",").map((field) => {
                        return (
                          <TableCell key={field}>
                            {item.data[field] ? item.data[field] : " "}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
                {relatedItems.length > 3 && (
                  <>
                    <TableRow
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setShowMore(!showMore);
                      }}
                    >
                      <TableCell
                        colSpan={layoutItem.displayfields.split(",").length}
                      >
                        {showMore ? <FaAngleUp /> : <FaAngleDown />}Show more
                      </TableCell>
                    </TableRow>
                    <Collapse
                      in={showMore}
                      timeout="auto"
                      unmountOnExit
                      style={{ width: "100%" }}
                    >
                      <TableContainer>
                        <TableBody>
                          {relatedItems
                            .slice(3, relatedItems.length)
                            .map((item, index) => {
                              return (
                                <TableRow
                                  key={item._id}
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    history.push(`/o/${item._id}`);
                                  }}
                                >
                                  {layoutItem.displayfields
                                    .split(",")
                                    .map((field) => {
                                      return (
                                        <TableCell key={field}>
                                          {item.data[field]
                                            ? item.data[field]
                                            : " "}
                                        </TableCell>
                                      );
                                    })}
                                </TableRow>
                              );
                            })}
                        </TableBody>
                      </TableContainer>
                    </Collapse>
                  </>
                )}
              </TableBody>
            </Table>
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
    </MaybeCard>
  );
};

const MaybeCard: React.FC<{ card: boolean; title?: string }> = ({
  children,
  card,
  title,
}) =>
  card ? (
    <Card hoverable title={title} withMargin>
      {children}
    </Card>
  ) : (
    <>{children}</>
  );

export default ObjectLayoutItemRelatedList;
