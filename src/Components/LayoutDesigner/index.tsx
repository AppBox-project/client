import React, { useState } from "react";
import DropTarget from "./DropTarget";
import Component from "./Component";
import { DndProvider } from "react-dnd";
import MultiBackend from "react-dnd-multi-backend";
import HTML5toTouch from "react-dnd-multi-backend/dist/esm/HTML5toTouch"; // or any other pipeline
import { Grid, IconButton, List, ListItem } from "@material-ui/core";
import { map } from "lodash";
import { LayoutDesignerItem } from "../../Utils/Types";
import { findIndex, remove } from "lodash";
import uniqid from "uniqid";
import {
  AnimationContainer,
  AnimationItem,
} from "../Apps/Apps/AppUI/Animations";
import {
  FaToggleOn,
  FaToggleOff,
  FaAngleRight,
  FaAngleLeft,
} from "react-icons/fa";

const LayoutDesigner: React.FC<{
  layout: LayoutDesignerItem[];
  onChange: (layout) => void;
  componentList: {};
}> = ({ layout, onChange, componentList }) => {
  // Vars
  const [expandTray, setExpandTray] = useState(false);
  // UI
  return (
    <DndProvider backend={MultiBackend} options={HTML5toTouch}>
      <Grid container>
        <Grid item xs={expandTray ? 9 : 11}>
          <div style={{ overflow: "hidden", clear: "both", marginTop: 10 }}>
            <DropTarget
              Wrapper={EmptyWrapper}
              root
              onChange={(response) => {
                onChange([
                  ...layout,
                  { type: response.id, xs: 12, id: uniqid() },
                ]);
              }}
            >
              {layout.map((layoutItem, key) => {
                return (
                  <LayoutItem
                    key={key}
                    layoutItem={layoutItem}
                    componentList={componentList}
                    onDrop={onChange}
                    layout={layout}
                    path=""
                  />
                );
              })}
            </DropTarget>
          </div>
        </Grid>
        <Grid item xs={expandTray ? 3 : 1}>
          <IconButton
            onClick={() => {
              setExpandTray(!expandTray);
            }}
          >
            {expandTray ? <FaAngleRight /> : <FaAngleLeft />}
          </IconButton>
          {expandTray && (
            <AnimationContainer>
              <List>
                {map(componentList, (component, key) => {
                  return (
                    <AnimationItem key={key}>
                      <ListItem>
                        <Component label={component.label} id={key} />
                      </ListItem>
                    </AnimationItem>
                  );
                })}
              </List>
            </AnimationContainer>
          )}
        </Grid>
      </Grid>
    </DndProvider>
  );
};

export default LayoutDesigner;

const EmptyWrapper: React.FC = (Props) => {
  return <div {...Props}>{Props.children}</div>;
};

const LayoutItem: React.FC<{
  key;
  layoutItem;
  componentList;
  onDrop;
  layout;
  path;
}> = ({ key, layoutItem, componentList, onDrop, layout, path }) => {
  const Wrapper = componentList[layoutItem.type].wrapper
    ? componentList[layoutItem.type].wrapper
    : EmptyWrapper;

  return (
    <DropTarget
      key={key}
      Wrapper={Wrapper}
      componentList={componentList}
      layoutItem={layoutItem}
      onDelete={() => {
        remove(layout, (o) => {
          return o.id === layoutItem.id;
        });
      }}
      onChangeProps={(result) => {
        map(result, (change, key) => {
          layoutItem[key] = change;
        });
        layout[
          findIndex(layout, (o) => {
            return o.id === layoutItem.id;
          })
        ] = layoutItem;
      }}
      onChange={(response) => {
        console.log(response);

        if (!layoutItem.items) layoutItem.items = [];
        layoutItem.items.push({ type: response.id, xs: 12, id: uniqid() });
        const itemList = layout;
        const newItemList = itemList;
        newItemList[
          findIndex(itemList, (o) => {
            return o.id === layoutItem.id;
          })
        ] = layoutItem;
        onDrop(newItemList);
      }}
    >
      {layoutItem.items &&
        layoutItem.items.map((layoutItem, key) => {
          return (
            <LayoutItem
              key={key}
              layoutItem={layoutItem}
              componentList={componentList}
              onDrop={onDrop}
              layout={layout}
              path={path + layoutItem.id}
            />
          );
        })}
    </DropTarget>
  );
};
