import React from "react";
import { Skeleton } from "@material-ui/lab";
import styles from "./styles.module.scss";
import { Typography } from "@material-ui/core";

const ConditionsBlock: React.FC<{
  isLoading?: true;
  onClick?: (event) => void;
  condition?;
}> = ({ isLoading, onClick, condition }) => {
  return isLoading ? (
    <Skeleton className={styles.block} />
  ) : (
    <div className={styles.block} onClick={onClick}>
      <Typography variant="subtitle2" className={styles.blockHeader}>
        {condition.name}
      </Typography>
    </div>
  );
};

export default ConditionsBlock;
