import React from "react";
import FourOhFour from "../../Components/FourOhFour";
import { FaStream, FaStore } from "react-icons/fa";
import AppAHBrowse from "./Browse";
import AppAHMyApps from "./MyApps";

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
          key: "browse",
          label: "Browse",
          component: AppAHBrowse,
          icon: FaStore,
        },
        {
          key: "my-apps",
          label: "My apps",
          component: AppAHMyApps,
          icon: FaStream,
        },
      ]);
    });
  };
}
