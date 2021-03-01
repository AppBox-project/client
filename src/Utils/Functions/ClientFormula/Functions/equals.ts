export default (fArgs, data) => {
  const left = fArgs[0].str ? fArgs[0].str : data[fArgs[0]];
  const right = fArgs[1].str ? fArgs[1].str : data[fArgs[1]];
  return left === right;
};
