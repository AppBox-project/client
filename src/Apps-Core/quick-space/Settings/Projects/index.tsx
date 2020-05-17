import React from "react";
import { AppContextType } from "../../../../Utils/Types";
import { Paper, Typography } from "@material-ui/core";

const AppSettingsProject: React.FC<{ context: AppContextType }> = ({
  context,
}) => {
  return (
    <context.UI.Animations.AnimationContainer>
      <context.UI.Animations.AnimationItem>
        <Paper className="paper" style={{ margin: 15 }}>
          <Typography variant="h6">Projects</Typography>
        </Paper>
      </context.UI.Animations.AnimationItem>
    </context.UI.Animations.AnimationContainer>
  );
};

export default AppSettingsProject;
