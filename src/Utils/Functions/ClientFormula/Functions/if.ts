const ifFunction = (fArgs, data) => {
  // Get value
  if (data[fArgs[0]] === "true" || data[fArgs[0]] === true) {
    return fArgs[1].str || data[fArgs[1]];
  } else {
    return fArgs[2].str || data[fArgs[2]];
  }
};

export default ifFunction;
