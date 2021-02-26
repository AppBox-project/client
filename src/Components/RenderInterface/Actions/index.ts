import { InterfaceActionType } from "../../../Utils/Types";
import setVariables from "./set_variables";

export default async (action: InterfaceActionType, vars, setVars) => {
  await action.actions.reduce((prev, currAction) => {
    switch (currAction.type) {
      case "set_variables":
        setVariables(currAction, vars, setVars);
        break;
      default:
        console.log(`Unknown action type ${currAction.type}`);

        break;
    }
    return currAction;
  }, action.actions[0]);
};
