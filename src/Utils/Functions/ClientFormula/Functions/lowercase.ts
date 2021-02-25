export default (fArgs, data) =>
  fArgs[0].str
    ? fArgs[0].str.toLowerCase()
    : (data[fArgs[0]] || "error").toLowerCase();
