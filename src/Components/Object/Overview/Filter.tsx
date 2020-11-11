import { Button, Grid, Typography } from "@material-ui/core";
import React, { useState } from "react";
import { AppContextType, ModelType } from "../../../Utils/Types";
import ObjectDesigner from "../../ObjectDesigner/Filter";

const ObjectOverviewFilter: React.FC<{
  context: AppContextType;
  model: ModelType;
  modelId: string;
  onChange: (filter) => void;
}> = ({ context, model, modelId, onChange }) => {
  // Vars
  const [currentFilter, setCurrentFilter] = useState<
    {
      key: string;
      operator: "equals" | "not_equals";
      value: string | number | boolean;
    }[]
  >([]);

  // Lifecycle
  // UI
  return (
    <div style={{ margin: 15 }}>
      <Typography variant="h6">Create list</Typography>
      <ObjectDesigner
        context={context}
        model={model}
        modelId={modelId}
        value={currentFilter}
        onChange={(value) => {
          setCurrentFilter(value);
        }}
      />
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={() => {
              onChange(currentFilter);
            }}
          >
            Apply
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button fullWidth color="primary">
            Save
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default ObjectOverviewFilter;
