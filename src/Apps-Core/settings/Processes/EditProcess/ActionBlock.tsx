import React from "react";
import { Skeleton } from "@material-ui/lab";
import styles from "./styles.module.scss";
import { Typography } from "@material-ui/core";

const ActionsBlock: React.FC<{
  isLoading?: true;
  onClick?: (event) => void;
  action?;
}> = ({ isLoading, onClick, action }) => {
  return isLoading ? (
    <Skeleton className={styles.block} />
  ) : (
    <div className={styles.block} onClick={onClick}>
      <Typography variant="subtitle2" className={styles.blockHeader}>
        Actions
      </Typography>
    </div>
  );
};

export default ActionsBlock;
