import React from "react";
import FourOhFour from "../../Components/FourOhFour";
import AppActionObject from "./Object/index";

export default class App {
  context: any;

  constructor(context) {
    this.context = context;
  }

  getActions = () => {
    return new Promise((resolve) => {
      this.context.getTypes({}, (response) => {
        if (response.success) {
          const actions = [];
          response.data.map((result) => {
            actions.push({
              label: result.name_plural,
              key: result.key,
              component: AppActionObject,
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
    });
  };
}
