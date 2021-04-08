import React from "react";
import {
  AppContextType,
  ModelType,
  ValueListItemType,
} from "../../../../Utils/Types";
import map from "lodash/map";
import { useState, useEffect } from "reactn";
import { Grid } from "@material-ui/core";

const ExtensionConfigure: React.FC<{
  onChange: (value) => void;
  context: AppContextType;
  modelExtension: any;
  model: ModelType;
}> = ({ onChange, context, modelExtension, model }) => {
  // Vars

  // Lifecycle

  // UI

  return (
    <Grid container>
      <Grid item xs={3}>
        Test
      </Grid>
      <Grid item xs={9}>
        Test
      </Grid>
      <context.UI.Inputs.CheckmarkInput
        label="Active"
        value={modelExtension.active}
        onChange={(value) => onChange({ ...modelExtension, active: value })}
      />
    </Grid>
  );
};

export default ExtensionConfigure;
