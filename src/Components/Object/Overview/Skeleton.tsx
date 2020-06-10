import React from "react";
import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { Skeleton as SkeletonUI } from "@material-ui/lab";
const Skeleton: React.FC = () => {
  return (
    <TableContainer component="div" style={{ height: "100%", width: "100%" }}>
      <Toolbar style={{ display: "flex" }}>
        <Typography
          variant="h6"
          id="tableTitle"
          component="div"
          style={{ flex: 1 }}
        >
          <SkeletonUI width={300} />
        </Typography>
      </Toolbar>
      <Table aria-labelledby="tableTitle" aria-label="Object overview">
        <TableHead>
          <TableRow>
            <TableCell>
              <SkeletonUI />
            </TableCell>
            <TableCell>
              <SkeletonUI />
            </TableCell>
            <TableCell>
              <SkeletonUI />
            </TableCell>
          </TableRow>
        </TableHead>{" "}
        <TableBody>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((row) => (
            <TableRow key={row}>
              <TableCell>
                <SkeletonUI />
              </TableCell>
              <TableCell>
                <SkeletonUI />
              </TableCell>
              <TableCell>
                <SkeletonUI />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Skeleton;
