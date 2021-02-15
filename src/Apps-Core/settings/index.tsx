import AppSettingsUpdate from "./Updates";
import {
  FaInfoCircle,
  FaRobot,
  FaDownload,
  FaCogs,
  FaHistory,
  FaThLarge,
} from "react-icons/fa";
import AppSettingsBackup from "./Backup";
import AppSettingsProcesses from "./Automations";
import AppSettingsAbout from "./About";
import AppSettingsSystem from "./System";
import AppSettingsApps from "./Apps";

export default class App {
  context: any;

  constructor(context) {
    this.context = context;
  }

  appConfig = {
    actions: {
      mobile: { displayAs: "bottom-navigation" },
      group: true,
      filter: true,
    },
  };

  getActions = () => {
    return new Promise((resolve) => {
      resolve([
        {
          key: "system",
          label: "System settings",
          component: AppSettingsSystem,
          icon: FaCogs,
          group: "System",
        },
        {
          key: "apps",
          label: "Apps",
          component: AppSettingsApps,
          icon: FaThLarge,
          group: "System",
        },
        {
          key: "automations",
          label: "Automations",
          component: AppSettingsProcesses,
          icon: FaRobot,
          group: "System",
        },
        {
          key: "update",
          label: "Update software",
          component: AppSettingsUpdate,
          icon: FaDownload,
          group: "Administration",
        },
        {
          key: "backup",
          label: "Backup",
          component: AppSettingsBackup,
          icon: FaHistory,
          group: "Administration",
        },

        {
          key: "about",
          label: "About",
          component: AppSettingsAbout,
          icon: FaInfoCircle,
          group: "Administration",
        },
      ]);
    });
  };
}
