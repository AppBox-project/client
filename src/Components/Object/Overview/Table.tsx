import React, { useState } from "react";
import {
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  IconButton,
  Table,
  TableHead,
  TableSortLabel,
} from "@material-ui/core";
import { filter, orderBy } from "lodash";
import FieldDisplay from "../FieldDisplay";
import { IoMdMore } from "react-icons/io";

const RegularTable: React.FC<{
  data;
  layout;
  model;
  baseUrl;
  history;
  setSelected;
  selected;
  setAnchorEl;
}> = ({
  data,
  layout,
  model,
  baseUrl,
  history,
  setSelected,
  selected,
  setAnchorEl,
}) => {
  // Vars
  const [orderField, setOrderField] = useState(layout.fields[0]);
  const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("asc");
  const sortedData = orderBy(data, [`data.${orderField}`], [orderDirection]);

  // Lifecycle
  // UI
  return (
    <Table aria-labelledby="tableTitle" aria-label="Object overview">
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              color="primary"
              inputProps={{ "aria-label": "Select all" }}
              onChange={(event) => {
                if (event.target.checked) {
                  const newSelecteds = data.map((n) => n._id);
                  setSelected(newSelecteds);
                  return;
                }
                setSelected([]);
              }}
              checked={data.length > 0 && selected.length === data.length}
              indeterminate={
                selected.length > 0 && selected.length < data.length
              }
            />
          </TableCell>
          {layout.fields.map((field) => (
            <TableCell key={field}>
              <TableSortLabel
                onClick={() => {
                  if (orderField === field) {
                    setOrderDirection(
                      orderDirection === "asc" ? "desc" : "asc"
                    );
                  } else {
                    setOrderField(field);
                    setOrderDirection("asc");
                  }
                }}
                active={orderField === field}
                direction={orderField === field ? orderDirection : "asc"}
              >
                {model.fields[field].name}
              </TableSortLabel>
            </TableCell>
          ))}
          {layout.actions && layout.actions.length > 0 && (
            <TableCell> </TableCell>
          )}
        </TableRow>
      </TableHead>{" "}
      <TableBody>
        {sortedData.map((object, index) => {
          const isItemSelected = selected
            ? selected.indexOf(object._id) !== -1
            : false;
          const labelId = `enhanced-table-checkbox-${index}`;

          return (
            <TableRow
              hover
              role="checkbox"
              aria-checked={isItemSelected}
              tabIndex={-1}
              key={object._id}
              selected={isItemSelected}
            >
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  checked={isItemSelected}
                  onChange={() => {
                    if (selected.includes(object._id)) {
                      setSelected(
                        filter(selected, (o) => {
                          return o !== object._id;
                        })
                      );
                    } else {
                      setSelected([...selected, object._id]);
                    }
                  }}
                  inputProps={{ "aria-labelledby": labelId }}
                />
              </TableCell>
              {layout.fields.map((field) => {
                return (
                  <TableCell
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      history.push(`${baseUrl}/${object._id}`);
                    }}
                  >
                    <FieldDisplay
                      modelField={model.fields[field]}
                      objectField={object.data[field]}
                    />
                  </TableCell>
                );
              })}
              {layout.actions && layout.actions.length > 0 && (
                <TableCell>
                  <div style={{ float: "right" }}>
                    <IconButton
                      onClick={(event) => {
                        const newSelected = [];
                        newSelected.push(object._id);
                        setSelected(newSelected);
                        setAnchorEl(event.currentTarget);
                      }}
                    >
                      <IoMdMore />
                    </IconButton>
                  </div>
                </TableCell>
              )}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
export default RegularTable;
