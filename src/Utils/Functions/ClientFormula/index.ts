import functions from "./Functions";

const formula = async (input, data) =>
  new Promise(async (resolve) => {
    // Prepare
    let formula = input;
    data = { ...data };

    // Extract tags
    const tags = [...formula.matchAll(new RegExp(/{{\s*(.*?)\s*}}/gm))];
    await tags.reduce(async (prev, match) => {
      await prev;
      const tag = match[1];
      if (tag.match(/\w*\(.+\)/)) {
        const func = new RegExp(/(\w*)\((.*)\)/gm).exec(tag);
        formula = formula.replace(
          match[0],
          await processFormula(func[1], func[2], data)
        );
      } else {
        formula = formula.replace(match[0], data[tag]);
      }
      return match;
    }, tags[0]);

    // Output
    resolve(formula);
  });

export default formula;

const processFormula = async (fName, fArgs, data) => {
  const fArguments = fArgs.split(
    /,(?!(?=[^"]*"[^"]*(?:"[^"]*"[^"]*)*$))(?![^\(]*\))(?![^\[]*\])(?![^\{]*\})/gm
  ); // Splits commas, except when they're in brackets or apostrophes

  let index = 0;
  await fArguments.reduce(async (prev, currArg) => {
    await prev;
    if (currArg.match(/\w*\(.+\)/)) {
      const func = new RegExp(/(\w*)\((.*)\)/gm).exec(currArg);
      fArguments[index] = await processFormula(func[1], func[2], data);
    }
    index++;
    return currArg;
  }, fArguments[0]);

  // Seperate variables and string literals
  fArguments.map((fA, fIndex) => {
    if (typeof fA === "string") {
      fA = fA.trim();
      if (
        (fA.substr(0, 1) === "'" && fA.substr(fA.length - 1, 1) === "'") ||
        (fA.substr(0, 1) === '"' && fA.substr(fA.length - 1, 1) === '"')
      ) {
        fArguments[fIndex] = { str: fA.substr(1, fA.length - 2) };
      }
    }
  });

  if (!functions[fName]) {
    return false;
  }

  return functions[fName](fArguments, data);
};
