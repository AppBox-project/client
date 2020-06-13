import React, { useEffect } from "react";
import { AppContextType } from "../../../Utils/Types";
import AppSettingsProcessDetail from "./ProcessDetail";
import { useState } from "reactn";
import { FiGitBranch } from "react-icons/fi";
import { FaPlus } from "react-icons/fa";

const AppSettingsProcesses: React.FC<{
  match: { isExact: boolean };
  context: AppContextType;
  action: string;
}> = ({ context, action, match: { isExact } }) => {
  // Vars
  const [processes, setProcesses] = useState([]);

  // Lifecycle
  useEffect(() => {
    context.getObjects("system-processes", {}, (response) => {
      const result = [{ label: "Create process", id: "create", icon: FaPlus }];
      response.data.map((process) => {
        result.push({
          label: process.data.name,
          id: process._id,
          icon: FiGitBranch,
        });
      });
      setProcesses(result);
    });
  }, []);

  // UI
  return (
    <context.UI.Layouts.ListDetailLayout
      list={processes}
      baseUrl="/settings/processes"
      context={context}
      title="Processes"
      DetailComponent={AppSettingsProcessDetail}
      isLoading={processes.length === 0}
    />
  );
};

export default AppSettingsProcesses;