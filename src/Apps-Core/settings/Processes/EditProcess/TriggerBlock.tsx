import React from "react";
import styles from "./styles.module.scss";
import { Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

const TriggerBlock: React.FC<{
  add?: true;
  isLoading?: true;
  onClick?: () => void;
  trigger?: { label: string };
}> = ({ add, isLoading, onClick, trigger }) => {
  return isLoading ? (
    <Skeleton className={styles.block} />
  ) : (
    <div className={styles.block} onClick={onClick}>
      {add ? (
        <Typography variant="subtitle2" className={styles.blockHeader}>
          Add trigger
        </Typography>
      ) : (
        <Typography variant="subtitle2" className={styles.blockHeader}>
          {trigger.label}
        </Typography>
      )}
    </div>
  );
};

export default TriggerBlock;
