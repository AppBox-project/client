import React from "react";
import FourOhFour from "../../Components/FourOhFour";
import AppActionObject from "./Object/index";

export default class App {
  context: any;

  constructor(context) {
    this.context = context;
  }

  getActions = () => {
    return new Promise(resolve => {
      this.context.getTypes({}).then(
        results => {
          const response = [];
          results.map(result => {
            response.push({
              label: result.name_plural,
              key: result.key,
              component: AppActionObject
            });
          });
          resolve(response);
        },
        error => {
          console.log("Something went wrong", error);
          resolve([{ key: "a", label: "A", component: FourOhFour }]);
        }
      );
    });
  };
}
