import AppActionTodo from "./Todo";
import FourOhFour from "../../Components/FourOhFour";
import AppQSActionNotes from "./Notes";
import { FaStickyNote, FaListAlt, FaFolderOpen, FaTh } from "react-icons/fa";
import AppSettings from "./Settings";

export default class App {
  context: any;

  constructor(context) {
    this.context = context;
  }

  appConfig = {
    settings: AppSettings,
  };

  getActions = () => {
    return new Promise((resolve) => {
      resolve([
        {
          key: "desktop",
          label: "Desktop",
          component: FourOhFour,
          icon: FaTh,
        },
        {
          key: "todo",
          label: "Todo",
          component: AppActionTodo,
          icon: FaListAlt,
        },
        {
          key: "notes",
          label: "Notes",
          component: AppQSActionNotes,
          icon: FaStickyNote,
        },
        {
          key: "files",
          label: "Files",
          component: FourOhFour,
          icon: FaFolderOpen,
        },
      ]);
    });
  };
}
