import React from "react";
import DropTarget from "./DropTarget";
import Component from "./Component";
import { DndProvider } from "react-dnd";
import MultiBackend from "react-dnd-multi-backend";
import HTML5toTouch from "react-dnd-multi-backend/dist/esm/HTML5toTouch"; // or any other pipeline
import { Divider } from "@material-ui/core";
import { map } from "lodash";
import { LayoutDesignerItem } from "../../Utils/Types";

const LayoutDesigner: React.FC<{
  layout: LayoutDesignerItem[];
  onChange: (layout) => void;
  componentList: {};
}> = ({ layout, onChange, componentList }) => {
  // UI
  return (
    <DndProvider backend={MultiBackend} options={HTML5toTouch}>
      {map(componentList, (component, key) => {
        return <Component label={component.label} id={key} key={key} />;
      })}
      <Divider style={{ marginTop: 10 }} />
      <div style={{ overflow: "hidden", clear: "both", marginTop: 10 }}>
        <DropTarget
          root
          onChange={(response) => {
            onChange([...layout, { field: "name", type: "Field", xs: 12 }]);
          }}
        >
          {layout.map((layoutItem, key) => {
            return (
              <DropTarget
                key={key}
                layoutItem={layoutItem}
                onChange={(response) => {
                  console.log(response);
                }}
              />
            );
          })}
        </DropTarget>
      </div>
    </DndProvider>
  );
};

export default LayoutDesigner;
