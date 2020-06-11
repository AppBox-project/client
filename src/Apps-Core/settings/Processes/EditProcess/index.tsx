import React from "react";
import { AppContextType } from "../../../../Utils/Types";
import styles from "./styles.module.scss";
import { Typography, Drawer, Grid } from "@material-ui/core";
import TriggerBlock from "./TriggerBlock";
import { useState, useEffect } from "reactn";
import { Skeleton } from "@material-ui/lab";
import TriggerEditor from "./TriggerEditor";
import { FaSave } from "react-icons/fa";

const AppSettingsProcessEdit: React.FC<{
  context: AppContextType;
  processId: string;
}> = ({ context, processId }) => {
  // Vars
  const [process, setProcess] = useState(); // Contains process data item
  const [editBlock, setEditBlock] = useState(); // Contains information about the currently selected block
  const [contexts, setContexts] = useState<any>([]); // Contains a list of all models + potential contexts
  const [hasChanged, setHasChanged] = useState(false); // Show a save button when changes

  // Lifecycle
  useEffect(() => {
    context.getObjects("system-processes", {}, (response) => {
      if (response.success) {
        setProcess(response.data[0].data);
      } else {
        console.log(response);
      }
    });
  }, [processId]);
  useEffect(() => {
    context.getTypes({}, (response) => {
      if (response.success) {
        const newList = [{ label: "System", value: "system" }];
        response.data.map((model) => {
          newList.push({ label: model.name, value: model.key });
        });
        setContexts(newList);
      } else {
        console.log(response);
      }
    });
  }, []);

  useEffect(() => {
    if (hasChanged) {
      context.setButton("save", {
        icon: FaSave,
        label: "Save",
        function: () => {
          context.updateObject("system-processes", process, processId);
          setHasChanged(false);
        },
      });
    } else {
      context.setButton("save", undefined);
    }

    return () => {
      context.setButton("save", undefined);
    };
  }, [hasChanged]);

  // UI
  return (
    <>
      <div
        style={{
          textAlign: "center",
          borderBottom: "1px solid #eaeaea",
          padding: 15,
        }}
      >
        {process ? (
          <Grid container>
            <Grid item xs={10}>
              <Typography variant="h6">{process.name}</Typography>
            </Grid>
            <Grid item xs={2}>
              <context.UI.Inputs.SelectInput
                label="Process runs in"
                value={process?.context || "system"}
                options={contexts}
                onChange={(value) => {
                  setProcess({ ...process, context: value });
                  setHasChanged(true);
                }}
              />
            </Grid>
          </Grid>
        ) : (
          <Skeleton width={350} height={42} />
        )}{" "}
      </div>
      <div
        className={styles.row}
        onClick={() => {
          setProcess({
            ...process,
            triggers: [
              ...(process.triggers || []),
              { label: "Example trigger" },
            ],
          });
          setHasChanged(true);
        }}
      >
        <Typography variant="subtitle1" className={styles.title}>
          Process triggers...
        </Typography>
        {process ? (
          <>
            {(process.triggers || []).map((trigger, index) => {
              return (
                <TriggerBlock
                  trigger={trigger}
                  onClick={(e) => {
                    setEditBlock(`trigger-${index}`);
                    e.stopPropagation();
                  }}
                />
              );
            })}
          </>
        ) : (
          <>
            <TriggerBlock isLoading />
            <TriggerBlock isLoading />
            <TriggerBlock isLoading />
            <TriggerBlock isLoading />
          </>
        )}
      </div>
      {process ? (
        <>
          {(process.actions || []).map((action, ine3s) => {
            return (
              <div className={styles.row}>
                <Typography variant="subtitle1" className={styles.title}>
                  and performs...
                </Typography>
              </div>
            );
          })}
          <div
            className={styles.row}
            style={{ height: 50, cursor: "pointer" }}
            onClick={() => {
              setProcess({
                ...process,
                actions: [
                  ...(process.actions || []),
                  { label: "Example action" },
                ],
              });
              setHasChanged(true);
            }}
          >
            <Typography
              variant="subtitle1"
              className={styles.title}
              style={{ cursor: "pointer" }}
            >
              add action
            </Typography>
          </div>
        </>
      ) : (
        <div className={styles.row}>
          <Typography variant="subtitle1" className={styles.title}>
            and performs...
          </Typography>

          <TriggerBlock isLoading />
          <TriggerBlock isLoading />
          <TriggerBlock isLoading />
          <TriggerBlock isLoading />
        </div>
      )}

      <Drawer
        anchor="bottom"
        open={editBlock}
        onClose={() => {
          setEditBlock(null);
        }}
      >
        {editBlock && editBlock.match("trigger") ? (
          <TriggerEditor
            trigger={process.triggers[editBlock.split("-")[1]]}
            context={context}
            onChange={(newValue) => {
              const index = editBlock.split("-")[1];
              const triggers = process.triggers;
              if (newValue) {
                triggers[index] = newValue;
              } else {
                triggers.splice(index, 1);
              }
              setProcess({ ...process, triggers });
              setEditBlock(null);
              setHasChanged(true);
            }}
          />
        ) : (
          "action"
        )}
      </Drawer>
    </>
  );
};

export default AppSettingsProcessEdit;
