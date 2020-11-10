import React from "react";
import { FaStream, FaStore, FaShapes } from "react-icons/fa";
import AppHubBrowse from "./Browse";
import AppHubMyApps from "./MyApps";

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
          component: AppHubBrowse,
          icon: FaStore,
        },
        {
          key: "my-apps",
          label: "My apps",
          component: AppHubMyApps,
          icon: FaShapes,
        },
      ]);
    });
  };
}
