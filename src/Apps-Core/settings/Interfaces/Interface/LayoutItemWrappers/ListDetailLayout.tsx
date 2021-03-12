import { Grid, GridSize } from "@material-ui/core";
import React, { useState } from "react";
import { useEffect } from "reactn";
import { AppContextType, ValueListItemType } from "../../../../../Utils/Types";

const LayoutItemListDetailLayout: React.FC<{
  list?: { navWidth: GridSize; var?: string };
  detail;
  onChange: (props: {}) => void;
  componentList;
  layout;
  path;
  context: AppContextType;
  varList;
}> = ({
  list,
  detail,
  onChange,
  componentList,
  layout,
  path,
  context,
  varList,
}) => {
  // Vars
  const [varListList, setVarList] = useState<ValueListItemType[]>();

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

  // UI

  return (
    <Grid container spacing={3}>
      <Grid item xs={list?.navWidth || 3}>
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
        </context.UI.Design.Card>
      </Grid>
      <Grid
        item
        xs={
          //@ts-ignore
          (12 - (list || { navWidth: 3 })?.navWidth) as GridSize
        }
      >
        <context.UI.Design.Card title="Detail">Right</context.UI.Design.Card>
      </Grid>
    </Grid>
  );
};

export default LayoutItemListDetailLayout;
