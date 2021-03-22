import AppSettingsUpdate from "./Updates";
import {
  FaInfoCircle,
  FaRobot,
  FaDownload,
  FaCogs,
  FaHistory,
  FaThLarge,
  FaColumns,
} from "react-icons/fa";
import AppSettingsBackup from "./Backup";
import AppSettingsProcesses from "./Automations";
import AppSettingsAbout from "./About";
import AppSettingsSystem from "./System";
import AppSettingsApps from "./Apps";
import AppSettingsInterfaces from "./Interfaces";
import AppSettingsActions from "./Actions";

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
          key: "automations",
          label: "Automations",
          component: AppSettingsProcesses,
          icon: FaRobot,
          group: "System",
        },
        {
          key: "actions",
          label: "Actions",
          component: AppSettingsActions,
          icon: FaRobot,
          group: "System",
        },
        {
          key: "apps",
          label: "Apps",
          component: AppSettingsApps,
          icon: FaThLarge,
          group: "Apps",
        },
        {
          key: "interfaces",
          label: "Interfaces",
          component: AppSettingsInterfaces,
          icon: FaColumns,
          group: "Apps",
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
