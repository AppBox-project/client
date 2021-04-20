import {
  Button,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
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
import map from "lodash/map";
import InputSelect from "../Inputs/Select";
import InputInput from "../Inputs/Input";
import InputCheckbox from "../Inputs/Checkbox";
import { FaFlask, FaUndo } from "react-icons/fa";

const ObjectDesigner: React.FC<{
  model?: ModelType;
  modelId?: string;
  context: AppContextType;
  value: { [k: string]: any };
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
              <TableCell style={{ width: "50%" }}>
                {appliedModel.fields[key].name}
              </TableCell>
              <TableCell style={{ width: "50%" }}>
                {typeof val === "object" ? (
                  <Grid container>
                    <Grid item xs={10}>
                      <InputInput
                        label="Formula"
                        value={val.formula}
                        onChange={(newVal) => {
                          onChange({
                            ...value,
                            [key]: { formula: newVal },
                          });
                        }}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <Tooltip
                        placement="left"
                        title="Switch back to static input"
                      >
                        <IconButton
                          onClick={() => {
                            onChange({
                              ...value,
                              [key]: val.formula,
                            });
                          }}
                        >
                          <FaUndo style={{ width: 18, height: 18 }} />
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Grid>
                ) : appliedModel?.fields[key].type === "formula" ? (
                  appliedModel?.fields[key].typeArgs?.type === "boolean" ? (
                    <Grid container>
                      <Grid item xs={10}>
                        <InputCheckbox
                          value={val === true || val === "true"}
                          onChange={(newVal) => {
                            onChange({
                              ...value,
                              [key]: newVal,
                            });
                          }}
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <Tooltip placement="left" title="Switch to formula">
                          <IconButton>
                            <FaFlask style={{ width: 18, height: 18 }} />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  ) : (
                    <Grid container>
                      <Grid item xs={10}>
                        <InputInput
                          value={val.toString()}
                          type={
                            appliedModel?.fields[key].typeArgs?.type || "text"
                          }
                          onChange={(newVal) => {
                            onChange({
                              ...value,
                              [key]: newVal,
                            });
                          }}
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <Tooltip placement="left" title="Switch to formula">
                          <IconButton>
                            <FaFlask style={{ width: 18, height: 18 }} />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  )
                ) : (
                  <Grid container>
                    <Grid item xs={10}>
                      <context.UI.Field
                        model={appliedModel}
                        field={appliedModel.fields[key]}
                        fieldId={key}
                        value={
                          val
                            ? val
                            : appliedModel?.fields[key].type === "boolean"
                            ? false
                            : appliedModel?.fields[key].typeArgs?.type ===
                              "number"
                            ? 0
                            : ""
                        }
                        onChange={(newVal) => {
                          onChange({ ...value, [key]: newVal });
                        }}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <Tooltip placement="left" title="Switch to formula">
                        <IconButton
                          onClick={() => {
                            onChange({
                              ...value,
                              [key]: { formula: val },
                            });
                          }}
                        >
                          <FaFlask style={{ width: 18, height: 18 }} />
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Grid>
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
                  onChange({ ...value, [newVal || "error"]: "" });
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
