import React, { ReactNode, useState, useEffect } from "react";
import {
  AppContextType,
  InterfaceType,
  ObjectType,
} from "../../../Utils/Types";
import {
  Grid,
  GridSize,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
} from "@material-ui/core";
import formula from "../../../Utils/Functions/ClientFormula";
import { get } from "lodash";

const RenderInterfaceListDetailLayout: React.FC<{
  context: AppContextType;
  layoutItem;
  vars;
  interfaceObject: InterfaceType;
  renderChildren: (items, vars) => ReactNode;
}> = ({ context, layoutItem, vars, interfaceObject, renderChildren }) => {
  // Vars
  const selectedObjectVarName = `current${
    layoutItem?.list?.var.charAt(0).toUpperCase() +
    layoutItem?.list?.var.slice(1)
  }Item`;
  const [selectedObject, setSelectedObject] = useState<ObjectType>();
  const [list, setList] = useState<ObjectType[]>([]);
  const wideMode = vars?.interfaceWidth > 800;

  // Lifecycle
  useEffect(() => {
    setSelectedObject(vars[selectedObjectVarName]);
  }, [selectedObjectVarName, vars]);
  useEffect(() => {
    if (layoutItem?.list?.dataFilter) {
      applyFilterToList(
        layoutItem.list.dataFilter,
        vars[layoutItem?.list?.var] || [],
        vars,
        (newList) => setList(newList)
      );
    } else {
      setList(vars[layoutItem?.list?.var] || []);
    }
  }, [vars, layoutItem?.list?.var]);

  // UI

  return (
    <context.UI.Animations.AnimationContainer>
      <Grid container>
        <Grid
          item
          xs={wideMode ? layoutItem?.list?.navWidth || 3 : 12}
          className={wideMode && "scrollIndependently"}
        >
          <context.UI.Animations.AnimationItem>
            <context.UI.Design.Card withBigMargin withoutPadding>
              <List>
                <ListSubheader>
                  {
                    interfaceObject.data.data.variables[layoutItem?.list?.var]
                      .label
                  }
                </ListSubheader>
                {list.map((listItem) => (
                  <ListItem
                    key={listItem._id}
                    button
                    onClick={() => setSelectedObject(listItem)}
                    selected={listItem?._id === selectedObject?._id}
                  >
                    <ListItemText
                      primary={
                        layoutItem?.list?.primary &&
                        listItem.data[layoutItem?.list?.primary]
                      }
                      secondary={
                        layoutItem?.list?.secondary &&
                        listItem.data[layoutItem?.list?.secondary]
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </context.UI.Design.Card>
          </context.UI.Animations.AnimationItem>
        </Grid>
        {selectedObject && (
          <Grid
            item
            xs={
              (wideMode
                ? 12 - (layoutItem?.list?.navWidth || 3)
                : 12) as GridSize
            }
            className={wideMode && "scrollIndependently"}
          >
            {renderChildren(layoutItem.items, {
              ...vars,
              [selectedObjectVarName]: selectedObject,
            })}
          </Grid>
        )}
      </Grid>
    </context.UI.Animations.AnimationContainer>
  );
};
export default RenderInterfaceListDetailLayout;

const applyFilterToList = async (textFilter, list, vars, then) => {
  const filter = JSON.parse(textFilter);

  await filter.reduce(async (prev, curr) => {
    if (curr.value.match(/{{.*}}/gm)) {
      curr.value = await formula(curr.value, {
        ...vars,
      });
    }
    return curr;
  }, filter[0]);
  let reduceIndex = 0;

  const resultList = [];
  await list.reduce(async (prev, listItem) => {
    let itemPassedFilter = true;

    filter.map((filterItem) => {
      const itemValue = get(listItem, filterItem.field);
      const expectedValue = filterItem.value;
      if (itemValue !== expectedValue) {
        itemPassedFilter = false;
      }
    });

    if (itemPassedFilter) {
      resultList.push(listItem);
    }

    reduceIndex++;
    return listItem;
  }, list[0]);

  then(resultList);
};
