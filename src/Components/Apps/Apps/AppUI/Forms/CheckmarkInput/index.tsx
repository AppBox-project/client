import React, { useState, useEffect } from "react";
import { Grid, Checkbox } from "@material-ui/core";

const AppUICheckmark: React.FC<{
  label?: string;
  value: boolean;
  onChange?: (value: boolean, event: React.ChangeEvent<any>) => void;
}> = ({ label, value, onChange }) => {
  // Global
  // States & Hooks
  const [newValue, setNewValue] = useState<any>(false);
  // Lifecycle
  useEffect(() => {
    setNewValue(value);
  }, [value]);

  // UI
  if (!label)
    return (
      <Checkbox
        color="primary"
        checked={newValue}
        onChange={(event) => {
          setNewValue(event.target.checked);
          onChange(event.target.checked, event);
        }}
      />
    );
  return (
    <Grid
      style={{ cursor: "pointer", padding: 5 }}
      container
      onClick={(event) => {
        setNewValue(!newValue);
        if (onChange) onChange(!newValue, event);
      }}
    >
      <Grid item xs={11} className="input-container">
        <div className="input-container-sub">{label}</div>
      </Grid>
      <Grid item xs={1} className="input-container">
        <div className="input-container-sub" style={{ textAlign: "right" }}>
          <Checkbox
            color="primary"
            checked={newValue}
            onChange={(event) => {
              setNewValue(event.target.checked);
              onChange(event.target.checked, event);
            }}
          />
        </div>
      </Grid>
    </Grid>
  );
};

export default AppUICheckmark;
