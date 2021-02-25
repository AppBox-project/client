import functions from "./Functions";

const formula = async (input, data) =>
  new Promise((resolve) => {
    // Prepare
    let formula = input;
    data = { ...data };

    // Extract tags
    [...formula.matchAll(new RegExp(/{{\s*(.*?)\s*}}/gm))].map((match) => {
      const tag = match[1];
      if (tag.match(/\w*\(.+\)/)) {
        const func = new RegExp(/(\w*)\((.*)\)/gm).exec(tag);
        formula = formula.replace(
          match[0],
          processFormula(func[1], func[2], data)
        );
      } else {
        formula = formula.replace(match[0], data[tag]);
      }
    });

    // Output
    resolve(formula);
  });

export default formula;

const processFormula = (fName, fArgs, data) => {
  const fArguments = fArgs.split(
    /,(?!(?=[^"]*"[^"]*(?:"[^"]*"[^"]*)*$))(?![^\(]*\))(?![^\[]*\])(?![^\{]*\})/gm
  ); // Splits commas, except when they're in brackets or apostrophes

  // Seperate variables and string literals
  fArguments.map((fA, fIndex) => {
    if (
      (fA.substr(0, 1) === "'" && fA.substr(fA.length - 1, 1) === "'") ||
      (fA.substr(0, 1) === '"' && fA.substr(fA.length - 1, 1) === '"')
    ) {
      fArguments[fIndex] = { str: fA.substr(1, fA.length - 2) };
    }
  });
  return functions[fName](fArguments, data);
};
