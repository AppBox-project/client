import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import { AutoSizer, Column, Table } from "react-virtualized";
import { ModelType } from "../../../Utils/Types";
import FieldDisplay from "../FieldDisplay";
import { TableSortLabel } from "@material-ui/core";
import "react-virtualized/styles.css";
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

  cellRenderer = ({ rowData, columnIndex }) => {
    //@ts-ignore
    const { columns, classes, rowHeight, onRowClick, model } = this.props;

    return (
      <TableCell
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
                    })
                  }
                  dataKey={dataKey}
                  {...other}
                />
              );
            })}
          </Table>
        )}
      </AutoSizer>
    );
  }
}
//@ts-ignore
const VirtualizedTable = withStyles(styles)(MuiVirtualizedTable);

const ReactVirtualizedTable: React.FC<{ data; columns; model: ModelType }> = ({
  data,
  columns,
  model,
}) => {
  return (
    <div style={{ height: 800, width: "100%" }}>
      <VirtualizedTable
        rowCount={data.length}
        rowGetter={({ index }) => data[index]}
        columns={columns}
        model={model}
      />
    </div>
  );
};

export default ReactVirtualizedTable;
