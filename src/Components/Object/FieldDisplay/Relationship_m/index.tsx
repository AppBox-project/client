import React, { useState, useEffect, Fragment } from "react";
import { Skeleton } from "@material-ui/lab";
import uniqid from "uniqid";
import Server from "../../../../Utils/Server";
import { Chip, Popover } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import * as icons from "react-icons/fa";
import ObjectPreview from "../../ObjectPreview";
import { ModelType } from "../../../../Utils/Types";

const ObjectFieldDisplayRelationshipM: React.FC<{
  modelField;
  objectField;
  size?;
  baseUrl?;
}> = ({ objectField, modelField, size, baseUrl }) => {
  // Vars
  const [objects, setObjects] = useState<any>();
  const [model, setModel] = useState<any>();

  // Lifecycle
  useEffect(() => {
    const requestId = uniqid();
    Server.emit("listenForObjects", {
      requestId,
      type: modelField.typeArgs.relationshipTo,
      filter: { _id: { $in: objectField } },
    });
    Server.on(`receive-${requestId}`, (response) => {
      if (response.success) {
        setObjects(response.data);
      } else {
        console.log(response);
      }
    });

    return () => {
      Server.emit("unlistenForObjects", { requestId });
    };
  }, [objectField]);
  useEffect(() => {
    const requestId = uniqid();
    Server.emit("listenForObjectTypes", {
      requestId,
      filter: { key: modelField.typeArgs.relationshipTo },
    });
    Server.on(`receive-${requestId}`, (response) => {
      setModel(response[0]);
    });
    return () => {
      Server.emit("unlistenForObjectTypes", { requestId });
    };
  }, [modelField]);

  // UI
  return (
    <>
      {objectField ? (
        objects && model ? (
          <>
            {objects.map((object) => {
              return (
                <Fragment key={object._id}>
                  <ChipComponent
                    object={object}
                    model={model}
                    baseUrl={baseUrl}
                    size={size}
                  />
                </Fragment>
              );
            })}
          </>
        ) : (
          <>
            {objectField.map((item, index) => {
              return (
                <Skeleton
                  key={index}
                  variant="text"
                  width={150}
                  height={18}
                  style={{ display: "inline-block" }}
                />
              );
            })}
          </>
        )
      ) : (
        <> </>
      )}
    </>
  );
};

const ChipComponent: React.FC<{ size; baseUrl; object; model: ModelType }> = ({
  size,
  baseUrl,
  object,
  model,
}) => {
  const history = useHistory();
  const [anchorEl, setAnchorEl] = useState(null);
  const Icon = icons[model.icon ? model.icon : "FaTags"];

  return (
    <>
      <Chip
        color="primary"
        size={size}
        onClick={() => {
          history.push(
            baseUrl ? `${baseUrl}/${object._id}` : `/o/${object._id}`
          );
        }}
        icon={<Icon style={{ color: "white" }} />}
        label={object.data[model.primary]}
        style={{
          color: "white",
          backgroundColor:
            object.data["color"] &&
            `rgba(${object.data["color"].r},${object.data["color"].g},${object.data["color"].b},${object.data["color"].a})`,
        }}
        aria-owns={Boolean(anchorEl) ? "relationshipPreview" : undefined}
        aria-haspopup="true"
        onMouseEnter={(event) => {
          setAnchorEl(anchorEl ? null : event.currentTarget);
        }}
      />
      <Popover
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
        <ObjectPreview model={model} object={object} />
      </Popover>
    </>
  );
};

export default ObjectFieldDisplayRelationshipM;
