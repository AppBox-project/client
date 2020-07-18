import React, { useState } from "react";
import DropTarget from "./DropTarget";
import Component from "./Component";
import { DndProvider } from "react-dnd";
import MultiBackend from "react-dnd-multi-backend";
import HTML5toTouch from "react-dnd-multi-backend/dist/esm/HTML5toTouch"; // or any other pipeline
import { Grid, IconButton, List, ListItem, Tooltip } from "@material-ui/core";
import { map } from "lodash";
import { LayoutType } from "../../Utils/Types";
import { findIndex } from "lodash";
import uniqid from "uniqid";
import {
  AnimationContainer,
  AnimationItem,
} from "../Apps/Apps/AppUI/Animations";
import { BsBoxArrowRight, BsBoxArrowLeft } from "react-icons/bs";
import styles from "./styles.module.scss";
import { remove, updateById } from "../../Utils/Functions/General";

const LayoutDesigner: React.FC<{
  layout: LayoutType;
  onChange: (layout) => void;
  componentList: {};
}> = ({ layout, onChange, componentList }) => {
  // Vars
  const [expandTray, setExpandTray] = useState<any>(false);
  // UI
  return (
    <DndProvider backend={MultiBackend} options={HTML5toTouch}>
      <Grid container style={{ overflow: "hidden", height: "100%" }}>
        <Grid
          item
          xs={expandTray ? 9 : 11}
          md={expandTray ? 10 : 11}
          className={styles.designer}
        >
          <DropTarget
            Wrapper={EmptyWrapper}
            root
            onChange={(response) => {
              // If there is a migration, delete the old entry first
              if (response.migration) {
                remove(layout.layout, response.migration.id);
              }

              onChange({
                ...layout, layout: [...layout.layout,
                {
                  type: response.id,
                  xs: 12,
                  id: uniqid(),
                  ...response.migration, // migrate any old data to here
                }],
              });
            }}
          >
            {layout.layout.map((layoutItem, key) => {
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
        </Grid>
        <Grid
          item
          xs={expandTray ? 3 : 1}
          md={expandTray ? 2 : 1}
          className={styles.tray}
        >
          <Tooltip
            placement="left"
            title={expandTray ? "Hide components" : "Show components"}
          >
            <IconButton
              onClick={() => {
                setExpandTray(!expandTray);
              }}
            >
              {expandTray ? <BsBoxArrowRight /> : <BsBoxArrowLeft />}
            </IconButton>
          </Tooltip>

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
    </DndProvider >
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
  layout: LayoutType;
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
        remove(layout.layout, layoutItem.id);
      }}
      onChangeProps={(result) => {
        map(result, (change, key) => {
          layoutItem[key] = change;
        });
        updateById(layout.layout, layoutItem)
      }}
      onChange={(response) => {
        console.log(layout, layoutItem, response);
        if (response.migration) {
          remove(layout.layout, response.migration.id);
        }
        if (!layoutItem?.items) layoutItem.items = []
        layoutItem.items.push({
          type: response.id,
          xs: 12,
          id: uniqid(),
          ...response.migration,
        });
        updateById(layout.layout, layoutItem)
        onDrop(layout);
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
