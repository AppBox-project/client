import React from "react";
import { FaStream, FaStore } from "react-icons/fa";
import AppHubBrowse from "./Browse";

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
          component: AppHubBrowse,
          icon: FaStream,
        },
      ]);
    });
  };
}
