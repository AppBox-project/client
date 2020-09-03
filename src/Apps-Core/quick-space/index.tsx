import AppActionTodo from "./Todo";
import FourOhFour from "../../Components/FourOhFour";
import AppQSActionNotes from "./Notes";
import { FaStickyNote, FaListAlt, FaFolderOpen, FaTh } from "react-icons/fa";
import AppSettings from "./Settings";
import AppQSActionFile from "./Files";

export default class App {
  context: any;

  constructor(context) {
    this.context = context;
  }

  appConfig = {
    settings: AppSettings,
    actions: { mobile: { displayAs: "bottom-navigation" } },
  };

  getActions = () => {
    return new Promise((resolve) => {
      resolve([
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
          component: AppQSActionFile,
          icon: FaFolderOpen,
        },
      ]);
    });
  };
}
