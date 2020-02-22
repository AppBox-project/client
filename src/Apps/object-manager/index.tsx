import React from "react";
import FourOhFour from "../../Components/FourOhFour";
import AppActionManageObject from "./Actions/ManageObject";

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
              component: AppActionManageObject
            });
          });
          resolve([
            { key: "new", label: "Add object", component: FourOhFour },
            ...response
          ]);
        },
        error => {
          console.log("Something went wrong", error);
          resolve([{ key: "a", label: "A", component: FourOhFour }]);
        }
      );
    });
  };
}
