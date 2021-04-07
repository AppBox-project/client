import React from "react";
import { AppContext } from "../../Components/Apps/Apps/AppContext";
import FaIcon from "../../Components/Icons";
import Todo from "../../Components/Todo";
import CollectionsDisplayInterface from "./Interface";
import CollectionsDisplayObject from "./ObjectDisplay";

export default class App {
  context: AppContext;

  constructor(context: AppContext) {
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
      const actions = [];
      (this?.context?.app?.data?.collection_data?.actions || []).map(
        (action) => {
          return actions.push({
            label: action.label,
            key: action.key,
            icon: <FaIcon icon={action.icon} />,
            component:
              action.page.type === "model"
                ? CollectionsDisplayObject
                : action.page.type === "interface"
                ? CollectionsDisplayInterface
                : Todo,
          });
        }
      );
      resolve(actions);
    });
  };
}
