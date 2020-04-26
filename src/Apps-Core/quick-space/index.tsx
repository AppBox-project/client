import React from "react";
import AppActionTodo from "./Todo";
import FourOhFour from "../../Components/FourOhFour";
import AppQSActionNotes from "./Notes";
import { FaLemon, FaStickyNote, FaListAlt, FaFolderOpen } from "react-icons/fa";

export default class App {
  context: any;

  constructor(context) {
    this.context = context;
  }

  getActions = () => {
    return new Promise((resolve) => {
      resolve([
        {
          key: "desktop",
          label: "Desktop",
          component: FourOhFour,
          icon: FaLemon,
        },
        {
          key: "notes",
          label: "Quick notes",
          component: AppQSActionNotes,
          icon: FaStickyNote,
        },
        {
          key: "todo",
          label: "Todo",
          component: AppActionTodo,
          icon: FaListAlt,
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
