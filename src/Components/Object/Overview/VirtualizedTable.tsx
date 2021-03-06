import React, { useState } from "react";
import TableCell from "@material-ui/core/TableCell";
import { AutoSizer, Column, Table } from "react-virtualized";
import { ModelType } from "../../../Utils/Types";
import FieldDisplay from "../FieldDisplay";
import { TableSortLabel, Checkbox, IconButton } from "@material-ui/core";
import filter from "lodash/filter";
import orderBy from "lodash/orderBy";
import "react-virtualized/styles.css";
import { IoMdMore } from "react-icons/io";
import styles from "./styles.module.scss";

const ReactVirtualizedTable: React.FC<{
  data;
  columns;
  model: ModelType;
  baseUrl: string;
  history;
  selected;
  setSelected;
  setAnchorEl;
}> = ({
  data,
  columns,
  model,
  baseUrl,
  history,
  selected,
  setSelected,
  setAnchorEl,
}) => {
  // Vars
  const [remoteModelCache, setRemoteModelCache] = useState<any>({});
  const [remoteObjectCache, setRemoteObjectCache] = useState<any>({});
  const [orderField, setOrderField] = useState<any>(columns[0]);
  const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("asc");
  const sortedData = orderBy(data, [`data.${orderField}`], [orderDirection]);

  // Lifecycle
  // UI
  return (
    <div style={{ height: "calc(100% - 64px)", width: "100%" }}>
      <AutoSizer>
        {({ height, width }) => (
          <Table
            height={height}
            width={width}
            rowHeight={48}
            gridStyle={{
              direction: "inherit",
            }}
            headerHeight={48}
            rowCount={sortedData.length}
            rowGetter={({ index }) => sortedData[index]}
            overscanRowCount={20}
            rowClassName={`${styles.tableRow} ${styles.flexContainer}`}
          >
            <Column
              dataKey="checkmark"
              headerRenderer={(headerProps) => (
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
              )}
              className={styles.flexContainer}
              cellRenderer={({ rowData }) => {
                return (
                  <Checkbox
                    color="primary"
                    checked={
                      selected ? selected.indexOf(rowData._id) !== -1 : false
                    }
                    onChange={() => {
                      if (selected.includes(rowData._id)) {
                        setSelected(
                          filter(selected, (o) => {
                            return o !== rowData._id;
                          })
                        );
                      } else {
                        setSelected([...selected, rowData._id]);
                      }
                    }}
                  />
                );
              }}
            />
            {columns.map(({ dataKey, ...other }, index) => {
              return (
                <Column
                  width={300}
                  key={dataKey}
                  headerRenderer={(headerProps) => (
                    <TableCell
                      component="div"
                      variant="head"
                      style={{
                        height: 48,
                        display: "flex",
                        alignItems: "center",
                        boxSizing: "border-box",
                      }}
                      align={columns[index].numeric || false ? "right" : "left"}
                    >
                      <TableSortLabel
                        onClick={() => {
                          if (orderField === columns[index]) {
                            setOrderDirection(
                              orderDirection === "asc" ? "desc" : "asc"
                            );
                          } else {
                            setOrderField(columns[index]);
                            setOrderDirection("asc");
                          }
                        }}
                        active={orderField === columns[index]}
                        direction={
                          orderField === columns[index] ? orderDirection : "asc"
                        }
                      >
                        {model.fields[columns[index]].name}
                      </TableSortLabel>
                    </TableCell>
                  )}
                  className={styles.flexContainer}
                  cellRenderer={({ rowData, isScrolling }) => {
                    return (
                      <TableCell
                        onClick={() => {
                          history.push(`${baseUrl}/${rowData._id}`);
                        }}
                        component="div"
                        variant="body"
                        style={{
                          height: 48,
                          display: "flex",
                          alignItems: "center",
                          boxSizing: "border-box",
                          flex: 1,
                        }}
                      >
                        <FieldDisplay
                          modelField={model.fields[columns[index]]}
                          objectField={rowData.data[columns[index]]}
                          remoteModelCache={remoteModelCache[columns[index]]}
                          onLoadRemoteModel={(remoteModel) => {
                            if (!remoteModelCache[columns[index]]) {
                              setRemoteModelCache({
                                ...remoteModelCache,
                                [columns[index]]: remoteModel,
                              });
                            }
                          }}
                          remoteObjectCache={
                            remoteObjectCache[rowData.data[columns[index]]]
                          }
                          onLoadRemoteObject={(remoteObject) => {
                            if (
                              !remoteObjectCache[rowData.data[columns[index]]]
                            ) {
                              setRemoteObjectCache({
                                ...remoteObjectCache,
                                [rowData.data[columns[index]]]: remoteObject,
                              });
                            }
                          }}
                          object={rowData}
                        />
                      </TableCell>
                    );
                  }}
                  dataKey={dataKey}
                  {...other}
                />
              );
            })}
            <Column
              key="options"
              headerRenderer={(headerProps) => " "}
              className={styles.flexContainer}
              cellRenderer={({ rowData }) => (
                <TableCell style={{ flex: 1, minWidth: 50 }}>
                  <div style={{ float: "right" }}>
                    <IconButton
                      onClick={(event) => {
                        const newSelected = [];
                        newSelected.push(rowData._id);
                        setSelected(newSelected);
                        setAnchorEl(event.currentTarget);
                      }}
                    >
                      <IoMdMore />
                    </IconButton>
                  </div>
                </TableCell>
              )}
              dataKey={"options"}
            />
          </Table>
        )}
      </AutoSizer>
    </div>
  );
};

export default ReactVirtualizedTable;
