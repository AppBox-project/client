import FourOhFour from "../../Components/FourOhFour";
import AppActionObject from "./Object/index";
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
      context: {
        sortBy: "frequent",
      },
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

          this.context.getModels({}, (response) => {
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
                  icon: result.icon,
                  group,
                  shortcuts: {
                    type: "recents",
                    model: result.key,
                    title: `Recent ${result.name_plural.toLowerCase()}`,
                    url: `/explorer/${result.key}/`,
                  },
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
