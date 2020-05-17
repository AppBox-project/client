import FourOhFour from "../../Components/FourOhFour";
import AppActionObject from "./Object/index";
import * as icons from "react-icons/fa";

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
              icon: icons[result.icon],
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
