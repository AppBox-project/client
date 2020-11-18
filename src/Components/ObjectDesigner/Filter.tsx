import {
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
import Loading from "../Loading";
import { map } from "lodash";
import InputSelect from "../Inputs/Select";
import MaybeCard from "../Design/MaybeCard";
import InputCheckbox from "../Inputs/Checkbox";

interface Filter {
  key: string;
  operator: "equals" | "not_equals";
  value: string | number | boolean;
}

const ObjectDesigner: React.FC<{
  model?: ModelType;
  modelId?: string;
  context: AppContextType;
  value: Filter[];
  onChange: (value: Filter[]) => void;
  withCard?: boolean;
}> = ({ model, modelId, context, value, onChange, withCard }) => {
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
      component={MaybeCard}
      showCard={withCard}
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
          {(value || []).map((val, rowIndex) => (
            <TableRow key={rowIndex}>
              <TableCell style={{ width: "30%" }}>
                {appliedModel.fields[val.key].name}
              </TableCell>
              <TableCell style={{ width: "32%" }}>
                <InputSelect
                  label="Operator"
                  options={[
                    { label: "Equals", value: "equals" },
                    { label: "Does not equal", value: "not_equals" },
                  ]}
                  value={val.operator}
                  onChange={(nv) => {
                    const newVal = value;
                    newVal[rowIndex].operator = nv;
                    onChange(newVal);
                  }}
                />
              </TableCell>
              <TableCell style={{ width: "40%" }}>
                {appliedModel.fields[val.key].type === "formula" ? appliedModel.fields[val.key].typeArgs.type === "boolean" ? <InputCheckbox label={appliedModel.fields[val.key].name} value={val.value as boolean} onChange={nv => {
                  const newVal = value;
                  newVal[rowIndex].value = nv;
                  onChange(newVal);
                }} /> : "still have to make this formula filter" : <context.UI.Field
                    fieldId={val.key}
                    field={appliedModel.fields[val.key]}
                    model={appliedModel}
                    value={val.value}
                    onChange={(nv) => {
                      const newVal = value;
                      newVal[rowIndex].value = nv;
                      onChange(newVal);
                    }}
                  />}

              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={4}>
              <InputSelect
                options={fieldList || []}
                label="Add field"
                onChange={(newVal) => {
                  onChange([
                    ...(value || []),
                    { key: newVal, operator: "equals", value: "" },
                  ]);
                }}
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ObjectDesigner;
