import React, { useState, useEffect } from "react";
import { AppContextType, ModelType } from "../../../../../../Utils/Types";
import { Typography, Paper, Divider } from "@material-ui/core";
import LayoutDesigner from "../../../../../../Components/LayoutDesigner";

const AppActionManageObjectTabLayoutsDetail: React.FC<{
  match: { params: { detailId } };
  context: AppContextType;
  model: ModelType;
}> = ({
  match: {
    params: { detailId },
  },
  context,
  model,
}) => {
  // Global
  const [newLayout, setNewLayout] = useState();

  // Lifecycle
  useEffect(() => {
    setNewLayout(model.layouts[detailId]);
  }, [detailId]);

  // UI
  if (!newLayout) return <context.UI.Loading />;

  return (
    <context.UI.Animations.AnimationContainer>
      <context.UI.Animations.AnimationItem>
        <Typography variant="h6">
          Layout <i>{detailId}</i>
        </Typography>
      </context.UI.Animations.AnimationItem>
      <context.UI.Animations.AnimationItem>
        <Paper className="paper" style={{ marginTop: 15 }}>
          [item tray]
          <Divider style={{ margin: "15px 0" }} />
          <LayoutDesigner
            layout={newLayout}
            onChange={(layout) => {
              setNewLayout(layout);
            }}
          />
        </Paper>
      </context.UI.Animations.AnimationItem>
    </context.UI.Animations.AnimationContainer>
  );
};

export default AppActionManageObjectTabLayoutsDetail;
