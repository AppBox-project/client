import { Grid } from "@material-ui/core";
import React from "react";
import { ObjectType } from "../../../../../../Utils/Types";
import Card from "../../../../../Design/Card";
import { AnimationContainer, AnimationItem } from "../../Animations";
import { get } from "lodash";
import { Link } from "react-router-dom";

const GridItemLayout: React.FC<{
  data: ObjectType[];
  cols?: 1 | 2 | 3 | 4 | 5 | 6;
  title?: string;
  text?: string;
  link?: string;
  image?: string;
  baseUrl?: string;
}> = ({ data, cols, title, text, link, image, baseUrl }) => {
  // Vars

  // Lifecycle

  // UI
  return (
    <AnimationContainer>
      <Grid container>
        {data.map((item) => (
          <Grid
            item
            xs={(cols || 6) < 4 ? 12 : 6} //@ts-ignore
            md={Math.floor(12 / (cols || 6))}
            key={item._id}
          >
            <AnimationItem>
              <MaybeLink link={link && baseUrl + get(item, link)}>
                <Card
                  hoverable={link !== undefined}
                  withBigMargin
                  title={title && get(item, title)}
                  style={{ cursor: link && "pointer" }}
                  image={image && get(item, image)}
                >
                  {text && get(item, text)}
                </Card>
              </MaybeLink>
            </AnimationItem>
          </Grid>
        ))}
      </Grid>
    </AnimationContainer>
  );
};

export default GridItemLayout;

const MaybeLink: React.FC<{
  children;
  link: string;
}> = ({ children, link }) =>
  link ? <Link to={link}>{children}</Link> : children;
