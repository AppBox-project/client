import FourOhFour from "../../Components/FourOhFour";
import { GrUpdate } from "react-icons/gr";
import AppSettingsUpdate from "./Updates";
import { FaServer, FaInfoCircle, FaRobot } from "react-icons/fa";
import AppSettingsBackup from "./Backup";
import AppSettingsProcesses from "./Automations";
import AppSettingsAbout from "./About";

export default class App {
  context: any;

  constructor(context) {
    this.context = context;
  }

  appConfig = {
    actions: { mobile: { displayAs: "bottom-navigation" } },
  };

  getActions = () => {
    return new Promise((resolve) => {
      resolve([
        {
          key: "update",
          label: "Update software",
          component: AppSettingsUpdate,
          icon: GrUpdate,
        },
        {
          key: "backup",
          label: "Backup",
          component: AppSettingsBackup,
          icon: FaServer,
        },
        {
          key: "automations",
          label: "Automations",
          component: AppSettingsProcesses,
          icon: FaRobot,
        },
        {
          key: "about",
          label: "About",
          component: AppSettingsAbout,
          icon: FaInfoCircle,
        },
      ]);
    });
  };
}
