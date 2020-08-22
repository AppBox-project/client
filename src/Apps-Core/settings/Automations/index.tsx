import React, { useEffect } from "react";
import { AppContextType } from "../../../Utils/Types";
import AppSettingsProcessDetail from "./AutomationDetail";
import { useState } from "reactn";
import { FaPlus, FaRobot } from "react-icons/fa";

const AppSettingsProcesses: React.FC<{
  match: { isExact: boolean };
  context: AppContextType;
  action: string;
}> = ({ context, action, match: { isExact } }) => {
  // Vars
  const [processes, setProcesses] = useState<any>([]);

  // Lifecycle
  useEffect(() => {
    context.getObjects("automations", {}, (response) => {
      const result = [{ label: "New automation", id: "create", icon: FaPlus }];
      response.data.map((process) => {
        result.push({
          label: process.data.name,
          id: process._id,
          icon: FaRobot,
        });
      });
      setProcesses(result);
    });
  }, []);

  // UI
  return (
    <context.UI.Layouts.ListDetailLayout
      list={processes}
      baseUrl="/settings/automations"
      context={context}
      title="Automations"
      DetailComponent={AppSettingsProcessDetail}
      isLoading={processes.length === 0}
    />
  );
};

export default AppSettingsProcesses;
