import React from "react";
import drawing from "./construction.svg";
import styles from "./styles.module.scss";
import { Typography } from "@material-ui/core";

const PageOnboardingNoDb: React.FC = () => {
  return (
    <>
      <div
        className={styles.root}
        style={{ backgroundImage: `url(${drawing})` }}
      />
      <div
        className="center"
        style={{
          textAlign: "center",
          backgroundColor: "rgba(255,255,255,0.6)",
          padding: 35,
          borderRadius: 8,
        }}
      >
        <Typography gutterBottom variant="h4">
          Mongo DB not online
        </Typography>
        <Typography variant="body1">
          We require an instance of MongoDB to run AppBox.
        </Typography>
        <Typography variant="body2">
          We'll add a set of instructions on how to get started later. For now,
          have it running as a replicaSet and point AppBox towards it with an
          environment variable.
        </Typography>
      </div>
    </>
  );
};

export default PageOnboardingNoDb;
