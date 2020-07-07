import React from "react";
import { useState, useEffect } from "reactn";
import Axios from "axios";
import GridItemLayoutSkeleton from "./Skeleton";
import { Typography, Grid } from "@material-ui/core";
import { get } from "lodash";
import styles from "./styles.module.scss";
import { useHistory } from "react-router-dom";

const GridItemLayout: React.FC<{
  list?: {}[];
  remoteList?: string;
  title?: string;
  dataMap: {
    title: string;
    description?: string;
    image?: string;
    url?: string;
    id: string;
  };
  onClick?: (item) => void;
  descriptionIsHtml?: true;
  baseUrl?: string;
}> = ({
  list,
  remoteList,
  title,
  dataMap,
  descriptionIsHtml,
  onClick,
  baseUrl,
}) => {
  // Vars
  const [data, setData] = useState<{}[]>(list ? list : undefined);
  const history = useHistory();

  // Lifecycle
  useEffect(() => {
    Axios.get(remoteList).then((response) => {
      if (response.status === 200) {
        setData(response.data);
      } else {
        console.log(response);
      }
    });
  }, [remoteList]);

  // UI
  if (!list && !remoteList)
    return (
      <>
        <b>Error: </b>Either <em>list</em> or <em>remoteList</em> needs to be
        provided.
      </>
    );
  if (!data)
    return (
      <>
        {title && (
          <Typography
            variant="h6"
            style={{ textAlign: "center", cursor: "default" }}
          >
            {title}
          </Typography>
        )}
        <GridItemLayoutSkeleton />
      </>
    );
  return (
    <>
      {title && (
        <Typography
          variant="h6"
          style={{ textAlign: "center", cursor: "default" }}
        >
          {title}
        </Typography>
      )}
      <Grid container>
        {data.map((item) => {
          const title = get(item, dataMap?.title || "title") || (
            <>
              <b>Error: </b>please provide a dataMap
            </>
          );
          const id = get(item, dataMap?.id || "id") || "Error";
          const image = dataMap?.image ? get(item, dataMap.image) : false;
          const description = dataMap?.description
            ? get(item, dataMap.description)
            : false;
          const url = dataMap?.url ? get(item, dataMap.url) : false;

          return (
            <Grid item xs={12} md={6} lg={3}>
              <div
                className={styles.item}
                style={{ cursor: (url || onClick) && "pointer" }}
                onClick={() => {
                  if (onClick) onClick(item);
                  if (url)
                    baseUrl
                      ? history.push(`${baseUrl}/${url}`)
                      : history.push(url);
                }}
              >
                {image && (
                  <div className={styles.imageWrapper}>
                    <img src={image} alt="Design preview" />
                  </div>
                )}
                <div className={styles.infoWrapper}>
                  <Typography variant="h6" style={{ fontSize: 20 }}>
                    {title}
                  </Typography>
                  {description && (
                    <Typography variant="subtitle2">
                      {descriptionIsHtml ? (
                        <div
                          dangerouslySetInnerHTML={{ __html: description }}
                        />
                      ) : (
                        description
                      )}
                    </Typography>
                  )}
                </div>
              </div>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};

export default GridItemLayout;
