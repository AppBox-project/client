import FourOhFour from "../../Components/FourOhFour";
import AppActionManageObject from "./Actions/ManageObject";

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
            });
          });
          resolve([
            { key: "new", label: "Add object", component: FourOhFour },
            ...actions,
          ]);
        } else {
          console.log("Something went wrong", response.reason);
          resolve([{ key: "a", label: "A", component: FourOhFour }]);
        }
      });
    });
  };
}
