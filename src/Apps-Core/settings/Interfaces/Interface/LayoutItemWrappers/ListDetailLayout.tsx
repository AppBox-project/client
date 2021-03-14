import { Grid, GridSize } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import {
  AppContextType,
  InterfaceType,
  ModelType,
  ValueListItemType,
} from "../../../../../Utils/Types";
import { find, map } from "lodash";

const LayoutItemListDetailLayout: React.FC<{
  list?: {
    navWidth: GridSize;
    var?: string;
    primary?: string;
    secondary?: string;
    dataFilter?: string;
  };
  detail;
  setContextVar: (key, value) => void;
  onChange: (props: {}) => void;
  layout;
  path;
  context: AppContextType;
  varList;
  children;
  interfaceObject: InterfaceType;
}> = ({
  list,
  onChange,
  context,
  varList,
  children,
  setContextVar,
  interfaceObject,
}) => {
  // Vars
  const [varListList, setVarList] = useState<ValueListItemType[]>();
  const [modelFieldList, setModelFieldList] = useState<ValueListItemType[]>();
  const contextVarName =
    list?.var &&
    `current${list.var.charAt(0).toUpperCase() + list.var.slice(1)}Item`;

  // Lifecycle
  useEffect(() => {
    const nl: ValueListItemType[] = [];
    varList.map(
      (v) =>
        v.args.type === "objects" &&
        nl.push({ label: v.label, value: v.value, args: v })
    );
    setVarList(nl);
  }, [varList]);
  useEffect(() => {
    let request;
    if (list?.var) {
      request = context.getModel(
        find(varList, (o) => o.value === list?.var).args.model,
        (response) => {
          const nl: ValueListItemType[] = [];
          map((response.data as ModelType).fields, (field, fKey) =>
            nl.push({ label: field.name, value: fKey, args: field })
          );
          setModelFieldList(nl);
        }
      );
    }
    return () => request?.stop();
  }, [list?.var]);
  useEffect(() => {
    let request;
    if (contextVarName) {
      const modelKey = interfaceObject.data.data.variables[list?.var]?.model;
      request = context.getModel(modelKey, (response) => {
        const model: ModelType = response.data;
        setContextVar(contextVarName, {
          label: `(context) Selected ${model.name}`,
          value: contextVarName,
          args: { type: "object", model: modelKey },
        });
      });
    }

    return () => request?.stop();
  }, [contextVarName]);

  // UI

  return (
    <Grid container spacing={3}>
      <Grid item xs={3}>
        <context.UI.Design.Card title="List">
          <context.UI.Inputs.Select
            label="Var"
            options={varListList}
            value={list?.var}
            onChange={(newVar) => onChange({ list: { ...list, var: newVar } })}
          />
          <context.UI.Inputs.TextInput
            type="number"
            label="Width"
            value={`${list?.navWidth}` || "3"}
            onChange={(navWidth: number) => {
              if (navWidth > 0 && navWidth < 13) {
                onChange({ list: { ...list, navWidth } });
              }
            }}
          />
          <context.UI.Inputs.Select
            label="Primary"
            options={modelFieldList}
            value={list?.primary}
            onChange={(newVar) =>
              onChange({ list: { ...list, primary: newVar } })
            }
          />
          <context.UI.Inputs.Select
            label="Secondary"
            options={modelFieldList}
            value={list?.secondary}
            onChange={(newVar) =>
              onChange({ list: { ...list, secondary: newVar } })
            }
          />
          <context.UI.Inputs.TextInput
            label="Data filter"
            value={list?.dataFilter}
            onChange={(newVar) =>
              onChange({ list: { ...list, dataFilter: newVar } })
            }
          />
        </context.UI.Design.Card>
      </Grid>
      <Grid item xs={9}>
        <context.UI.Design.Card title="Detail">
          {list?.var && `New var: ${contextVarName}`}
          {children}
        </context.UI.Design.Card>
      </Grid>
    </Grid>
  );
};

export default LayoutItemListDetailLayout;
