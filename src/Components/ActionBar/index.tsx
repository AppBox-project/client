import React from "react";
import styles from "./styles.module.scss";
import { Link } from "react-router-dom";
import { FaAngleLeft } from "react-icons/fa";
import { IconButton } from "@material-ui/core";

const ActionBar: React.FC<{ backUrl?: string }> = ({ backUrl }) => {
  return (
    <div className={styles.root}>
      {backUrl && (
        <Link to={backUrl}>
          <IconButton>
            <FaAngleLeft />
          </IconButton>
        </Link>
      )}
    </div>
  );
};

export default ActionBar;
