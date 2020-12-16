import { Grid } from "@material-ui/core";
import React from "react";
import Card from "../../../../Design/Card";
import { Animation } from "../Animations";

const PLCenteredBlock: React.FC<{
  children;
  title?: string;
  width?: boolean | "auto" | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  centered?: true;
}> = ({ children, title, width, centered }) => {
  return (
    <Animation>
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        style={{ marginTop: 75 }}
      >
        <Grid item xs={12} md={width || 3}>
          <Card withBigMargin title={title}>
            <div style={{ ...(centered && { textAlign: "center" }) }}>
              {children}
            </div>
          </Card>
        </Grid>
      </Grid>
    </Animation>
  );
};

export default PLCenteredBlock;
