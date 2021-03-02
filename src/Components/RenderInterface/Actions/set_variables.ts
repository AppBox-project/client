import formula from "../../../Utils/Functions/ClientFormula";

export default (action, vars, setVars) =>
  new Promise<void>(async (resolve) => {
    const varsToUpdate = {};

    await action.vars.reduce(async (prevStep, currStep) => {
      await prevStep;
      if (currStep.field) {
        varsToUpdate[currStep.var] = {
          ...vars[currStep.var],
          ...varsToUpdate[currStep.var],
          data: {
            ...vars[currStep.var].data,
            ...((varsToUpdate[currStep.var] || {}).data || {}),
            [currStep.field]:
              currStep.valueType === "data"
                ? JSON.parse(currStep.value)
                : await formula(currStep.value, { ...vars }),
          },
        };
        console.log(varsToUpdate[currStep.var]);
      } else {
        varsToUpdate[currStep.var] = await formula(currStep.value, {
          ...vars,
        });
      }
      return currStep;
    }, action.vars[0]);
    setVars({ ...vars, ...varsToUpdate });
    resolve();
  });
