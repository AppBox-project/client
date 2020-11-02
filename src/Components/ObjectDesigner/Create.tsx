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
import InputInput from "../Inputs/Input";
import InputCheckbox from "../Inputs/Checkbox";

const ObjectDesigner: React.FC<{
  model?: ModelType;
  modelId?: string;
  context: AppContextType;
  value: {};
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
      title={`New ${model.name}`}
      style={{ marginTop: 25 }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Field</TableCell>
            <TableCell>Value</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {map(value, (val, key) => (
            <TableRow key={key}>
              <TableCell style={{ width: "50%" }}>{key}</TableCell>
              <TableCell style={{ width: "50%" }}>
                {appliedModel.fields[key].type === "boolean" ? (
                  <InputCheckbox
                    value={val}
                    onChange={(val) => onChange({ ...value, [key]: val })}
                  />
                ) : (
                  <InputInput
                    value={val}
                    type={appliedModel?.fields[key].typeArgs?.type || "text"}
                    onChange={(val) => {
                      onChange({ ...value, [key]: val });
                    }}
                  />
                )}
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={2}>
              <InputSelect
                options={fieldList || []}
                label="Add field"
                onChange={(newVal) => {
                  onChange({ ...value, [newVal?.value || "error"]: "" });
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
