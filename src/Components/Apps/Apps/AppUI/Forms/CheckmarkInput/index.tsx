import React, { useState, useEffect } from "react";
import { Grid, Checkbox } from "@material-ui/core";

const AppUICheckmark: React.FC<{
  label: string;
  value: boolean;
  onChange?: (value: boolean) => void;
}> = ({ label, value, onChange }) => {
  // Global
  // States & Hooks
  const [newValue, setNewValue] = useState(false);
  // Lifecycle
  useEffect(() => {
    setNewValue(value);
  }, [value]);

  // UI
  return (
    <Grid
      style={{ cursor: "pointer", padding: 5 }}
      container
      onClick={() => {
        setNewValue(!newValue);
        if (onChange) onChange(!newValue);
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
              onChange(event.target.checked);
            }}
          />
        </div>
      </Grid>
    </Grid>
  );
};

export default AppUICheckmark;
