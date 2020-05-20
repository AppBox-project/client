import React from "reactn";
import { AppContextType } from "../../../Utils/Types";
import { Button, Typography } from "@material-ui/core";
import { useState } from "react";

const AppSettingsBackup: React.FC<{
  match: { isExact: boolean };
  context: AppContextType;
  action: string;
}> = ({ context, action, match: { isExact } }) => {
  // Vars
  const [task, setTask] = useState();

  // Lifecycle

  // UI
  return (
    <div className="center" style={{ textAlign: "center" }}>
      {task ? (
        <>
          <Typography variant="h6">{task.data.state}</Typography>
          <Typography>
            {task.data.done ? <>Backup done</> : task.data.progress + "%"}
          </Typography>
        </>
      ) : (
        <>
          <Typography variant="h6">Back up AppBox</Typography>
          <Button
            disabled={task !== undefined}
            variant="contained"
            color="primary"
            onClick={() => {
              context.addObject(
                "system-task",
                {
                  type: "Database export",
                  name: `Backing up database`,
                  description: `Triggered manually`,
                  when: "asap",
                  action: "database-backup",
                  done: false,
                  arguments: undefined,
                  progress: 0,
                  state: "Starting",
                },
                (response) => {
                  context.getObjects(
                    "system-task",
                    { _id: response.data._id },
                    (response) => {
                      setTask(response.data[0]);
                    }
                  );
                }
              );
            }}
          >
            Create backup
          </Button>
        </>
      )}
    </div>
  );
};

export default AppSettingsBackup;
