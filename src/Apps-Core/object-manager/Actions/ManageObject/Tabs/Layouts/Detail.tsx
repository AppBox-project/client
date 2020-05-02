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
    const [layout, setLayout] = useState(model.layouts[detailId]);

    // Lifecycle
    console.log('brap', layout);

    // UI
    return (
      <context.UI.Animations.AnimationContainer>
        <context.UI.Animations.AnimationItem>
          <Typography variant="h6">
            Layout <i>{detailId}</i> {layout.length}
          </Typography>
        </context.UI.Animations.AnimationItem>
        <context.UI.Animations.AnimationItem>
          <Paper className="paper" style={{ marginTop: 15 }}>
            <LayoutDesigner
              componentList={{
                GridContainer: { label: "Grid container" },
                GridItem: { label: "Grid item" },
                AnimationContainer: { label: "Animation container" },
                AnimationItem: { label: "Animation Item" },
                Paper: { label: "Paper" },
                Group: { label: "Group" },
                Field: { label: "Field" },
                Html: { label: "HTML" },
              }}
              layout={layout}
              onChange={(layout) => {
                setLayout([...layout]);
              }}
            />
          </Paper>
        </context.UI.Animations.AnimationItem>
      </context.UI.Animations.AnimationContainer>
    );
  };

export default AppActionManageObjectTabLayoutsDetail;
