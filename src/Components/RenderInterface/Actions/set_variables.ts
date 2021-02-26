import formula from "../../../Utils/Functions/ClientFormula";

export default async (action, vars, setVars) => {
  const varsToUpdate = {};

  await action.vars.reduce(async (prevStep, currStep) => {
    await prevStep;
    varsToUpdate[currStep.var] = await formula(await currStep.value, {
      ...vars,
    });
    return currStep;
  }, action.vars[0]);

  setVars({ ...vars, ...varsToUpdate });
};
