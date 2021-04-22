import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import React, { useState, useEffect } from "react";
import { AppContextType, ModelType, ObjectType } from "../../../Utils/Types";
import map from "lodash/map";
import FieldDisplay from "../FieldDisplay";
import styles from "./styles.module.scss";
import find from "lodash/find";
import set from "lodash/set";

const MergeUI: React.FC<{
  context: AppContextType;
  model: ModelType;
  ids: string[];
}> = ({ context, model, ids }) => {
  // Vars
  const [objects, setObjects] = useState<ObjectType[]>();
  const [primaryId, setPrimaryId] = useState<string>();
  const [fieldSelections, setFieldSelections] = useState<{
    [fieldId: string]: string;
  }>({});

  // Lifecycle
  useEffect(() => {
    context.getObjects(model.key, { _id: { $in: ids } }, (response) => {
      setObjects(response.data);
      setPrimaryId(response.data[0]._id);
    });
  }, [model, ids]);
  // UI
  if (!objects) return <Skeleton />;
  return (
    <>
      <Table aria-label="merge-table">
        <TableHead>
          <TableRow>
            <TableCell />
            {objects.map((obj) => (
              <TableCell
                key={`title-${obj._id}`}
                align="right"
                style={{ cursor: "pointer" }}
                className={primaryId === obj._id && styles.selected}
                onClick={() =>
                  setPrimaryId(primaryId === obj._id ? objects[0]._id : obj._id)
                }
              >
                {obj.data[model.primary]}
                <br />
                <Typography variant="body2" style={{ fontSize: 8 }}>
                  {obj._id}
                </Typography>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow key={"_id"}>
            <TableCell component="th" scope="row" style={{ width: "30%" }}>
              _id
            </TableCell>
            {objects.map((obj) => (
              <TableCell
                align="right"
                key={`field-_id-obj-${obj._id}`}
                style={{ width: `${70 / objects.length}%` }}
                onClick={() =>
                  setFieldSelections({
                    ...fieldSelections,
                    ["_id"]:
                      fieldSelections["_id"] === obj._id ? null : obj._id,
                  })
                }
                className={
                  fieldSelections["_id"]
                    ? fieldSelections["_id"] === obj._id && styles.selected
                    : primaryId === obj._id && styles.selected
                }
              >
                {obj._id}
              </TableCell>
            ))}
          </TableRow>
          {map(model.fields, (field, fieldKey) => (
            <TableRow key={fieldKey}>
              <TableCell component="th" scope="row" style={{ width: "30%" }}>
                {field.name}
              </TableCell>
              {objects.map((obj) => (
                <TableCell
                  align="right"
                  key={`field-${fieldKey}-obj-${obj._id}`}
                  style={{ width: `${70 / objects.length}%` }}
                  onClick={() =>
                    setFieldSelections({
                      ...fieldSelections,
                      [fieldKey]:
                        fieldSelections[fieldKey] === obj._id ? null : obj._id,
                    })
                  }
                  className={
                    fieldSelections[fieldKey]
                      ? fieldSelections[fieldKey] === obj._id && styles.selected
                      : primaryId === obj._id && styles.selected
                  }
                >
                  <FieldDisplay
                    context={context}
                    objectField={obj.data[fieldKey]}
                    modelField={field}
                    object={obj}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button
        color="primary"
        style={{ float: "right" }}
        onClick={() => {
          const newObject = {};

          // _id
          const objId = fieldSelections["_id"] || primaryId || objects[0]._id;
          newObject["_id"] = objId;

          // Data
          // Default to primary
          newObject["data"] = find(objects, (o) => o._id === primaryId).data;

          // Selected fields
          map(fieldSelections, (select, key) => {
            set(
              newObject,
              `data.${key}`,
              find(objects, (o) => o._id === select).data[key]
            );
          });
          console.log(newObject);
        }}
      >
        Merge
      </Button>
    </>
  );
};

export default MergeUI;
