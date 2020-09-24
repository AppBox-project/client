import FourOhFour from "../../Components/FourOhFour";
import AppActionObject from "./Object/index";
import * as icons from "react-icons/fa";
import { AppContextType } from "../../Utils/Types";

export default class App {
  context: AppContextType;

  constructor(context) {
    this.context = context;
  }

  appConfig = {
    actions: {
      filter: true,
      group: true,
      mobile: { displayAs: "menu" },
    },
  };

  getActions = () => {
    return new Promise((resolve) => {
      this.context.getObjects("apps", {}, (appResponse) => {
        if (appResponse.success) {
          // Make app-map
          const apps = {};
          appResponse.data.map((app) => {
            apps[app.data.id] = app.data;
          });

          this.context.getTypes({}, (response) => {
            if (response.success) {
              const actions = [];
              response.data.map((result) => {
                let group = result.app;
                if (!group) group = "Other";
                if (group !== "Other" && group !== "System") {
                  group = apps[group]?.name || "Unknown app";
                }
                actions.push({
                  label: result.name_plural,
                  key: result.key,
                  component: AppActionObject,
                  icon: icons[result.icon],
                  group,
                });
              });
              resolve(actions);
            } else {
              console.log("Something went wrong", response);
              resolve([
                { key: "a", label: response.reason, component: FourOhFour },
              ]);
            }
          });
        } else {
          console.log("Something went wrong", appResponse);
          resolve([
            { key: "a", label: appResponse.reason, component: FourOhFour },
          ]);
        }
      });
    });
  };
}
