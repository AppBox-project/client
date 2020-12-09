import React, { useGlobal } from "reactn";
import { ModelType } from "../../../Utils/Types";
import Card from "../../Design/Card";
import styles from "./styles.module.scss";
import * as icons from "react-icons/fa";
import { Avatar, Grid, Typography } from "@material-ui/core";
import { baseUrl } from "../../../Utils/Utils";
import FieldDisplay from "../FieldDisplay";
import { Link } from "react-router-dom";

const ObjectPreview: React.FC<{ model: ModelType; object }> = ({
  model,
  object,
}) => {
  const Icon = icons[model.icon];
  const [theme] = useGlobal<any>("theme");

  const Picture =
    (model.preview?.picture || "modelicon") === "modelicon" ? (
      <Avatar
        color="primary"
        style={{
          width: 25,
          height: 25,
          color: theme.palette.primary.main,
          backgroundColor: "white",
        }}
      >
        <Icon style={{ width: 15, height: 15 }} />
      </Avatar>
    ) : object.data[model.preview.picture] ? (
      <Avatar
        color="primary"
        style={{
          width: 25,
          height: 25,
          color: theme.palette.primary.main,
          backgroundColor: "white",
        }}
        src={baseUrl + object.data[model.preview.picture]}
      />
    ) : (
      <Avatar
        color="primary"
        style={{
          width: 25,
          height: 25,
        }}
      >
        <Icon style={{ width: 15, height: 15 }} />
      </Avatar>
    );

  return (
    <Card withBigMargin withoutPadding className={styles.root}>
      <Link to={`/o/${object._id}`}>
        <Grid
          container
          className={styles.header}
          style={{ backgroundColor: theme.palette.primary.main }}
        >
          <Grid item xs={1}>
            {Picture}
          </Grid>
          <Grid
            item
            xs={11}
            style={{ verticalAlign: "middle", paddingLeft: 10 }}
          >
            <Typography noWrap>{object.data[model.primary]}</Typography>
          </Grid>
        </Grid>
      </Link>
      <div className={styles.content}>
        <Grid container>
          {(model.preview?.fields || []).map((field) => {
            return (
              <Grid
                item
                //@ts-ignore
                xs={12 / model.preview.fields.length}
                style={{ overflow: "hidden" }}
              >
                <FieldDisplay
                  objectField={object.data[field]}
                  modelField={model.fields[field]}
                  object={object}
                />
              </Grid>
            );
          })}
        </Grid>
      </div>
    </Card>
  );
};

export default ObjectPreview;
