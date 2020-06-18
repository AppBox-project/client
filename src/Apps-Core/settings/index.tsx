import FourOhFour from "../../Components/FourOhFour";
import { GrUpdate } from "react-icons/gr";
import AppSettingsUpdate from "./Updates";
import { FaServer, FaAddressCard, FaInfoCircle } from "react-icons/fa";
import AppSettingsBackup from "./Backup";
import AppSettingsProcesses from "./Processes";
import { FiGitBranch } from "react-icons/fi";
import AppSettingsAbout from "./About";

export default class App {
  context: any;

  constructor(context) {
    this.context = context;
  }

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
          key: "processes",
          label: "Processes",
          component: AppSettingsProcesses,
          icon: FiGitBranch,
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
