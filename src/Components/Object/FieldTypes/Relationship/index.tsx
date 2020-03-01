import React, { useState, useEffect } from "react";
import { Grid, Typography } from "@material-ui/core";
import { ModelFieldType } from "../../../../Utils/Types";
import Loading from "../../../Loading";
import Select from "react-select";
import Server from "../../../../Utils/Server";
import uniqid from "uniqid";
import { filter } from "lodash";

const FieldTypeRelationship: React.FC<{
  mode: "view" | "edit";
  field: ModelFieldType;
  object: any;
  fieldKey: string;
  setMode: (mode: "view" | "edit") => void;
  onChange: (value: any) => void;
}> = ({ mode, field, object, fieldKey, setMode, onChange }) => {
  // Hooks
  const [newValue, setNewValue] = useState();
  // Lifecycle
  useEffect(() => {
    setNewValue(
      object ? (object.data[fieldKey] ? object.data[fieldKey] : "") : ""
    );
  }, [fieldKey]);

  // UI
  if (newValue === undefined) return <Loading />;
  return (
    <div className={mode === "view" ? "view-container" : "input-container"}>
      <div
        className={
          mode === "view" ? "view-container-sub" : "input-container-sub"
        }
        style={{ width: "100%", paddingRight: 5 }}
      >
        {mode === "view" && (
          <div
            style={{ cursor: "copy" }}
            onDoubleClick={() => {
              setMode("edit");
            }}
          >
            <Grid container>
              <Grid item xs={6}>
                <Typography variant="body1" style={{ fontWeight: 500 }}>
                  {field.name}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">{newValue}</Typography>
              </Grid>
            </Grid>
          </div>
        )}
        {mode === "edit" && (
          <RelationShipSelector
            field={field}
            value={newValue}
            onChangeEvent={id => {
              setNewValue(id);
              onChange(id);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default FieldTypeRelationship;

const RelationShipSelector: React.FC<{
  field: ModelFieldType;
  onChangeEvent: (id: string) => void;
  value: string;
}> = ({ field, onChangeEvent, value }) => {
  // Hooks
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState();

  // Lifecycle
  useEffect(() => {
    let relationshipObject;

    const requestIdForObject = uniqid();
    const requestId = uniqid();

    Server.emit("listenForObjectTypes", {
      requestId: requestIdForObject,
      filter: { key: field.typeArgs.relationshipTo }
    });
    Server.on(`receive-${requestIdForObject}`, response => {
      relationshipObject = response[0];
      Server.emit("listenForObjects", {
        requestId,
        type: field.typeArgs.relationshipTo,
        filter: {}
      });
      Server.on(`receive-${requestId}`, response => {
        const r = [];
        response.data.map(rd => {
          r.push({ value: rd._id, label: rd.data[relationshipObject.primary] });
        });
        setResults(r);
        setIsLoading(false);
      });
    });

    return () => {
      Server.emit("unlistenForObjects", { requestId });
      Server.emit("unlistenForObjectTypes", { requestIdForObject });
    };
  }, []);

  // UI
  return (
    <>
      <Typography variant="caption">{field.name}</Typography>
      <Select
        isLoading={isLoading}
        options={results}
        value={
          filter(results, o => {
            return o.value === value;
          })[0]
        }
        onChange={selected => {
          // @ts-ignore
          onChangeEvent(selected.value);
        }}
      />
    </>
  );
};
