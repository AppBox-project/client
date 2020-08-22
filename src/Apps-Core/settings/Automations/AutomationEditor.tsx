import React, { useState, useEffect } from "react";
import { AppContextType, ObjectType } from "../../../Utils/Types";
import { Skeleton } from "@material-ui/lab";
import uniqid from "uniqid";
import {
  Grid,
  Typography,
  List,
  ListItemText,
  ListItem,
  ListItemIcon,
} from "@material-ui/core";
import { FaPlus, FaPlay } from "react-icons/fa";

const AppSettingsAutomationEditor: React.FC<{
  context: AppContextType;
  detailId: string;
}> = ({ context, detailId }) => {
  // Vars
  const [newAutomation, setNewAutomation] = useState<ObjectType>();

  // Lifecycle
  useEffect(() => {
    const requestId = uniqid();
    const request = context.getObjects(
      "automations",
      { _id: detailId },
      (response) => {
        if (response.success) {
          setNewAutomation(response.data[0]);
        } else {
          console.log(response);
        }
      }
    );

    return () => {
      request.stop();
    };
  }, [detailId]);

  // UI
  return newAutomation ? (
    <>
      <context.UI.Design.Card
        withBigMargin
        title={newAutomation.data.name}
        titleDivider
      >
        <context.UI.Field
          object={newAutomation}
          modelId="automations"
          fieldId="description"
        />
      </context.UI.Design.Card>
      <Grid container>
        <Grid item xs={12} md={newAutomation.data.type === "Process" ? 9 : 4}>
          <context.UI.Design.Card withBigMargin title="Triggers" titleDivider>
            <List>
              {(newAutomation.data.triggers || []).length > 0 ? (
                newAutomation.data.triggers.map((trigger, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <FaPlay />
                    </ListItemIcon>
                    <ListItemText>{trigger.type}</ListItemText>
                  </ListItem>
                ))
              ) : (
                <ListItem>
                  <ListItemText>No triggers.</ListItemText>
                </ListItem>
              )}
              <ListItem
                button
                onClick={() => {
                  setNewAutomation({
                    ...newAutomation,
                    data: {
                      ...newAutomation.data,
                      triggers: [
                        ...(newAutomation.data.triggers || []),
                        { type: "date", trigger: "day" },
                      ],
                    },
                  });
                }}
              >
                <ListItemIcon>
                  <FaPlus />
                </ListItemIcon>
                <ListItemText>Add trigger</ListItemText>
              </ListItem>
            </List>
          </context.UI.Design.Card>
        </Grid>
        <Grid item xs={12} md={newAutomation.data.type === "Process" ? 3 : 2}>
          <Typography variant="h6">Then</Typography>
          <context.UI.Field
            object={newAutomation}
            modelId="automations"
            fieldId="type"
            onChange={(val) => {
              setNewAutomation({
                ...newAutomation,
                data: { ...newAutomation.data, type: val },
              });
            }}
          />
        </Grid>
        <Grid item xs={12} md={newAutomation.data.type === "Process" ? 12 : 6}>
          <context.UI.Design.Card withBigMargin title="Test" titleDivider>
            b
          </context.UI.Design.Card>
        </Grid>
      </Grid>
    </>
  ) : (
    <context.UI.Design.Card withBigMargin>
      <Skeleton width={350} />
      <br />
      <Skeleton />
    </context.UI.Design.Card>
  );
};

export default AppSettingsAutomationEditor;
