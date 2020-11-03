import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import {
  AppContextType,
  ModelType,
  OptionType,
  ModelFieldType,
} from "../../Utils/Types";
import Card from "../Design/Card";
import Loading from "../Loading";
import { map } from "lodash";
import InputSelect from "../Inputs/Select";

const ObjectDesigner: React.FC<{
  model?: ModelType;
  modelId?: string;
  context: AppContextType;
  value: {
    key: string;
    operator: "equals";
    value: string | number | boolean;
  }[];
  onChange: (value: {}) => void;
}> = ({ model, modelId, context, value, onChange }) => {
  // Vars
  const [appliedModel, setAppliedModel] = useState<ModelType>();
  const [error, setError] = useState<string>();
  const [fieldList, setFieldList] = useState<OptionType[]>([]);

  // Lifecycle
  useEffect(() => {
    let modelRequest;
    if (!model) {
      if (!modelId) {
        setError("You need to provide either a model or a modelId");
      } else {
        setError(undefined);
        modelRequest = context.getModel(modelId, (response) => {
          if (response.success) {
            setAppliedModel(response.data);
          } else {
            console.log(response);
          }
        });
      }
    } else {
      setError(undefined);
      setAppliedModel(model);
    }

    return () => {
      if (modelRequest) modelRequest.stop();
    };
  }, [model, modelId]);

  useEffect(() => {
    const nl: OptionType[] = [];
    map(appliedModel?.fields || {}, (v: ModelFieldType, k) =>
      nl.push({ label: v.name, value: k })
    );
    setFieldList(nl);
  }, [appliedModel]);

  // UI
  if (error) return <>{error}</>;
  if (!appliedModel) return <Loading />;
  return (
    <TableContainer
      component={Card}
      title={`Filter ${model.name_plural}`}
      style={{ marginTop: 25 }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Field</TableCell>
            <TableCell>Operator</TableCell>
            <TableCell>Value</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {value.map((val, index) => (
            <TableRow key={index}>
              <TableCell style={{ width: "33%" }}>
                {appliedModel.fields[val.key].name}
              </TableCell>
              <TableCell style={{ width: "33%" }}>
                <InputSelect
                  label="Operator"
                  options={[{ label: "Equals", value: "equals" }]}
                  value={val.operator}
                />
              </TableCell>
              <TableCell style={{ width: "34%" }}>
                <context.UI.Field
                  model={appliedModel}
                  field={appliedModel.fields[val.key]}
                  fieldId={val.key}
                  value={
                    val.value
                      ? val.value
                      : appliedModel?.fields[val.key].type === "boolean"
                      ? false
                      : appliedModel?.fields[val.key].typeArgs?.type ===
                        "number"
                      ? 0
                      : ""
                  }
                  onChange={(newVal) => {
                    const newValue = value;
                    newValue[index] = { ...val, value: newVal };
                    onChange(newValue);
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={3}>
              <InputSelect
                options={fieldList || []}
                label="Add field"
                onChange={(newVal) => {
                  onChange([
                    ...value,
                    { key: newVal?.value, operator: "equals", value: "" },
                  ]);
                }}
              />
            </TableCell>
            <TableCell />
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ObjectDesigner;
