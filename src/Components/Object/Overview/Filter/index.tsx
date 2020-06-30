import React, { useState } from "react";
import {
  TableContainer,
  Paper,
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  IconButton,
  Button,
  Grid,
} from "@material-ui/core";
import Select from "react-select";
import { FaTrash } from "react-icons/fa";
import { map } from "lodash";
import InputInput from "../../../Inputs/Input";
import { ModelType } from "../../../../Utils/Types";
import InputCheckbox from "../../../Inputs/Checkbox";

const OverviewFilter: React.FC<{
  onSave;
  model;
}> = ({ onSave, model }) => {
  // Vars
  const [filter, setFilter] = useState<any>([]);

  const modelFieldOptions = [];
  map(model.fields, (field, key) => {
    modelFieldOptions.push({ label: field.name, value: key });
  });

  // Lifecycle

  // UI
  return (
    <TableContainer component={Paper}>
      <Table aria-label="Filter table">
        <TableHead>
          <TableRow>
            <TableCell>Field</TableCell>
            <TableCell>Operator</TableCell>
            <TableCell>Value</TableCell>
            <TableCell> </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filter.map((filterItem, index) => (
            <FilterItem
              key={index}
              modelFieldOptions={modelFieldOptions}
              setFilter={setFilter}
              filter={filter}
              filterItem={filterItem}
              index={index}
              model={model}
            />
          ))}
        </TableBody>
      </Table>
      <Grid container>
        <Grid item xs={6}>
          <Button
            fullWidth
            onClick={() => {
              setFilter([
                ...filter,
                {
                  field: undefined,
                  operator: { label: "is equal to", value: "equals" },
                  value: "",
                },
              ]);
            }}
          >
            Add filter
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            fullWidth
            onClick={() => {
              onSave(filter);
            }}
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </TableContainer>
  );
};

const FilterItem: React.FC<{
  modelFieldOptions;
  setFilter;
  filter;
  filterItem;
  key?;
  index;
  model: ModelType;
}> = ({ modelFieldOptions, setFilter, filter, filterItem, index, model }) => {
  // Vars
  return (
    <TableRow>
      <TableCell>
        <Select
          options={modelFieldOptions}
          value={filter.field}
          onChange={(picked) => {
            const newFilter = filter;
            newFilter[index] = {
              ...filterItem,
              field: picked,
            };
            setFilter([...newFilter]);
          }}
        />
      </TableCell>
      <TableCell>
        <Select
          options={[
            { label: "is equal to", value: "equals" },
            { label: "contains", value: "contains" },
            { label: "starts with", value: "starts_with" },
            { label: "ends with", value: "ends_with" },
          ]}
          value={filterItem.operator}
          onChange={(picked) => {
            const newFilter = filter;
            newFilter[index] = {
              ...filterItem,
              operator: picked,
            };
            setFilter([...newFilter]);
          }}
        />
      </TableCell>
      <TableCell>
        {filterItem.field &&
          model.fields[filterItem.field?.value].type === "boolean" && (
            <InputCheckbox
              value={filterItem.value}
              onChange={(value) => {
                const newFilter = filter;
                newFilter[index] = {
                  ...filterItem,
                  value,
                };
                setFilter([...newFilter]);
              }}
            />
          )}
        {filterItem.field &&
          model.fields[filterItem.field?.value].type === "input" && (
            <InputInput
              value={filterItem.value}
              placeholder="Value"
              onChange={(value) => {
                const newFilter = filter;
                newFilter[index] = {
                  ...filterItem,
                  value,
                };
                setFilter([...newFilter]);
              }}
            />
          )}
      </TableCell>
      <TableCell align="right">
        <IconButton
          onClick={() => {
            const newFilter = filter;
            newFilter.splice(index, 1);
            setFilter([...newFilter]);
          }}
        >
          <FaTrash style={{ width: 15, height: 15 }} />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default OverviewFilter;
