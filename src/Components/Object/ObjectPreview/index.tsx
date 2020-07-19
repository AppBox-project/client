import React from "react";
import { ModelType } from "../../../Utils/Types";
import Card from "../../Design/Card";
import styles from "./styles.module.scss";
import * as icons from "react-icons/fa";
import { Avatar, Grid, Typography } from "@material-ui/core";

const ObjectPreview: React.FC<{ model: ModelType; object }> = ({
  model,
  object,
}) => {
  const Icon = icons[model.icon];

  return (
    <Card withMargin className={styles.root}>
      <Grid container className={styles.header}>
        <Grid item xs={1}>
          <Avatar
            color="primary"
            sizes="small"
            style={{
              width: 25,
              height: 25,
            }}
          >
            <Icon style={{ width: 15, height: 15 }} />
          </Avatar>
        </Grid>
        <Grid item xs={11} style={{ verticalAlign: "middle", paddingLeft: 10 }}>
          <Typography>{object.data[model.primary]}</Typography>
        </Grid>
      </Grid>
      <div className={styles.content}>{model.key}</div>
    </Card>
  );
};

export default ObjectPreview;
