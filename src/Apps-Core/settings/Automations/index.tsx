import React, { useEffect } from "react";
import { AppContextType } from "../../../Utils/Types";
import AppSettingsProcessDetail from "./AutomationDetail";
import { useState } from "reactn";
import { FaRobot } from "react-icons/fa";
import { useHistory } from "react-router-dom";

const AppSettingsProcesses: React.FC<{
  match: { isExact: boolean };
  context: AppContextType;
  action: string;
}> = ({ context, action, match: { isExact } }) => {
  // Vars
  const [processes, setProcesses] = useState<any>([]);
  const history = useHistory();

  // Lifecycle
  useEffect(() => {
    context.getObjects("automations", {}, (response) => {
      const result = [];
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
      addFunction={() => {
        history.push("/settings/automations/create");
      }}
      addTitle="New automation"
      DetailComponent={AppSettingsProcessDetail}
      isLoading={processes.length === 0}
    />
  );
};

export default AppSettingsProcesses;
