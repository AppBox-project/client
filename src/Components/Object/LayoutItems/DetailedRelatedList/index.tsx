import React, { useState, useEffect } from "react";
import uniqid from "uniqid";
import Server from "../../../../Utils/Server";
import { useHistory } from "react-router-dom";
import { AppContextType, ObjectType } from "../../../../Utils/Types";
import Loading from "../../../Loading";
import { Divider, Typography } from "@material-ui/core";

const ObjectLayoutItemDetailedRelatedList: React.FC<{
  layoutItem;
  objectId;
  context: AppContextType;
  object: ObjectType;
}> = ({ layoutItem, objectId, context, object }) => {
  // Vars
  const [relatedItems, setRelatedItems] = useState<any>();
  const [relatedModel, setRelatedModel] = useState<any>();
  const [defaultValues, setDefaultValues] = useState<{}>({});

  // Lifecycle

  useEffect(() => {
    const requestId = uniqid();
    Server.emit("listenForObjects", {
      requestId,
      type: layoutItem.model,
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
      filter: { key: layoutItem.model },
    });

    Server.on(`receive-${modelRequestId}`, (response) => {
      setRelatedModel(response[0]);
    });

    return () => {
      Server.emit("unlistenForObjects", { requestId });
      Server.emit("unlistenForObjectTypes", { requestId: modelRequestId });
    };
  }, [objectId]);

  useEffect(() => {
    const ndv = {};
    layoutItem?.valueCopyFields?.split(",")?.map((defValue) => {
      const vls = defValue.split("=");
      ndv[vls[0]] = vls[1] === "_id" ? object._id : object.data[vls[1]];
    });
    setDefaultValues(ndv);
  }, [layoutItem]);

  // UI
  if (!relatedModel || !relatedItems) return <Loading />;
  return (
    <>
      <Divider style={{ marginBottom: 15 }} />
      {relatedItems.length < 1 ? (
        <Typography
          variant="body1"
          style={{ fontStyle: "italic", textAlign: "center" }}
        >
          {layoutItem.emptyMessage || "Nothing found."}
        </Typography>
      ) : (
        relatedItems.map((item, itemIndex) => (
          <div key={item._id}>
            <context.UI.Object.Detail
              context={context}
              model={relatedModel}
              object={item}
              objectId={item._id}
              layoutId={layoutItem.layoutId}
              popup={true}
            />
            {(itemIndex < relatedItems.length - 1 || layoutItem.createNew) && (
              <Divider style={{ marginBottom: 15 }} />
            )}
          </div>
        ))
      )}
      {layoutItem.createNew && (
        <context.UI.Object.Detail
          context={context}
          model={relatedModel}
          layoutId={layoutItem.addLayout}
          popup={true}
          defaults={{
            ...defaultValues,
            [layoutItem.field]:
              relatedModel.fields[layoutItem.field].type === "relationship_m"
                ? [objectId]
                : objectId,
          }}
        />
      )}
    </>
  );
};
export default ObjectLayoutItemDetailedRelatedList;
