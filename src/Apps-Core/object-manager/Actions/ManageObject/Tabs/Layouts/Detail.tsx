import React, { useState, useEffect } from "react";
import { AppContextType, ModelType } from "../../../../../../Utils/Types";
import { Typography, Paper, Divider, Fab } from "@material-ui/core";
import LayoutDesigner from "../../../../../../Components/LayoutDesigner";
import { FaSave } from "react-icons/fa";
import { map } from "lodash"

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
    const [hasChanged, setHasChanged] = useState(false);
    const [fieldList, setFieldList] = useState([])

    // Lifecycle
    useEffect(() => {
      const newFieldList = [];
      map(model.fields, (field, key) => {
        newFieldList.push({ value: key, label: field.name });
      })
      setFieldList(newFieldList)
    }, [])

    // UI
    if (!fieldList) return <context.UI.Loading />

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
                Field: {
                  label: "Field", dynamicLabel: "field", popup: (component, layoutItem) => {
                    // Show tweak UI
                    context.setDialog({
                      display: true, title: component.label, form: [
                        { key: "field", label: "Field", value: layoutItem.field ? layoutItem.field : '', type: 'dropdown', dropdownOptions: fieldList },
                        { key: "xs", label: "XS", value: layoutItem.xs ? layoutItem.xs : 12, type: 'number' },
                      ],
                      buttons: [{
                        label: 'Save', onClick: response => {
                          console.log(response);
                        }
                      }]
                    })
                  }
                },
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
