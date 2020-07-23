import AppCal from "./Calendar";

export default class App {
  context: any;

  constructor(context) {
    this.context = context;
  }

  appConfig = {
    actions: { mobile: { displayAs: "bottom-navigation" } },
  };

  getActions = () => {
    return new Promise((resolve) => {
      resolve(AppCal);
    });
  };
}
