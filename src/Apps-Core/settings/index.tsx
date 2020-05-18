import FourOhFour from "../../Components/FourOhFour";
import { GrUpdate } from "react-icons/gr";
import AppSettingsUpdate from "./Updates";

export default class App {
  context: any;

  constructor(context) {
    this.context = context;
  }

  getActions = () => {
    return new Promise((resolve) => {
      resolve([
        {
          key: "update",
          label: "Update software",
          component: AppSettingsUpdate,
          icon: GrUpdate,
        },
      ]);
    });
  };
}
