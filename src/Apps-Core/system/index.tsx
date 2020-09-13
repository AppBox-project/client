import { GrUpdate } from "react-icons/gr";
import AppSystemUser from "./User";

export default class App {
  context: any;

  constructor(context) {
    this.context = context;
  }

  getActions = () => {
    return new Promise((resolve) => {
      resolve([
        {
          key: "user",
          label: "User",
          component: AppSystemUser,
          icon: GrUpdate,
        },
      ]);
    });
  };
}
