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
  Popover,
} from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";
import uniqid from "uniqid";
import Server from "../../../../Utils/Server";
import { useHistory } from "react-router-dom";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import Card from "../../../Design/Card";
import * as icons from "react-icons/fa";
import ObjectPreview from "../../ObjectPreview";
import FieldDisplay from "../../FieldDisplay";
import { AppContextType } from "../../../../Utils/Types";

const ObjectLayoutItemRelatedList: React.FC<{
  layoutItem;
  objectId;
  context: AppContextType;
}> = ({ layoutItem, objectId, context }) => {
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
    <MaybeCard
      withBigMargin={layoutItem.withBigMargin}
      withSmallMargin={layoutItem.withSmallMargin}
      sideMarginOnly={layoutItem.sideMarginOnly}
      card={layoutItem.displayCard}
      title={layoutItem.title}
      buttons={
        layoutItem.addButton && [
          {
            label: "Add",
            icon: icons.FaPlus,
            compact: true,
            onClick: () => {
              context.setDialog({
                display: true,
                content: (
                  <context.UI.Layouts.Object.ObjectLayout
                    layoutId="create"
                    context={context}
                    popup
                    model={relatedModel}
                    defaults={{ [layoutItem.field]: objectId }}
                    hideFields={[layoutItem.field]}
                    onSuccess={() => {
                      context.setDialog({ display: false });
                    }}
                  />
                ),
              });
            },
          },
        ]
      }
    >
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
                    <ResultRow
                      item={item}
                      history={history}
                      layoutItem={layoutItem}
                      key={item._id}
                      model={relatedModel}
                    />
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
                                <ResultRow
                                  item={item}
                                  key={item._id}
                                  history={history}
                                  layoutItem={layoutItem}
                                  model={relatedModel}
                                />
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

const MaybeCard: React.FC<{
  card: boolean;
  title?: string;
  withBigMargin: boolean;
  withSmallMargin: boolean;
  sideMarginOnly: boolean;
  buttons?;
}> = ({
  children,
  card,
  title,
  withBigMargin,
  withSmallMargin,
  sideMarginOnly,
  buttons,
}) =>
  card ? (
    <Card
      hoverable
      title={title}
      withBigMargin={withBigMargin}
      withSmallMargin={withSmallMargin}
      sideMarginOnly={sideMarginOnly}
      buttons={buttons}
    >
      {children}
    </Card>
  ) : (
    <>{children}</>
  );

const ResultRow: React.FC<{ item; history; layoutItem; key; model }> = ({
  item,
  history,
  layoutItem,
  key,
  model,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const Icon = icons[model.icon ? model.icon : "FaTags"];

  return (
    <>
      <TableRow
        hover
        key={key}
        style={{ cursor: "pointer" }}
        onClick={() => {
          history.push(`/o/${item._id}`);
        }}
        onMouseEnter={
          model.preview.enabled
            ? (event) => {
                setAnchorEl(event.currentTarget);
              }
            : () => {}
        }
        onMouseLeave={
          model.preview.enabled
            ? () => {
                setAnchorEl(null);
              }
            : () => {}
        }
      >
        {layoutItem.displayfields.split(",").map((field) => {
          return (
            <TableCell key={field}>
              <FieldDisplay
                objectField={item.data[field]}
                modelField={model.fields[field]}
              />
            </TableCell>
          );
        })}
      </TableRow>
      {model.preview.enabled && (
        <Popover
          style={{ pointerEvents: "none" }}
          disableRestoreFocus
          id="relationshipPreview"
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          onClose={() => {
            setAnchorEl(null);
          }}
          transformOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          elevation={0}
          PaperProps={{
            style: { backgroundColor: "transparent" },
          }}
        >
          <ObjectPreview model={model} object={item} />
        </Popover>
      )}
    </>
  );
};
export default ObjectLayoutItemRelatedList;
