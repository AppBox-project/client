import React from "react";
import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  Grid,
  Divider,
} from "@material-ui/core";
import { MdExpandMore } from "react-icons/md";
import { ModelType, ObjectType } from "../../../../Utils/Types";
import ObjectLayoutItemField from "../Field";

const ObjectLayoutItemFieldGrid: React.FC<{
  model: ModelType;
  object: ObjectType;
  layoutItem: {
    layout: {
      columns: number;
      showTitle: boolean;
      defaultExpanded: boolean;
      id: string;
      items: [];
      name: string;
    }[];
  };
  setToChange;
  toChange;
  setMode;
  mode;
}> = ({ layoutItem, object, model, setToChange, toChange, setMode, mode }) => {
  // Vars
  // Lifecycle
  // UI
  return (
    <>
      {layoutItem.layout.map((group) => (
        <Accordion
          defaultExpanded={group.defaultExpanded}
          elevation={0}
          style={{ border: "1px solid rgba(0,0,0,0.1)", marginBottom: 15 }}
        >
          <AccordionSummary expandIcon={<MdExpandMore />}>
            <Typography variant="h6">{group.name}</Typography>
            <Divider />
          </AccordionSummary>
          <AccordionDetails>
            <Grid container>
              {group.items.map((item) => (
                <Grid
                  item
                  xs={12}
                  //@ts-ignore
                  md={12 / group.columns}
                  style={{ overflow: "hidden" }}
                >
                  <ObjectLayoutItemField
                    layoutItem={{ field: item }}
                    object={object}
                    mode={mode}
                    setMode={setMode}
                    model={model}
                    toChange={toChange}
                    onChange={(value) => {
                      setToChange({ ...toChange, [item]: value });
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
};

export default ObjectLayoutItemFieldGrid;
