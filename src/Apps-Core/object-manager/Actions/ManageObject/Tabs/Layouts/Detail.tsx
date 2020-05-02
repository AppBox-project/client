import React, { useState, useEffect } from "react";
import { AppContextType, ModelType } from "../../../../../../Utils/Types";
import { Typography, Paper, Divider, Fab } from "@material-ui/core";
import LayoutDesigner from "../../../../../../Components/LayoutDesigner";
import { FaSave } from "react-icons/fa";

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
    const [hasChanged, setHasChanged] = useState(false)

    // Lifecycle

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
                GridContainer: { label: "Grid container", droppable: true },
                GridItem: { label: "Grid item", droppable: true },
                AnimationContainer: { label: "Animation container", droppable: true },
                AnimationItem: { label: "Animation Item", droppable: true },
                Paper: { label: "Paper", droppable: true },
                Group: { label: "Group", droppable: true },
                Field: { label: "Field" },
                Html: { label: "HTML" },
              }}
              layout={layout}
              onChange={(layout) => {
                setLayout([...layout]);
                setHasChanged(true)
              }}
            />
          </Paper>
        </context.UI.Animations.AnimationItem>{hasChanged && <context.UI.Animations.AnimationContainer><context.UI.Animations.AnimationItem><Fab color="primary" style={{ position: 'fixed', bottom: 15, right: 15 }} onClick={() => {
          console.log(layout);

        }}><FaSave /></Fab></context.UI.Animations.AnimationItem></context.UI.Animations.AnimationContainer>}
      </context.UI.Animations.AnimationContainer>
    );
  };

export default AppActionManageObjectTabLayoutsDetail;
