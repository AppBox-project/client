import FourOhFour from "../../Components/FourOhFour";
import AppActionManageObject from "./Actions/ManageObject";
import AppActionAddObject from "./Actions/AddObject";
import React from "react";
import FaIcon from "../../Components/Icons";

export default class App {
  context: any;

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

          this.context.getModels({}, (response) => {
            if (response.success) {
              const actions = [];
              response.data.map((result) => {
                let group = result.app;
                if (!group) group = "Other";
                if (group !== "Other" && group !== "System") {
                  group = apps[group]?.name || "Other";
                }

                actions.push({
                  label: result.name_plural,
                  key: result.key,
                  component: AppActionManageObject,
                  icon: result.icon,
                  group,
                });
              });
              resolve([
                {
                  key: "new",
                  label: "New model",
                  component: AppActionAddObject,
                },
                ...actions,
              ]);
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
