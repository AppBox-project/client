import React from "react";
import { AppContextType } from "../../../../Utils/Types";
import styles from "./styles.module.scss";
import { Typography, Drawer } from "@material-ui/core";
import TriggerBlock from "./TriggerBlock";
import { useState, useEffect } from "reactn";
import { Skeleton } from "@material-ui/lab";
import TriggerEditor from "./TriggerEditor";

const AppSettingsProcessEdit: React.FC<{
  context: AppContextType;
  processId: string;
}> = ({ context, processId }) => {
  // Vars
  const [process, setProcess] = useState(); // Contains process data item
  const [editBlock, setEditBlock] = useState(); // Contains information about the currently selected block

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
          <Typography variant="h6">{process.name}</Typography>
        ) : (
          <Skeleton width={350} height={42} />
        )}{" "}
      </div>
      <div className={styles.row}>
        <Typography variant="subtitle1" className={styles.title}>
          Process triggers...
        </Typography>
        {process ? (
          <>
            {(process.triggers || []).map((trigger, index) => {
              return (
                <TriggerBlock
                  trigger={trigger}
                  onClick={() => {
                    setEditBlock(`trigger-${index}`);
                  }}
                />
              );
            })}
            <TriggerBlock
              add
              onClick={() => {
                setProcess({
                  ...process,
                  triggers: [
                    ...(process.triggers || []),
                    { label: "Example trigger" },
                  ],
                });
              }}
            />
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
      <div className={styles.row}>
        <Typography variant="subtitle1" className={styles.title}>
          and performs...
        </Typography>
        {process ? (
          <>
            <TriggerBlock isLoading />
            <TriggerBlock isLoading />
            <TriggerBlock isLoading />
            <TriggerBlock add />
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
      <Drawer
        anchor="bottom"
        open={editBlock}
        onClose={() => {
          setEditBlock(null);
        }}
      >
        {editBlock && editBlock.match("trigger") ? (
          <TriggerEditor trigger={process.triggers[editBlock.split("-")[1]]} />
        ) : (
          "action"
        )}
      </Drawer>
    </>
  );
};

export default AppSettingsProcessEdit;
