import {
  AppContextType,
  InterfaceActionType,
  InterfaceType,
} from "../../../Utils/Types";
import setVariables from "./set_variables";
import insertObject from "./insert_object";

export default async (
  action: InterfaceActionType,
  vars,
  setVars,
  interfaceObject: InterfaceType,
  context: AppContextType
) => {
  let newVars = { ...vars };

  //@ts-ignore
  await action.actions.reduce(async (prev, currAction) => {
    await prev;

    switch (currAction.type) {
      case "set_variables":
        await setVariables(currAction, newVars, (_newVars) => {
          newVars = _newVars;
        });
        break;
      case "insert_object":
        await insertObject(
          currAction,
          newVars,
          (_newVars) => {
            newVars = _newVars;
          },
          interfaceObject,
          context
        );
        break;
      default:
        console.log(`Unknown action type ${currAction.type}`);
        break;
    }
    return currAction;
  }, action.actions[0]);
  setVars(newVars);
};
