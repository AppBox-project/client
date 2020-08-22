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
import { FaPlus, FaCloudSun, FaFileImport } from "react-icons/fa";

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
                  <ListItem
                    key={index}
                    button
                    onClick={() => {
                      context.setDialog({
                        display: true,
                        title: "Modify trigger",
                        form: [
                          {
                            key: "type",
                            label: "Trigger type",
                            type: "dropdown",
                            value: trigger.type,
                            dropdownOptions: [
                              { value: "date", label: "Date" },
                              { value: "change", label: "Change" },
                            ],
                          },
                          {
                            key: "trigger",
                            label: "Trigger",
                            type: "dropdown",
                            value: trigger.trigger,
                            dropdownOptions: [
                              { value: "second", label: "Every second" },
                              { value: "minute", label: "every minute" },
                              { value: "hour", label: "every hour" },
                              { value: "day", label: "every day" },
                              { value: "week", label: "every week" },
                              { value: "month", label: "every month" },
                              { value: "year", label: "every year" },
                              { value: "custom", label: "set custom time" },
                            ],
                            onlyDisplayWhen: { type: "date" },
                          },
                          {
                            key: "customTrigger",
                            label: "Trigger when (CRON!)",
                            type: "text",
                            value: trigger.trigger,
                            onlyDisplayWhen: { trigger: "custom" },
                          },
                        ],
                        buttons: [
                          {
                            label: "Update",
                            onClick: (form) => {
                              if (form.type === "date") {
                                if (form.trigger === "custom") {
                                  form.trigger = form.customTrigger;
                                }
                              }
                              const newTriggers = newAutomation.data.triggers;
                              newTriggers[index] = {
                                type: form.type,
                                trigger: form.trigger,
                              };
                              setNewAutomation({
                                ...newAutomation,
                                data: {
                                  ...newAutomation.data,
                                  triggers: newTriggers,
                                },
                              });
                            },
                          },
                        ],
                      });
                    }}
                  >
                    <ListItemIcon>
                      {trigger.type === "date" && <FaCloudSun />}
                      {trigger.type === "change" && <FaFileImport />}
                    </ListItemIcon>
                    <ListItemText>
                      {trigger.type === "date" && `Every ${trigger.trigger}`}
                    </ListItemText>
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
