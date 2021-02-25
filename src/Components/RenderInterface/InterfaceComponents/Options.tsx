import { Typography } from "@material-ui/core";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import React from "react";

const RenderInterfaceOptions: React.FC<{
  value: string;
  onChange: (newVal: boolean) => void;
  varMeta;
}> = ({ value, onChange, varMeta }) => (
  <div style={{ marginTop: 15 }}>
    <Typography variant="body1">{varMeta.label}</Typography>
    <ToggleButtonGroup
      value={value}
      size="small"
      exclusive
      onChange={(event, newVal) => onChange(newVal)}
    >
      {varMeta.options.split(",").map((button) => (
        <ToggleButton value={button} aria-label="left aligned" key={button}>
          {button}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  </div>
);
export default RenderInterfaceOptions;
