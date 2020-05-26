import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import { AutoSizer, Column, Table } from "react-virtualized";
import { ModelType } from "../../../Utils/Types";
import FieldDisplay from "../FieldDisplay";
import { TableSortLabel, Checkbox, IconButton } from "@material-ui/core";
import { filter } from "lodash";

import "react-virtualized/styles.css";
import { IoMdMore } from "react-icons/io";
const styles = (theme) => ({
  flexContainer: {
    display: "flex",
    alignItems: "center",
    boxSizing: "border-box",
  },
  table: {
    // temporary right-to-left patch, waiting for
    // https://github.com/bvaughn/react-virtualized/issues/454
    "& .ReactVirtualized__Table__headerRow": {
      flip: false,
      paddingRight: theme.direction === "rtl" ? "0 !important" : undefined,
    },
  },
  tableRow: {
    cursor: "pointer",
  },
  tableRowHover: {
    "&:hover": {
      backgroundColor: theme.palette.grey[200],
    },
  },
  tableCell: {
    flex: 1,
  },
  noClick: {
    cursor: "initial",
  },
});

class MuiVirtualizedTable extends React.PureComponent {
  static defaultProps = {
    headerHeight: 48,
    rowHeight: 48,
  };

  cellRenderer = ({ rowData, columnIndex, baseUrl }) => {
    const {
      //@ts-ignore
      columns,
      //@ts-ignore
      classes,
      //@ts-ignore
      rowHeight,
      //@ts-ignore
      onRowClick,
      //@ts-ignore
      model,
      //@ts-ignore
      history,
    } = this.props;

    return (
      <TableCell
        onClick={() => {
          history.push(`${baseUrl}/${rowData._id}`);
        }}
        component="div"
        variant="body"
        style={{
          height: rowHeight,
          display: "flex",
          alignItems: "center",
          boxSizing: "border-box",
          flex: 1,
        }}
      >
        <FieldDisplay
          modelField={model.fields[columns[columnIndex]]}
          objectField={rowData.data[columns[columnIndex]]}
        />
      </TableCell>
    );
  };

  headerRenderer = ({ label, columnIndex }) => {
    //@ts-ignore
    const { headerHeight, columns, classes, model } = this.props;

    return (
      <TableCell
        component="div"
        variant="head"
        style={{
          height: headerHeight,
          display: "flex",
          alignItems: "center",
          boxSizing: "border-box",
          flex: 1,
        }}
        align={columns[columnIndex].numeric || false ? "right" : "left"}
      >
        <TableSortLabel>
          {model.fields[columns[columnIndex]].name}
        </TableSortLabel>
      </TableCell>
    );
  };

  render() {
    const {
      //@ts-ignore
      classes,
      //@ts-ignore
      columns,
      //@ts-ignore
      rowHeight,
      //@ts-ignore
      headerHeight,
      //@ts-ignore
      model,
      //@ts-ignore
      baseUrl,
      //@ts-ignore
      history,
      //@ts-ignore
      data,
      //@ts-ignore
      selected,
      //@ts-ignore
      setSelected,
      //@ts-ignore
      setAnchorEl,
      ...tableProps
    } = this.props;
    return (
      <AutoSizer>
        {({ height, width }) => (
          <Table
            height={height}
            width={width}
            rowHeight={rowHeight}
            gridStyle={{
              direction: "inherit",
            }}
            headerHeight={headerHeight}
            className={classes.table}
            {...tableProps}
            rowClassName={`${classes.tableRow} ${classes.flexContainer}`}
          >
            <Column
              width={100}
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
              className={classes.flexContainer}
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
                  headerRenderer={(headerProps) =>
                    this.headerRenderer({
                      ...headerProps,
                      columnIndex: index,
                      model: model,
                    })
                  }
                  className={classes.flexContainer}
                  cellRenderer={(props) =>
                    this.cellRenderer({
                      ...props,
                      columnIndex: index,
                      model: model,
                      baseUrl: baseUrl,
                      history: history,
                    })
                  }
                  dataKey={dataKey}
                  {...other}
                />
              );
            })}
            <Column
              width={100}
              key="options"
              headerRenderer={(headerProps) => " "}
              className={classes.flexContainer}
              cellRenderer={({ rowData }) => (
                <TableCell>
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
    );
  }
}
//@ts-ignore
const VirtualizedTable = withStyles(styles)(MuiVirtualizedTable);

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
  return (
    <div style={{ height: "calc(100% - 64px)", width: "100%" }}>
      <VirtualizedTable
        rowCount={data.length}
        rowGetter={({ index }) => data[index]}
        columns={columns}
        model={model}
        baseUrl={baseUrl}
        history={history}
        data={data}
        selected={selected}
        setSelected={setSelected}
        setAnchorEl={setAnchorEl}
      />
    </div>
  );
};

export default ReactVirtualizedTable;
