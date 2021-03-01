import { AppContextType, InterfaceType } from "../../../Utils/Types";

export default async (
  action,
  vars,
  setVars,
  interfaceAction: InterfaceType,
  context: AppContextType
) =>
  new Promise<void>((resolve) => {
    const newObject = (vars[action.var] || {}).data || {};
    const modelId = interfaceAction.data.data.variables[action.var].model;

    context.addObject(modelId, newObject, (response) => {
      console.log(response);
      setVars({ ...vars, [action.var]: response.data });
      resolve();
    });
  });
