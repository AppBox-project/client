import React from "react";
import AppActionTodo from "./Todo";
import FourOhFour from "../../Components/FourOhFour";

export default class App {
  context: any;

  constructor(context) {
    this.context = context;
  }

  getActions = () => {
    return new Promise(resolve => {
      resolve([
        { key: "overview", label: "Overview", component: FourOhFour },
        { key: "notes", label: "Quick notes", component: FourOhFour },
        { key: "todo", label: "Todo", component: AppActionTodo },
        { key: "files", label: "Files", component: FourOhFour }
      ]);
    });
  };
}
