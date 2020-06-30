import React, { useState, useEffect } from "react";
import {
  TextField,
  Grid,
  Button,
  List,
  ListItemText,
  ListItem,
  ListSubheader,
  Tooltip,
} from "@material-ui/core";
import Server from "../../Utils/Server";
import uniqid from "uniqid";

const FormulaEditor: React.FC<{
  value: string;
  onChange: (formula: string, deps: string[]) => void;
  formulaContext: string;
}> = ({ value, onChange, formulaContext }) => {
  // General

  // Hooks
  const [isValid, setIsValid] = useState<any>(true);
  const [preview, setPreview] = useState<any>("");
  const [newValue, setNewValue] = useState<any>();
  const [requestId, setRequestId] = useState<any>(uniqid());
  const [dependencies, setDependencies] = useState<any>([]);

  // Lifecycle
  useEffect(() => {
    setNewValue(value ? value : "{{ project_r.owner_r.first_name }}");
    Server.on(`receive-${requestId}`, (response) => {
      setPreview(response);
    });
  }, [value]);

  // UI
  return (
    <Grid container>
      <Grid item xs={6}>
        <Button fullWidth>Add field</Button>
      </Grid>
      <Grid item xs={6}>
        <Button
          fullWidth
          onClick={() => {
            const depList = [];
            newValue.split("{{").map((tag) => {
              if (tag.match("}}")) {
                const t = tag.split("}}")[0].trim();
                depList.push(t);
              }
            });
            setDependencies(depList);
            onChange(newValue, depList);

            Server.emit("testFormula", {
              formula: newValue,
              requestId,
              context: formulaContext,
              dependencies: depList,
            });
          }}
        >
          Test
        </Button>
      </Grid>
      <Grid item xs={9}>
        <TextField
          multiline
          value={newValue}
          fullWidth
          label="Formula"
          onChange={(event) => {
            setNewValue(event.target.value);
          }}
        />
      </Grid>
      <Grid item xs={3} style={{ backgroundColor: "#eeeeee" }}>
        {preview}
      </Grid>
      {dependencies.length > 0 && (
        <Grid item xs={12}>
          <Tooltip
            title="The formula will be recalculated when one of it's dependencies changes."
            placement="left"
          >
            <List>
              <ListSubheader>Formula dependencies</ListSubheader>
              {dependencies.map((dep) => {
                return (
                  <ListItem key={dep}>
                    <ListItemText>{dep}</ListItemText>
                  </ListItem>
                );
              })}
            </List>
          </Tooltip>
        </Grid>
      )}
    </Grid>
  );
};

export default FormulaEditor;
