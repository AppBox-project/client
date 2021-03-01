export default (fArgs, data) =>
  fArgs[0] === true || data[fArgs[0]] === "true" || data[fArgs[0]] === true
    ? fArgs[1].str || data[fArgs[1]]
    : fArgs[2].str || data[fArgs[2]];
