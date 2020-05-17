import FourOhFour from "../../Components/FourOhFour";
import AppActionManageObject from "./Actions/ManageObject";
import AppActionAddObject from "./Actions/AddObject";
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
              component: AppActionManageObject,
              icon: icons[result.icon],
            });
          });
          resolve([
            { key: "new", label: "Add object", component: AppActionAddObject },
            ...actions,
          ]);
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
