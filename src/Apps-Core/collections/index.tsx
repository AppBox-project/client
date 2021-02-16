import * as icons from "react-icons/fa";
import { AppContext } from "../../Components/Apps/Apps/AppContext";
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
      this.context.app.data.collection_data.actions.map((action) => {
        const Icon = icons[action.icon];

        return actions.push({
          label: action.label,
          key: action.key,
          icon: Icon,
          component: action.page.type === "model" && CollectionsDisplayObject,
        });
      });
      resolve(actions);
    });
  };
}
