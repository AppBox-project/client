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
} from "@material-ui/core";
import Select from "react-select";
import { FaTrash } from "react-icons/fa";
import { filter, map, findIndex } from "lodash";
import InputInput from "../../../Inputs/Input";
import uniqid from "uniqid";

const OverviewFilter: React.FC<{
  overviewFilter;
  setOverviewFilter;
  model;
}> = ({ overviewFilter, setOverviewFilter, model }) => {
  // Vars
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
          {overviewFilter.map((filterItem, index) => (
            <FilterItem
              key={index}
              modelFieldOptions={modelFieldOptions}
              setOverviewFilter={setOverviewFilter}
              overviewFilter={overviewFilter}
              filterItem={filterItem}
            />
          ))}
        </TableBody>
      </Table>
      <Button
        fullWidth
        onClick={() => {
          const id = uniqid();
          setOverviewFilter([
            ...overviewFilter,
            { field: "username", operator: "=", value: "", id: uniqid() },
          ]);
        }}
      >
        Add filter
      </Button>
    </TableContainer>
  );
};

const FilterItem: React.FC<{
  modelFieldOptions;
  setOverviewFilter;
  overviewFilter;
  filterItem;
  key?;
}> = ({ modelFieldOptions, setOverviewFilter, overviewFilter, filterItem }) => {
  // Vars
  console.log(filterItem);

  return (
    <TableRow>
      <TableCell>
        <Select
          options={modelFieldOptions}
          inputValue={filterItem.field}
          onChange={(picked) => {
            setOverviewFilter([
              ...overviewFilter.splice(
                findIndex(overviewFilter, { id: filterItem.id }),
                1,
                { ...filterItem, field: picked }
              ),
            ]);
          }}
        />
      </TableCell>
      <TableCell>
        <Select
          options={[{ label: "=" }]}
          value={filterItem.operator}
          onChange={(picked) => {
            setOverviewFilter(
              overviewFilter.splice(
                findIndex(overviewFilter, { id: filterItem.id }),
                1,
                { ...filterItem, operator: picked }
              )
            );
          }}
        />
      </TableCell>
      <TableCell>
        <InputInput
          value={filterItem.value}
          placeholder="Value"
          onChange={(value) => {
            setOverviewFilter(
              overviewFilter.splice(
                findIndex(overviewFilter, { id: filterItem.id }),
                1,
                { ...filterItem, value }
              )
            );
          }}
        />
      </TableCell>
      <TableCell align="right">
        <IconButton
          onClick={() => {
            setOverviewFilter(
              filter(overviewFilter, (o) => {
                return o.id !== filterItem.id;
              })
            );
          }}
        >
          {filterItem.id}
          <FaTrash style={{ width: 15, height: 15 }} />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default OverviewFilter;
