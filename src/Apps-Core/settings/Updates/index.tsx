import React from "reactn";
import { AppContextType } from "../../../Utils/Types";
import { Button } from "@material-ui/core";
import { useState } from "react";

const AppSettingsUpdate: React.FC<{
  match: { isExact: boolean };
  context: AppContextType;
  action: string;
}> = ({ context, action, match: { isExact } }) => {
  // Vars
  const [isUpgrading, setIsUpgrading] = useState(false);
  // Lifecycle
  // UI
  return (
    <Button
      disabled={isUpgrading}
      variant="contained"
      color="primary"
      onClick={() => {
        setIsUpgrading(true);
        context.addObject(
          "system-task",
          {
            type: "Box update",
            name: `Update box software`,
            description: `Triggered manually`,
            when: "asap",
            action: "box-update",
            done: false,
            arguments: undefined,
          },
          (response) => {
            console.log(response);
          }
        );
      }}
    >
      Start upgrade
    </Button>
  );
};

export default AppSettingsUpdate;
